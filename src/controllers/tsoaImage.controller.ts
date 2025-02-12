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
  Post,
  Body,
} from 'tsoa';
import {RequestImageData, RequestTagSearch} from '../dtos/tsoaImage.dto.js';
import {addImage, findImagesFromTag} from '../services/tsoaImage.service.js';
import {BaseError, ServerError} from '../errors.js';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse,
} from '../models/tsoaResponse.js';
import {Request as ExpressRequest} from 'express';
import {StatusCodes} from 'http-status-codes';
import {
  ResponseCreateImage,
  ResponseGetImageListFromTag,
} from '../models/tsoaImage.model.js';

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
      reason: '<인하대학교> 태그에 해당하는 사진이 존재하지 않습니다.',
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
  public async getImageListFromTag(
    @Request() req: ExpressRequest,
    @Query() tag: string,
  ): Promise<ITsoaSuccessResponse<ResponseGetImageListFromTag>> {
    if (tag.trim() === '') {
      throw new ValidateError(
        {tag: {message: '"tag" is required'}},
        'Validation Error',
      );
    }
    const dto = new RequestTagSearch(tag, req.user!.id);
    const images = await findImagesFromTag(dto)
      .then(result => {
        return {images: result};
      })
      .catch(err => {
        if (err instanceof BaseError) {
          throw err;
        } else {
          throw new ServerError({reason: err.message});
        }
      });
    return new TsoaSuccessResponse(images);
  }

  /**
   * mediaId에 해당하는 사진데이터가 존재하면 해당 사진데이터의 imageId를 보여줍니다.(조회)
   *
   * mediaId에 해당하는 사진데이터가 존재하지 않는다면 사진데이터를 생성하고 생성한 사진데이터의 imageId를 보여줍니다.(생성)
   *
   * @summary 이미지 데이터 생성 및 조회
   * @param body 미디어ID, 사진 생성일
   * @returns 생성된 또는 존재하는 imageId
   */
  @Post('/')
  @Tags('Image')
  @SuccessResponse('201', 'CREATED')
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
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request', {
    resultType: 'FAIL',
    error: {
      errorCode: 'PHO-400',
      reason: '사진 데이터가 유효하지 않습니다.',
      data: {
        reason: '이미 휴지통에 있는 사진입니다',
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
  public async createImage(
    @Request() req: ExpressRequest,
    @Body()
    body: {
      mediaId: string;
      timestamp: Date;
    },
  ): Promise<ITsoaSuccessResponse<ResponseCreateImage>> {
    const dto = new RequestImageData(body, req.user!.id);
    const createdImageId = await addImage(dto).catch(err => {
      if (err instanceof BaseError) {
        throw err;
      } else {
        throw new ServerError({reason: err.message});
      }
    });
    const result = {
      imageId: createdImageId.toString(),
    };

    return new TsoaSuccessResponse(result);
  }
}
