import {prisma} from '../db.config.js';
import {
  BodyToMemoFolder,
  BodyToMemoTextToUpdate,
  MemoFolderList,
  MemoFolderType,
  MemoFoler,
  MemoTextImageList,
  ResponseMessage,
} from '../models/memo-folder.model.js';
import {getPresignedUrl} from '../s3/get-presigned-url.js';
import {imageDeleter} from '../s3/image.deleter.js';

export const createMemoFolder = async (
  data: BodyToMemoFolder,
  userId: bigint,
): Promise<bigint | null> => {
  const confirmMemoFolder = await prisma.memoFolder.findFirst({
    where: {
      name: data.folderName,
      userId,
    },
  });
  if (confirmMemoFolder) {
    return null;
  }
  const createdMemoFolder = await prisma.memoFolder.create({
    data: {
      name: data.folderName,
      userId,
      imageText: '',
    },
  });

  return createdMemoFolder.id;
};

export const getMemoFolder = async (
  memoFolderId: bigint,
): Promise<MemoFoler | null> => {
  const memoFolder = await prisma.memoFolder.findFirst({
    where: {
      id: memoFolderId,
    },
    select: {
      id: true,
      name: true,
      imageText: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      userId: true,
    },
  });

  if (memoFolder === null) {
    return null;
  }

  const formattedMemoFolder = {
    ...memoFolder,
    id: memoFolder.id.toString(),
  };

  return formattedMemoFolder;
};

export const getMemoFolderList = async (
  userId: bigint,
): Promise<MemoFolderList[]> => {
  const memoFolderList = await prisma.memoFolder.findMany({
    select: {
      id: true,
      userId: true,
      name: true,
      imageText: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      _count: {
        // 이미지 개수를 세는 필드 추가
        select: {
          memoImages: true, // memoImages의 개수를 가져온다.
        },
      },
      memoImages: {
        take: 1, // 각 폴더에서 첫 번째 사진만 가져오기
        orderBy: {
          createdAt: 'asc', // 업로드된 시간순으로 정렬
        },
      },
    },
    where: {
      userId,
    },
  });

  const formattedMemoFolderList = await Promise.all(
    // 비동기 작업이 완료될 때까지 기다린 후 처리된 결과를 배열로 반환
    memoFolderList.map(async memoFolder => ({
      ...memoFolder,
      id: memoFolder.id.toString(),
      imageCount: memoFolder._count?.memoImages || 0, // 이미지 개수 추가
      memoImages: await Promise.all(
        memoFolder.memoImages.map(async memoImage => {
          const presignedUrl = await getPresignedUrl(memoImage.url);
          return {
            ...memoImage,
            id: memoImage.id.toString(),
            folderId: memoImage.folderId.toString(),
            url: presignedUrl, // Pre-signed URL로 변환
          };
        }),
      ),
    })),
  );

  return formattedMemoFolderList;
};

export const getSearchMemoList = async (
  userId: bigint,
  searchKeyword: string,
): Promise<MemoFolderList[]> => {
  const memoSearchList = await prisma.memoFolder.findMany({
    select: {
      id: true,
      name: true,
      imageText: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      userId: true,
      _count: {
        // 이미지 개수를 세는 필드 추가
        select: {
          memoImages: true, // memoImages의 개수를 가져온다.
        },
      },
      memoImages: {
        take: 1,
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
    where: {
      // 폴더 이름이나 메모 텍스트에 검색어가 포함된 데이터 필터링
      AND: [
        {
          userId,
        },
        {
          OR: [
            {
              name: {
                // name 필드에 searchKeyword가 포함된 데이터를 찾는다.
                contains: searchKeyword,
              },
            },
            {
              imageText: {
                // imageText 필드에 searchKeyword가 포함된 데이터를 찾는다.
                contains: searchKeyword,
              },
            },
          ],
        },
      ],
    },
  });

  const formattedMemoSearchList = await Promise.all(
    memoSearchList.map(async memoSearch => ({
      ...memoSearch,
      id: memoSearch.id.toString(),
      imageCount: memoSearch._count?.memoImages || 0, // 이미지 개수 추가
      memoImages: await Promise.all(
        memoSearch.memoImages.map(async memoImage => {
          const presignedUrl = await getPresignedUrl(memoImage.url);
          return {
            ...memoImage,
            id: memoImage.id.toString(),
            folderId: memoImage.folderId.toString(),
            url: presignedUrl, // Pre-signed URL로 변환
          };
        }),
      ),
    })),
  );

  return formattedMemoSearchList;
};

export const getMemoTextImageList = async (
  userId: bigint,
  folderId: bigint,
): Promise<MemoTextImageList | null> => {
  const memoTextImageList = await prisma.memoFolder.findFirst({
    select: {
      id: true,
      userId: true,
      name: true,
      imageText: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      memoImages: {
        orderBy: {
          createdAt: 'asc', // 업로드된 시간순으로 정렬
        },
      },
    },
    where: {
      userId,
      id: folderId,
    },
  });

  if (memoTextImageList === null) {
    return null;
  }

  const formattedMemoTextImageList = {
    ...memoTextImageList,
    id: memoTextImageList.id.toString(),
    memoImages: await Promise.all(
      memoTextImageList.memoImages.map(async memoImage => {
        const presignedUrl = await getPresignedUrl(memoImage.url);
        return {
          ...memoImage,
          id: memoImage.id.toString(),
          folderId: memoImage.folderId.toString(),
          url: presignedUrl,
        };
      }),
    ),
  };

  return formattedMemoTextImageList;
};

export const updateMemoFolder = async (
  userId: bigint,
  folderId: bigint,
  folderName: string,
): Promise<MemoFolderType | null> => {
  const checkFolder = await prisma.memoFolder.findFirst({
    where: {
      name: folderName,
      userId,
    },
  });
  if (checkFolder) {
    return null;
  }
  const folder = await prisma.memoFolder.update({
    where: {
      userId,
      id: folderId,
    },
    data: {
      name: folderName,
      updatedAt: new Date(),
    },
  });
  return folder;
};

export const deleteMemoFolder = async (
  userId: bigint,
  folderId: bigint,
): Promise<ResponseMessage | null> => {
  const folder = await prisma.memoFolder.findFirst({
    where: {
      id: folderId,
      userId,
    },
  });
  if (folder === null) {
    return null;
  }
  const imageUrlToDelete = await prisma.memoImage.findMany({
    where: {
      folderId,
      memoFolder: {
        userId,
      },
    },
  });
  for (const imageUrl of imageUrlToDelete) {
    imageDeleter(imageUrl.url);
  }
  await prisma.memoImage.deleteMany({
    where: {
      folderId,
    },
  });
  await prisma.memoFolder.delete({
    where: {
      id: folderId,
      userId,
    },
  });
  return {message: '성공적으로 삭제하였습니다.'};
};

export const updateMemoText = async (
  userId: bigint,
  folderId: bigint,
  data: BodyToMemoTextToUpdate,
): Promise<MemoTextImageList> => {
  const memoText = await prisma.memoFolder.update({
    where: {
      id: folderId,
      userId,
    },
    data: {
      imageText: data.memoText,
      updatedAt: new Date(),
    },
    select: {
      id: true,
      userId: true,
      name: true,
      imageText: true,
      createdAt: true,
      updatedAt: true,
      status: true,
      memoImages: true,
    },
  });

  const formattedMemoText = {
    ...memoText,
    id: memoText.id.toString(),
    memoImages: await Promise.all(
      memoText.memoImages.map(async memoImage => {
        const presignedUrl = await getPresignedUrl(memoImage.url);
        return {
          ...memoImage,
          id: memoImage.id.toString(),
          folderId: memoImage.folderId.toString(),
          url: presignedUrl,
        };
      }),
    ),
  };

  return formattedMemoText;
};
