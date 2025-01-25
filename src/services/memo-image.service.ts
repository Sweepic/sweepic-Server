import { responseFromMessage, responseFromMemoFolderImage, responseFromMemoTextImageList } from '../dtos/memo-folder.dto.js';
import { ResponseMessage, MemoFolderImageResponseDto, MemoTextImageListResponseDto } from '../models/memo-folder.model.js';
import { BodyToMemoImagesToDelete, BodyToMemoImagesToMove } from '../models/memo-image.model.js';
import { deleteMemoFolder, getMemoFolder, getMemoTextImageList } from '../repositories/memo-folder.repository.js';
import { addMemoImage, deleteMemoImages, getMemoImage, moveMemoImages } from '../repositories/memo-image.repository.js';


export const memoImageAdd = async (folderId: bigint, imageUrl: string): Promise<MemoFolderImageResponseDto> => {
    const folder = await getMemoFolder(folderId);
    if (folder === null) {
        throw new Error('해당 폴더는 존재하지 않아 저장할 수 없습니다.');
    }
    const addedMemoImageId = await addMemoImage(folderId, imageUrl);
    const memoFolder = await getMemoFolder(folderId);
    const memoImage = await getMemoImage(addedMemoImageId);
    if (memoFolder === null) {
        throw new Error('메모 폴더 조회 에러');
    }
    if (memoImage === null) {
        throw new Error('메모 사진 추가 에러');
    }
    return responseFromMemoFolderImage({ memoFolder, memoImage });
};

export const memoFolderDelete = async (userId: bigint, folderId: bigint):Promise<ResponseMessage> => {
    const deleteFolder = await deleteMemoFolder(userId, folderId);
    if(deleteFolder === null) {
        throw new Error('존재하지 않은 폴더입니다.');
    }
    return responseFromMessage(deleteFolder);
};

export const memoImagesMove = async (userId: bigint, folderId: bigint, body: BodyToMemoImagesToMove):Promise<MemoTextImageListResponseDto> => {
    const checkTargetFolder = await getMemoFolder(body.targetFolderId);
    if (checkTargetFolder === null) {
        throw new Error('해당 폴더는 존재하지 않아 이동할 수 없습니다.');
    }
    const memoImagesToMove = await moveMemoImages(userId, folderId, body);
    if (folderId == body.targetFolderId) {
        throw new Error('현재 폴더와 같습니다.');
    }
    if (memoImagesToMove === null) {
        throw new Error('존재하지 않는 사진입니다.');
    }
    const movedMemoImages = await getMemoTextImageList(userId, body.targetFolderId);
    if (movedMemoImages === null) {
        throw new Error('메모 사진 이동 에러');
    }
    return responseFromMemoTextImageList(movedMemoImages);
};

export const memoImageDelete = async (userId: bigint, folderId: bigint, body: BodyToMemoImagesToDelete): Promise<MemoTextImageListResponseDto> => {
    const memoImagesToDelete = await deleteMemoImages(userId, folderId, body);
    if (memoImagesToDelete === null) {
        throw new Error('존재하지 않는 사진입니다.');
    }
    const memoFolder = await getMemoTextImageList(userId, folderId);
    if (memoFolder === null) {
        throw new Error('존재하지 않는 폴더입니다.');
    }
    return responseFromMemoTextImageList(memoFolder);
};