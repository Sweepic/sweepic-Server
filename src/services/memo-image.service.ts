import { responseFromMemoFolderImage } from '../dtos/memo-folder.dto.js';
import { getMemoFolder } from '../repositories/memo-folder.repository.js';
import { addMemoImage, getMemoImage } from '../repositories/memo-image.repository.js';


export const memoImageAdd = async (folderId: bigint, imageUrl: string) => {
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