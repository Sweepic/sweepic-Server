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
        AND: [
          {
            tags: {
              some: {
                tag: {
                  content: tag,
                },
              },
            },
          },
          {
            userId: userId,
          },
          {
            status: {
              equals: 1,
            },
          },
        ],
      },
      select: {
        id: true,
        mediaId: true,
      },
    })
    .catch(() => {
      throw new DBError();
    });
  return images;
};
