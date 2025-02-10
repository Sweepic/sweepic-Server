import {CopyObjectCommand, DeleteObjectCommand} from '@aws-sdk/client-s3';
import {s3} from './awsS3Client.js';
import {updateMemoImageUrl} from '../repositories/memo-image.repository.tsoa.js';
import process from 'process';

// AWS S3에서 특정 이미지의 디렉토리를 변경하는 함수
export const imageMover = async (
  userId: bigint,
  key: string,
  directory: bigint,
): Promise<void> => {
  // 원본 경로
  const bucketName = process.env.AWS_S3_BUCKET_NAME; // S3 버킷 이름
  const copySource = `${bucketName}/${key}`; // S3 복사 작업에서의 원본 객체(버킷이름/객체키)
  const encodedCopySource = encodeURIComponent(copySource);

  // 대상 경로 설정
  const directoryToMove = directory ? `${directory}/` : ''; // 이동할 디렉토리
  const imageOwnerId = userId; // 사용자 ID
  const targetKey = `${imageOwnerId}/${directoryToMove}${key.replace(/^[^/]+\/[^/]+\//, '')}`; // 복사될 key(사용자ID/이동디렉토리/uuid_파일이름)

  await updateMemoImageUrl(key, targetKey);

  // S3에서 파일을 복사하기 위한 설정
  const copyParams = {
    Bucket: bucketName, // 복사할 대상 버킷
    CopySource: encodedCopySource, // 복사할 원본 파일의 경로
    Key: targetKey, // 복사될 대상 파일의 경로
  };
  const copyCommand = new CopyObjectCommand(copyParams); // 파일 복사 명령 생성
  await s3.send(copyCommand); // 파일 복사 요청 실행

  // 삭제할 원본 파일 설정
  const deleteParams = {
    Bucket: bucketName,
    Key: key,
  };
  const deleteCommand = new DeleteObjectCommand(deleteParams);
  await s3.send(deleteCommand);
};
