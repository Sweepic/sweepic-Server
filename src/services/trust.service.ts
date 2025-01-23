import {BodyToImage, ResponseFromImage} from '../models/image.model.js';
import {responseFromImage} from '../dtos/image.dto.js';
import {
  updateStatusImage,
  getImage,
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

export {imageStatusUpdate};
