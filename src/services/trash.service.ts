import {DeleteImagesDTO, RestoreImagesDTO} from '../dtos/trash.dto.js';
import {
  removeImages,
  updateImageStatus,
} from '../repositories/trash.repository.js';

export const deactivateImage = async (imageId: bigint): Promise<void> => {
  await updateImageStatus([imageId], 0);
  return;
};

export const restoreImages = async (dto: RestoreImagesDTO): Promise<void> => {
  await updateImageStatus(dto.mediaIdList, 1, dto.userId);
  return;
};

export const deleteImages = async (dto: DeleteImagesDTO): Promise<void> => {
  await removeImages(dto.mediaIdList, dto.userId);
  return;
};
