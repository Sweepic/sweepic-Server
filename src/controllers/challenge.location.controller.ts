import {Request as ExpressRequest} from 'express';
import {
  serviceCreateNewLocationChallenge,
  serviceGetLocationChallenge,
  serviceLocationLogic,
} from '../services/challenge.location.services.js';
import {StatusCodes} from 'http-status-codes';
import {
  LocationChallengeCreation,
  PhotoInfo,
  ResponseFromChallenge,
  ResponseFromLocationChallenge,
} from '../models/challenge.entities.js';
import {bodyToLocationCreation} from '../dtos/challenge.dtos.js';
import {BaseError, DataValidationError, ServerError} from '../errors.js';
import { 
  Controller,
  Post,
  Route,
  SuccessResponse,
  Tags,
  Request,
  Body,
  Get,
  Path,
  Response
} from 'tsoa';
import { ITsoaErrorResponse, ITsoaSuccessResponse, TsoaSuccessResponse } from '../models/tsoaResponse.js';

@Route('challenge')
export class LocationController extends Controller{
  /**
   * 위치 챌린지를 생성하는 API 입니다.
   * 
   * @summary 위치 챌린지 생성 API
   * @param req 
   * @param body 챌린지 생성에 필요한 정보
   * @returns 챌린지 정보
   */
  @Post('/location_challenge/create')
  @Tags('location challenge controller')
  @SuccessResponse(StatusCodes.OK, '위치 챌린지 성공 응답')
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST, 
    'Not Found', 
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'SRH-400',
        reason: '입력 데이터가 유효하지 않습니다.',
        data: null,
      },
      success: null,
    },
  )
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST, 
    'Not Found', 
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'CHL-400',
        reason: '위치 기반 챌린지 생성 중 오류가 발생했습니다.',
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
        errorCode: 'SER-001',
        reason: '내부 서버 오류입니다.',
        data: null,
      },
      success: null,
    },
  )
  public async handleNewLocationChallenge(
    @Request() req: ExpressRequest,
    @Body() body: {
      context: string,
      location: string,
      required: number
    }
  ): Promise<ITsoaSuccessResponse<ResponseFromChallenge>>{
    if(!req.user){
      throw new DataValidationError({reason: '유저 정보가 없습니다. 다시 로그인 해주세요.'});
    }

    const data: LocationChallengeCreation = bodyToLocationCreation(body, req.user.id);
    const result: ResponseFromChallenge = await serviceCreateNewLocationChallenge(data)
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
   * 위치 챌린지를 id로 조회하는 API입니다.
   * 
   * @summary 위치 챌린지 조회 API
   * @param req 
   * @param challengeId 챌린지 ID
   * @returns 챌린지 정보
   */
  @Get('/location_challenge/get/:id')
  @Tags('location challenge controller')
  @SuccessResponse(StatusCodes.OK, '위치 챌린지 조회 성공 응답')
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST, 
    'Not Found', 
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'SRH-400',
        reason: '입력 데이터가 유효하지 않습니다.',
        data: null,
      },
      success: null,
    },
  )
  @Response<ITsoaErrorResponse>(
    StatusCodes.BAD_REQUEST, 
    'Not Found', 
    {
      resultType: 'FAIL',
      error: {
        errorCode: 'CHL-404',
        reason: '해당 위치 기반 챌린지를 찾을 수 없습니다.',
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
        errorCode: 'SER-001',
        reason: '내부 서버 오류입니다.',
        data: null,
      },
      success: null,
    },
  )
  public async handleGetLocationChallenge(
    @Request() req: ExpressRequest,
    @Path('id') challengeId: string
  ): Promise<ITsoaSuccessResponse<ResponseFromLocationChallenge>>{
    if(!challengeId){
      throw new DataValidationError({
        reason: '올바른 parameter 값이 필요합니다.',
      });
    }

    const result: ResponseFromLocationChallenge = await serviceGetLocationChallenge(BigInt(challengeId))
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
   * 사진들의 위치 챌린지 조건을 판별하는 로직입니다.
   * 
   * @summary 위치 챌린지 판별 API
   * @param req 
   * @param body 사진 데이터 정보
   * @returns 사진 데이터 정보
   */
 @Post('/location_logic/test')
 @Tags('location challenge controller')
 @SuccessResponse(StatusCodes.OK, '위치 챌린지 판별 응답')
 @Response<ITsoaErrorResponse>(
  StatusCodes.BAD_REQUEST, 
  'Not Found', 
  {
    resultType: 'FAIL',
    error: {
      errorCode: 'SRH-400',
      reason: '입력 데이터가 유효하지 않습니다.',
      data: null,
    },
    success: null,
  },
)
@Response<ITsoaErrorResponse>(
  StatusCodes.BAD_REQUEST, 
  'Not Found', 
  {
    resultType: 'FAIL',
    error: {
      errorCode: 'PHO-404',
      reason: '해당 사진 데이터가 없습니다.',
      data: null,
    },
    success: null,
  },
)
@Response<ITsoaErrorResponse>(
  StatusCodes.BAD_REQUEST, 
  'Not Found', 
  {
    resultType: 'FAIL',
    error: {
      errorCode: 'PHO-400',
      reason: '사진 데이터가 유효하지 않습니다.',
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
      errorCode: 'SER-001',
      reason: '내부 서버 오류입니다.',
      data: null,
    },
    success: null,
  },
)
 public async handleLocationLogic(
  @Request() req: ExpressRequest,
  @Body() body: {
    id: string,
    displayName: string,
    longitude: number,
    latitude: number,
    timestamp: Date
  }[]
 ): Promise<ITsoaSuccessResponse<PhotoInfo[]>>{
  if(!body){
    throw new DataValidationError({reason: '사진 데이터가 없습니다.'});
  }

  const result: PhotoInfo[] = await serviceLocationLogic(body)
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