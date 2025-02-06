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

export const updateUser = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    try {
        if (!req.user?.id) {
            throw new AuthError({reason: 'User_id를 찾을 수 없습니다'});
        }
        const userId = req.user?.id;
        const updatedUser = await userService.updateUser(userId, req.body);

    res.status(StatusCodes.OK).success(updatedUser);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.id) {
        throw new AuthError({reason: 'User_id를 찾을 수 없습니다'});

        }
        const userId = req.user?.id;
        const success = await userService.deleteUser(userId);

        if (!success) {
            throw new AuthError({reason: 'user not found'});
        }

        res.status(204).send(); // No Content
    } catch (error) {
        next(error);
    }
};