import { Response, Request, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { memoFolderDelete, memoImageAdd, memoImageDelete, memoImagesMove } from '../services/memo-image.service.js';
import { bodyToMemoImagesToDelete, bodyToMemoImagesToMove } from '../dtos/memo-image.dto.js';
import { DataValidationError } from '../errors.js';

export const handlerMemoImageAdd = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  /*
    #swagger.tags = ['memo-image-controller']
    #swagger.summary = '사진 저장 API';
    #swagger.description = '특정 폴더에 사진을 저장하는 API입니다.'
        #swagger.parameters['folderId'] = {
        in: 'path',
        required: true,
        description: "폴더 ID 입력",
        '@schema': {
            type: "integer",
            format: "int64"
        }
    };
    #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    properties: {
                        image: {
                            type: "string", 
                            format: "binary",
                            description: "파일 업로드"
                        }
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "사진 저장 성공 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "SUCCESS" },
                        error: { type: "object", nullable: true, example: null },
                        success: {
                            type: "object", 
                            properties: {
                                folderId: { type: "string", example: "1" },
                                folderName: { type: "string" },
                                imageId: { type: "string", example: "1" },
                                imageUrl: { type: "string" },
                            }
                        }   
                    }
                }
            }
        }
    };
    */
    try{
        console.log('특정 폴더에 사진 추가');
        console.log('body: ', req.body);
        if (!req.user) {
            throw new Error('로그인을 하지 않았습니다.');
        }
        const folderId = BigInt(req.params.folderId);
        if (!req.file) {
            throw new DataValidationError({reason: '저장할 사진이 없습니다.'});
        }
        const imageUrl = (req.file as Express.MulterS3File).key;
        const memoImage = await memoImageAdd(folderId, imageUrl);
        res.status(StatusCodes.OK).success(memoImage);
    }
    catch(error) {
        next(error);
    }
};

export const handlerMemoImageMove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    /*
    #swagger.tags = ['memo-image-controller']
    #swagger.summary = '사진 이동 API';
    #swagger.description = '특정 폴더의 사진을 이동하는 API입니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    required: ['folderId', 'imageId'],
                    properties: {
                        targetFolderId: { type: "integer" },
                        imageId: { type: "array", items: { type: "integer" } }
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "사진 이동 성공 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "SUCCESS" },
                        error: { type: "object", nullable: true, example: null },
                        success: {
                            type: "object", 
                            properties: {
                                folderId: { type: "string", example: "1" },
                                folderName: { type: "string" },
                                imageText: { type: "string" },
                                images: { 
                                    type: "array", 
                                    items: { 
                                        type: "object", 
                                        properties: { 
                                            imageId: { type: "string", example: "1"}, 
                                            imageUrl: { type: "string" }
                                        }
                                    }
                                }
                            }
                        }    
                    }
                }
            }
        }
    };
    */
    try{
        if (!req.user){
            throw new Error('로그인을 하지 않았습니다.');
        }
        const userId = BigInt(req.user!.id);
        const folderId = BigInt(req.params.folderId);
        const memoImagesToMove = await memoImagesMove(userId, folderId, bodyToMemoImagesToMove(req.body));
        res.status(StatusCodes.OK).success(memoImagesToMove);
    }
    catch(error) {
        next(error);
    }
};

export const handlerMemoFolderDelete = async (req: Request, res: Response, next: NextFunction) :Promise<void> => {
    /*
    #swagger.tags = ['memo-folder-controller']
    #swagger.summary = '폴더 삭제 API';
    #swagger.description = '특정 폴더를 삭제하는 API입니다.'
    #swagger.parameters['folderId'] = {
        in: 'path',
        required: true,
        description: "폴더 ID 입력",
        '@schema': {
            type: "integer",
            format: "int64"
        }
    };
    #swagger.responses[200] = {
        description: "폴더 삭제 성공 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "SUCCESS" },
                        error: { type: "object", nullable: true, example: null },
                        success: {
                            type: "object", 
                            properties: {
                                message: { type: "string" }
                            }
                        }      
                    }
                }
            }
        }
    };
    */
    try{
        if (!req.user) {
            throw new Error('로그인을 하지 않았습니다.');
        }
        const userId = BigInt(req.user.id);
        const folderId = BigInt(req.params.folderId);
        const memoImagesToDelete = await memoFolderDelete(userId, folderId);
        res.status(StatusCodes.OK).success(memoImagesToDelete);
    }
    catch(error) {
        next(error);
    }
};
