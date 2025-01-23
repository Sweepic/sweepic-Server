import { Response, Request, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { bodyToMemoFolder } from '../dtos/memo-folder.dto.js';
import { listMemoFolder, listMemoTextImage, memoFolderCreate, memoFolderImageCreate, memoSearch } from '../services/memo-folder.service.js';

export const handlerMemoFolderImageCreate = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
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
    if (!req.file) {
        throw new Error('저장할 사진이 없습니다.');
    }
    const imageUrl = (req.file as Express.MulterS3File).key;
    const folderId = req.uploadDirectory;
    console.log('imageUrl', imageUrl);
    const memoFolderImage = await memoFolderImageCreate(folderId, imageUrl);
    res.status(StatusCodes.OK).success(memoFolderImage);
};

export const handlerMemoFolderAdd = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
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

export const handlerMemoFolderList = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
    /*
    #swagger.tags = ['memo-folder-controller']
    #swagger.summary = '모든 메모 조회 API';
    #swagger.description = '모든 메모를 조회하는 API입니다.'
    #swagger.responses[200] = {
        description: "메모 조회 성공 응답",
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
                                data: {
                                    type: "array",
                                    items: {
                                        type: "object", 
                                        properties: {
                                            folderId: { type: "string", example: "1" },
                                            folderName: { type: "string" },
                                            imageText: { type: "string" },
                                            imageCount: { type: "integer", example: 0 },
                                            firstImageId: { type: "string", example: "1" },
                                            firstImageUrl: { type: "string" },
                                            createdAt: { type: "string", example: "2025-01-17T03:50:25.923Z"}
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
    console.log('메모 폴더 리스트 조회');
    // if (!req.user) {
    //     throw new Error('로그인을 하지 않았습니다.');
    // }
    const userId = BigInt(1); //BigInt(req.user!.id);
    const memoList = await listMemoFolder(userId);
    res.status(StatusCodes.OK).success(memoList);
};

export const handlerMemoSearch = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
    /*
    #swagger.tags = ['memo-folder-controller']
    #swagger.summary = '메모 검색 API';
    #swagger.description = '메모를 검색 및 조회하는 API입니다.'
    #swagger.parameters['keyword'] = {
        in: 'query',
        required: true,
        description: "검색 키워드",
        '@schema': {
            type: "string",
        }
    };
    #swagger.responses[200] = {
        description: "메모 검색 성공 응답",
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
                                data: {
                                    type: "array",
                                    items: {
                                        type: "object", 
                                        properties: {
                                            folderId: { type: "string", example: "1" },
                                            folderName: { type: "string" },
                                            imageCount: { type: "integer", example: 0 },
                                            imageText: { type: "string" },
                                            firstImageId: { type: "string", example: "1" },
                                            firstImageUrl: { type: "string" },
                                            createdAt: { type: "string", example: "2025-01-17T03:50:25.923Z"}
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
    console.log('메모 검색');
    // if (!req.user) {
    //     throw new Error('로그인을 하지 않았습니다.');
    // }
    const userId = BigInt(1); //BigInt(req.user!.id);
    const searchKeyword = req.query.keyword?.toString();
    if (searchKeyword == null) {
        throw new Error('검색어를 1자 이상 입력하세요.');
    }
    const searchMemoList = await memoSearch(userId, searchKeyword);
    res.status(StatusCodes.OK).success(searchMemoList);
};

export const handlerMemoTextImageList = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
    /*
    #swagger.tags = ['memo-folder-controller']
    #swagger.summary = '특정 폴더의 메모 조회 API';
    #swagger.description = '특정 폴더의 모든 메모(텍스트 및 사진)을 조회하는 API입니다.'
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
        description: "메모 조회 성공 응답",
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
                                            imageId: {type: "string", example: "1"}, 
                                            imageUrl: {type: "string" }
                                        }
                                    }
                                },
                                createdAt: { type: "string", example: "2025-01-17T03:50:25.923Z"}
                            }
                        }     
                    }
                }
            }
        }
    };
    */
    console.log('특정 폴더의 사진&텍스트 리스트 조회');
    // if (!req.user) {
    //     throw new Error('로그인을 하지 않았습니다.');
    // }
    const userId = BigInt(1);//BigInt(req.user!.id);
    const folderId = BigInt(req.params.folderId);
    const memoTextImageList = await listMemoTextImage(userId, folderId);
    res.status(StatusCodes.OK).success(memoTextImageList);
};
