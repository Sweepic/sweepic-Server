import express from 'express';
export const authRouter = express.Router();
import {UserModel} from '../models/user.model.js';

import passport from 'passport';
import {naverStrategy, googleStrategy, kakaoStrategy} from '../auth.config.js';
import {prisma} from '../db.config.js';

// BigInt를 문자열로 직렬화
(BigInt.prototype as unknown as {toJSON: () => string}).toJSON = function () {
  return this.toString();
};
//passport 전략 설정
passport.use(naverStrategy);
passport.use(googleStrategy);
passport.use(kakaoStrategy);
// serialize 설정
passport.serializeUser((user, done) => done(null, user));
// deserializeUser 설정
passport.deserializeUser<UserModel>(async (user: UserModel, done) => {
  try {
    // 사용자 조회
    const checkUser = await prisma.user.findUnique({where: {id: user.id}});

    // 사용자 존재 여부 확인
    if (!checkUser) {
      return done(new Error('User not found'), null);
    }

    // 성공적으로 사용자 반환
    done(null, checkUser as UserModel);
  } catch (error) {
    // 에러 처리
    done(error, null);
  }
});

//네이버 로그인 라우트
authRouter.get(
  '/login/naver',
  passport.authenticate('naver', {scope: ['email', 'name']}),
  /* 
  #swagger.tags = ['OAuth']
  #swagger.summary = '네이버 로그인 URL 요청'
  #swagger.description = '네이버 OAuth 로그인을 시작하는 엔드포인트입니다. 브라우저에서 호출하면 네이버 로그인 페이지로 리디렉트됩니다.'
  #swagger.responses[302] = {
    description: "네이버 로그인 페이지로 리디렉트",
    headers: {
      Location: {
        type: "string",
        example: "https://3.37.137.212:3000/oauth2/login/naver"
      }
    }
  }
*/
);

//네이버 로그인 콜백 라우트
authRouter.get(
  '/callback/naver',
  passport.authenticate('naver', {failureRedirect: '/'}),
  (req, res) => {
    // 로그인 성공 시 처리
    res.redirect('/'); // 온보딩 페이지로 리디렉션(예정)
  },
  /* 
  #swagger.tags = ['OAuth']
  #swagger.summary = '네이버 로그인 콜백'
  #swagger.description = '네이버 OAuth 인증 후 리디렉션되는 엔드포인트입니다. 로그인 성공 시 세션을 생성하고 메인 페이지로 리디렉트합니다.'
  #swagger.responses[200] = {
    description: "로그인 성공",
    schema: {
      type: "object",
      properties: {
        token: { type: "string", example: "jwt_token_here" },
        user: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            email: { type: "string", example: "user@example.com" },
            name: { type: "string", example: "홍길동" }
          }
        }
      }
    }
  }
  #swagger.responses[401] = {
    description: "인증 실패",
    schema: {
      type: "object",
      properties: {
        error: { type: "string", example: "Unauthorized" }
      }
    }
  }
*/
);
// 구글 로그인 라우트
authRouter.get(
  '/login/google',
  passport.authenticate('google', {scope: ['profile', 'email']}),
  /* 
  #swagger.tags = ['OAuth']
  #swagger.summary = '구글 로그인 URL 요청'
  #swagger.description = '구글 OAuth 로그인을 시작하는 엔드포인트입니다.'
  #swagger.responses[302] = {
    description: "구글 로그인 페이지로 리디렉트",
    headers: {
      Location: {
        type: "string",
        example: "https://3.37.137.212:3000/oauth2/login/google"
      }
    }
  }
*/
);

// 구글 로그인 콜백 라우트
authRouter.get(
  '/callback/google',
  passport.authenticate('google', {failureRedirect: '/'}),
  (req, res) => {
    // 로그인 성공 시 처리
    res.redirect('/'); // 온보딩 페이지로 리디렉션(예정)
  },
  /* 
  #swagger.tags = ['OAuth']
  #swagger.summary = '구글 로그인 콜백'
  #swagger.description = '구글 OAuth 인증 후 리디렉션되는 엔드포인트입니다. 로그인 성공 시 세션을 생성하고 메인 페이지로 리디렉트합니다.'
  #swagger.responses[200] = {
    description: "로그인 성공",
    schema: {
      type: "object",
      properties: {
        token: { type: "string", example: "jwt_token_here" },
        user: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            email: { type: "string", example: "user@example.com" },
            name: { type: "string", example: "홍길동" }
          }
        }
      }
    }
  }
  #swagger.responses[401] = {
    description: "인증 실패",
    schema: {
      type: "object",
      properties: {
        error: { type: "string", example: "Unauthorized" }
      }
    }
  }
*/
);
// 카카오 로그인 라우트
authRouter.get(
  '/login/kakao',
  passport.authenticate('kakao', {
    scope: ['profile_nickname', 'account_email'],
  }),
  /* 
  #swagger.tags = ['OAuth']
  #swagger.summary = '카카오 로그인 URL 요청'
  #swagger.description = '카카오 OAuth 로그인을 시작하는 엔드포인트입니다.'
  #swagger.responses[302] = {
    description: "카카오 로그인 페이지로 리디렉트",
    headers: {
      Location: {
        type: "string",
        example: "https://3.37.137.212:3000/oauth2/login/kakao"
      }
    }
  }
*/
);

// 카카오 로그인 콜백 라우트
authRouter.get(
  '/callback/kakao',
  passport.authenticate('kakao', {failureRedirect: '/'}),
  (req, res) => {
    // 로그인 성공 시 처리
    res.redirect('/'); // 온보딩 페이지로 리디렉션(예정)
  },
  /* 
  #swagger.tags = ['OAuth']
  #swagger.summary = '카카오 로그인 콜백'
  #swagger.description = '카카오 OAuth 인증 후 리디렉션되는 엔드포인트입니다. 로그인 성공 시 세션을 생성하고 메인 페이지로 리디렉트합니다.'
  #swagger.responses[200] = {
    description: "로그인 성공",
    schema: {
      type: "object",
      properties: {
        token: { type: "string", example: "jwt_token_here" },
        user: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            email: { type: "string", example: "user@example.com" },
            name: { type: "string", example: "홍길동" }
          }
        }
      }
    }
  }
  #swagger.responses[401] = {
    description: "인증 실패",
    schema: {
      type: "object",
      properties: {
        error: { type: "string", example: "Unauthorized" }
      }
    }
  }
*/
);
