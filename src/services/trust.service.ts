import * as trustRepository from '../repositories/trust.repositories.js';

export const deactivateImages = async (mediaId: number): Promise <{mediaId: number; status: number}> => {
    await trustRepository.updateImageStatus([mediaId], 0);
    const [updatedImage] = await trustRepository.getImagesByIds([mediaId]);
    return updatedImage;
};

export const restoreImages = async (mediaIds: number[]): Promise<{ mediaId: number; status: number }[]> => {
    await trustRepository.updateImageStatus(mediaIds, 1);
    return trustRepository.getImagesByIds(mediaIds);
};

export const deleteImages = async (mediaIds: number[]): Promise<boolean> => {
   const images = await trustRepository.getImagesByIds(mediaIds);
   if (!images.length || images.some(({ status }) => status ===1)){
    return false;
   }
   await trustRepository.removeImages(mediaIds);
   return true;
};