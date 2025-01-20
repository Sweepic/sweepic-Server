import { responseFromMemoFolder, responseFromMemoFolderImage } from '../dtos/memo-folder.dto.js';
import { BodyToMemoFolder } from '../models/memo-folder.model.js';
import { createMemoFolder, getMemoFolder } from '../repositories/memo-folder.repository.js';
import { addMemoImage, getMemoImage } from '../repositories/memo-image.repository.js';

export const memoFolderCreate = async (userId: bigint, body: BodyToMemoFolder) => {
    const createdMemoFolderId = await createMemoFolder(body, userId);
    const memoFolder = await getMemoFolder(createdMemoFolderId);
    console.log(memoFolder);
    if (memoFolder === null) {
        throw new Error('메모 폴더 생성 에러');
    }
    return responseFromMemoFolder(memoFolder);
};

export const memoFolderImageCreate = async (folderId: bigint, imageUrl: string) => {
    //const createdMemoFolderId = await createMemoFolder(body, userId);
    const addedMemoImageId = await addMemoImage(folderId, imageUrl);
    const memoFolder = await getMemoFolder(folderId);
    const memoImage = await getMemoImage(addedMemoImageId);
    if (memoFolder === null) {
        throw new Error('메모 폴더 생성 에러');
    }
    if (memoImage === null) {
        throw new Error('메모 사진 추가 에러');
    }
    return responseFromMemoFolderImage({ memoFolder, memoImage });
};
