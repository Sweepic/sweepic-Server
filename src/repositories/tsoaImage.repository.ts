import {Image} from '@prisma/client';
import {prisma} from '../db.config.js';

export const selectImagesFromTag = async (
  tag: string,
  userId: bigint,
): Promise<Pick<Image, 'id' | 'mediaId'>[]> => {
  const images = await prisma.image.findMany({
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
      ],
    },
    select: {
      id: true,
      mediaId: true,
    },
  });
  return images;
};
