import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';
import {bodyToTag} from '../dtos/tag.dto.js';
import {tagCreate} from '../services/tag.service.js';

async function handleNewTag(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  /*
      #swagger.tags = ['tag-controller']
      #swagger.summary = '태그 생성 API';
      #swagger.description = '태그 생성 API입니다. 중복 이름은 허용하지 않습니다.'
      #swagger.requestBody = {
          required: true,
          content: {
              "multipart/form-data": {
                  schema: {
                      type: "object",
                      required: ['content', 'tag_category_id'],
                      properties: {
                          content: { type: "string", description: "태그 이름" },
                          tag_category_id: { type: "integer", description: "태그 카테고리 ID" , example: 1}
                      }
                  }
              }
          }
      };
      #swagger.responses[200] = {
          description: "폴더 생성 및 사진 저장 성공 응답",
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
  console.log('태그 생성 컨트롤러 실행');
  console.log('body: ', req.body);

  const newTag = await tagCreate(bodyToTag(req.body));
  res.status(StatusCodes.OK).success(newTag);
}

export {handleNewTag};
