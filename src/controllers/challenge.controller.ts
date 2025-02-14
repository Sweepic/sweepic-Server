import {Request as ExpressRequest} from 'express';
import {
  Controller,
  Route,
  Patch,
  Tags,
  Body,
  Request,
  SuccessResponse,
  Delete,
  Path,
  Get,
  Query,
  Response,
} from 'tsoa';
import {
  serviceAcceptChallenge,
  serviceCompleteChallenge,
  serviceDeleteChallenge,
  serviceGetByUserId,
  serviceUpdateChallenge,
} from '../services/challenge.services.js';
import {StatusCodes} from 'http-status-codes';
import {getReverseGeocode} from '../utils/challenge.utils.js';
import {
  ResponseFromChallenge,
  ResponseFromGetByUserIdReform,
  ResponseFromUpdateChallenge,
} from '../models/challenge.entities.js';
import {BaseError, DataValidationError, ServerError} from '../errors.js';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse,
} from '../models/tsoaResponse.js';

@Route('challenge')
export class ChallengeController extends Controller {
  /**
   * 챌린지의 남은 장수와 목표 장수를 수정하는 API입니다.
   *
   * @summary 챌린지 수정 API
   * @param body 챌린지 id, 남은 장수, 목표 장수
   * @returns 챌린지 업데이트 결과
   */
  @Patch('/update')
  @Tags('Challenge')
  @SuccessResponse(StatusCodes.OK, '챌린지 업데이터 성공 응답')
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'SRH-400',
      reason: '업데이트 내용이 없습니다.',
      data: null,
    },
    success: null,
  })
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'CHL-400',
      reason: '챌린지 업데이트 실패',
      data: null,
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
  public async handleUpdateChallenge(
    @Request() req: ExpressRequest,
    @Body()
    body: {
      id: string;
      required: number;
      remaining: number;
    },
  ): Promise<ITsoaSuccessResponse<ResponseFromUpdateChallenge>> {
    if (!body) {
      throw new DataValidationError({reason: '업데이트 내용이 없습니다.'});
    }

    const result: ResponseFromUpdateChallenge = await serviceUpdateChallenge(
      body,
    )
      .then(r => {
        return r;
      })
      .catch(err => {
        if (!(err instanceof BaseError)) {
          throw new ServerError();
        } else {
          throw err;
        }
      });

    return new TsoaSuccessResponse(result);
  }

  /**
   * 챌린지를 삭제하는 API입니다.
   *
   * @summary 챌린지 삭제 API
   * @param deleteId 삭제할 챌린지 ID
   * @returns 삭제한 챌린지의 ID
   */
  @Delete('/delete/:id')
  @Tags('Challenge')
  @SuccessResponse(StatusCodes.OK, '챌린지 삭제 성공 응답')
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'SRH-400',
      reason: '삭제할 챌린지의 id를 입력해주세요.',
      data: null,
    },
    success: null,
  })
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'CHL-400',
      reason: '챌린지 삭제 실패',
      data: null,
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
  public async handleRemoveChallenge(
    @Request() req: ExpressRequest,
    @Path('id') deleteId: string,
  ): Promise<ITsoaSuccessResponse<string>> {
    if (!deleteId) {
      throw new DataValidationError({
        reason: '삭제할 챌린지의 id를 입력해주세요.',
      });
    }

    await serviceDeleteChallenge(BigInt(deleteId))
      .then(() => {
        return;
      })
      .catch(err => {
        if (!(err instanceof BaseError)) {
          throw new ServerError();
        } else {
          throw err;
        }
      });

    return new TsoaSuccessResponse(`${deleteId} 챌린지 삭제`);
  }

  /**
   * 챌린지를 수락하는 API입니다.
   * parameter에 id값을 적으면 challenge의 status가 2로 변합니다.
   * 1 = 생성된 챌린지, 2 = 수락된 챌린지, 3 = 완료된 챌린지
   *
   * @summary 챌린지 수락 API
   * @param req
   * @param acceptId 수락할 챌린지의 ID
   * @returns 챌린지 정보
   */
  @Patch('/accept/:id')
  @Tags('Challenge')
  @SuccessResponse(StatusCodes.OK, '챌린지 수락 성공 응답')
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'SRH-400',
      reason: '입력된 id가 없습니다.',
      data: null,
    },
    success: null,
  })
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'CHL-400',
      reason: '챌린지를 수락할 수 없습니다.',
      data: null,
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
  public async handleAcceptChallenge(
    @Request() req: ExpressRequest,
    @Path('id') acceptId: string,
  ): Promise<ITsoaSuccessResponse<ResponseFromChallenge>> {
    if (!acceptId) {
      throw new DataValidationError({reason: '입력된 id가 없습니다.'});
    }

    const result: ResponseFromChallenge = await serviceAcceptChallenge(
      BigInt(acceptId),
    )
      .then(r => {
        return r;
      })
      .catch(err => {
        if (!(err instanceof BaseError)) {
          throw new ServerError();
        } else {
          throw err;
        }
      });

    return new TsoaSuccessResponse(result);
  }

  /**
   * 챌린지를 완료하는 API입니다.
   *
   * @summary 챌린지 완료 API
   * @param req
   * @param completeId 완료할 챌린지의 ID
   * @returns 챌린지 정보
   */
  @Patch('/complete/:id')
  @Tags('Challenge')
  @SuccessResponse(StatusCodes.OK, '챌린지 완료 성공 응답')
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'SRH-400',
      reason: '입력된 id가 없습니다.',
      data: null,
    },
    success: null,
  })
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'CHL-400',
      reason: '해당 챌린지를 완료할 수 없습니다.',
      data: null,
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
  public async handleCompleteChallenge(
    @Request() req: ExpressRequest,
    @Path('id') completeId: string,
  ): Promise<ITsoaSuccessResponse<ResponseFromChallenge>> {
    if (!completeId) {
      throw new DataValidationError({reason: '입력된 id가 없습니다.'});
    }

    const result: ResponseFromChallenge = await serviceCompleteChallenge(
      BigInt(completeId),
    )
      .then(r => {
        return r;
      })
      .catch(err => {
        if (!(err instanceof BaseError)) {
          throw new ServerError();
        } else {
          throw err;
        }
      });

    return new TsoaSuccessResponse(result);
  }

  /**
   * 로그인 되어 있는 유저의 모든 챌린지들을 불러옵니다.
   *
   * @summary 유저 챌린지 조회
   * @param req
   * @returns 챌린지 정보
   */
  @Get('/get')
  @Tags('Challenge')
  @SuccessResponse(StatusCodes.OK, '유저 챌린지 조회 성공')
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'SRH-400',
      reason: 'req.user 정보가 없습니다.',
      data: null,
    },
    success: null,
  })
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'CHL-400',
      reason: '해당 유저의 챌린지를 찾을 수 없습니다.',
      data: null,
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
  public async handleGetByUserId(
    @Request() req: ExpressRequest,
  ): Promise<ITsoaSuccessResponse<ResponseFromGetByUserIdReform[]>> {
    if (!req.user) {
      throw new DataValidationError({reason: 'req.user 정보가 없습니다.'});
    }

    const result: ResponseFromGetByUserIdReform[] = await serviceGetByUserId(
      req.user.id,
    )
      .then(r => {
        return r;
      })
      .catch(err => {
        if (!(err instanceof BaseError)) {
          throw new ServerError();
        } else {
          throw err;
        }
      });

    return new TsoaSuccessResponse(result);
  }

  /**
   * 지오해쉬 값을 입력하면 주소로 변환해줍니다.
   *
   * @summary 주소 변환 API
   * @param hashedLocation 해쉬된 위치 정보
   * @returns 주소 정보
   */
  @Get('getGeoCode')
  @Tags('Challenge')
  @SuccessResponse(StatusCodes.OK, '네이버 API 성공 응답')
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'SRH-400',
      reason: 'query문이 비었습니다. hashedLocation을 입력하세요.',
      data: null,
    },
    success: null,
  })
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'CHL-500',
      reason: '네이버 API 호출에 문제가 있습니다.',
      data: null,
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
  public async naverController(
    @Query() hashedLocation: string,
  ): Promise<ITsoaSuccessResponse<string>> {
    if (!hashedLocation) {
      throw new DataValidationError({
        reason: 'query문이 비었습니다. hashedLocation을 입력하세요.',
      });
    }

    const result: string = await getReverseGeocode(hashedLocation)
      .then(r => {
        return r;
      })
      .catch(err => {
        if (!(err instanceof BaseError)) {
          throw new ServerError();
        } else {
          throw err;
        }
      });

    return new TsoaSuccessResponse(result);
  }
}
