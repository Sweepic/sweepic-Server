import {DBError} from 'src/errors.js';
import {prisma} from '../db.config.js';
import {UserModel} from '../models/user.model.js';

export const findUserById = async (
  userId: bigint,
): Promise<UserModel | null> => {
  const user = await prisma.user
    .findUnique({
      where: {id: userId},
    })
    .catch(err => {
      throw new DBError({reason: err.message});
    });

  return user;
};

export const deleteUser = async (userId: bigint): Promise<boolean> => {
  await prisma.user
    .delete({
      where: {id: userId},
    })
    .catch(err => {
      throw new DBError({reason: err.message});
    });
  return true;
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  await prisma.session
    .delete({
      where: {
        sid: sessionId,
      },
    })
    .catch(err => {
      throw new DBError({reason: err.message});
    });
};
