import {
  responseFromMessage,
  responseFromMemoFolderImage,
  responseFromMemoTextImageList,
} from '../dtos/memo-folder.dto.tsoa.js';
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
} from '../models/memo-folder.model.tsoa.js';
import {
  BodyToMemoImagesToDelete,
  BodyToMemoImagesToMove,
} from '../models/memo-image.model.tsoa.js';
import {
  deleteMemoFolder,
  getMemoFolder,
  getMemoTextImageList,
} from '../repositories/memo-folder.repository.tsoa.js';
import {
  addMemoImage,
  deleteMemoImages,
  getMemoImage,
  moveMemoImages,
} from '../repositories/memo-image.repository.tsoa.js';

export const memoImageAdd = async (
  folderId: bigint,
  imageUrl: string,
  userId: bigint,
): Promise<MemoFolderImageResponseDto> => {
  const folder = await getMemoFolder(folderId);
  if (folder === null || folder.userId !== userId) {
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
  const currentFolder = await getMemoFolder(folderId);
  if (currentFolder === null || currentFolder.userId !== userId) {
    throw new FolderNotFoundError({folderId});
  }
  const checkTargetFolder = await getMemoFolder(BigInt(body.targetFolderId));
  if (checkTargetFolder === null || checkTargetFolder.userId !== userId) {
    throw new FolderNotFoundError({folderId: BigInt(body.targetFolderId)});
  }
  if (folderId === BigInt(body.targetFolderId)) {
    throw new FolderNotChangeError({folderId});
  }

  const memoImagesToMove = await moveMemoImages(userId, folderId, body);
  if (
    typeof memoImagesToMove === 'bigint' ||
    typeof memoImagesToMove === 'number'
  ) {
    throw new PhotoDataNotFoundError({imageId: memoImagesToMove.toString()});
  }
  const movedMemoImages = await getMemoTextImageList(
    userId,
    BigInt(body.targetFolderId),
  );
  if (movedMemoImages === null) {
    throw new MemoImageMoveError({
      folderId,
      imageId: body.imageId.map(imgId => BigInt(imgId)),
    });
  }
  return responseFromMemoTextImageList(movedMemoImages);
};

export const memoImageDelete = async (
  userId: bigint,
  folderId: bigint,
  body: BodyToMemoImagesToDelete,
): Promise<MemoTextImageListResponseDto> => {
  const folder = await getMemoFolder(folderId);
  if (folder === null || folder.userId !== userId) {
    throw new FolderNotFoundError({folderId});
  }
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
