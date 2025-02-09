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
import {DataValidationError, PhotoValidationError} from '../errors.js';

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
    #swagger.responses[400] = {
        description: "유효하지 않은 데이터 에러",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: { 
                            type: "object", 
                            properties: {
                                errorCode: { type: "string", example: "400" },
                                reason: { type: "string" },
                                data: {},
                            }
                        },
                        success: { type: "object", nullable: true, example: null },  
                    }
                },
                examples: {
                    "폴더 생성 에러": {
                        summary: "폴더 생성 에러",
                        description: "폴더 생성 중 오류가 발생했습니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "FOL-400",
                                reason: "폴더 생성 중 오류가 발생했습니다.",
                                data: {
                                    userId: "1",
                                    folderName: "string"
                                }
                            },
                            success: null 
                        }
                    },
                    "유효하지 않은 사진 데이터 에러": {
                        summary: "유효하지 않은 사진 데이터 에러",
                        description: "저장할 사진이 없습니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "PHO-400",
                                reason: "사진 데이터가 유효하지 않습니다.",
                                data: {
                                    reason: "저장할 사진이 없습니다."
                                }
                            },
                            success: null 
                        }
                    },
                    "사진 추가 에러": {
                        summary: "사진 추가 에러",
                        description: "메모 사진 추가 중 오류가 발생했습니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "MEM-400",
                                reason: "메모 사진 추가 중 오류가 발생했습니다.",
                                data: {
                                    folderId: "1",
                                    imageUrl: "string"
                                }
                            },
                            success: null 
                        }
                    },
                    "유효하지 않은 확장자 에러": {
                        summary: "유효하지 않은 확장자 에러",
                        description: "이미지 확장자가 유효하지 않습니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "PHO-400",
                                reason: "사진 데이터가 유효하지 않습니다.",
                                data: {
                                    extension: "string"
                                }
                            },
                            success: null 
                        }
                    }
                }
            }
        }
    };
    #swagger.responses[409] = {
        description: "폴더명 중복 에러",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: { 
                            type: "object", 
                            properties: {
                                errorCode: { type: "string", example: "FOL-409" },
                                reason: { type: "string", example: "이미 존재하는 폴더 이름입니다." },
                                data: {
                                    type: "object",
                                    properties: {
                                        folderName: { type: "string" },
                                    }
                                }
                            }
                        },
                        success: { type: "object", nullable: true, example: null },  
                    }
                }
            }
        }
    };
    */
  try {
    const userId = BigInt(req.user!.id);
    if (!req.file) {
      throw new PhotoValidationError({reason: '저장할 사진이 없습니다.'});
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
    #swagger.responses[400] = {
        description: "사진 추가 에러",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: { 
                            type: "object", 
                            properties: {
                                errorCode: { type: "string", example: "FOL-400" },
                                reason: { type: "string", example: "폴더 생성 중 오류가 발생했습니다." },
                                data: {
                                    type: "object",
                                    properties: {
                                        userId: { type: "string", example: "1" },
                                        folderName: { type: "string" },
                                    }
                                }
                            }
                        },
                        success: { type: "object", nullable: true, example: null },  
                    }
                },
            }
        }
    };
    #swagger.responses[409] = {
        description: "폴더명 중복 에러",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: { 
                            type: "object", 
                            properties: {
                                errorCode: { type: "string", example: "FOL-409" },
                                reason: { type: "string", example: "이미 존재하는 폴더 이름입니다." },
                                data: {
                                    type: "object",
                                    properties: {
                                        folderName: { type: "string" },
                                    }
                                }
                            }
                        },
                        success: { type: "object", nullable: true, example: null },  
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
    #swagger.responses[400] = {
        description: "유효하지 않은 입력 데이터 에러",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: { 
                            type: "object", 
                            properties: {
                                errorCode: { type: "string", example: "SRH-400" },
                                reason: { type: "string", example: "입력 데이터가 유효하지 않습니다." },
                                data: {
                                    type: "object",
                                    properties: {
                                        reason: { type: "string", example: "검색어를 1자 이상 입력하세요." },
                                    }
                                }
                            }
                        },
                        success: { type: "object", nullable: true, example: null },  
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
    #swagger.responses[404] = {
        description: "조회할 수 없는 데이터 에러",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: { 
                            type: "object", 
                            properties: {
                                errorCode: { type: "string", example: "404" },
                                reason: { type: "string" },
                                data: {},
                            }
                        },
                        success: { type: "object", nullable: true, example: null },  
                    }
                },
                examples: {
                    "폴더 조회 에러": {
                        summary: "폴더 조회 에러",
                        description: "해당 폴더를 찾을 수 없습니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "FOL-404",
                                reason: "해당 폴더를 찾을 수 없습니다.",
                                data: {
                                    folderId: "1",
                                }
                            },
                            success: null 
                        }
                    },
                    "사진 조회 에러": {
                        summary: "사진 조회 에러",
                        description: "해당 사진 데이터가 없습니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "PHO-404",
                                reason: "해당 사진 데이터가 없습니다.",
                                data: {
                                    imageId: "1"
                                }
                            },
                            success: null 
                        }
                    },
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
    #swagger.responses[404] = {
        description: "폴더 조회 에러",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: { 
                            type: "object", 
                            properties: {
                                errorCode: { type: "string", example: "FOL-404" },
                                reason: { type: "string", example: "해당 폴더를 찾을 수 없습니다." },
                                data: {
                                    type: "object",
                                    properties: {
                                        folderId: { type: "string", example: "1" },
                                    }
                                }
                            }
                        },
                        success: { type: "object", nullable: true, example: null },  
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
    #swagger.responses[404] = {
        description: "폴더 조회 에러",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: { 
                            type: "object", 
                            properties: {
                                errorCode: { type: "string", example: "FOL-404" },
                                reason: { type: "string", example: "해당 폴더를 찾을 수 없습니다." },
                                data: {
                                    type: "object",
                                    properties: {
                                        folderId: { type: "string", example: "1" },
                                    }
                                }
                            }
                        },
                        success: { type: "object", nullable: true, example: null },  
                    }
                }
            }
        }
    };
    #swagger.responses[409] = {
        description: "폴더명 중복 에러",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: { 
                            type: "object", 
                            properties: {
                                errorCode: { type: "string", example: "FOL-409" },
                                reason: { type: "string", example: "이미 존재하는 폴더 이름입니다." },
                                data: {
                                    type: "object",
                                    properties: {
                                        folderName: { type: "string" },
                                    }
                                }
                            }
                        },
                        success: { type: "object", nullable: true, example: null },  
                    }
                }
            }
        }
    };
    #swagger.responses[400] = {
        description: "유효하지 않은 데이터 에러",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: { 
                            type: "object", 
                            properties: {
                                errorCode: { type: "string", example: "400" },
                                reason: { type: "string" },
                                data: {},
                            }
                        },
                        success: { type: "object", nullable: true, example: null },  
                    }
                },
                examples: {
                    "폴더명 업데이트 에러": {
                        summary: "폴더명 업데이트 에러",
                        description: "폴더 업데이트 중 오류가 발생했습니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "FOL-400",
                                reason: "폴더 업데이트 중 오류가 발생했습니다.",
                                data: {
                                    folderId: "1",
                                }
                            },
                            success: null 
                        }
                    },
                    "변경 전과 동일한 폴더명 에러": {
                        summary: "변경 전과 동일한 폴더명 에러",
                        description: "변경 전의 폴더 이름과 같습니다.",
                        value: {
                            resultType: "FAIL",
                            error: { 
                                errorCode: "FOL-400",
                                reason: "변경 전의 폴더 이름과 같습니다.",
                                data: {
                                    folderName: "string"
                                }
                            },
                            success: null 
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
    #swagger.responses[404] = {
        description: "폴더 조회 에러",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: { 
                            type: "object", 
                            properties: {
                                errorCode: { type: "string", example: "FOL-404" },
                                reason: { type: "string", example: "해당 폴더를 찾을 수 없습니다." },
                                data: {
                                    type: "object",
                                    properties: {
                                        folderId: { type: "string", example: "1" },
                                    }
                                }
                            }
                        },
                        success: { type: "object", nullable: true, example: null },  
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
