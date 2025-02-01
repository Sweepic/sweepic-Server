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
      #swagger.description = '태그 생성 API입니다. 중복 이름은 허용하지 않습니다. 카레고리 ID가 없을 경우 에러를 반환합니다.'
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
          description: "태그 저장 성공 응답",
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
                                  id: { type: "string", example: "1" },
                                  content: { type: "string", example: "스위픽 단체사진" },
                                  createdAt: { type: "string", example: "2021-08-31T07:00:00.000Z" },
                                  updatedAt: { type: "string", example: "2021-08-31T07:00:00.000Z" },
                                  status: { type: "number", example: 1 },
                                  tagCategoryId: { type: "string", example: "1" }
                              }
                          }   
                      }
                  }
              }
          }
      };  
      #swagger.responses[400] = {
          description: "태그 저장 실패 응답",
          content: {
              "application/json": {
                  schema: {
                      type: "object",
                      properties: {
                          resultType: { type: "string", example: "FAIL" },
                          error: { 
                             type: "object",
                             properties: {
                                errorCode: { type: "string", example: "U400" },
                                reason: { type: "string", example: "태그 중복 확인 에러" },
                                data: { 
                                    type: "object", 
                                    example: null
                                }
                             }         
                          },
                          success: { type: "object", nullable: true, example: null }
                          }   
                      }
                  }
              }
          }
      };
      */
  console.log('태그 생성 컨트롤러 실행');
  console.log('body: ', req.body);

  const newImageTag = await tagCreate(bodyToTag(req.body));
  res.status(StatusCodes.OK).success(newImageTag);
}

export {handleNewTag};
