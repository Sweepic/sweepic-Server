import {PrismaClient} from '@prisma/client/extension';

const prisma = new PrismaClient();

export const folderRepository = {
  // 폴더 조회
  findFolderById: async (folder_id: number, user_id: number) => {
    return await prisma.MemoFolder.findUnique({
      where: {id: folder_id, userId: user_id},
    });
  },

  // 폴더에 텍스트 업데이트 (새로 저장)
  updateFolderImageText: async (folder_id: number, new_text: string) => {
    return await prisma.MemoFolder.update({
      where: {id: folder_id},
      data: {
        image_text: new_text,
      },
    });
  },

  // 폴더에 텍스트 추가
  appendFolderImageText: async (folder_id: number, additional_text: string) => {
    const folder = await prisma.MemoFolder.findUnique({
      where: {id: folder_id},
    });

    const updatedText = (folder?.image_text || '') + '\n' + additional_text;

    return await prisma.MemoFolder.update({
      where: {id: folder_id},
      data: {
        image_text: updatedText,
      },
    });
  },

  // 이미지 저장
  addImageToFolder: async (folder_id: number, image_url: string) => {
    return await prisma.MemoImage.create({
      data: {
        folder_id,
        url: image_url,
        status: 1,
      },
    });
  },
};
