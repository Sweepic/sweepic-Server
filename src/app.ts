import dotenv from 'dotenv';
import cors from 'cors';
import express, { Request, Response, Express, NextFunction } from 'express';
import swaggerAutogen from 'swagger-autogen';
import swaggerUiExpress from 'swagger-ui-express';
import { memoFolderRouter } from './routers/memo.router.js';
import { challengeRouter } from './routers/challenge.router.js';
import { UserModel } from './models/user.model.js';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import passport from 'passport';
import { naverStrategy,googleStrategy,kakaoStrategy } from './auth.config.js';
import { prisma } from './db.config.js';

dotenv.config();

// BigInt를 문자열로 직렬화
(BigInt.prototype as unknown as { toJSON: () => string }).toJSON = function () {
  return this.toString();
};
//passport 전략 설정
passport.use(naverStrategy);
passport.use(googleStrategy);
passport.use(kakaoStrategy);
// serialize 설정
passport.serializeUser((user, done) => done(null, user));
// deserializeUser 설정
passport.deserializeUser(async (id: bigint, done) => {
  try {
    // 사용자 조회
    const user = await prisma.user.findUnique({ where: { id } });

    // 사용자 존재 여부 확인
    if (!user) {
      return done(new Error('User not found'), null);
    }

    // 성공적으로 사용자 반환
    done(null, user as UserModel);
  } catch (error) {
    // 에러 처리
    done(error, null);
  }
});


const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 세션 설정
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
            typeof value === 'bigint' ? value.toString() : value
          ),
        parse: (str: string) =>
          JSON.parse(str, (_, value) =>
            typeof value === 'string' && /^\d+$/.test(value) ? BigInt(value) : value
          ),
      },
    }),
  })
);

app.get('/', (req: Request, res: Response) => {
  res.send('Sweepic');
});

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

//passport 초기화
app.use(passport.initialize());
app.use(passport.session());

//네이버 로그인 라우트
app.get('/auth/login/naver', passport.authenticate('naver', {scope: ['email', 'name']}));
//네이버 로그인 콜백 라우트
app.get(
  '/oauth2/callback/naver',
  passport.authenticate('naver', { failureRedirect: '/' }),
  (req, res) => {
    // 로그인 성공 시 처리
    res.redirect('/'); // 온보딩 페이지로 리디렉션(예정)
  }
);
// 구글 로그인 라우트
app.get('/auth/login/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// 구글 로그인 콜백 라우트
app.get(
  '/oauth2/callback/google',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // 로그인 성공 시 처리
    res.redirect('/'); // 온보딩 페이지로 리디렉션(예정)
  }
);
// 카카오 로그인 라우트
app.get('/auth/login/kakao', passport.authenticate('kakao', {scope: ['profile_nickname', 'account_email']}));

// 카카오 로그인 콜백 라우트
app.get(
  '/oauth2/callback/kakao',
  passport.authenticate('kakao', { failureRedirect: '/' }),
  (req, res) => {
    // 로그인 성공 시 처리
    res.redirect('/'); // 온보딩 페이지로 리디렉션(예정)
  }
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
  res.success = (success) => {
    return res.json({ resultType: 'SUCCESS', error: null, success });
  };

  res.error = ({ errorCode = 'unknown', reason = null, data = null }) => {
    return res.json({
      resultType: 'FAIL',
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

app.use('/memo', memoFolderRouter);

app.use('/challenge', challengeRouter);

// 응답 통일 (임시)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) { // 응답 헤더가 이미 클라이언트로 전송되었는지 확인
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
