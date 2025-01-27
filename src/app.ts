import dotenv from 'dotenv';
import cors from 'cors';
import express, {Request, Response, Express, NextFunction} from 'express';
import swaggerAutogen from 'swagger-autogen';
import swaggerUiExpress from 'swagger-ui-express';
import {memoFolderRouter} from './routers/memo.router.js';
import {challengeRouter} from './routers/challenge.router.js';
import {authRouter} from './routers/auth.routers.js';
import {userRouter} from './routers/user.router.js';
import passport from 'passport';
import session from 'express-session';
import {PrismaSessionStore} from '@quixo3/prisma-session-store';
import {prisma} from './db.config.js';
import swaggerDocument from '../swagger/openapi.json' assert {type: 'json'};
import { sessionAuthMiddleware } from './auth.config.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false})); 
app.use(cookieParser());

app.use(
  '/docs',
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerDocument),
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

app.use(sessionAuthMiddleware);

app.use('/onboarding', userRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Sweepic');
});

app.use('/memo', memoFolderRouter);

app.use('/challenge', challengeRouter);
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
