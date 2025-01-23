import {BodyToImage, ResponseFromImage} from '../models/image.model.js';
import {responseFromImage} from '../dtos/image.dto.js';
import {
  updateStatusImage,
  getImage,
  deleteImage,
} from '../repositories/trust.repositories.js';

async function imageStatusUpdate(
  image: BodyToImage,
): Promise<ResponseFromImage> {
  console.log('imageStatusUpdate 실행');
  console.log('image: ', image);

  const newImageId = await updateStatusImage(image);
  const imageData = await getImage(newImageId);

  return responseFromImage(imageData);
}

async function imageDelete(userId: bigint): Promise<boolean> {
  console.log('imageDelete 실행');
  console.log('userId: ', userId);

  const deleted = await deleteImage(userId);

  return deleted;
}

export {imageStatusUpdate, imageDelete};
