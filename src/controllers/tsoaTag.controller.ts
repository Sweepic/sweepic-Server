import {
  Controller,
  Get,
  Query,
  Route,
  SuccessResponse,
  Tags,
  Response,
  Request,
  Path,
} from 'tsoa';
import {
  findTagsByDate,
  findTagsFromImage,
} from '../services/tsoaTag.service.js';
import {DateToTags, ImageToTags} from '../dtos/tsoaTag.dto.js';
import {BaseError, ServerError} from '../errors.js';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse,
} from '../models/tsoaResponse.js';
import {StatusCodes} from 'http-status-codes';
import {Request as ExpressRequest} from 'express';
import {
  ResponseTagListFromImage,
  ResponseTagListWithDate,
} from '../models/tsoaTag.model.js';

@Route('tags')
export class TagsController extends Controller {
  /**
   * 사용자가 날짜를 입력하면 해당 날짜에 찍은 사진들의 태그를 검색합니다.
   *
   * date를 입력하지 않으면 해당 월에 찍은 사진들의 태그를 검색합니다.
   *
   * @summary 날짜기반 태그 검색 API
   * @param year 년
   * @param month 월
   * @param date 일
   * @returns 태그
   */
  @Get('/date')
  @Tags('Tag')
  @SuccessResponse(200, 'OK')
  @Response<ITsoaErrorResponse>(StatusCodes.NOT_FOUND, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'TAG-001',
      reason: '태그가 없습니다.',
      data: null,
    },
    success: null,
  })
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request', {
    resultType: 'FAIL',
    error: {
      errorCode: 'VAL-001',
      reason: 'Validation Error',
      data: {
        year: {
          message: 'invalid float',
          value: 'a',
        },
      },
    },
    success: null,
  })
  @Response<ITsoaErrorResponse>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    'Internal Server Error',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'SER-001',
        reason: '내부 서버 오류입니다.',
        data: {reason: '에러원인 메시지'},
      },
      success: null,
    },
  )
  @Response<ITsoaErrorResponse>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    'Internal Server Error',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'DB-001',
        reason: 'DB 에러 입니다.',
        data: {reason: '에러원인 메시지'},
      },
      success: null,
    },
  )
  public async getTagListWithDate(
    @Request() req: ExpressRequest,
    @Query() year: number,
    @Query() month: number,
    @Query() date?: number,
  ): Promise<ITsoaSuccessResponse<ResponseTagListWithDate>> {
    const user = req.user!;
    const dto = new DateToTags(user.id, year, month, date);
    const tags = await findTagsByDate(dto)
      .then(result => {
        return {tags: result};
      })
      .catch(err => {
        if (!(err instanceof BaseError)) {
          throw new ServerError({reason: err.message});
        } else {
          throw err;
        }
      });

    return new TsoaSuccessResponse(tags);
  }

  /**
   * 사용자가 mediaId를 제공하면 해당 이미지와 연관된 태그들의 정보를 제공합니다.
   *
   * @summary 이미지의 태그 조회
   * @param mediaId 이미지의 고유 mediaId
   * @returns 태그
   */
  @Get('/images/{mediaId}')
  @Tags('Tag')
  @SuccessResponse(200, 'OK')
  @Response<ITsoaErrorResponse>(StatusCodes.NOT_FOUND, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'TAG-001',
      reason: '태그가 없습니다.',
      data: null,
    },
    success: null,
  })
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request', {
    resultType: 'FAIL',
    error: {
      errorCode: 'VAL-001',
      reason: 'Validation Error',
      data: {
        mediaId: {
          message: 'invalid float',
          value: 'a',
        },
      },
    },
    success: null,
  })
  @Response<ITsoaErrorResponse>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    'Internal Server Error',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'SER-001',
        reason: '내부 서버 오류입니다.',
        data: {reason: '에러원인 메시지'},
      },
      success: null,
    },
  )
  @Response<ITsoaErrorResponse>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    'Internal Server Error',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'DB-001',
        reason: 'DB 에러 입니다.',
        data: {reason: '에러원인 메시지'},
      },
      success: null,
    },
  )
  public async getTagListFromImage(
    @Request() req: ExpressRequest,
    @Path() mediaId: number,
  ): Promise<ITsoaSuccessResponse<ResponseTagListFromImage>> {
    const dto = new ImageToTags(req.user!.id, mediaId);
    const tags = await findTagsFromImage(dto)
      .then(result => {
        return {tags: result};
      })
      .catch(err => {
        if (!(err instanceof BaseError)) {
          throw new ServerError({reason: err.message});
        } else {
          throw err;
        }
      });
    return new TsoaSuccessResponse(tags);
  }
}
