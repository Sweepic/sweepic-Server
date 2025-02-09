import {prisma} from '../db.config.js';

export const updateImageStatus = async (imageIds: number[], status: number) => {
    return prisma.image.updateMany({
        where: { id: { in: imageIds } },
        data: { status }
    });
};

export const removeImages = async (imageIds: number[]) => {
    return prisma.image.deleteMany({
        where: { id: { in: imageIds }, status: 0 }
    });
};

export const getImagesByIds = async (imageIds: number[]): Promise<{ id: number; status: number }[]> => {
  const images = await prisma.image.findMany({
      where: { id: { in: imageIds } },
      select: { id: true, status: true }
  });
  return images.map(({ id, status }) => ({
    id: Number(id), // 변환 적용
    status
  }));
};