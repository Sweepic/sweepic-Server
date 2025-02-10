import {Request, Response, NextFunction} from 'express';
import * as userService from '../services/mypage.service.js';
import {AuthError} from '../errors.js';
import {StatusCodes} from 'http-status-codes';

//사용자 정보 가져오기
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = '사용자 정보 가져오기 API'
    #swagger.description = '사용자 정보를 가져오는 API입니다.'
    #swagger.responses[200] = {
      description: "사용자 정보 가져오기 성공",
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "SUCCESS" },
          error: { type: "object", nullable: true, example: null },
          success: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              email: { type: "string", example: "yein117@naver.com"},
              name: { type: "string", example: "예인" },
              goalCount: {type: "integer", example: 0},
              createdAt: {type: "string", example: "2025-01-23T12:26:19.188Z"},
              updatedAt: { type: "string", format: "date-time" }
            }
          }
        }
      }
    }
    #swagger.responses[401] = {
      description: "잘못된 요청",
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "FAILURE" },
          error: {
            type: "object",
            properties: {
              reason: { type: "string", example: "User_id를 찾을 수 없습니다" }
            }
          },
          success: { type: "object", nullable: true, example: null }
        }
      }
    }
  */
  try {
    if (!req.user?.id) {
      throw new AuthError({reason: 'User_id를 찾을 수 없습니다'});
    }
    const myPageUserId = req.user?.id;
    const user = await userService.getUserById(myPageUserId);
    res.status(StatusCodes.OK).success(user);
  } catch (error) {
    next(error);
  }
};
//사용자 로그아웃
export const logOutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  /*
    #swagger.tags = ['User']
    #swagger.summary = '사용자 로그아웃 API'
    #swagger.description = '로그아웃 API입니다.'
    #swagger.responses[204] = {
      description: "사용자 로그아웃 성공",
    }
    #swagger.responses[401] = {
      description: "잘못된 요청",
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "FAILURE" },
          error: {
            type: "object",
            properties: {
              reason: { type: "string", example: "Session ID가 존재하지 않습니다" }
            }
          },
          success: { type: "object", nullable: true, example: null }
        }
      }
    }
  */
  try {
    const sessionId = req.sessionID;
    if (!sessionId) {
      throw new AuthError({reason: 'Session ID가 존재하지 않습니다'});
    }
    await userService.logoutUserService(sessionId); //세션 삭제 처리
    req.session.destroy(() => {}); //express 세션도 삭제
    res.status(204).send(); // No Content;
  } catch (error) {
    next(error);
  }
};
//회원탈퇴
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    /*
    #swagger.tags = ['User']
    #swagger.summary = '회원탈퇴 API'
    #swagger.description = '사용자 상태를 비활성화하는 API입니다.'
    #swagger.responses[204] = {
      description: "회원탈퇴 성공",
    }
    #swagger.responses[401] = {
      description: "잘못된 요청",
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "FAILURE" },
          error: {
            type: "object",
            properties: {
              reason: { type: "string", example: "user를 찾을 수 없습니다" }
            }
          },
          success: { type: "object", nullable: true, example: null }
        }
      }
    }
  */
  try {
    if (!req.user?.id) {
      throw new AuthError({reason: 'User_id를 찾을 수 없습니다'});
    }
    const userId = req.user?.id;
    const success = await userService.deleteUser(userId);

    if (!success) {
      throw new AuthError({reason: 'user를 찾을 수 없습니다'});
    }

    res.status(204).send(); // No Content
  } catch (error) {
    next(error);
  }
};
