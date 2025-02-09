import * as trustRepository from '../repositories/trust.repositories.js';

export const deactivateImages = async (imageId: number): Promise <void> => {
    await trustRepository.updateImageStatus([imageId], 0);
};

export const restoreImages = async (imageIds: number[]): Promise<void> => {
    await trustRepository.updateImageStatus(imageIds, 1);
};

export const deleteImages = async (imageIds: number[]): Promise<boolean> => {
   const images = await trustRepository.getImagesByIds(imageIds);
   if (images.some(({ status }) => status ===1)){
    return false;
   }
   await trustRepository.removeImages(imageIds);
   return true;
};