import {prisma} from '../db.config.js';

export const updateImageStatus = async (mediaIds: number[], status: number): Promise<void> => {
    await prisma.image.updateMany({
        where: { mediaId: { in: mediaIds } },
        data: { status }
    });
};

export const removeImages = async (mediaIds: number[]): Promise<void> => {
    await prisma.image.deleteMany({
        where: { mediaId: { in: mediaIds }, status: 0 }
    });
};

export const getImagesByIds = async (mediaIds: number[]): Promise<{ mediaId: number; status: number }[]> => {
  const images = await prisma.image.findMany({
      where: { mediaId: { in: mediaIds } },
      select: { mediaId: true, status: true }
  });
  return images.map(({ mediaId, status }) => ({
    mediaId: Number(mediaId), // 변환 적용
    status
  }));
};