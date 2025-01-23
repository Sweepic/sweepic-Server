import {Request, Response} from 'express';
import {processOCRAndSave} from '../services/memo-ocrService.js';

export const updateFolderOCR = async (
  req: Request,
  res: Response,
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
            "application/json": {
                schema: {
                    type: "object",
                    required: ["base64_image", "user_id"],
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

  const {folderId} = req.params; // URL 매개변수에서 folderId 가져오기
  const {base64_image, user_id} = req.body;

  //유효성 검사
  if (!base64_image) {
    res.status(400).json({error: 'image is required'});
    return;
  }

  if (!user_id) {
    res.status(400).json({error: 'user_id is required'});
    return;
  }

  if (!folderId) {
    res.status(400).json({error: 'folderId is required for updating a folder'});
    return;
  }

  try {
    const result = await processOCRAndSave({
      folder_id: Number(folderId),
      base64_image,
      user_id,
    });

    res.status(200).json({
      message: 'Folder updated with new text successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error in updateFolderOCR controller:', error);

    if (error instanceof Error) {
      res.status(500).json({error: error.message});
    } else {
      res.status(500).json({error: 'An unknown error occurred.'});
    }
  }
};
