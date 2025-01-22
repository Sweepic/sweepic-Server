import {Request, Response} from 'express';
import {processOCRAndSave} from '../services/memo-ocrService.js';

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
                        image_url: {
                            type: "string",
                            description: "OCR 처리를 위한 이미지 URL",
                            example: "https://example.com/image.jpg"
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
        description: "폴더 생성 및 텍스트와 이미지 저장 성공",
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
                                image_url: { type: "string", example: "https://example.com/image.jpg" }
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

  const {image_url, user_id, folder_name} = req.body;

  //유효성 검사
  if (!image_url) {
    res.status(400).json({error: 'image_url is required'});
    return;
  }

  if (!user_id) {
    res.status(400).json({error: 'user_id is required'});
    return;
  }

  if (!folder_name) {
    res
      .status(400)
      .json({error: 'folder_name is required to create a new folder'});
    return;
  }

  try {
    const result = await processOCRAndSave({
      image_url,
      user_id,
      folder_name,
    });

    res.status(201).json({
      message: 'Folder created and text saved successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error in createFolderOCR controller:', error);

    if (error instanceof Error) {
      res.status(500).json({error: error.message});
    } else {
      res.status(500).json({error: 'An unknown error occurred.'});
    }
  }
};
