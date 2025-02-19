import {Request as ExpressRequest} from 'express';
import {
  ResponseFromChallenge,
  WeeklyChallengeCreation,
} from '../models/challenge.entities.js';
import {bodyToWeeklyCreation} from '../dtos/challenge.dtos.js';
import {StatusCodes} from 'http-status-codes';
import {
  serviceCreateNewWeeklyChallenge,
  serviceGetWeeklyChallenge,
} from '../services/challenge.weekly.services.js';
import {BaseError, DataValidationError, ServerError} from '../errors.js';
import {
  Controller,
  Route,
  SuccessResponse,
  Request,
  Post,
  Tags,
  Body,
  Get,
  Path,
  Response,
} from 'tsoa';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse,
} from '../models/tsoaResponse.js';

@Route('challenge')
export class DateChallengeController extends Controller {
  /**
   * 날짜 챌린지를 생성하는 API 입니다.
   *
   * @summary 날짜 챌린지 생성 API
   * @param req
   * @param body 챌린지 생성 정보
   * @returns 챌린지 정보
   */
  @Post('/weekly_challenge/create')
  @Tags('Date-challenge')
  @SuccessResponse(StatusCodes.OK, '날짜 챌린지 생성 성공 응답')
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'SRH-400',
      reason: '입력 데이터가 유효하지 않습니다.',
      data: null,
    },
    success: null,
  })
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'CHL-400',
      reason: '날짜 기반 챌린지 생성 중 오류가 발생했습니다.',
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
  public async handleNewWeeklyChallenge(
    @Request() req: ExpressRequest,
    @Body()
    body: {
      context: string;
      challengeDate: Date;
      required: number;
    },
  ): Promise<ITsoaSuccessResponse<ResponseFromChallenge>> {
    if (!req.user) {
      throw new DataValidationError({
        reason: '유저 정보가 없습니다. 다시 로그인 해주세요.',
      });
    }

    if (!req.body) {
      throw new DataValidationError({
        reason: '날짜 챌린지를 생성할 데이터가 없습니다.',
      });
    }

    const data: WeeklyChallengeCreation = bodyToWeeklyCreation(
      body,
      req.user.id,
    );
    const result: ResponseFromChallenge = await serviceCreateNewWeeklyChallenge(
      data,
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
   * 날짜 챌린지 조회 API입니다.
   *
   * @summary 날짜 챌린지 조회 API
   * @param req
   * @param challengeId 챌린지 ID
   * @returns 챌린지 정보
   */
  @Get('/weekly_challenge/get/:id')
  @Tags('Date-challenge')
  @SuccessResponse(StatusCodes.OK, '날짜 챌린지 조회 성공 응답')
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'SRH-400',
      reason: '입력 데이터가 유효하지 않습니다.',
      data: null,
    },
    success: null,
  })
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'CHL-400',
      reason: '해당 날짜 기반 챌린지를 찾을 수 없습니다.',
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
  public async handleGetWeeklyChallenge(
    @Request() req: ExpressRequest,
    @Path('id') challengeId: string,
  ): Promise<ITsoaSuccessResponse<ResponseFromChallenge>> {
    if (!req.params.id) {
      throw new DataValidationError({
        reason: '올바른 parameter값이 필요합니다.',
      });
    }

    const result: ResponseFromChallenge = await serviceGetWeeklyChallenge(
      BigInt(challengeId),
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
}
