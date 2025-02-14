import {
  findUserById,
  deleteSession,
  deleteUser,
} from '../repositories/user.repository.js';
import {UserModel} from '../models/user.model.js';
import {UserNotFoundError} from '../errors.js';
//사용자 정보 가져오기
export const getUserById = async (user_id: bigint): Promise<UserModel> => {
  const user = await findUserById(user_id).then(result => {
    if (!result) {
      throw new UserNotFoundError();
    }
    return result;
  });

  return user;
};
// //사용자 회원 탈퇴
export const removeUser = async (user_id: bigint): Promise<boolean> => {
  return await deleteUser(user_id);
};
//사용자 로그아웃
export const logoutUserService = async (sessionId: string) => {
  try {
    await deleteSession(sessionId); // Prisma를 통해 DB에서 세션 삭제
  } catch (error) {
    throw error;
  }
};
