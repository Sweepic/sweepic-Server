import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from './awsS3Client.js';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const getPresignedUrl = async (key: string) => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    
    // AWS 리소스에 접근할 수 있는 Pre-signed URL 생성
    const command = new GetObjectCommand({ // S3 버킷에서 객체를 가져온다.
        Bucket: bucketName,
        Key: key, // S3 키
    });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // Signed URL 생성 (유효 기간: 1시간)
    
    return signedUrl;
};