import { BodyToMemoFolder, ResponseFromMemoFolder } from '../models/memo-folder.model.js';
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