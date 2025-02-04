import {NextFunction, Request, Response} from 'express';
import {processOCRAndSave} from '../services/memo-ocrService.js';
import {StatusCodes} from 'http-status-codes';
import {BaseError} from '../errors.js';
import {DataValidationError, PhotoValidationError} from '../errors.js';

export const createFolderOCR = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  /*
    #swagger.tags = ['memo-ai']
    #swagger.summary = '폴더 생성 및 OCR 수행'
    #swagger.description = '새로운 폴더를 생성하고, 이미지에서 OCR 텍스트를 추출하여 이미지와 텍스트를 저장하는 API입니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    required: ["base64_image", "folder_name"],
                    properties: {
                        base64_image: {
                            type: "string",
                            description: "OCR 처리를 위한 이미지 URL",
                            example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
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

  try {
    let base64_image: string | undefined = req.body.base64_image;

    //파일 업로드가 있는 경우 base64 변환
    if (req.file) {
      base64_image = `data:image/png;base64,${req.file.buffer.toString('base64')}`;
    }

    const user_id = BigInt(req.user!.id);
    const {folder_name} = req.body;

    // 유효성 검사-데이터가 하나라도 빠지지 않도록
    if (!base64_image || !user_id || !folder_name) {
      throw new DataValidationError({
        reason: 'base64_image, user_id, folder_name이 필요합니다.',
      });
    }

    //base64 이미지 검증 - 올바른 형태인지
    if (!isValidBase64(base64_image)) {
      throw new PhotoValidationError({
        reason: '올바른 Base64 이미지 형식이 아닙니다.',
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
  } catch (error) {
    console.error('에러 발생:', error);
    next(error);
  }
};

const isValidBase64 = (base64String: string): boolean => {
  // base64 문자열 검증 함수
  const base64Regex = /^data:image\/(jpeg|png|jpg);base64,[A-Za-z0-9+/=]+$/;
  return base64Regex.test(base64String);
};
