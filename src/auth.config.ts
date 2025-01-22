import dotenv from 'dotenv';
import { Strategy as KakaoStrategy, Profile as KakaoProfile } from 'passport-kakao';
import { Strategy as NaverStrategy, Profile as NaverProfile } from 'passport-naver';
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from 'passport-google-oauth20';
import { prisma } from './db.config.js';
import { UserModel } from './models/user.model.js';
import { SocialProfile } from './entities.js';


dotenv.config();

const updateOrCreateSocialAccount = async (userId: bigint, profile: SocialProfile, provider: string):Promise<void> => {
  const providerUserId = profile.id.toString();

  // 기존 SocialAccount 조회
  const existingSocialAccount = await prisma.socialAccount.findFirst({
    where: {
      provider,
      providerUserId,
      userId,
    },
  });

  if (existingSocialAccount) {
    // SocialAccount 업데이트
    await prisma.socialAccount.update({
      where: { id: existingSocialAccount.id },
      data: {
        updatedAt: new Date(),
        status: 1,
      },
    });
  } else {
    // 새로운 SocialAccount 생성
    await prisma.socialAccount.create({
      data: {
        provider,
        providerUserId,
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
        cb(err); // Pass the error if something goes wrong
      }
    }
  );

  // 카카오 로그인
export const kakaoStrategy = new KakaoStrategy(
    {
      clientID: process.env.PASSPORT_KAKAO_CLIENT_ID!,
      clientSecret: process.env.PASSPORT_KAKAO_CLIENT_SECRET!, // Optional in Kakao
      callbackURL: 'http://localhost:3000/oauth2/callback/kakao',
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const user = await verifyUser(profile as KakaoProfile, 'KAKAO');
        cb(null, user as UserModel);
      } catch (err) {
        cb(err); // Pass the error if something goes wrong
      }
    }
  );

  // 사용자 검증 및 생성 함수
const verifyUser = async (profile: SocialProfile, provider: string): Promise<{id:bigint; email: string; name:string}> => {
    const email = provider === 'KAKAO'
      ? (profile as KakaoProfile)._json?.kakao_account?.email
      : provider === 'NAVER'
      ? (profile as NaverProfile).emails?.[0]?.value || (profile as NaverProfile)._json?.email
      : (profile as GoogleProfile).emails?.[0]?.value;
  
    if (!email) {
      throw new Error(`profile.email was not found: ${JSON.stringify(profile)}`);
    }
  
    // 기존 사용자 조회
    const user = await prisma.user.findFirst({ where: { email } });
  
    if (user !== null) {
      // SocialAccount 데이터 추가 또는 업데이트
      await updateOrCreateSocialAccount(user.id, profile, provider);
  
      return { id: user.id, email: user.email, name: user.name };
    }
  
    // 새로운 사용자 생성
    const createdUser = await prisma.user.create({
      data: {
        email,
        name: provider === 'KAKAO'
          ? profile.displayName || profile.username || 'Kakao User'
          : provider === 'NAVER'
          ? profile.displayName || (profile as NaverProfile)._json?.nickname || 'Naver User'
          : profile.displayName || 'Google User',
        goalCount: 0, // default
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 1,
      },
    });
  
    // SocialAccount 데이터 추가
    await updateOrCreateSocialAccount(createdUser.id, profile, provider);
  
    return { id: createdUser.id, email: createdUser.email, name: createdUser.name };
  };