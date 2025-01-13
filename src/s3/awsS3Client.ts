import { S3Client } from '@aws-sdk/client-s3'; // Amazon S3 서비스와 통신

// AWS SDK의 s3 객체 생성
export const s3 = new S3Client({
    region: process.env.AWS_REGION, // 위치한 AWS 리전
    credentials: { // AWS에 인증하기 위한 자격 증명
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, // AWS 액세스 키
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // AWS 시크릿 액세스 키
    }
});