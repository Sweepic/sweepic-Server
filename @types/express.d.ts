import 'express';

declare global {
  namespace Express {
    export interface User extends UserModel {}

    export interface MulterS3File extends Multer.File {
      key: string;
    }

    export interface Request {
      uploadDirectory: bigint;
      file?: MulterS3File;
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
