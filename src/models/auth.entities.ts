import { Profile as KakaoProfile } from 'passport-kakao';
import { Profile as NaverProfile } from 'passport-naver';
import { Profile as GoogleProfile } from 'passport-google-oauth20';

// Shared SocialAccount type
export type SocialProfile = KakaoProfile | NaverProfile | GoogleProfile;
