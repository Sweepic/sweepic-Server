import {BaseBodyToTag} from '../models/tag.model.js';

export function tagcategory(tags: BaseBodyToTag[]): String[] {
  const tagcategory = tags.map(tag => {
    return tag.content;
  });
  return tagcategory;
}
