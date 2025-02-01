import {prisma} from '../db.config.js';
import {DBError} from '../errors.js';
import {
  ResponseFromTag,
  BodyToImageTag,
  ResponseFromImageTag,
} from '../models/tag.model.js';
import {tagcategory} from '../utils/tag.utils.js';

export async function getImage(mediaId: bigint | number): Promise<bigint> {
  const imageTagData = await prisma.image.findFirst({
    where: {
      mediaId,
    },
    select: {
      id: true,
    },
  });

  if (imageTagData === null) {
    throw new DBError();
  }

  return imageTagData.id;
}

// 태그가 있을 시, 태그를 반환하고 없을 시, 태그를 생성
export async function addImageTag({
  imageId,
  tags,
}: BodyToImageTag): Promise<void> {
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    const {content, tag_category_id} = tag;
    console.log(`태그 생성 시작 ${i}번째`);

    // 태그가 빈 값일 경우, 해당 이미지의 태그 상태를 0으로 변경
    if (content === '') {
      console.log('태그가 빈 값일 경우, 해당 이미지의 태그 상태를 0으로 변경');
      await inActiveTag(imageId, tag_category_id);
    }
    // 태그가 동일한 것이 있을 시, 태그를 반환하고 / 태그가 동일한 것이 없을 시, 태그를 생성
    else {
      const tagData = await getTag(content, tag_category_id);
      // await activeTag(imageId, tag_category_id);
      await inActiveTag(imageId, tag_category_id);
      // 태그가 동일한 것이 없으면 생성
      if (!tagData) {
        console.log('태그 생성 실행 후, 이미지-태그 테이블 태그 생성 실행');
        await newTag(imageId, content, tag_category_id);
      }
      // 태그가 동일한 것이 있으면 미생성
      else {
        console.log('이미지-태그 테이블 태그 업데이트 실행');
        await updateTag(imageId, tagData);
      }
    }
  }
  return;
}

export async function inActiveTag(
  imageId: bigint | number,
  tag_category_id: bigint,
): Promise<void> {
  // 이미지 태그 테이블에서 image_id가 일치하는 데이터들을 찾아서,
  // 해당 tag_id 값과 태그 테이블의 id 값이 같은 데이터를 태그 테이블에서 찾아서,
  // tagCategoryID와 tag_category_id가 일치하는 데이터를 찾음.
  // 해당 데이터의 status를 0으로 변경
  const imageData = await prisma.imageTag.findMany({
    where: {
      imageId,
    },
    select: {
      id: true,
      tagId: true,
    },
  });

  // bigint 타입을 string 타입으로 변경
  const formattedImageData = imageData.map(item => ({
    id: item.id.toString(),
    tagId: item.tagId.toString(),
  }));

  for (let j = 0; j < imageData.length; j++) {
    const tagData = await prisma.tag.findMany({
      where: {
        id: BigInt(formattedImageData[j].tagId),
        tagCategoryId: tag_category_id,
      },
      select: {
        id: true,
      },
    });

    if (tagData) {
      const formattedTagData = tagData.map(item => ({
        ...item,
        id: item.id.toString(),
      }));
      for (let k = 0; k < tagData.length; k++) {
        await prisma.imageTag.update({
          where: {
            id: BigInt(formattedImageData[j].id),
            tagId: BigInt(formattedTagData[k].id),
          },
          data: {
            status: 0,
          },
        });
      }
    }
  }
}

export async function activeTag(
  imageId: bigint | number,
  tag_category_id: bigint,
): Promise<void> {
  const imageData = await prisma.imageTag.findMany({
    where: {
      imageId,
    },
    select: {
      id: true,
      tagId: true,
    },
  });

  // bigint 타입을 string 타입으로 변경
  const formattedImageData = imageData.map(item => ({
    ...item,
    id: item.id.toString(),
    tagId: item.tagId.toString(),
  }));

  for (let j = 0; j < imageData.length; j++) {
    const tagData = await prisma.tag.findFirst({
      where: {
        id: BigInt(formattedImageData[j].tagId),
        tagCategoryId: tag_category_id,
      },
      select: {
        id: true,
      },
    });

    // bigint 타입을 string 타입으로 변경

    if (tagData) {
      const formattedTagDataId = tagData.id.toString();
      await prisma.imageTag.update({
        where: {
          id: BigInt(formattedImageData[j].id),
          tagId: BigInt(formattedTagDataId),
        },
        data: {
          status: 1,
        },
      });
    } else {
      continue;
    }
  }
}

export async function newTag(
  imageId: bigint | number,
  content: string,
  tag_category_id: bigint,
): Promise<void> {
  const tagData = await addTag(content, tag_category_id);

  if (tagData === null) {
    throw new Error('태그 생성 실패');
  } // 태그 생성 실패 시 에러 반환

  const formattedTagDataId = tagData.id.toString();

  // 이미지 태그 테이블에 image_id와 tag_id가 일치하는 데이터가 있는지 확인
  const imageData = await prisma.imageTag.findFirst({
    where: {
      imageId,
      tagId: BigInt(formattedTagDataId),
    },
  });

  // 이미지 태그 테이블에 데이터가 없으면 생성
  if (!imageData) {
    await prisma.imageTag.create({
      data: {
        imageId,
        tagId: BigInt(formattedTagDataId),
      },
    });
  }
}

export async function updateTag(
  imageId: bigint | number,
  tagData: ResponseFromTag,
): Promise<void> {
  const formattedTagDataId = tagData.id.toString();

  // 이미지 테이블에 태그 존재 여부
  const imageData = await prisma.imageTag.findFirst({
    where: {
      imageId,
      tagId: tagData.id,
    },
    select: {
      id: true,
    },
  });

  // 비활성화 -> 활성화
  if (imageData) {
    const formattedImageDataId = imageData.id.toString();
    await prisma.imageTag.update({
      where: {
        id: BigInt(formattedImageDataId),
        tagId: BigInt(formattedTagDataId),
      },
      data: {
        status: 1,
      },
    });
  }
  // 이미지 태그 테이블에 데이터가 없으면 생성
  else {
    await prisma.imageTag.create({
      data: {
        imageId,
        tagId: BigInt(formattedTagDataId),
      },
    });
  }
}

export async function addTag(
  content: string,
  tag_category_id: bigint,
): Promise<ResponseFromTag | null> {
  console.log('addTag 실행');
  const created = await prisma.tag.create({
    data: {
      content,
      tagCategoryId: tag_category_id,
    },
  }); // 태그 생성

  return created;
}

export async function getTag(
  content: string,
  tag_category_id: bigint,
): Promise<ResponseFromTag | null> {
  const tagCategoryId = await prisma.tagCategory.findFirst({
    where: {
      id: tag_category_id,
    },
  }); // 태그 카테고리 조회

  const tag = await prisma.tag.findFirst({
    where: {
      content,
      tagCategoryId: tag_category_id,
    },
  }); // 태그 조회

  if (tag === null) {
    return null;
  } // 태그 조회 실패 시 null 반환

  return tag;
}

export async function getImageTag(
  imageId: bigint | number,
): Promise<ResponseFromImageTag[]> {
  console.log('getImageTag 실행');

  const imageTagData = await prisma.imageTag.findMany({
    where: {
      imageId,
      status: 1,
    },
  });

  console.log(imageTagData.length);

  return imageTagData;
}
