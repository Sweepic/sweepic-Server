import dotenv from 'dotenv';
import { Strategy as KakaoStrategy, Profile as KakaoProfile } from 'passport-kakao';
import { Strategy as NaverStrategy, Profile as NaverProfile } from 'passport-naver';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { prisma } from './db.config.js';
import { UserModel } from './models/user.model.js';
import { SocialProfile } from './models/auth.entities.js';
import { Request, Response, NextFunction } from 'express';
import { BaseError } from './errors.js';
import { StatusCodes } from 'http-status-codes';
dotenv.config();

const updateOrCreateSocialAccount = async (
  userId: bigint,
  profile: SocialProfile,
  provider: string
): Promise<void> => {
  const { id: providerUserId } = profile;

  // 기존 SocialAccount 조회
  const existingSocialAccount = await prisma.socialAccount.findFirst({
    where: { provider, providerUserId: providerUserId.toString(), userId },
  });

  const updatedAt = new Date();
  if (existingSocialAccount) {
    // SocialAccount 업데이트
    await prisma.socialAccount.update({
      where: { id: existingSocialAccount.id },
      data: { updatedAt, status: 1 },
    });
  } else {
    // 새로운 SocialAccount 생성
    await prisma.socialAccount.create({
      data: {
        provider,
        providerUserId: providerUserId.toString(),
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 1,
      },
    });
  }
};

// 네이버 로그인
export const naverStrategy = new NaverStrategy(
  {
    clientID: process.env.PASSPORT_NAVER_CLIENT_ID!,
    clientSecret: process.env.PASSPORT_NAVER_CLIENT_SECRET!,
    callbackURL: 'http://localhost:3000/oauth2/callback/naver',
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const user = await verifyUser(profile as NaverProfile, 'NAVER');
      cb(null, user as UserModel);
    } catch (err) {
      cb(err);
    }
  }
);

// 구글 로그인
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID!,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET!,
    callbackURL: 'http://localhost:3000/oauth2/callback/google',
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const user = await verifyUser(profile as GoogleProfile, 'GOOGLE');
      cb(null, user as UserModel);
    } catch (err) {
      cb(err);
    }
  }
);

// 카카오 로그인
export const kakaoStrategy = new KakaoStrategy(
  {
    clientID: process.env.PASSPORT_KAKAO_CLIENT_ID!,
    clientSecret: process.env.PASSPORT_KAKAO_CLIENT_SECRET!, // Optional in Kakao
    callbackURL: 'http://3.37.137.212:3000/oauth2/callback/kakao',
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const user = await verifyUser(profile as KakaoProfile, 'KAKAO');
      cb(null, user as UserModel);
    } catch (err) {
      cb(err);
    }
  }
);

// 사용자 검증 및 생성 함수
const verifyUser = async (
  profile: SocialProfile,
  provider: string
): Promise<{ id: bigint; email: string; name: string }> => {
  const email =
    provider === 'KAKAO'
      ? (profile as KakaoProfile)._json?.kakao_account?.email
      : provider === 'NAVER'
      ? (profile as NaverProfile).emails?.[0]?.value ||
        (profile as NaverProfile)._json?.email
      : (profile as GoogleProfile).emails?.[0]?.value;

  if (!email) {
    throw new Error(`profile.email was not found: ${JSON.stringify(profile)}`);
  }

  // 기존 사용자 조회
  const user = await prisma.user.findFirst({ where: { email } });

  const name =
    provider === 'KAKAO'
      ? profile.displayName || profile.username || 'Kakao User'
      : provider === 'NAVER'
      ? profile.displayName || (profile as NaverProfile)._json?.nickname || 'Naver User'
      : profile.displayName || 'Google User';

  const createdAt = new Date();
  if (user) {
    // SocialAccount 데이터 추가 또는 업데이트
    const { id, email, name } = user;
    await updateOrCreateSocialAccount(id, profile, provider);
    
    return { id, email, name };
  }

  // 새로운 사용자 생성
  const createdUser = await prisma.user.create({
    data: {
      email,
      name,
      goalCount: 0, // default
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 1,
    },
  });

  // SocialAccount 데이터 추가
  const { id, email: createdEmail, name: createdName } = createdUser;
  await updateOrCreateSocialAccount(id, profile, provider);

  return { id, email, name };
};


//인증 미들웨어
export const sessionAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cookies = req.cookies || {};
    let sessionId = cookies['connect.sid'];
    if (!sessionId) {
      console.error('Session ID missing in cookies.');
      res.status(401).json({ message: 'Unauthorized: No session ID provided.' });
      return;
    }

    // 's:' 및 서명 제거
    sessionId = sessionId.split('.')[0].replace(/^s:/, '');

    const sessionExpiresAt = sessionId.expiresAt
      ? new Date(sessionId.expiresAt)
      : req.session?.cookie?.expires
      ? new Date(req.session.cookie.expires)
      : null;

    if (!sessionExpiresAt || new Date() > sessionExpiresAt ) {
      console.warn('Session expired. Extending expiration:', sessionId);
      await extendSessionExpiration(sessionId); // 만료일 연장
      return;
    }

    // 세션 인증 완료 시
    next();
  } catch (error) {
    next(error);
    }
};

// 세션 만료일 연장 함수
const extendSessionExpiration = async (sid: string): Promise<void> => {
  try {
    const newExpirationDate = new Date();
    newExpirationDate.setDate(newExpirationDate.getDate() + 7); 

    await prisma.session.update({
      where: { sid },
      data: { expiresAt: newExpirationDate },
    });

    console.log(`Session expiration extended for SID: ${sid}`);
  } catch (error) {
    console.error(`Failed to extend session expiration for SID: ${sid}`, error);
    throw new BaseError(500, 'SES-500', 'Failed to extend session expiration.', {
      reason: 'Database update failed.',
    });
  }
};