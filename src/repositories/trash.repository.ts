import {prisma} from '../db.config.js';
import {DBError} from '../errors.js';

export const updateImageStatus = async (
  mediaIdList: bigint[],
  status: number,
  userId?: bigint,
): Promise<void> => {
  if (userId) {
    await prisma.image
      .updateMany({
        where: {mediaId: {in: mediaIdList}, userId: userId},
        data: {status},
      })
      .catch(err => {
        throw new DBError({reason: err.message});
      });
  } else {
    await prisma.image
      .updateMany({
        where: {id: {in: mediaIdList}},
        data: {status},
      })
      .catch(err => {
        throw new DBError({reason: err.message});
      });
  }
};

export const removeImages = async (
  mediaIdList: bigint[],
  userId: bigint,
): Promise<void> => {
  await prisma.image
    .deleteMany({
      where: {mediaId: {in: mediaIdList}, userId: userId, status: 0},
    })
    .catch(err => {
      throw new DBError({reason: err.message});
    });
};
