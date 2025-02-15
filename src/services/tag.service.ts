import {RequestCreationTags} from 'src/dtos/tsoaTag.dto.js';
import {addImageTag, getImageTag} from '../repositories/tag.repositories.js';
import {
  ResponseCreationTags,
  responseCreationTags,
} from 'src/models/tsoaTag.model.js';
import {DBError} from 'src/errors.js';

/**
 * 태그 생성
 * 생성 시, 태그가 존재하면 어떤 태그인지 알려주고, 존재하지 않으면 생성
 */
async function tagCreate({
  imageId,
  tags,
}: RequestCreationTags): Promise<ResponseCreationTags> {
  await addImageTag({imageId, tags}).catch(err => {
    throw new DBError({reason: err.message});
  });

  const imageTagData = await getImageTag(imageId).catch(err => {
    throw new DBError({reason: err.message});
  });

  return responseCreationTags(imageTagData);
}

export {tagCreate};
