import {StatusCodes} from 'http-status-codes';
import {RequestTagSearch} from '../dtos/image.dto.js';
import {selectImagesFromTag} from '../repositories/image.repository.js';

export const findImagesFromTag = async (
  dto: RequestTagSearch,
): Promise<{id: string; mediaId: string}[]> => {
  const images = await selectImagesFromTag(dto.tag, dto.userId)
    .then(result => {
      const resultBigintToString = result.map(image => {
        return {
          id: image.id.toString(),
          mediaId: image.mediaId.toString(),
        };
      });
      return resultBigintToString;
    })
    .catch(err => {
      err.statusCode = StatusCodes.BAD_REQUEST;
      throw err;
    });
  if (images.length === 0) {
    throw new Error('아무것도 없어요');
  }
  return images;
};
