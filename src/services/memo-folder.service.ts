import { responseFromMessage, responseFromMemoFolder, responseFromMemoFolderImage, responseFromMemoFolderList, responseFromMemoTextImageList } from '../dtos/memo-folder.dto.js';
import { BodyToMemoFolder, BodyToMemoTextToUpdate, MemoFolderImageResponseDto, MemoFolderListResponseDto, MemoFolderResponseDto, MemoTextImageListResponseDto } from '../models/memo-folder.model.js';
import { createMemoFolder, deleteMemoFolder, getMemoFolder, getMemoFolderList, getMemoTextImageList, getSearchMemoList, updateMemoFolder, updateMemoText } from '../repositories/memo-folder.repository.js';
import { addMemoImage, getMemoImage } from '../repositories/memo-image.repository.js';

export const memoFolderCreate = async (userId: bigint, body: BodyToMemoFolder):Promise<MemoFolderResponseDto> => {
    const createdMemoFolderId = await createMemoFolder(body, userId);
    if (createdMemoFolderId === null) {
        throw new Error('이미 존재하는 폴더 이름입니다.');
    }
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

export const memoFolderUpdate = async (userId: bigint, folderId: bigint, body: BodyToMemoFolder):Promise<MemoTextImageListResponseDto> => {
    const currentFolder = await getMemoFolder(folderId);
    if (currentFolder === null) {
        throw new Error('존재하지 않은 폴더입니다.');
    }
    if (currentFolder?.name == body.folderName && currentFolder?.userId == userId) {
        throw new Error('변경 전의 폴더 이름과 같습니다.');
    }
    const updatedFolder = await updateMemoFolder(userId, folderId, body.folderName);
    if (updatedFolder === null) {
        throw new Error('이미 존재하는 폴더 이름입니다.');
    }
    const updatedMemoFolder = await getMemoTextImageList(userId, folderId);
    if (updatedMemoFolder === null) {
        throw new Error('메모 폴더 업데이트 에러');
    }
    return responseFromMemoTextImageList(updatedMemoFolder);
};

export const memoTextUpdate = async (userId: bigint, folderId: bigint, body: BodyToMemoTextToUpdate): Promise<MemoTextImageListResponseDto> => {
    const updatedMemoText = await updateMemoText(userId, folderId, body);
    return responseFromMemoTextImageList(updatedMemoText);
};