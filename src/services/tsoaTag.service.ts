import {DateToTags} from '../dtos/tsoaTag.dto.js';
import {selectTagsByDate} from '../repositories/tsoaTag.repository.js';

export const findTagsByDate = async (dto: DateToTags): Promise<string[]> => {
  let endDate = new Date(dto.createdAt);
  if (dto.dateExisted) {
    endDate.setDate(endDate.getDate() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }
  const tags = await selectTagsByDate(dto, endDate).then(result => {
    return result.map(object => object.content);
  });
  if (tags.length === 0) {
    throw new Error('아무 태그도 없습니다');
  }
  return tags;
};
