import * as trustRepository from '../repositories/trust.repositories.js';

export const deactivateImages = async (imageId: number): Promise <{imageId: number; status: number}> => {
    await trustRepository.updateImageStatus([imageId], 0);
    const [updatedImage] = await trustRepository.getImagesByIds([imageId]);
    return updatedImage;
};

export const restoreImages = async (imageIds: number[]): Promise<{ imageId: number; status: number }[]> => {
    await trustRepository.updateImageStatus(imageIds, 1);
    return trustRepository.getImagesByIds(imageIds);
};

export const deleteImages = async (imageIds: number[]): Promise<boolean> => {
   const images = await trustRepository.getImagesByIds(imageIds);
   if (!images.length || images.some(({ status }) => status ===1)){
    return false;
   }
   await trustRepository.removeImages(imageIds);
   return true;
};

export const getTrashedImages = async (userId: number): Promise<{ imageId: number; mediaId: number }[]> => {
    return trustRepository.getTrashedImages(userId);
};
