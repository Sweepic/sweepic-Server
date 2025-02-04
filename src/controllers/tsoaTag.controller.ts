import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Res,
  Route,
  SuccessResponse,
  Tags,
  Response,
  Request,
} from 'tsoa';
import {findTagsByDate} from '../services/tsoaTag.service.js';
import {DateToTags} from '../dtos/tsoaTag.dto.js';
import {AuthError, BaseError, ServerError} from '../errors.js';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse,
} from '../models/tsoaResponse.js';
import {StatusCodes} from 'http-status-codes';
import {Request as ExpressRequest} from 'express';

@Route('tags')
export class TagsController extends Controller {
  /**
   * 사용자가 날짜를 입력하면 해당 날짜에 찍은 사진들의 태그를 검색합니다.
   *
   * date를 입력하지 않으면 해당 월에 찍은 사진들의 태그를 검색합니다.
   *
   * @summary 날짜기반 태그 검색 API
   * @param userId 유저ID
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
        data: null,
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
        data: null,
      },
      success: null,
    },
  )
  public async getTagListWithDate(
    @Request() req: ExpressRequest,
    @Query() year: number,
    @Query() month: number,
    @Query() date?: number,
  ): Promise<ITsoaSuccessResponse<{tags: string[]}>> {
    const user = req.user!;
    const dto = new DateToTags(user.id, year, month, date);
    const tags = await findTagsByDate(dto)
      .then(result => {
        return {tags: result};
      })
      .catch(err => {
        if (!(err instanceof BaseError)) {
          throw new ServerError();
        } else {
          throw err;
        }
      });

    return new TsoaSuccessResponse(tags);
  }
}
