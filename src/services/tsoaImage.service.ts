import {RequestImageData, RequestTagSearch} from '../dtos/tsoaImage.dto.js';
import {
  findImage,
  insertImage,
  selectImagesFromTag,
} from '../repositories/tsoaImage.repository.js';
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
      reason: `<${dto.tag}> 태그에 해당하는 사진이 존재하지 않습니다.`,
    });
  }
  return images;
};

export const addImage = async (dto: RequestImageData): Promise<bigint> => {
  const imageId = await findImage(dto.mediaId, dto.userId).catch(err => {
    if (err.code === 'P2025') {
      return insertImage(dto.mediaId, dto.createdAt, dto.userId);
    } else {
      throw err;
    }
  });

  return imageId;
};
