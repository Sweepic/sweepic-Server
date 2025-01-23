import {responseFromTag} from '../dtos/tag.dto.js';
import {BodyToTag, ResponseFromTag} from '../models/tag.model.js';
import {getMemoFolder} from '../repositories/memo-folder.repository.js';
import {addTag, getTag} from '../repositories/tag.repositories.js';

async function tagCreate(tag: BodyToTag): Promise<ResponseFromTag> {
  const {content, tag_category_id} = tag;
  const newTagId = await addTag(content, tag_category_id);

  const tagData = await getTag(newTagId);

  return responseFromTag(tagData);
}

export {tagCreate};
