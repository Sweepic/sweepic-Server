import {prisma} from '../db.config.js';
import {ResponseFromTag} from '../models/tag.model.js';

export async function addTag(
  content: string,
  tag_category_id: bigint,
): Promise<bigint> {
  console.log('addTag 실행' + content + tag_category_id);
  const tag = await prisma.tag.findFirst({
    where: {
      content,
    },
  }); // 태그 중복 확인

  console.log('tag: ', tag);

  if (tag !== null) {
    throw new Error('태그 중복 확인 에러');
  } // 중복된 태그가 있을 경우 null 반환

  const tagCategoryId = await prisma.tagCategory.findFirst({
    where: {
      id: tag_category_id,
    },
  }); // 태그 카테고리 조회

  if (tagCategoryId === null) {
    throw new Error('태그 카테고리 조회 에러');
  } // 태그 카테고리 조회 실패 시 null 반환

  const created = await prisma.tag.create({
    data: {
      content,
      tagCategoryId: tag_category_id,
    },
  }); // 태그 생성

  if (created === null) {
    throw new Error('태그 생성 에러');
  } // 태그 생성 실패 시 null 반환

  return created.id;
}

export async function getTag(tagId: bigint): Promise<ResponseFromTag> {
  const tag = await prisma.tag.findFirst({
    where: {
      id: tagId,
    },
  }); // 태그 조회

  if (tag === null) {
    throw new Error('태그 조회 에러');
  } // 태그 조회 실패 시 null 반환

  return tag;
}
