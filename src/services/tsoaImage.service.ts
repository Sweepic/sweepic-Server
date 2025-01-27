import {RequestTagSearch} from '../dtos/tsoaImage.dto.js';
import {selectImagesFromTag} from '../repositories/tsoaImage.repository.js';
import {PhotoDataNotFoundError} from '../errors.js';

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
      throw err;
    });
  if (images.length === 0) {
    throw new PhotoDataNotFoundError({
      reason: '<' + dto.tag + '> 태그에 해당하는 사진이 존재하지 않습니다.',
    });
  }
  return images;
};
