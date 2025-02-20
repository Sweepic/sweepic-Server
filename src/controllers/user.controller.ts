import {Request as ExpressRequest} from 'express';
import {
  updateUserGoalCount as updateGoalCount,
  updateUserName,
} from '../services/user.service.js';
import {AuthError, BaseError, ServerError} from '../errors.js';
import {StatusCodes} from 'http-status-codes';
import {
  Body,
  Controller,
  Patch,
  Request,
  Route,
  SuccessResponse,
  Tags,
  ValidateError,
  Response,
  Get,
} from 'tsoa';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse,
} from '../models/tsoaResponse.js';
import {ResponseUser} from '../models/user.model.js';
import {
  getUserById,
  logoutUserService,
  removeUser,
} from '../services/mypage.service.js';

@Route('onboarding')
export class UserController extends Controller {
  /**
   * 로그인한 사용자의 이름을 변경하는 API입니다.
   *
   * @summary 사용자 이름 변경 API
   * @param req
   * @param bodyName 변경할 이름
   * @returns 변경된 유저정보
   */
  @Patch('/name')
  @Tags('User')
  @SuccessResponse(StatusCodes.CREATED, 'CREATED')
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request', {
    resultType: 'FAIL',
    error: {
      errorCode: 'VAL-001',
      reason: 'Validation Error',
      data: {
        name: {
          message: 'name is required',
          value: null,
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
  public async updateUserName(
    @Request() req: ExpressRequest,
    @Body() body: {name: string},
  ): Promise<ITsoaSuccessResponse<ResponseUser>> {
    const userId = req.user!.id;

    const name = body.name.trim();
    if (!name) {
      throw new ValidateError(
        {name: {message: 'name is required', value: null}},
        '이름이 입력되지 않았습니다.',
      );
    }

    const updatedUser = await updateUserName(userId, name).catch(err => {
      if (err instanceof BaseError) {
        throw err;
      }
      throw new ServerError({reason: err.message});
    });
    return new TsoaSuccessResponse(updatedUser);
  }

  /**
   * 로그인한 사용자의 목표 장수를 변경하는 API입니다.
   *
   * @summary 사용자 목표 장수 변경 API
   * @param req
   * @param body 변경할 목표 장수
   * @returns 변경된 유저정보
   */
  @Patch('/goal')
  @Tags('User')
  @SuccessResponse(StatusCodes.CREATED, 'CREATED')
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request', {
    resultType: 'FAIL',
    error: {
      errorCode: 'VAL-001',
      reason: 'Validation Error',
      data: {
        goalCount: {
          message: 'goalCount is required',
          value: null,
        },
      },
    },
    success: null,
  })
  @Response<ITsoaErrorResponse>(StatusCodes.BAD_REQUEST, 'Bad Request', {
    resultType: 'FAIL',
    error: {
      errorCode: 'VAL-001',
      reason: 'Validation Error',
      data: {
        goalCount: {
          message: 'goalCount is unsigned Integer',
          value: -8,
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
  public async updateUserGoalCount(
    @Request() req: ExpressRequest,
    @Body() body: {goalCount: number},
  ): Promise<ITsoaSuccessResponse<ResponseUser>> {
    const userId = req.user!.id;
    const goalCount = body.goalCount;
    if (goalCount === undefined || goalCount < 0) {
      throw new ValidateError(
        {
          goalCount: {
            message: 'goalCount is unsigned Integer',
            value: goalCount,
          },
        },
        '잘못된 목표장수 입니다.',
      );
    }

    const updatedUser = await updateGoalCount(userId, goalCount).catch(err => {
      if (err instanceof BaseError) {
        throw err;
      }
      throw new ServerError({reason: err.message});
    });

    return new TsoaSuccessResponse(updatedUser);
  }
}

@Route('user/mypage')
export class MypageController extends Controller {
  /**
   * 사용자 정보를 가져오는 API 입니다.
   *
   * @summary 사용자 정보 가져오기
   * @param req
   * @returns 유저 정보
   */
  @Get('')
  @Tags('User')
  @SuccessResponse(StatusCodes.OK, 'OK')
  @Response<ITsoaErrorResponse>(StatusCodes.NOT_FOUND, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'USR-404',
      reason: '사용자를 찾을수 없습니다',
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
  public async getUser(
    @Request() req: ExpressRequest,
  ): Promise<ITsoaSuccessResponse<ResponseUser>> {
    const myPageUserId = req.user!.id;
    const user = await getUserById(myPageUserId);
    const userInfo = {
      ...user,
      id: user.id.toString(),
    };

    return new TsoaSuccessResponse(userInfo);
  }

  /**
   * 사용자 로그아웃 API 입니다.
   *
   * @summary 사용자 로그아웃 API
   * @param req
   * @returns 로그아웃 성공 메시지
   */
  @Patch('/logout')
  @Tags('User')
  @SuccessResponse(StatusCodes.NO_CONTENT, 'LOGOUT')
  @Response<ITsoaErrorResponse>(StatusCodes.NOT_FOUND, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'AUT-401',
      reason: '인증 실패',
      data: {reason: 'Session ID가 존재하지 않습니다'},
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
  public async logOut(
    @Request() req: ExpressRequest,
  ): Promise<ITsoaSuccessResponse<string>> {
    const sessionID = req.sessionID;
    if (sessionID.trim() === '') {
      throw new AuthError({reason: 'Session ID가 존재하지 않습니다'});
    }
    await logoutUserService(sessionID);
    req.session.destroy(() => {});
    return new TsoaSuccessResponse('사용자 로그아웃 성공');
  }

  /**
   * 사용자 상태를 비활성화하는 API 입니다.
   *
   * @summary 회원탈퇴
   * @param req
   * @returns 탈퇴 성공 메시지
   */
  @Patch()
  @Tags('User')
  @SuccessResponse(StatusCodes.NO_CONTENT, '회원 탈퇴')
  @Response<ITsoaErrorResponse>(StatusCodes.NOT_FOUND, 'Not Found', {
    resultType: 'FAIL',
    error: {
      errorCode: 'AUT-401',
      reason: '인증 실패',
      data: {reason: 'user를 찾을 수 없습니다.'},
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
  public async deleteUser(
    @Request() req: ExpressRequest,
  ): Promise<ITsoaSuccessResponse<string>> {
    const userId = req.user!.id;
    const success = await removeUser(userId);
    const sessionID = req.sessionID;
    if (sessionID.trim() === '') {
      throw new AuthError({reason: 'Session ID가 존재하지 않습니다'});
    }
    await logoutUserService(sessionID);
    req.session.destroy(() => {});

    if (!success) {
      throw new AuthError({reason: 'user를 찾을 수 없습니다'});
    }

    return new TsoaSuccessResponse('회원 탈퇴 성공');
  }
}
