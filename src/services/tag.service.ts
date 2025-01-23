import {responseFromTag} from '../dtos/tag.dto.js';
import {BodyToTag, ResponseFromTag} from '../models/tag.model.js';
import {addTag, updateTag, getTag} from '../repositories/tag.repositories.js';

async function tagCreate(tag: BodyToTag): Promise<ResponseFromTag> {
  const {content, tag_category_id} = tag;
  const newTagId = await addTag(content, tag_category_id);

  const tagData = await getTag(newTagId);

  return responseFromTag(tagData);
}

async function tagUpdate(id: number, tag: BodyToTag): Promise<ResponseFromTag> {
  const newTagId = await updateTag(id, tag);

  const tagData = await getTag(newTagId);

  return responseFromTag(tagData);
}

export {tagCreate, tagUpdate};
