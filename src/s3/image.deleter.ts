import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from './awsS3Client.js';

// AWS S3에서 특정 이미지를 삭제하는 함수
export const imageDeleter = async (imageUrl: string) => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME; // S3 버킷 이름
    const region = process.env.AWS_REGION; // 위치한 AWS 리전
    const key = imageUrl.replace(`https://${bucketName}.s3.${region}.amazonaws.com/`, ''); // 이미지 URL에서 키를 추출한다.
    const decodedKey = decodeURIComponent(key); // 인코딩 되어 있는 키를 디코딩한다.

    // 삭제할 파일 정보 설정
    const deleteParams = {
        Bucket: bucketName,
        Key: decodedKey,
    };
    const deleteCommand = new DeleteObjectCommand(deleteParams); // 파일 삭제 명령 생성
    await s3.send(deleteCommand); // 파일 삭제 요청 실행
};