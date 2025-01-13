import { CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Request } from 'express';
import { s3 } from './awsS3Client.js';

// AWS S3에서 특정 이미지의 디렉토리를 변경하는 함수
export const imageMover = async (req: Request, imageUrl: string, directory: string) => {
    const bucketName = process.env.AWS_S3_BUCKET_NAME; // S3 버킷 이름
    const region = process.env.AWS_REGION; // 위치한 AWS 리전

    const key = imageUrl.replace(`https://${bucketName}.s3.${region}.amazonaws.com/`, ''); // 이미지 URL에서 키 추출
    const copySource = `${bucketName}/${key}`; // S3 복사 작업에서의 원본 객체(버킷이름/객체키)
    const decodedKey = decodeURIComponent(key);

    const directoryToMove = directory ? `${directory}/` : ''; // 이동할 디렉토리
    const userId = req.user!.id; // 사용자 ID
    const targetKey = `${userId}/${directoryToMove}` + key.replace(/^[^/]+\/[^/]+\//, ''); // 복사될 key(사용자ID/이동디렉토리/uuid_파일이름)
    const decodedTargetKey = decodeURIComponent(targetKey); // 키 디코딩

    // S3에서 파일을 복사하기 위한 설정
    const copyParams = {
        Bucket: bucketName, // 복사할 대상 버킷 
        CopySource: copySource, // 복사할 원본 파일의 경로
        Key: decodedTargetKey, // 복사될 대상 파일의 경로
    };
    const copyCommand = new CopyObjectCommand(copyParams); // 파일 복사 명령 생성
    await s3.send(copyCommand); // 파일 복사 요청 실행

    // 삭제할 원본 파일 설정
    const deleteParams = {
        Bucket: bucketName,
        Key: decodedKey,
    };
    const deleteCommand = new DeleteObjectCommand(deleteParams);
    await s3.send(deleteCommand);
};