import { Response, Request, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { bodyToMemoFolder } from '../dtos/memo-folder.dto.js';
import {  memoFolderCreate, memoFolderImageCreate } from '../services/memo-folder.service.js';

export const handlerMemoFolderImageCreate = async (req: Request, res: Response, next: NextFunction) => {
    /*
    #swagger.tags = ['memo-folder-controller']
    #swagger.summary = '폴더 생성 및 사진 저장 API';
    #swagger.description = '폴더 생성과 동시에 파일을 저장하는 API입니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    required: ['folderName'],
                    properties: {
                        folderName: { type: "string", description: "폴더 이름" },
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
        description: "폴더 생성 및 사진 저장 성공 응답",
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
    console.log('폴더 생성 및 사진 추가');
    console.log('body: ', req.body);
    console.log('image: ', req.file);
    // if (!req.user) {
    //     throw new Error('로그인을 하지 않았습니다.');
    // }
    const imageUrl = (req.file as any).key;
    const folderId = req.uploadDirectory;
    console.log('imageUrl', imageUrl);
    const memoFolderImage = await memoFolderImageCreate(folderId, imageUrl);
    res.status(StatusCodes.OK).success(memoFolderImage);
};

export const handlerMemoFolderAdd = async (req: Request, res: Response, next: NextFunction) => {
    /*
    #swagger.tags = ['memo-folder-controller']
    #swagger.summary = '폴더 생성 API';
    #swagger.description = '폴더를 생성하는 API입니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    required: ['folderName'],
                    properties: {
                        folderName: { type: "string", description: "폴더 이름" }
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "폴더 생성 성공 응답",
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
                                id: { type: "string", example: "1" },
                                folderName: { type: "string" },
                            }
                        }   
                    }
                }
            }
        }
    };
    */
    console.log('폴더 생성');
    console.log('body: ', req.body);
    // if (!req.user) {
    //     throw new Error('로그인을 하지 않았습니다.');
    // }
    const userId = BigInt(1); //BigInt(req.user!.id);
    const memoFolder = await memoFolderCreate(userId, bodyToMemoFolder(req.body));
    res.status(StatusCodes.OK).success(memoFolder);
};
