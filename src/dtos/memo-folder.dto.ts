import { BodyToMemoFolder, ResponseFromMemo, ResponseFromMemoFolder } from '../models/memo-folder.model.js';
import { ResponseFromMemoImage } from '../models/memo-image.model.js';

export const bodyToMemoFolder = ({ folderName }: BodyToMemoFolder) => {
    return {
        folderName
    };
};

export const responseFromMemoFolder = ({ id, name }: ResponseFromMemoFolder) => {
    return {
        id,
        folderName: name
    };
};

export const responseFromMemoFolderImage = ({ memoFolder: { id: folderId, name: folderName }, memoImage: { id: imageId, url: imageUrl }}: {
    memoFolder: ResponseFromMemoFolder
    memoImage: ResponseFromMemoImage
}) => {
    return {
        folderId,
        folderName,
        imageId,
        imageUrl
    };
};

export const responseFromMemoFolderList = (searchMemoList: ResponseFromMemo[]) => {
    return {
        data: searchMemoList.map(({ id: folderId, name: folderName, imageText, memoImages }) => {
            const [firstImage] = memoImages; // memoImages의 첫 번째 항목 구조 분해
            return {
                folderId,
                folderName,
                imageText,
                firstImageId: firstImage?.id || null, 
                firstImageUrl: firstImage?.url || null, 
            };
        }),
    };
};

export const responseFromMemoTextImageList = ({id, name, imageText, memoImages, createdAt}: ResponseFromMemo) => {
    return {
        folderId: id,
        folderName: name,
        imageText,
        images: memoImages.length > 0 ? memoImages.map((mi) => ({ imageId: mi.id, imageUrl: mi.url })) : null,
        createdAt,
    };
};