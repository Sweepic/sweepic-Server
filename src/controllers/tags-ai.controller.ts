import {NextFunction, Request, Response} from 'express';
import {detectLabels} from '../services/tags-ai.service.js';
import {StatusCodes} from 'http-status-codes';
import {PhotoDataNotFoundError, PhotoValidationError} from '../errors.js';

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
              "multipart/form-data": {
                  schema: {
                      type: "object",
                      properties: {
                          base64_image: {
                              type: "string",
                              format: "binary",
                              description: "업로드할 이미지 파일"
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
    if (!req.file) {
      throw new PhotoDataNotFoundError({
        reason: '라벨링을 추출 할 사진이 없습니다',
      });
    }

    const base64_image = req.file.buffer.toString('base64');

    if (!isValidBase64(base64_image)) {
      throw new PhotoValidationError({
        reason: '올바른 Base64 이미지 형식이 아닙니다.',
      });
    }

    //서비스 호출
    const labels = await detectLabels(base64_image);

    // 라벨 반환
    res.status(StatusCodes.OK).json({topLabels: labels});
  } catch (error) {
    next(error);
  }
};

const isValidBase64 = (base64String: string): boolean => {
  // base64 문자열 검증 함수
  const base64Regex =
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  return base64Regex.test(base64String);
};
