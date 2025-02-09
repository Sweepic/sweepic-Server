import {prisma} from '../db.config.js';
import {UserModel} from '../models/user.model.js';

export const userRepository = {
    findUserById: async (user_id: bigint): Promise<UserModel | null> => {
        const user = await prisma.user.findUnique({
            where: { id: Number(user_id) },
        });

        return user;
    },

    deleteUser: async (user_id: bigint): Promise<boolean> => {
        try {
            await prisma.user.update({
                where: { id: Number(user_id) },
                data: { status:0 },
            });
            return true;
        } catch (error) {
            throw error;
        }
    },
};

export const logoutUserRepository = async (sessionId: string): Promise<void> => {
    try {
        await prisma.session.delete({
            where: {
                sid: sessionId,
            },
        });
    } catch (error) {
        throw error;
    }
};