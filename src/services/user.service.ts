import { prisma } from '../db.config.js';

export const updateUserName = async (id: number, name: string) => {
    return await prisma.user.update({
      where: { id },
      data: { name },
    });
  };
  
  export const updateUserGoalCount = async (id: number, goalCount: number) => {
    return await prisma.user.update({
      where: { id },
      data: { goalCount },
    });
  };