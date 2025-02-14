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
  Post,
  Body,
  Middlewares,
} from 'tsoa';
import {
  findTagsByDate,
  findTagsFromImage,
} from '../services/tsoaTag.service.js';
import {
  DateToTags,
  ImageToTags,
  RequestBodyCreationTags,
  RequestCreationTags,
} from '../dtos/tsoaTag.dto.js';
import {
  BaseError,
  PhotoDataNotFoundError,
  PhotoValidationError,
  ServerError,
} from '../errors.js';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse,
} from '../models/tsoaResponse.js';
import {StatusCodes} from 'http-status-codes';
import {Request as ExpressRequest} from 'express';
import {
  ResponseCreationTags,
  ResponseTagListFromImage,
  ResponseTagListWithDate,
} from '../models/tsoaTag.model.js';
import {tagCreate} from '../services/tag.service.js';
import {uploadMiddleware} from '../ai/ai-upload.middleware.js';
import {detectLabels} from '../services/tags-ai.service.js';

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

  /**
   * 태그를 생성하는 API 입니다.
   *
   * @summary 태그 생성
   * @param imageId 이미지ID
   * @param body 생성할 태그들
   * @returns 생성된 태그
   */
  @Post('/images/{imageId}')
  @Tags('Tag')
  @SuccessResponse(201, 'CREATED')
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
  @Response(500, 'Internal Server Error', {
    resultType: 'FAIL',
    error: {
      errorCode: 'SER-001',
      reason: '내부 서버 오류입니다.',
      data: {reason: '에러원인 메시지'},
    },
    success: null,
  })
  public async postTag(
    @Path() imageId: string,
    @Body() body: RequestBodyCreationTags,
  ): Promise<ITsoaSuccessResponse<ResponseCreationTags>> {
    const dto = new RequestCreationTags(imageId, body.tags);
    const newImageTag = await tagCreate(dto).catch(err => {
      if (err instanceof BaseError) {
        throw err;
      }
      throw new ServerError({reason: err.message});
    });
    return new TsoaSuccessResponse(newImageTag);
  }

  /**
   * 이미지를 분석하여 태그 추천 라벨을 생성합니다.
   *
   * @summary 이미지 분석 태그생성 API
   * @param req
   * @param image 라벨을 생성할 이미지
   * @returns 태그 라벨
   */
  @Post('/ai')
  @Middlewares(uploadMiddleware)
  @Tags('Tag')
  @SuccessResponse(201, 'CREATED')
  @Response<ITsoaErrorResponse>(StatusCodes.NOT_FOUND, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'PHO-404',
      reason: '해당 사진 데이터가 없습니다.',
      data: {reason: '라벨링을 추출 할 사진이 없습니다.'},
    },
    success: null,
  })
  @Response<ITsoaErrorResponse>(StatusCodes.NOT_FOUND, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'LBL-405',
      reason: '이미지에서 라벨을 감지하지 못했습니다.',
      data: {reason: '해당 이미지는 정보가 부족합니다.'},
    },
    success: null,
  })
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request', {
    resultType: 'FAIL',
    error: {
      errorCode: 'PHO-400',
      reason: '사진 데이터가 유효하지 않습니다.',
      data: {reason: '올바른 Base64 이미지 형식이 아닙니다.'},
    },
    success: null,
  })
  @Response<ITsoaErrorResponse>(
    StatusCodes.INTERNAL_SERVER_ERROR,
    'Internal Server Error',
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'LBL-500',
        reason: '라벨링 처리 중 오류가 발생했습니다.',
        data: {reason: '라벨링 처리 중 오류가 발생했습니다.'},
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
        errorCode: 'SER-001',
        reason: '내부 서버 오류입니다.',
        data: {reason: '에러원인 메시지'},
      },
      success: null,
    },
  )
  public async getLableFromImage(@Request() req: ExpressRequest): Promise<
    ITsoaSuccessResponse<{
      labels: {
        description: string;
        score: number;
      }[];
    }>
  > {
    if (!req.file) {
      throw new PhotoDataNotFoundError({
        reason: '라벨링을 추출 할 사진이 없습니다.',
      });
    }

    const base64_image = req.file.buffer.toString('base64');

    if (!isValidBase64(base64_image)) {
      throw new PhotoValidationError({
        reason: '올바른 Base64 이미지 형식이 아닙니다.',
      });
    }

    const labels = {
      labels: await detectLabels(base64_image).catch(err => {
        if (err instanceof BaseError) {
          throw err;
        }
        throw new ServerError({reason: err.message});
      }),
    };
    return new TsoaSuccessResponse(labels);
  }
}

const isValidBase64 = (base64String: string): boolean => {
  // base64 문자열 검증 함수
  const base64Regex =
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  return base64Regex.test(base64String);
};
