import {responseFromMemoFolderImage} from '../dtos/memo-folder.dto.js';
import {MemoFolderImageResponseDto} from '../models/memo-folder.model.js';
import {getMemoFolder} from '../repositories/memo-folder.repository.js';
import {
  addMemoImage,
  getMemoImage,
} from '../repositories/memo-image.repository.js';
import {FolderNotFoundError, MemoImageAdditionError} from '../errors.js';

export const memoImageAdd = async (
  folderId: bigint,
  imageUrl: string,
): Promise<MemoFolderImageResponseDto> => {
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
