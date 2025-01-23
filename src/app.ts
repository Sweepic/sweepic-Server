import dotenv from 'dotenv';
import cors from 'cors';
import express, {Request, Response, Express, NextFunction} from 'express';
import swaggerAutogen from 'swagger-autogen';
import swaggerUiExpress from 'swagger-ui-express';
import {memoFolderRouter} from './routers/memo.router.js';
import {RegisterRoutes} from './routers/tsoaRoutes.js';
import {challengeRouter} from './routers/challenge.router.js';
import {authRouter} from './routers/auth.routers.js';
import passport from 'passport';
import session from 'express-session';
import {PrismaSessionStore} from '@quixo3/prisma-session-store';
import {prisma} from './db.config.js';
import swaggerDocument from '../swagger/swagger.json' assert {type: 'json'};

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false})); //true

app.get('/', (req: Request, res: Response) => {
  res.send('Sweepic');
});

// app.use(
//   '/docs',
//   swaggerUiExpress.serve,
//   swaggerUiExpress.setup(swaggerDocument),
// );

app.use(
  '/docs',
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(
    {},
    {
      swaggerOptions: {
        url: '/openapi.json',
      },
    },
  ),
);

app.get(
  '/openapi.json',
  async (req: Request, res: Response, next: NextFunction) => {
    // #swagger.ignore = true
    const options = {
      openapi: '3.0.0',
      disableLogs: true,
      writeOutputFile: false,
    };
    const outputFile = '/dev/null'; // 파일 출력은 사용하지 않습니다.
    const routes = ['./src/app.ts']; // swagger-autogen이 분석할 파일 경로입니다.
    const doc = {
      openapi: '3.0.0',
      info: {
        title: 'Sweepic API',
        description: 'Sweepic 프로젝트입니다.',
        version: '1.0.0',
      },
      host: 'localhost:3000',
    };
    const result = await swaggerAutogen(options)(outputFile, routes, doc);
    res.json(result ? result.data : null);
  },
);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.success = success => {
    return res.json({resultType: 'SUCCESS', error: null, success});
  };

  res.error = ({errorCode = 'unknown', reason = null, data = null}) => {
    return res.json({
      resultType: 'FAIL',
      error: {errorCode, reason, data},
      success: null,
    });
  };

  next();
});

app.use('/memo', memoFolderRouter);
RegisterRoutes(app);
app.use('/challenge', challengeRouter);

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      serializer: {
        // BigInt를 문자열로 변환하여 저장
        stringify: (obj: unknown) =>
          JSON.stringify(obj, (_, value) =>
            typeof value === 'bigint' ? value.toString() : value,
          ),
        parse: (str: string) =>
          JSON.parse(str, (_, value) =>
            typeof value === 'string' && /^\d+$/.test(value)
              ? BigInt(value)
              : value,
          ),
      },
    }),
  }),
);

//passport 초기화
app.use(passport.initialize());
app.use(passport.session());

app.use('/oauth2', authRouter);

// 응답 통일 (임시)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    // 응답 헤더가 이미 클라이언트로 전송되었는지 확인
    return next(err); // 추가적인 응답을 보낼 수 없으므로 에러를 다음 미들웨어로 전달
  }
  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || 'unknown',
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
