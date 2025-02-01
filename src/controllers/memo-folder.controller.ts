import {Response, Request, NextFunction, Express} from 'express';
import {StatusCodes} from 'http-status-codes';
import {
  bodyToMemoFolder,
  bodyToMemoTextToUpdate,
} from '../dtos/memo-folder.dto.js';
import {
  listMemoFolder,
  listMemoTextImage,
  memoFolderCreate,
  memoFolderImageCreate,
  memoFolderUpdate,
  memoSearch,
  memoTextUpdate,
} from '../services/memo-folder.service.js';
import {memoImageDelete} from '../services/memo-image.service.js';
import {bodyToMemoImagesToDelete} from '../dtos/memo-image.dto.js';
import {DataValidationError} from '../errors.js';

export const handlerMemoFolderImageCreate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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
  try {
    const userId = BigInt(req.user!.id);
    if (!req.file) {
      throw new DataValidationError({reason: '저장할 사진이 없습니다.'});
    }
    const imageUrl = (req.file as Express.MulterS3File).key;
    const folderId = req.uploadDirectory;
    const memoFolderImage = await memoFolderImageCreate(
      userId,
      folderId,
      imageUrl,
      req.body,
    );
    res.status(StatusCodes.OK).success(memoFolderImage);
  } catch (error) {
    next(error);
  }
};
export const handlerMemoFolderAdd = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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
  try {
    const userId = BigInt(req.user!.id);
    const memoFolder = await memoFolderCreate(
      userId,
      bodyToMemoFolder(req.body),
    );
    res.status(StatusCodes.OK).success(memoFolder);
  } catch (error) {
    next(error);
  }
};

export const handlerMemoFolderList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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
  try {
    const userId = BigInt(req.user!.id);
    const memoList = await listMemoFolder(userId);
    res.status(StatusCodes.OK).success(memoList);
  } catch (error) {
    next(error);
  }
};

export const handlerMemoSearch = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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
  try {
    const userId = BigInt(req.user!.id);
    const searchKeyword = req.query.keyword?.toString();
    if (searchKeyword === null || searchKeyword === undefined) {
      throw new DataValidationError({reason: '검색어를 1자 이상 입력하세요.'});
    }
    const searchMemoList = await memoSearch(userId, searchKeyword);
    res.status(StatusCodes.OK).success(searchMemoList);
  } catch (error) {
    next(error);
  }
};

export const handlerMemoImageDelete = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  /*
    #swagger.tags = ['memo-image-controller']
    #swagger.summary = '사진 삭제 API';
    #swagger.description = '특정 폴더의 사진을 삭제하는 API입니다.'
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
            "application/json": {
                schema: {
                    type: "object",
                    required: ['imageId'],
                    properties: {
                        imageId: { type: "array", items: { type: "integer" } }
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "사진 삭제 성공 응답",
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
  try {
    const userId = BigInt(req.user!.id);
    const folderId = BigInt(req.params.folderId);
    const memoImagesToMove = await memoImageDelete(
      userId,
      folderId,
      bodyToMemoImagesToDelete(req.body),
    );
    res.status(StatusCodes.OK).success(memoImagesToMove);
  } catch (error) {
    next(error);
  }
};
export const handlerMemoTextImageList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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
                                }
                            }
                        }     
                    }
                }
            }
        }
    };
    */
  try {
    const userId = BigInt(req.user!.id);
    const folderId = BigInt(req.params.folderId);
    const memoTextImageList = await listMemoTextImage(userId, folderId);
    res.status(StatusCodes.OK).success(memoTextImageList);
  } catch (error) {
    next(error);
  }
};

export const handlerMemoFolderUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  /*
    #swagger.tags = ['memo-folder-controller']
    #swagger.summary = '메모 폴더 이름 수정 API';
    #swagger.description = '특정 폴더의 이름을 수정하는 API입니다.'
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
        description: "폴더 이름 수정 성공 응답",
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
                                }
                            }
                        }    
                    }
                }
            }
        }
    };
    */
  try {
    const userId = BigInt(req.user!.id);
    const folderId = BigInt(req.params.folderId);
    const updatedMemoFolder = await memoFolderUpdate(
      userId,
      folderId,
      bodyToMemoFolder(req.body),
    );
    res.status(StatusCodes.OK).success(updatedMemoFolder);
  } catch (error) {
    next(error);
  }
};

export const handlerMemoTextUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  /*
    #swagger.tags = ['memo-folder-controller']
    #swagger.summary = '특정 폴더의 메모 텍스트 수정 API';
    #swagger.description = '특정 폴더의 메모 텍스트를 수정하는 API입니다.'
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
            "application/json": {
                schema: {
                    type: "object",
                    required: ['memoText'],
                    properties: {
                        memoText: { type: "string", description: "메모 텍스트" }
                    }
                }
            }
        }
    };    
    #swagger.responses[200] = {
        description: "메모 텍스트 수정 응답",
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
                                }
                            }
                        }     
                    }
                }
            }
        }
    };
    */
  try {
    const userId = BigInt(req.user!.id);
    const folderId = BigInt(req.params.folderId);
    const memoTextImageList = await memoTextUpdate(
      userId,
      folderId,
      bodyToMemoTextToUpdate(req.body),
    );
    res.status(StatusCodes.OK).success(memoTextImageList);
  } catch (error) {
    next(error);
  }
};
