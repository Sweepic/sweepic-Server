import {Request, Response, NextFunction} from 'express';
import * as userService from '../services/mypage.service.js';
import {AuthError} from '../errors.js';
import {StatusCodes} from 'http-status-codes';

//사용자 정보 가져오기
export const getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
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
export const logOutUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const sessionId = req.sessionID;
        if(!sessionId) {
            throw new AuthError({reason: 'Session ID가 존재하지 않습니다'});
        }
        await userService.logoutUserService(sessionId); //세션 삭제 처리
        req.session.destroy(() => {}); //express 세션도 삭제
        res.status(204).send(); // No Content;
    } catch (error) {
        next(error);
    }

}
//회원탈퇴
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
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