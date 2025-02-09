import {
  Controller,
  Get,
  Query,
  Route,
  SuccessResponse,
  Tags,
  Request,
  Response,
  ValidateError,
} from 'tsoa';
import {RequestTagSearch} from '../dtos/tsoaImage.dto.js';
import {findImagesFromTag} from '../services/tsoaImage.service.js';
import {BaseError, ServerError} from '../errors.js';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse,
} from '../models/tsoaResponse.js';
import {Request as ExpressRequest} from 'express';
import {StatusCodes} from 'http-status-codes';

@Route('images')
export class ImagesController extends Controller {
  /**
   * 사용자가 tag를 입력하면 해당 태그에 속하는 이미지들을 가져옵니다.
   *
   * @summary 태그기반 이미지 검색
   * @param tag 태그 내용
   * @returns 태그에 속하는 이미지들
   */
  @Get('/')
  @Tags('Image')
  @SuccessResponse('200', 'OK')
  @Response<ITsoaErrorResponse>(StatusCodes.NOT_FOUND, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'PHO-404',
      reason: '<인하대학교교> 태그에 해당하는 사진이 존재하지 않습니다.',
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
        tag: {
          message: '"tag" is required',
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
  public async getImageListFromTag(
    @Request() req: ExpressRequest,
    @Query() tag: string,
  ): Promise<ITsoaSuccessResponse<{id: string; mediaId: string}[]>> {
    if (tag.trim() === '') {
      throw new ValidateError(
        {tag: {message: '"tag" is required'}},
        'Validation Error',
      );
    }
    const dto = new RequestTagSearch(tag, req.user!.id);
    const images = await findImagesFromTag(dto).catch(err => {
      if (err instanceof BaseError) {
        throw err;
      } else {
        throw new ServerError();
      }
    });
    return new TsoaSuccessResponse(images);
  }
}
