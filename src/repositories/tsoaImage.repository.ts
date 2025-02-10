import {Image} from '@prisma/client';
import {prisma} from '../db.config.js';
import {DBError} from '../errors.js';

export const selectImagesFromTag = async (
  tag: string,
  userId: bigint,
): Promise<Pick<Image, 'id' | 'mediaId'>[]> => {
  const images = await prisma.image
    .findMany({
      where: {
        userId: userId,
        tags: {
          some: {
            tag: {
              content: tag,
            },
            status: 1,
          },
        },
        status: 1,
      },
      select: {
        id: true,
        mediaId: true,
      },
    })
    .catch(err => {
      throw new DBError({reason: err.message});
    });
  return images;
};
