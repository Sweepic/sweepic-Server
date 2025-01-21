import { responseFromMemoFolder, responseFromMemoFolderImage, responseFromMemoFolderList, responseFromMemoTextImageList } from '../dtos/memo-folder.dto.js';
import { BodyToMemoFolder, MemoFolderImageResponseDto, MemoFolderListResponseDto, MemoFolderResponseDto, MemoTextImageListResponseDto } from '../models/memo-folder.model.js';
import { createMemoFolder, getMemoFolder, getMemoFolderList, getMemoTextImageList, getSearchMemoList } from '../repositories/memo-folder.repository.js';
import { addMemoImage, getMemoImage } from '../repositories/memo-image.repository.js';

export const memoFolderCreate = async (userId: bigint, body: BodyToMemoFolder):Promise<MemoFolderResponseDto> => {
    const createdMemoFolderId = await createMemoFolder(body, userId);
    const memoFolder = await getMemoFolder(createdMemoFolderId);
    console.log(memoFolder);
    if (memoFolder === null) {
        throw new Error('메모 폴더 생성 에러');
    }
    return responseFromMemoFolder(memoFolder);
};

export const memoFolderImageCreate = async (folderId: bigint, imageUrl: string):Promise<MemoFolderImageResponseDto> => {
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

export const listMemoFolder = async (userId: bigint): Promise<{ data: MemoFolderListResponseDto[] }> => {
    const memoFolderList = await getMemoFolderList(userId);
    return responseFromMemoFolderList(memoFolderList);
};

export const memoSearch = async (userId: bigint, searchKeyword: string): Promise<{ data: MemoFolderListResponseDto[] }> => {
    const searchMemoList = await getSearchMemoList(userId, searchKeyword);
    return responseFromMemoFolderList(searchMemoList);
};

export const listMemoTextImage = async (userId: bigint, folderId: bigint): Promise<MemoTextImageListResponseDto> => {
    const memoTextImageList = await getMemoTextImageList(userId, folderId);
    if (memoTextImageList === null) {
        throw new Error('해당 폴더가 존재하지 않습니다.');
    }
    return responseFromMemoTextImageList(memoTextImageList);
};