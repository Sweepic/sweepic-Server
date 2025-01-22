import express, {Request} from 'express';
export const authRouter = express.Router();
import { UserModel } from '../models/user.model.js';
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import passport from 'passport';
import { naverStrategy,googleStrategy,kakaoStrategy } from '../auth.config.js';
import { prisma } from '../db.config.js';


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

// 세션 설정
authRouter.use(
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


//passport 초기화
authRouter.use(passport.initialize());
authRouter.use(passport.session());

//네이버 로그인 라우트
authRouter.get('/login/naver', passport.authenticate('naver', {scope: ['email', 'name']}));
//네이버 로그인 콜백 라우트
authRouter.get(
  '/callback/naver',
  passport.authenticate('naver', { failureRedirect: '/' }),
  (req, res) => {
    // 로그인 성공 시 처리
    res.redirect('/'); // 온보딩 페이지로 리디렉션(예정)
  }
);
// 구글 로그인 라우트
authRouter.get('/login/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// 구글 로그인 콜백 라우트
authRouter.get(
  '/callback/google',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // 로그인 성공 시 처리
    res.redirect('/'); // 온보딩 페이지로 리디렉션(예정)
  }
);
// 카카오 로그인 라우트
authRouter.get('/login/kakao', passport.authenticate('kakao', {scope: ['profile_nickname', 'account_email']}));

// 카카오 로그인 콜백 라우트
authRouter.get(
  '/callback/kakao',
  passport.authenticate('kakao', { failureRedirect: '/' }),
  (req, res) => {
    // 로그인 성공 시 처리
    res.redirect('/'); // 온보딩 페이지로 리디렉션(예정)
  }
);