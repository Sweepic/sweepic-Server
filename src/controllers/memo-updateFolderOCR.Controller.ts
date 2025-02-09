import {NextFunction, Request, Response} from 'express';
import {processOCRAndSave} from '../services/memo-ocrService.js';
import {StatusCodes} from 'http-status-codes';
import {DataValidationError, PhotoValidationError} from '../errors.js';
export const updateFolderOCR = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  /*
    #swagger.tags = ['memo-ai']
    #swagger.summary = '폴더 업데이트 및 OCR 수행'
    #swagger.description = '기존 폴더에 이미지를 추가하고, OCR 텍스트를 업데이트하는 API입니다.'
    #swagger.parameters['folderId'] = {
        in: 'path',
        required: true,
        description: "업데이트할 폴더의 ID",
        '@schema': {
            type: "number",
            example: 1
        }
    }
    #swagger.requestBody = {
        required: true,
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    required: ["base64_image"],
                    properties: {
                        base64_image: {
                            type: "string",
                            description: "OCR 처리를 위한 이미지 URL",
                            example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
                        }
                      
                    }
                }
            }
        }
    }
    #swagger.responses[200] = {
        description: "폴더 업데이트 및 텍스트 변환",
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
                            example: "image_url이 존재하지 않습니다."
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
                            example: "서버 에러 발생."
                        }
                    }
                }
            }
        }
    }
  */
  try {
    let base64_image: string | undefined = req.body.base64_image;

    // 파일이 존재하는 경우 base64 변환
    if (req.file) {
      base64_image = `data:image/png;base64,${req.file.buffer.toString('base64')}`;
    }

    const {folderId} = req.params; // URL 매개변수에서 folderId 가져오기
    const user_id = BigInt(req.user!.id);

    // 유효성 검사
    if (!folderId) {
      throw new DataValidationError({
        reason: 'folder_ID가 필요합니다.',
      });
    }

    if (!base64_image) {
      throw new DataValidationError({
        reason: 'base64_image가 필요합니다.',
      });
    }

    if (!user_id) {
      throw new DataValidationError({reason: 'user_id가 필요합니다.'});
    }
    //bae64 이미지 형태 검증
    if (!isValidBase64(base64_image)) {
      throw new PhotoValidationError({
        reason: '올바른 Base64 이미지 형식이 아닙니다.',
      });
    }

    const result = await processOCRAndSave({
      folder_id: Number(folderId),
      base64_image,
      user_id,
    });

    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

const isValidBase64 = (base64String: string): boolean => {
  // MIME 타입 검증 (jpeg, png, jpg 허용)
  const base64Regex = /^data:image\/(jpeg|png|jpg);base64,[A-Za-z0-9+/=]+$/;
  return base64Regex.test(base64String);
};
