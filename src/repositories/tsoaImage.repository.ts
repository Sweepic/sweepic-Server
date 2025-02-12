import {Image} from '@prisma/client';
import {prisma} from '../db.config.js';
import {DBError, PhotoValidationError} from '../errors.js';

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

export const findImage = async (
  mediaId: bigint,
  userId: bigint,
): Promise<bigint> => {
  const image = await prisma.image
    .findUniqueOrThrow({
      where: {
        userId_mediaId: {
          userId: userId,
          mediaId: mediaId,
        },
      },
      select: {
        id: true,
        status: true,
      },
    })
    .then(result => {
      if (result.status !== 1) {
        throw new PhotoValidationError({
          reason: '이미 휴지통에 있는 사진입니다',
        });
      }
      return result;
    })
    .catch(err => {
      if (err instanceof PhotoValidationError || err.code === 'P2025') {
        throw err;
      } else {
        throw new DBError({reason: err.message});
      }
    });
  return image.id;
};

export const insertImage = async (
  mediaId: bigint,
  createdAt: Date,
  userId: bigint,
): Promise<bigint> => {
  const image = await prisma.image
    .create({
      data: {
        userId: userId,
        mediaId: mediaId,
        createdAt: createdAt,
      },
      select: {
        id: true,
      },
    })
    .catch(err => {
      throw new DBError({reason: err.message});
    });

  return image.id;
};
