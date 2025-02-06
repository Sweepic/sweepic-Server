import {prisma} from '../db.config.js';
import {UserModel} from '../models/user.model.js';

export const userRepository = {
    findUserById: async (user_id: bigint): Promise<UserModel | null> => {
        const user = await prisma.user.findUnique({
            where: { id: Number(user_id) },
        });

        return user;
    },

    updateUser: async (user_id: bigint, updatedData: Partial<UserModel>): Promise<UserModel | null> => {
        const user = await prisma.user.update({
            where: { id: Number(user_id) },
            data: { ...updatedData, updatedAt: new Date() },
        });

        return user;
    },

    deleteUser: async (user_id: bigint): Promise<boolean> => {
        try {
            await prisma.user.delete({
                where: { id: Number(user_id) },
            });
            return true;
        } catch (error) {
            return false;
        }
    },
};