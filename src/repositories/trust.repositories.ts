import {prisma} from '../db.config.js';

export const updateImageStatus = async (imageIds: number[], status: number): Promise<void> => {
    await prisma.image.updateMany({
        where: { id: { in: imageIds } },
        data: { status }
    });
};

export const removeImages = async (imageIds: number[]): Promise<void> => {
    await prisma.image.deleteMany({
        where: { id: { in: imageIds }, status: 0 }
    });
};

export const getImagesByIds = async (imageIds: number[]): Promise<{ imageId: number; status: number }[]> => {
  const images = await prisma.image.findMany({
      where: { id: { in: imageIds } },
      select: { id: true, status: true }
  });
  return images.map(({ id, status }) => ({
    imageId: Number(id), // 변환 적용
    status
  }));
};

export const getTrashedImages = async (userId: number): Promise<{ imageId: number; mediaId: number }[]> => {
    const images = await prisma.image.findMany({
        where: { userId, status: 0 },
        select: { id: true, mediaId: true }
    });
  
    return images.map(({ id, mediaId }) => ({
      imageId: Number(id),
      mediaId: Number(mediaId),
    }));
  };
  