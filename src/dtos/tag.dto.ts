import {
  BodyToTag,
  TagRequsetDto,
  ResponseFromTag,
  TagResponseDto,
} from '../models/tag.model.js';

export function bodyToTag({
  content,
  tag_category_id,
}: BodyToTag): TagRequsetDto {
  return {
    content,
    tag_category_id,
  };
}

export function responseFromTag(tag: ResponseFromTag): TagResponseDto {
  const {id, content, createdAt, updatedAt, status, tagCategoryId} = tag;
  return {
    id,
    content,
    createdAt,
    updatedAt,
    status,
    tagCategoryId,
  };
}
