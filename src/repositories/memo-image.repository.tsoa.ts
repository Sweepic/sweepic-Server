import {prisma} from '../db.config.js';
import {ResponseMessage} from '../models/memo-folder.model.tsoa.js';
import {
  BodyToMemoImagesToDelete,
  BodyToMemoImagesToMove,
  MemoImage,
} from '../models/memo-image.model.tsoa.js';
import {getPresignedUrl} from '../s3/get-presigned-url.js';
import {imageDeleter} from '../s3/image.deleter.js';
import {imageMover} from '../s3/image.mover.js';

export const addMemoImage = async (
  memoFolderId: bigint,
  imageUrl: string,
): Promise<bigint> => {
  const addedMemoImageId = await prisma.memoImage.create({
    data: {
      folderId: memoFolderId,
      url: imageUrl,
    },
  });

  return addedMemoImageId.id;
};

export const getMemoImage = async (
  memoImageId: bigint,
): Promise<MemoImage | null> => {
  const memoImage = await prisma.memoImage.findFirst({
    where: {
      id: memoImageId,
    },
  });

  if (memoImage === null) {
    return null;
  }

  const presignedUrl = await getPresignedUrl(memoImage.url); // pre-signed URL 생성

  const formattedMemoImage = {
    ...memoImage,
    id: memoImage.id.toString(),
    folderId: memoImage.folderId.toString(),
    url: presignedUrl, // pre-signed URL로 변환
  };

  return formattedMemoImage;
};

export const moveMemoImages = async (
  userId: bigint,
  folderId: bigint,
  body: BodyToMemoImagesToMove,
): Promise<ResponseMessage | bigint> => {
  for (const imgId of body.imageId) {
    const formattedImgId = BigInt(imgId);
    const image = await prisma.memoImage.findFirst({
      where: {
        id: formattedImgId,
        folderId,
      },
    });
    if (image === null) {
      return formattedImgId;
    }
  }

  for (const imgId of body.imageId) {
    const formattedImgId = BigInt(imgId);
    const image = await prisma.memoImage.update({
      where: {
        id: formattedImgId,
        folderId,
      },
      data: {
        folderId: BigInt(body.targetFolderId),
        updatedAt: new Date(),
      },
    });

    imageMover(userId, image.url, BigInt(body.targetFolderId));
  }
  return {message: '성공적으로 이동하였습니다'};
};

export const deleteMemoImages = async (
  userId: bigint,
  folderId: bigint,
  data: BodyToMemoImagesToDelete,
): Promise<void | null | bigint> => {
  for (const imgId of data.imageId) {
    const formattedImgId = BigInt(imgId);
    const image = await prisma.memoImage.findFirst({
      where: {
        id: formattedImgId,
        folderId,
        memoFolder: {
          userId,
        },
      },
    });

    if (image === null) {
      return formattedImgId;
    }
  }
  for (const imgId of data.imageId) {
    const formattedImgId = BigInt(imgId);
    const image = await prisma.memoImage.findFirst({
      where: {
        id: formattedImgId,
        folderId,
        memoFolder: {
          userId,
        },
      },
    });

    if (image === null) {
      return null;
    }

    imageDeleter(image.url);

    await prisma.memoImage.delete({
      where: {
        id: formattedImgId,
      },
    });
  }
};

export const updateMemoImageUrl = async (
  key: string,
  targetKey: string,
): Promise<void> => {
  const image = await prisma.memoImage.findFirst({where: {url: key}});
  await prisma.memoImage.update({
    where: {
      id: image!.id,
    },
    data: {
      url: targetKey,
      updatedAt: new Date(),
    },
  });
};
