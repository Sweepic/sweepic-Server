import 
  BodyToTag,
  TagRequsetDto,
  ResponseFromTag,
  TagResponseDto,
  ResponseFromImageTag,
  ImageTagResponseDto,
} from '../models/tag.model.js';

export function bodyToTag({mediaId, tags}: BodyToTag): TagRequsetDto {
  return {
    mediaId,
    tags,
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

export function responseFromImageTag(
  imageTagData: ResponseFromImageTag[],
): ImageTagResponseDto[] {
  const responseData = imageTagData.map(data => {
    const {id, createdAt, updatedAt, status, imageId, tagId} = data;
    return {
      id: id.toString(),
      createdAt,
      updatedAt,
      status,
      imageId: imageId.toString(),
      tagId: tagId.toString(),
    };
  });
  return responseData;
}
