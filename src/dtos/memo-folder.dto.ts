import { BodyToMemoFolder, ResponseFromMemoFolder, ResponseFromMemo } from '../models/memo-folder.model.js';
import { ResponseFromMemoImage } from '../models/memo-image.model.js';

export const bodyToMemoFolder = (body: BodyToMemoFolder) => {
    return {
        folderName: body.folderName
    };
};

export const responseFromMemoFolder = (data: ResponseFromMemoFolder) => {
    return {
        id: data.id,
        folderName: data.name
    };
};

export const responseFromMemoFolderImage = ({ memoFolder, memoImage }: {
    memoFolder: ResponseFromMemoFolder
    memoImage: ResponseFromMemoImage
}) => {
    return {
        folderId: memoFolder.id,
        folderName: memoFolder.name,
        imageId: memoImage.id,
        imageUrl: memoImage.url
    };
};