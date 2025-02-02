import { responseFromMemoFolder, responseFromMemoFolderImage, responseFromMemoFolderList, responseFromMemoTextImageList } from '../dtos/memo-folder.dto.js';
import { FolderCreationError, FolderDuplicateError, FolderNameNotChangeError, FolderNotFoundError, FolderUpdateError, MemoImageAdditionError } from '../errors.js';
import { BodyToMemoFolder, BodyToMemoTextToUpdate, MemoFolderImageResponseDto, MemoFolderListResponseDto, MemoFolderResponseDto, MemoTextImageListResponseDto } from '../models/memo-folder.model.js';
import { createMemoFolder, getMemoFolder, getMemoFolderList, getMemoTextImageList, getSearchMemoList, updateMemoFolder, updateMemoText } from '../repositories/memo-folder.repository.js';
import { addMemoImage, getMemoImage } from '../repositories/memo-image.repository.js';

export const memoFolderCreate = async (userId: bigint, body: BodyToMemoFolder):Promise<MemoFolderResponseDto> => {
    const createdMemoFolderId = await createMemoFolder(body, userId);
    if (createdMemoFolderId === null) {
        throw new FolderDuplicateError({folderName: body.folderName});
    }
    const memoFolder = await getMemoFolder(createdMemoFolderId);
    if (memoFolder === null) {
        throw new FolderCreationError({userId, folderName: body.folderName});
    }
    return responseFromMemoFolder(memoFolder);
};

export const memoFolderImageCreate = async (userId: bigint, folderId: bigint, imageUrl: string, body:BodyToMemoFolder ):Promise<MemoFolderImageResponseDto> => {
    //const createdMemoFolderId = await createMemoFolder(body, userId);
    const addedMemoImageId = await addMemoImage(folderId, imageUrl);
    const memoFolder = await getMemoFolder(folderId);
    const memoImage = await getMemoImage(addedMemoImageId);
    if (memoFolder === null) {
        throw new FolderCreationError({userId, folderName: body.folderName});
    }
    if (memoImage === null) {
        throw new MemoImageAdditionError({folderId, imageUrl });
    }
    return responseFromMemoFolderImage({ memoFolder, memoImage });
};

export const listMemoFolder = async (
  userId: bigint,
): Promise<{data: MemoFolderListResponseDto[]}> => {
  const memoFolderList = await getMemoFolderList(userId);
  return responseFromMemoFolderList(memoFolderList);
};

export const memoSearch = async (
  userId: bigint,
  searchKeyword: string,
): Promise<{data: MemoFolderListResponseDto[]}> => {
  const searchMemoList = await getSearchMemoList(userId, searchKeyword);
  return responseFromMemoFolderList(searchMemoList);
};

export const listMemoTextImage = async (userId: bigint, folderId: bigint): Promise<MemoTextImageListResponseDto> => {
    const memoTextImageList = await getMemoTextImageList(userId, folderId);
    if (memoTextImageList === null) {
        throw new FolderNotFoundError({folderId});
    }
    return responseFromMemoTextImageList(memoTextImageList);
};

export const memoFolderUpdate = async (userId: bigint, folderId: bigint, body: BodyToMemoFolder):Promise<MemoTextImageListResponseDto> => {
    const currentFolder = await getMemoFolder(folderId);
    if (currentFolder === null) {
        throw new FolderNotFoundError({folderId});
    }
    if (currentFolder?.name === body.folderName && currentFolder?.userId === userId) {
        throw new FolderNameNotChangeError({folderName: body.folderName});
    }
    const updatedFolder = await updateMemoFolder(userId, folderId, body.folderName);
    if (updatedFolder === null) {
        throw new FolderDuplicateError({folderName: body.folderName});
    }
    const updatedMemoFolder = await getMemoTextImageList(userId, folderId);
    if (updatedMemoFolder === null) {
        throw new FolderUpdateError({folderId});
    }
    return responseFromMemoTextImageList(updatedMemoFolder);
};

export const memoTextUpdate = async (userId: bigint, folderId: bigint, body: BodyToMemoTextToUpdate): Promise<MemoTextImageListResponseDto> => {
    const folder = await getMemoFolder(folderId);
    if (folder === null) {
        throw new FolderNotFoundError({folderId});
    }
    const updatedMemoText = await updateMemoText(userId, folderId, body);
    return responseFromMemoTextImageList(updatedMemoText);
};
