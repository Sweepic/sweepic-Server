import {Response, Request, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';
import {memoImageAdd} from '../services/memo-image.service.js';

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
    */
  console.log('특정 폴더에 사진 추가');
  console.log('body: ', req.body);
  // if (!req.user) {
  //     throw new Error('로그인을 하지 않았습니다.');
  // }
  const folderId = BigInt(req.params.folderId);
  if (!req.file) {
    throw new Error('저장할 사진이 없습니다.');
  }
  const imageUrl = (req.file as Express.MulterS3File).key;
  const memoImage = await memoImageAdd(folderId, imageUrl);
  res.status(StatusCodes.OK).success(memoImage);
};
