import multer from 'multer'; // 파일 업로드 처리를 위한 미들웨어
import multerS3 from 'multer-s3'; // AWS S3를 연결하는 라이브러리
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid'; // 고유한 식별자(UUID) 생성
import path from 'path'; // 확장자 처리
import { s3 } from './awsS3Client.js';
import { createMemoFolder } from '../repositories/memo-folder.repository.js';
import { bodyToMemoFolder } from '../dtos/memo-folder.dto.js';
import { DataValidationError, FolderDuplicateError } from '../errors.js';

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.bmp', '.PNG', '.JPG', '.webp']; // 확장자 검사 목록
export const imageUploader = multer({ // 파일 업로드 미들웨어 설정
    storage: multerS3({ // multerS3 저장소 설정
        s3: s3, // AWS S3 객체 설정
        bucket: process.env.AWS_S3_BUCKET_NAME, // 업로드할 S3 버킷 이름
        contentType: multerS3.AUTO_CONTENT_TYPE, // 업로드 파일의 MIME 타입 자동 설정
        key: async (req: Request, file, callback) => { // S3 버킷에 저장될 경로와 이름 정의
            const userId = req.user!.id; // 사용자 ID

            const uuid = uuidv4(); // UUID 생성
            const extension = path.extname(file.originalname); // 파일 이름(확장자) 추출
            if (!allowedExtensions.includes(extension)) { // 업로드 파일의 확장자가 허용 목록에 없을 경우
                return callback(new DataValidationError({reason: '이미지 확장자가 유효하지 않습니다.'}));
            }
            
            // 디렉토리 path 설정 과정
            let uploadDirectory = null;
            if (req.body.folderName) {
                const createdMemoFolderId = await createMemoFolder(bodyToMemoFolder(req.body), userId);
                if (createdMemoFolderId === null) {
                    return callback(new FolderDuplicateError({folderName: req.body.folderName}));
                }
                uploadDirectory = createdMemoFolderId;
                req.uploadDirectory = uploadDirectory; // 디렉토리 정보 저장
            }
            else {
                const folderId = req.params.folderId;
                uploadDirectory = folderId;
            }

            callback(null, `${userId}/${uploadDirectory}/${uuid}_${file.originalname}`); // S3 버킷에서 파일이 저장될 key
        },
        acl: 'private', // 비공개 설정 (업로드 파일을 버킷 소유자만 접근 가능)
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 이미지 용량 제한 (5MB)
});