import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';

import {imageStatusUpdate, imageDelete} from '../services/trust.service.js';
import {bodyToImage} from '../dtos/image.dto.js';

async function handleImageStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  /*
        #swagger.tags = ['trust-controller']
        #swagger.summary = '이미지 상태 변화 API';
        #swagger.description = '이미지를 활성화(1) 또는 비활성화(0) 시키는 API입니다. 유저나 이미지 고유 id를 통해 이미지 상태를 변경할 수 있습니다.'
        #swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        type: "object",
                        required: ['userId', 'imageId'],
                        properties: {
                            userId: { type: "interger", description: "사용자 ID" },
                            imageId: { type: "integer", description: "이미지 고유 ID" , example: 1000100124}
                        }
                    }
                }
            }
        };
        #swagger.responses[200] = {
            description: "이미지 상태 변화 성공 응답",
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
                                    mediaId: { type: "string", example: "1000100124" },
                                    userId: { type: "string", example: "1" },
                                    createdAt: { type: "string", example: "2021-08-31T07:00:00.000Z" },
                                    updatedAt: { type: "string", example: "2021-08-31T07:00:00.000Z" },
                                    status: { type: "number", example: 1 }
                                }
                            }   
                        }
                    }
                }
            }
        };  
        #swagger.responses[400] = {
            description: "이미지 상태 변화 실패 응답",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            resultType: { type: "string", example: "FAIL" },
                            error: { 
                               type: "object",
                               properties: {
                                  errorCode: { type: "string", example: "U400" },
                                  reason: { type: "string", example: "이미지 조회 에러" },
                                  data: { 
                                      type: "object", 
                                      example: null
                                  }
                               }         
                            },
                            success: { type: "object", nullable: true, example: null }
                            }   
                        }
                    }
                }
            }
        };
        */

  console.log('handleImageStatus 실행');
  console.log('req.params: ', req.params);
  console.log('req.body: ', req.body);
  const updateImageStatus = await imageStatusUpdate(bodyToImage(req.body));
  res.status(StatusCodes.OK).success(updateImageStatus);
}

async function handleImageDelete(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  /*
        #swagger.tags = ['trust-controller']
        #swagger.summary = '휴지통 비우기 API';
        #swagger.description = '비활성화(0)된 이미지를 일괄 삭제시키는 API입니다. 유저 상태를 이용하여 변경할 수 있습니다.'
        #swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        type: "object",
                        required: ['userId', 'imageId'],
                        properties: {
                            userId: { type: "interger", description: "사용자 ID" },
                        }
                    }
                }
            }
        };
        #swagger.responses[200] = {
            description: "휴지통 비우기 성공 응답",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            resultType: { type: "string", example: "SUCCESS" },
                            error: { type: "object", nullable: true, example: null },
                            success: { type: "boolean", example: "true" }
                            }   
                        }
                    }
                }
            }
        };  
        #swagger.responses[400] = {
            description: "휴지통 비우기 실패 응답",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            resultType: { type: "string", example: "FAIL" },
                            error: { 
                               type: "object",
                               properties: {
                                  errorCode: { type: "string", example: "U400" },
                                  reason: { type: "string", example: "유저 조회 에러" },
                                  data: { 
                                      type: "object", 
                                      example: null
                                  }
                               }         
                            },
                            success: { type: "object", nullable: true, example: null }
                            }   
                        }
                    }
                }
            }
        };
        */

  console.log('handleImageDelete 실행');
  console.log('req.params: ', req.params);
  console.log('req.body: ', req.body);
  const deleteImage = await imageDelete(req.body.userId);
  res.status(StatusCodes.OK).success(deleteImage);
}

export {handleImageStatus, handleImageDelete};
