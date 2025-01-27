import {Request, Response} from 'express';
import {processOCRAndSave} from '../services/memo-ocrService.js';
import {StatusCodes} from 'http-status-codes';
import {BaseError} from '../errors.js';
import {DataValidationError} from '../errors.js';

export const createFolderOCR = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /*
    #swagger.tags = ['memo-ai']
    #swagger.summary = '폴더 생성 및 OCR 수행'
    #swagger.description = '새로운 폴더를 생성하고, 이미지에서 OCR 텍스트를 추출하여 이미지와 텍스트를 저장하는 API입니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    required: ["image_url", "user_id", "folder_name"],
                    properties: {
                        base64_image: {
                            type: "string",
                            description: "OCR 처리를 위한 이미지 URL",
                            example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
                        },
                        user_id: {
                            type: "number",
                            description: "사용자 ID",
                            example: 1
                        },
                        folder_name: {
                            type: "string",
                            description: "생성할 폴더의 이름",
                            example: "공부"
                        }
                    }
                }
            }
        }
    }
    #swagger.responses[201] = {
        description: "폴더 생성 및 텍스트 변환",
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
                                folder_id: { type: "string", example: "1" },
                                image_text: { type: "string", example: "이번 수업 시간은 사회 과학 시간이다." },
                            }
                        }
                    }
                }
            }
        }
    }
    #swagger.responses[400] = {
        description: "잘못된 요청 데이터",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        error: {
                            type: "string",
                            example: "폴더의 이름을 입력해주세요."
                        }
                    }
                }
            }
        }
    }
    #swagger.responses[500] = {
        description: "서버 내부 오류",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        error: {
                            type: "string",
                            example: "서버에러발생."
                        }
                    }
                }
            }
        }
    }
  */

  const {base64_image, user_id, folder_name} = req.body;

  try {
    // 유효성 검사
    if (!base64_image || !user_id || !folder_name) {
      throw new DataValidationError({
        reason: 'base64_image, user_id, and folder_name are required fields.',
      });
    }

    // 서비스 호출
    const result = await processOCRAndSave({
      base64_image,
      user_id,
      folder_name,
    });

    // 성공 응답
    res.status(StatusCodes.CREATED).success(result);
  } catch (error: unknown) {
    console.error('에러 발생:', error);

    // BaseError 처리
    if (error instanceof BaseError) {
      res.status(error.statusCode).error({
        errorCode: error.code,
        reason: error.message,
        data: error.details,
      });
    } else {
      // 알 수 없는 에러 처리
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).error({
        errorCode: 'unknown',
        reason:
          error instanceof Error ? error.message : 'Unexpected server error.',
        data: null,
      });
    }
  }
};
