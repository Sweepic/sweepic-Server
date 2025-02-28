import 'express';
import {UserModel} from '../src/models/user.model.ts';

declare global {
  namespace Express {
    export interface User extends UserModel {}

    export interface MulterS3File extends Express.Multer.File {
      key: string; // multer-s3에서 추가된 location 속성
    }

    export interface Request {
      uploadDirectory: bigint; // 업로드된 디렉토리 정보
      file?: MulterS3File; // MulterS3File 타입으로 확장
    }

    export interface Response {
      success(success: any): this;
      error(error: {
        errorCode?: string;
        reason?: string | null;
        data?: any | null;
      }): this;
    }
  }
}
