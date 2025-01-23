import {prisma} from '../db.config.js';
import {BodyToImage, ResponseFromImage} from '../models/image.model.js';

export async function updateStatusImage(image: BodyToImage): Promise<bigint> {
  const {mediaId, userId} = image;
  let imageStatus: 0 | 1 = 0;
  console.log('updateStatusImage 실행');
  console.log('image: ', image);

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (user === null) {
    throw new Error('유저 조회 에러');
  }

  const imageData = await prisma.image.findFirst({
    where: {
      mediaId: mediaId,
      userId: userId,
    },
  });

  if (imageData === null) {
    throw new Error('이미지 조회 에러');
  }

  if (imageData.status === 0) {
    imageStatus = 1;
  } else {
    imageStatus = 0;
  }

  const updated = await prisma.image.update({
    where: {
      id: imageData.id,
    },
    data: {
      status: imageStatus,
    },
  });

  if (updated === null) {
    throw new Error('이미지 상태 변경 에러');
  }

  return updated.id;
}

export async function getImage(imageId: bigint): Promise<ResponseFromImage> {
  const image = await prisma.image.findFirst({
    where: {
      id: imageId,
    },
  }); // 이미지 조회

  if (image === null) {
    throw new Error('이미지 조회 에러');
  } // 이미지 조회 실패 시 null 반환

  return image;
}
