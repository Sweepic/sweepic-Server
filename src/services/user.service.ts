import {DBError} from '../errors.js';
import {prisma} from '../db.config.js';

export const updateUserName = async (id: bigint, name: string) => {
  return await prisma.user
    .update({
      where: {id},
      data: {name, status: 1},
    })
    .then(result => {
      return {
        id: result.id.toString(),
        email: result.email,
        name: result.name,
        goalCount: result.goalCount,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        status: result.status,
      };
    })
    .catch(err => {
      throw new DBError({reason: err.message});
    });
};

export const updateUserGoalCount = async (id: bigint, goalCount: number) => {
  return await prisma.user
    .update({
      where: {id},
      data: {goalCount, status: 1},
    })
    .then(result => {
      return {
        id: result.id.toString(),
        email: result.email,
        name: result.name,
        goalCount: result.goalCount,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        status: result.status,
      };
    })
    .catch(err => {
      throw new DBError({reason: err.message});
    });
};
