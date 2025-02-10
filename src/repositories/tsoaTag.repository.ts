import {Tag} from '@prisma/client';
import {prisma} from '../db.config.js';
import {DBError} from '../errors.js';

export const selectTagsByDate = async (
  userId: bigint,
  createdAt: Date,
  endDate: Date,
): Promise<Pick<Tag, 'content'>[]> => {
  const tags = await prisma.tag
    .findMany({
      where: {
        images: {
          some: {
            image: {
              createdAt: {
                gte: createdAt,
                lt: endDate,
              },
              userId: userId,
              status: 1,
            },
            status: 1,
          },
        },
      },
      select: {
        content: true,
      },
      orderBy: {
        content: 'asc',
      },
    })
    .catch(err => {
      throw new DBError({reason: err.message});
    });

  return tags;
};

export const selectTagsFromImage = async (
  userId: bigint,
  mediaId: number,
): Promise<{content: string; tagCategory: {id: bigint; tagType: string}}[]> => {
  const tags = await prisma.tag
    .findMany({
      where: {
        images: {
          some: {
            image: {
              mediaId: mediaId,
              userId: userId,
              status: 1,
            },
            status: 1,
          },
        },
      },
      select: {
        content: true,
        tagCategory: {
          select: {
            id: true,
            tagType: true,
          },
        },
      },
      orderBy: {
        tagCategory: {
          id: 'asc',
        },
      },
    })
    .catch(err => {
      throw new DBError({reason: err.message});
    });

  return tags;
};
