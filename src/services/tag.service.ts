import {responseFromImageTag} from '../dtos/tag.dto.js';
import {BodyToTag, ResponseFromImageTag} from '../models/tag.model.js';
import {addImageTag, getImageTag} from '../repositories/tag.repositories.js';

/**
 * 태그 생성
 * 생성 시, 태그가 존재하면 어떤 태그인지 알려주고, 존재하지 않으면 생성
 */
async function tagCreate({
  imageId,
  tags,
}: BodyToTag): Promise<ResponseFromImageTag[]> {
  await addImageTag({imageId, tags});

  const imageTagData = await getImageTag(imageId);

  return responseFromImageTag(imageTagData);
}

export {tagCreate};
