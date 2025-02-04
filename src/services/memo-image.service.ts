import {
  responseFromMessage,
  responseFromMemoFolderImage,
  responseFromMemoTextImageList,
} from '../dtos/memo-folder.dto.js';
import {
  FolderNotChangeError,
  FolderNotFoundError,
  MemoImageAdditionError,
  MemoImageMoveError,
  PhotoDataNotFoundError,
} from '../errors.js';
import {
  ResponseMessage,
  MemoFolderImageResponseDto,
  MemoTextImageListResponseDto,
} from '../models/memo-folder.model.js';
import {
  BodyToMemoImagesToDelete,
  BodyToMemoImagesToMove,
} from '../models/memo-image.model.js';
import {
  deleteMemoFolder,
  getMemoFolder,
  getMemoTextImageList,
} from '../repositories/memo-folder.repository.js';
import {
  addMemoImage,
  deleteMemoImages,
  getMemoImage,
  moveMemoImages,
} from '../repositories/memo-image.repository.js';

export const memoImageAdd = async (
  folderId: bigint,
  imageUrl: string,
): Promise<MemoFolderImageResponseDto> => {
  const folder = await getMemoFolder(folderId);
  if (folder === null) {
    throw new FolderNotFoundError({folderId});
  }
  const addedMemoImageId = await addMemoImage(folderId, imageUrl);
  const memoFolder = await getMemoFolder(folderId);
  const memoImage = await getMemoImage(addedMemoImageId);
  if (memoFolder === null) {
    throw new FolderNotFoundError({folderId});
  }
  if (memoImage === null) {
    throw new MemoImageAdditionError({folderId, imageUrl});
  }
  return responseFromMemoFolderImage({memoFolder, memoImage});
};

export const memoFolderDelete = async (
  userId: bigint,
  folderId: bigint,
): Promise<ResponseMessage> => {
  const deleteFolder = await deleteMemoFolder(userId, folderId);
  if (deleteFolder === null) {
    throw new FolderNotFoundError({folderId});
  }
  return responseFromMessage(deleteFolder);
};

export const memoImagesMove = async (
  userId: bigint,
  folderId: bigint,
  body: BodyToMemoImagesToMove,
): Promise<MemoTextImageListResponseDto> => {
  const checkTargetFolder = await getMemoFolder(body.targetFolderId);
  if (checkTargetFolder === null) {
    throw new FolderNotFoundError({folderId});
  }
  const memoImagesToMove = await moveMemoImages(userId, folderId, body);
  if (folderId === body.targetFolderId) {
    throw new FolderNotChangeError({folderId});
  }
  if (
    typeof memoImagesToMove === 'bigint' ||
    typeof memoImagesToMove === 'number'
  ) {
    throw new PhotoDataNotFoundError({imageId: memoImagesToMove.toString()});
  }
  const movedMemoImages = await getMemoTextImageList(
    userId,
    body.targetFolderId,
  );
  if (movedMemoImages === null) {
    throw new MemoImageMoveError({folderId, imageId: body.imageId});
  }
  return responseFromMemoTextImageList(movedMemoImages);
};

export const memoImageDelete = async (
  userId: bigint,
  folderId: bigint,
  body: BodyToMemoImagesToDelete,
): Promise<MemoTextImageListResponseDto> => {
  const memoImagesToDelete = await deleteMemoImages(userId, folderId, body);
  if (
    typeof memoImagesToDelete === 'bigint' ||
    typeof memoImagesToDelete === 'number'
  ) {
    throw new PhotoDataNotFoundError({imageId: memoImagesToDelete.toString()});
  }
  const memoFolder = await getMemoTextImageList(userId, folderId);
  if (memoFolder === null) {
    throw new FolderNotFoundError({folderId});
  }
  return responseFromMemoTextImageList(memoFolder);
};
