import {NextFunction, Request, Response} from 'express';
import {detectLabels} from '../services/tags-ai.service.js';
import {StatusCodes} from 'http-status-codes';
import {DataValidationError} from '../errors.js';

export const labelDetectionController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  /*
    #swagger.tags = ['label-detection']
    #swagger.summary = '이미지 라벨링'
    #swagger.description = 'Base64 데이터를 JSON으로 받아 이미지를 분석하여 상위 3개의 라벨과 정확도를 반환합니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        base64_image: {
                            type: "string",
                            description: "Base64 인코딩된 이미지 데이터",
                            example: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
                        }
                    }
                }
            }
        }
    }
    #swagger.responses[200] = {
        description: "라벨링 결과 반환",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        topLabels: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    description: { type: "string", example: "Mountain" },
                                    score: { type: "number", example: 0.95 }
                                }
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
                        error: { type: "string", example: "Base64 이미지 데이터가 제공되지 않았습니다." }
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
                        error: { type: "string", example: "라벨링 중 오류가 발생했습니다." }
                    }
                }
            }
        }
    }
  */

  try {
    // Base64 이미지 데이터가 요청에 포함되었는지 확인
    const {base64_image} = req.body;

    if (!base64_image) {
      throw new DataValidationError({
        reason: 'Base64 이미지 데이터가 제공되지 않았습니다.',
      });
    }

    // Base64 데이터에서 MIME 타입 제거
    const base64Data = base64_image.replace(/^data:image\/\w+;base64,/, '');

    // 서비스 호출
    const labels = await detectLabels(base64Data);

    // 라벨 반환
    res.status(StatusCodes.OK).json({topLabels: labels});
  } catch (error) {
    next(error);
  }
};
