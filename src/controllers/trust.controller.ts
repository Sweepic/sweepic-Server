import {Request, Response, NextFunction} from 'express';
import * as trustService from '../services/trust.service.js';
import {SearchNoResultsError, DataValidationError} from 'src/errors.js';
import {StatusCodes} from 'http-status-codes';

export const handleImageStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  /*
    #swagger.tags = ['Trust']
    #swagger.summary = '휴지통으로 이미지 이동 API'
    #swagger.description = '선택한 이미지를 휴지통으로 이동시키는 API입니다.'
     #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        mediaId: { 
                            type: "integer", 
                            description: "특정 이미지의 mediaId" 
                        }
                    },
                    required: ["mediaId"]
                }
            }
        }
    }
    #swagger.responses[200] = {
        description: "휴지통으로 이동 성공",
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
                                mediaId: { type: "integer", example: 100001 },
                                status: { type: "integer", example: 0 }
                            }
                        }
                    }
                }
            }
        }
    }

    #swagger.responses[500] = {
        description: "잘못된 요청 (mediaId가 올바르지 않음)",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAILURE" },
                        error: {
                            type: "object",
                            properties: {
                                reason: { type: "string", example: "mediaId가 올바르지 않습니다" }
                            }
                        },
                        success: { type: "object", nullable: true, example: null }
                    }
                }
            }
        }
    }

    #swagger.responses[500] = {
        description: "해당 mediaId에 대한 데이터를 찾을 수 없음",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "FAILURE" },
                        error: {
                            type: "object",
                            properties: {
                                reason: { type: "string", example: "해당 mediaId에 대한 이미지가 존재하지 않습니다" }
                            }
                        },
                        success: { type: "object", nullable: true, example: null }
                    }
                }
            }
        }
    }
  */
  try {
    const {mediaId} = req.body;
    const parsedMediaId = parseInt(mediaId);
    if (isNaN(parsedMediaId)) {
      throw new SearchNoResultsError({
        searchKeyword: 'mediaId가 올바르지 않습니다',
      });
    }
    const updatedImage = await trustService.deactivateImages(mediaId);
    if (!updatedImage) {
      throw new SearchNoResultsError({
        searchKeyword: '해당 mediaId에 대한 이미지가 존재하지 않습니다',
      });
    }
    const result = {
      mediaId: updatedImage.mediaId,
      status: updatedImage.status,
    };
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

export const handleImageRestore = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  /*
  #swagger.tags = ['Trust']
  #swagger.summary = '휴지통에서 이미지 복구 API'
  #swagger.description = '선택한 이미지를 휴지통에서 복구하는 API입니다.'
  #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      mediaIds: { 
                          type: "array",
                          items: { type: "integer" },
                          description: "복구할 이미지의 mediaId 리스트"
                      }
                  },
                  required: ["mediaIds"]
              }
          }
      }
  }

  #swagger.responses[200] = {
      description: "복구 성공",
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      resultType: { type: "string", example: "SUCCESS" },
                      error: { type: "object", nullable: true, example: null },
                      success: {
                          type: "array",
                          items: {
                              type: "object",
                              properties: {
                                  mediaId: { type: "integer", example: 10000001 },
                                  status: { type: "integer", example: 1 }
                              }
                          }
                      }
                  }
              }
          }
      }
  }
  #swagger.responses[500] = {
      description: "잘못된 요청 (mediaId가 올바르지 않음)",
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      resultType: { type: "string", example: "FAILURE" },
                      error: {
                          type: "object",
                          properties: {
                              reason: { type: "string", example: "mediaId가 올바르지 않습니다" }
                          }
                      },
                      success: { type: "object", nullable: true, example: null }
                  }
              }
          }
      }
  }
  #swagger.responses[500] = {
      description: "해당 mediaId에 대한 데이터를 찾을 수 없음",
      content: {
          "application/json": {
              schema: {
                  type: "object",
                  properties: {
                      resultType: { type: "string", example: "FAILURE" },
                      error: {
                          type: "object",
                          properties: {
                              reason: { type: "string", example: "해당 mediaId에 대한 이미지가 존재하지 않습니다" }
                          }
                      },
                      success: { type: "object", nullable: true, example: null }
                  }
              }
          }
      }
  }
*/
  try {
    const {mediaIds} = req.body;
    if (!Array.isArray(mediaIds)) {
      throw new SearchNoResultsError({
        searchKeyword: 'mediaIds가 올바르지 않습니다',
      });
    }
    const restoredImages = await trustService.restoreImages(mediaIds);
    if (!restoredImages.length) {
      throw new SearchNoResultsError({
        searchKeyword: '해당 mediaIds에 대한 이미지가 존재하지 않습니다',
      });
    }
    const result = restoredImages.map(image => ({
      mediaId: image.mediaId,
      status: image.status,
    }));
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

export const handleImageDelete = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  /* 
    #swagger.tags = ['Trust']
    #swagger.summary = '휴지통에서 이미지 삭제 API'
    #swagger.description = '선택한 이미지를 휴지통에서 삭제하는 API입니다.'

    #swagger.requestBody = { 
      required: true, 
      content: { 
        "application/json": { 
          schema: { 
            type: "object", 
            properties: { 
              imageIds: { 
                type: "array", 
                items: { type: "integer" }, 
                description: "삭제할 이미지의 imageId 리스트"
              } 
            }, 
            required: ["imageIds"] 
          } 
        } 
      } 
    }
    #swagger.responses[200] = {
      description: "삭제 성공",
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
                                success: { type: "boolean", example: true },
                            }
                        }   
                    }
                }
            }
        }
      }
     #swagger.responses[404] = { 
        description: "잘못된 요청 (imageIds가 올바르지 않음)", 
        content: {
            "application/json": {
                schema: { 
                    type: "object", 
                    properties: { 
                        resultType: { type: "string", example: "FAILURE" }, 
                        error: { 
                            type: "object", 
                            properties: { 
                                errorCode: { type: "string", example: "SRH-404" },
                                reason: { type: "string", example: "imageIds가 올바르지 않습니다" }, 
                            } 
                        }, 
                        success: { type: "object", nullable: true, example: null } 
                    } 
                },
                examples: {
                    "유효하지 않은 imageIds": {
                        summary: "유효하지 않은 imageIds",
                        description: "전송된 imageIds 값이 배열이 아니거나 올바른 숫자가 아닐 때 발생합니다.",
                        value: {
                            resultType: "FAILURE",
                            error: { 
                                errorCode: "SRH-404",
                                reason: "imageIds가 올바르지 않습니다",                            },
                            success: null
                        }
                    }
                }
            }
        }
    }

    #swagger.responses[400] = { 
        description: "삭제할 이미지가 존재하지 않음", 
        content: {
            "application/json": {
                schema: { 
                    type: "object", 
                    properties: { 
                        resultType: { type: "string", example: "FAILURE" }, 
                        error: { 
                            type: "object", 
                            properties: { 
                                errorCode: { type: "string", example: "SRH-400" },
                                reason: { type: "string", example: "해당 사진이 휴지통에 존재하지 않습니다" },                             } 
                        }, 
                        success: { type: "object", nullable: true, example: null } 
                    } 
                },
                examples: {
                    "삭제할 이미지가 존재하지 않음": {
                        summary: "삭제할 이미지가 존재하지 않음",
                        description: "전달된 imageIds 중 일부 또는 전체가 존재하지 않는 경우 발생합니다.",
                        value: {
                            resultType: "FAILURE",
                            error: { 
                                errorCode: "SRH-400",
                                reason: "해당 사진이 휴지통에 존재하지 않습니다",
                            },
                            success: null
                        }
                    }
                }
            }
        }
    }
    */

  try {
    const {mediaIds} = req.body;
    if (!Array.isArray(mediaIds)) {
      throw new SearchNoResultsError({
        searchKeyword: 'mediaIds가 올바르지 않습니다',
      });
    }
    const deleteable = await trustService.deleteImages(mediaIds);
    if (!deleteable) {
      throw new DataValidationError({
        reason: '해당 사진이 휴지통에 존재하지 않습니다',
      });
    }
    res.status(StatusCodes.OK).success(deleteable);
  } catch (error) {
    next(error);
  }
};
