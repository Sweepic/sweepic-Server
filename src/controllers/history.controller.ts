import { 
    Controller, 
    Get, 
    Route, 
    SuccessResponse, 
    Tags, 
    Request, 
    Post, 
    Patch, 
    Query,
    Response,
    Body,
} from 'tsoa';
import { Request as ExpressRequest } from 'express';
import { BaseError, DataValidationError, ServerError } from '../errors.js';
import { serviceGetAward, serviceGetMostTagged, serviceNewAward, serviceUpdateAward } from '../services/history.services.js';
import { ResponseFromMostTagToClient, ResponseFromAward, ResponseFromUpdateAward } from '../models/history.model.js';
import { ITsoaErrorResponse, ITsoaSuccessResponse, TsoaSuccessResponse } from '../models/tsoaResponse.js';
import { bodyToUpdateAward } from '../dtos/history.dto.js';
import { StatusCodes } from 'http-status-codes';

//most tag controller
@Route('user')
export class MostTaggedController extends Controller{
    /**
     * 사용자의 사진들의 카테고리별로 가장 많은 태그를 조회합니다.
     * 
     * @summary 인기 태그 조회 API
     * @returns 인기 태그
    */
    @Get('/history/most_tagged/get')
    @Tags('History')
    @SuccessResponse('200', 'OK')
    @Response<ITsoaErrorResponse>(
        StatusCodes.NOT_FOUND, 
        'Not Found', 
        {
            resultType: 'FAIL',
            error: {
                errorCode: 'HIS-404',
                reason: '조회를 요청한 데이터가 없습니다.',
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
                errorCode: 'SRH-400',
                reason: '유저 정보가 없습니다. 다시 로그인 해주세요.',
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
    public async getMostTagged(
        @Request() req: ExpressRequest,
    ): Promise<ITsoaSuccessResponse<ResponseFromMostTagToClient[]>> {
        if(!req.user){
           throw new DataValidationError({reason: '유저 정보가 없습니다. 다시 로그인 해주세요.'});
        }
        const userId: bigint = req.user.id;

        const result: ResponseFromMostTagToClient[] = await serviceGetMostTagged(userId)
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

//award controllers
@Route('user')
export class AwardController extends Controller{
    /**
     * 사용자의 어워드를 생성합니다.
     * 같은 달에 어워드가 이미 존재하는 경우 생성되지 않습니다.
     * 
     * @summary 어워드 생성 API
     * @returns 어워드
     */
    @Post('/history/award/create')
    @Tags('Award')
    @SuccessResponse('200', 'OK')
    @Response<ITsoaErrorResponse>(
        StatusCodes.NOT_FOUND, 
        'Not Found', 
        {
            resultType: 'FAIL',
            error: {
                errorCode: 'HIS-404',
                reason: '조회를 요청한 데이터가 없습니다.',
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
                errorCode: 'SRH-400',
                reason: '유저 정보가 없습니다. 다시 로그인 해주세요.',
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
                errorCode: 'HIS-400',
                reason: '이미 해당 월의 어워드가 존재합니다.',
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
    public async createNewAward(
        @Request() req: ExpressRequest
    ): Promise<ITsoaSuccessResponse<ResponseFromAward>> {
        if(!req.user){
            throw new DataValidationError({reason: '유저 정보가 없습니다. 다시 로그인 해주세요.'});
        }
        const userId: bigint = req.user.id;

        const result: ResponseFromAward = await serviceNewAward(userId)
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
     * 유저의 어워드에 사진을 등록합니다.
     * 총 5장의 사진만 등록 가능하며 원래 있던 사진들은 삭제하고 다시 등록합니다.
     * 배열에 이미지의 mediaId를 입력합니다.
     * 
     * @summary 어워드 수정 API
     * @param req
     * @param body 이미지 id의 배열
     * @param awardId 
     * @returns 어워드 이미지
     */
    @Patch('/history/award/modify')
    @Tags('Award')
    @SuccessResponse('200', 'OK')
    @Response<ITsoaErrorResponse>(
        StatusCodes.NOT_FOUND, 
        'Not Found', 
        {
            resultType: 'FAIL',
            error: {
                errorCode: 'HIS-404',
                reason: '조회를 요청한 데이터가 없습니다.',
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
                errorCode: 'SRH-400',
                reason: '유저 정보가 없습니다. 다시 로그인 해주세요.',
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
                errorCode: 'HIS-400',
                reason: '어워드 사진 형식이 잘못되었습니다.',
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
                errorCode: 'HIS-400',
                reason: '어워드 업데이트를 실패했습니다.',
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
    public async modifyAward(
        @Request() req: ExpressRequest,
        @Body() body: string[],
        @Query() awardId: string,
    ): Promise<ITsoaSuccessResponse<ResponseFromUpdateAward[]>> {
        if(!req.user){
            throw new DataValidationError({reason: '유저 정보가 없습니다. 다시 로그인 해주세요.'});
        }

        if(!body || !awardId){
            throw new DataValidationError({reason: '어워드 업데이트 정보가 없습니다.'});
        }

        const userId: bigint = req.user.id;

        const input: bigint[] = bodyToUpdateAward(body as string[]);

        const result: ResponseFromUpdateAward[] = await serviceUpdateAward(userId, BigInt(awardId), input)
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
     * 사용자의 어워드의 목록을 출력합니다.
     * 
     * @summary 어워드 조회 API
     * @returns 어워드
     */
    @Get('/history/award/get')
    @Tags('Award')
    @SuccessResponse('200', 'OK')
    @Response<ITsoaErrorResponse>(
        StatusCodes.NOT_FOUND, 
        'Not Found', 
        {
            resultType: 'FAIL',
            error: {
                errorCode: 'HIS-404',
                reason: '조회를 요청한 데이터가 없습니다.',
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
                errorCode: 'SRH-400',
                reason: '유저 정보가 없습니다. 다시 로그인 해주세요.',
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
    public async getAward(
        @Request() req: ExpressRequest
    ): Promise<ITsoaSuccessResponse<ResponseFromAward[]>> {
        if(!req.user){
            throw new DataValidationError({reason: '유저 정보가 없습니다. 다시 로그인 해주세요.'});
        }

        const userId: bigint = req.user.id;

        const result: ResponseFromAward[] = await serviceGetAward(userId)
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
};