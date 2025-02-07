import {userRepository, logoutUserRepository} from '../repositories/mypage.repository.js';
import {UserModel} from '../models/user.model.js';
import {UserNotFoundError} from '../errors.js';
//사용자 정보 가져오기
export const getUserById = async (user_id: bigint): Promise<UserModel | null> => {
    const user = await userRepository.findUserById(user_id);
    if (!user) {
        throw new UserNotFoundError();
    }
    return user;
};
//사용자 회원 탈퇴
export const deleteUser = async (user_id: bigint): Promise<boolean> => {
    return await userRepository.deleteUser(user_id);
};
//사용자 로그아웃
export const logoutUserService = async (sessionId: string) => {
    try {
        await logoutUserRepository(sessionId); // Prisma를 통해 DB에서 세션 삭제
    } catch (error) {
        throw error;
    }
};