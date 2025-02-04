import {userRepository} from '../repositories/mypage.repository.js';
import {UserModel} from '../models/user.model.js';
import {UserNotFoundError, UserCreationError} from '../errors.js';
export const getUserById = async (user_id: bigint): Promise<UserModel | null> => {
    const user = await userRepository.findUserById(user_id);
    if (!user) {
        throw new UserNotFoundError;
    }
    return user;
};

export const updateUser = async (user_id: bigint, updatedData: Partial<UserModel>): Promise<UserModel | null> => {
    const user = await userRepository.updateUser(user_id, updatedData);
    if (!user) {
        throw new UserCreationError;
    }
    return user;
};

export const deleteUser = async (user_id: bigint): Promise<boolean> => {
    return await userRepository.deleteUser(user_id);
};