import {Response, Request, NextFunction, Express} from 'express';
import {StatusCodes} from 'http-status-codes';
import {
  memoFolderDelete,
  memoImageAdd,
  memoImagesMove,
} from '../services/memo-image.service.js';
import {bodyToMemoImagesToMove} from '../dtos/memo-image.dto.js';
import {PhotoDataNotFoundError} from '../errors.js';

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
                                    reason: "저장할 사진이 없습니다."
                                }
                            },
                            success: null 
                        }
                    },
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
    */
  try {
    const folderId = BigInt(req.params.folderId);
    if (!req.file) {
      throw new PhotoDataNotFoundError({reason: '저장할 사진이 없습니다.'});
    }
    const imageUrl = (req.file as Express.MulterS3File).key;
    const memoImage = await memoImageAdd(folderId, imageUrl);
    res.status(StatusCodes.OK).success(memoImage);
  } catch (error) {
    next(error);
  }
};

export const handlerMemoImageMove = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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
    #swagger.responses[400] = {
        description: "사진 이동 에러",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAIL" },
                        error: { 
                            type: "object", 
                            properties: {
                                errorCode: { type: "string", example: "MEM-400" },
                                reason: { type: "string", example: "메모 사진 이동 중 오류가 발생했습니다." },
                                data: {
                                    type: "object",
                                    properties: {
                                        folderId: { type: "string", example: "1" },
                                        imageId: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                                example: "1"
                                            }
                                        }
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
    const memoImagesToMove = await memoImagesMove(
      userId,
      folderId,
      bodyToMemoImagesToMove(req.body),
    );
    res.status(StatusCodes.OK).success(memoImagesToMove);
  } catch (error) {
    next(error);
  }
};

export const handlerMemoFolderDelete = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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
    const memoImagesToDelete = await memoFolderDelete(userId, folderId);
    res.status(StatusCodes.OK).success(memoImagesToDelete);
  } catch (error) {
    next(error);
  }
};
