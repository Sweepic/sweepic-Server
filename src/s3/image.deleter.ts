import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from './awsS3Client.js';

// AWS S3에서 특정 이미지를 삭제하는 함수
export const imageDeleter = async (key: string) => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME; // S3 버킷 이름

    // 삭제할 파일 정보 설정
    const deleteParams = {
        Bucket: bucketName,
        Key: key,
    };
    const deleteCommand = new DeleteObjectCommand(deleteParams); // 파일 삭제 명령 생성
    await s3.send(deleteCommand); // 파일 삭제 요청 실행
};