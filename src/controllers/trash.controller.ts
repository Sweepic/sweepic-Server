import {Request as ExpressRequest} from 'express';
import {
  deactivateImage,
  deleteImages,
  restoreImages,
} from '../services/trash.service.js';
import {BaseError, ServerError} from 'src/errors.js';
import {StatusCodes} from 'http-status-codes';
import {
  Body,
  Controller,
  Delete,
  Patch,
  Path,
  Request,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse,
} from '../models/tsoaResponse.js';
import {DeleteImagesDTO, RestoreImagesDTO} from '../dtos/trash.dto.js';

@Route('trash')
export class TrustController extends Controller {
  /**
   * 휴지통에 넣고싶은 imageId를 입력하시면 해당 이미지는 비활성화 됩니다.
   *
   * @summary 휴지통에 이미지 넣기
   * @param imageId 버릴 이미지ID
   * @returns 성공문구
   */
  @Patch('/images/{imageId}')
  @Tags('Trash')
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
  public async deactivateImage(
    @Path() imageId: string,
  ): Promise<ITsoaSuccessResponse<string>> {
    const imageIdBigint = BigInt(imageId);
    await deactivateImage(imageIdBigint).catch(err => {
      if (err instanceof BaseError) {
        throw err;
      }
      throw new ServerError({reason: err.message});
    });
    return new TsoaSuccessResponse(
      `${imageId} 이미지가 휴지통에 들어갔습니다.`,
    );
  }

  /**
   * 휴지통에서 선택된 이미지들을 복원하는 API 입니다.
   *
   * @summary 휴지통 복원 API
   * @param body 복구하고 싶은 이미지들의 mediaId
   * @param req
   * @returns 복구 성공 문구
   */
  @Patch('/active')
  @Tags('Trash')
  @SuccessResponse(StatusCodes.CREATED, 'CREATED')
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request', {
    resultType: 'FAIL',
    error: {
      errorCode: 'VAL-001',
      reason: '잘못된 요청입니다.',
      data: {
        mediaIdList: {
          message: '하나이상의 복구할 사진을 선택해주세요.',
          value: [],
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
        errorCode: 'DB-001',
        reason: 'DB 에러 입니다.',
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
        errorCode: 'SER-001',
        reason: '내부 서버 오류입니다.',
        data: {reason: '에러원인 메시지'},
      },
      success: null,
    },
  )
  public async restoreImages(
    @Body() body: {mediaIdList: string[]},
    @Request() req: ExpressRequest,
  ): Promise<ITsoaSuccessResponse<string>> {
    const dto = new RestoreImagesDTO(body.mediaIdList, req.user!.id);
    await restoreImages(dto).catch(err => {
      if (err instanceof BaseError) {
        throw err;
      }
      throw new ServerError({reason: err.message});
    });

    return new TsoaSuccessResponse('이미지 복구 성공');
  }

  /**
   * 저장된 이미지들의 데이터를 삭제하는 API 입니다.
   *
   * @summary 이미지데이터 삭제 API
   * @param body 삭제하고싶은 이미지들의 mediaId
   * @param req
   * @returns 삭제 성공 문구
   */
  @Delete('/images')
  @Tags('Trash')
  @SuccessResponse(StatusCodes.NO_CONTENT, 'DELETED')
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request', {
    resultType: 'FAIL',
    error: {
      errorCode: 'VAL-001',
      reason: '잘못된 요청입니다.',
      data: {
        mediaIdList: {
          message: '하나이상의 복구할 사진을 선택해주세요.',
          value: [],
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
        errorCode: 'DB-001',
        reason: 'DB 에러 입니다.',
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
        errorCode: 'SER-001',
        reason: '내부 서버 오류입니다.',
        data: {reason: '에러원인 메시지'},
      },
      success: null,
    },
  )
  public async deleteImages(
    @Body() body: {mediaIdList: string[]},
    @Request() req: ExpressRequest,
  ): Promise<ITsoaSuccessResponse<string>> {
    const dto = new DeleteImagesDTO(body.mediaIdList, req.user!.id);
    await deleteImages(dto).catch(err => {
      if (err instanceof BaseError) {
        throw err;
      }
      throw new ServerError({reason: err.message});
    });
    return new TsoaSuccessResponse('이미지 삭제 성공');
  }
}
