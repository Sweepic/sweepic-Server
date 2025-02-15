import {
  responseCreationTags,
  ResponseCreationTags,
} from '../models/tsoaTag.model.js';
import {
  DateToTags,
  ImageToTags,
  RequestCreationTags,
} from '../dtos/tsoaTag.dto.js';
import {TagNotFound} from '../errors.js';
import {
  addImageTag,
  getImageTag,
  selectTagsByDate,
  selectTagsFromImage,
} from '../repositories/tsoaTag.repository.js';

export const findTagsByDate = async (dto: DateToTags): Promise<string[]> => {
  const endDate = new Date(dto.createdAt);
  if (dto.dateExisted) {
    endDate.setDate(endDate.getDate() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }

  const tags = await selectTagsByDate(dto.userId, dto.createdAt, endDate).then(
    result => {
      return result.map(object => object.content);
    },
  );
  if (tags.length === 0) {
    throw new TagNotFound();
  }
  return tags;
};

export const findTagsFromImage = async (
  dto: ImageToTags,
): Promise<
  {
    content: string;
    tagCategory: {
      id: string;
      tagType: string;
    };
  }[]
> => {
  const tags = await selectTagsFromImage(dto.userId, dto.mediaId).then(
    result => {
      if (result.length === 0) {
        throw new TagNotFound();
      }
      return result.map(tag => ({
        ...tag,
        tagCategory: {
          id: tag.tagCategory.id.toString(),
          tagType: tag.tagCategory.tagType,
        },
      }));
    },
  );
  return tags;
};

export async function tagCreate({
  imageId,
  tags,
}: RequestCreationTags): Promise<ResponseCreationTags> {
  await addImageTag({imageId, tags});

  const imageTagData = await getImageTag(imageId);

  return responseCreationTags(imageTagData);
}
