import {prisma} from '../db.config.js';
import {OCRRequest, OCRResponse} from '../models/memo-OCR.model.js';

export const folderRepository = {
  /**
   * 폴더 ID와 사용자 ID로 폴더 조회
   */
  findFolderById: async (
    folder_id: bigint,
    user_id: bigint,
  ): Promise<OCRResponse | null> => {
    const folder = await prisma.memoFolder.findFirst({
      where: {
        id: folder_id,
        userId: user_id,
      },
    });

    if (!folder) return null;

    const formatted: OCRResponse = {
      folder_id: folder.id.toString(),
      user_id: folder.userId,
      folder_name: folder.name,
      imageText: folder.imageText,
    };

    return formatted;
  },

  /**
   * 폴더 이름과 사용자 ID로 폴더 조회
   */
  findFolderByNameAndUserId: async (
    folder_name: string,
    user_id: bigint,
  ): Promise<OCRResponse | null> => {
    const folder = await prisma.memoFolder.findFirst({
      where: {
        name: folder_name,
        userId: user_id,
      },
    });

    if (!folder) return null;

    const formatted: OCRResponse = {
      folder_id: folder.id.toString(),
      user_id: folder.userId,
      folder_name: folder.name,
      imageText: folder.imageText,
    };

    return formatted;
  },

  /**
   * 새 폴더 생성
   */
  createFolder: async (
    user_id: bigint,
    folder_name: string,
  ): Promise<OCRResponse> => {
    const existingFolder = await folderRepository.findFolderByNameAndUserId(
      folder_name,
      user_id,
    );

    if (existingFolder) return existingFolder;

    const folder = await prisma.memoFolder.create({
      data: {
        userId: user_id,
        name: folder_name,
        imageText: '',
      },
    });

    const formatted: OCRResponse = {
      folder_id: folder.id.toString(),
      user_id: folder.userId,
      folder_name: folder.name,
      imageText: folder.imageText,
    };

    return formatted;
  },

  /**
   * 폴더에 텍스트 업데이트 (새로 저장 - POST 요청)
   */
  updateFolderImageText: async (
    folder_id: bigint,
    new_text: string,
  ): Promise<OCRResponse> => {
    const updatedFolder = await prisma.memoFolder.update({
      where: {id: folder_id},
      data: {imageText: new_text},
    });

    const formatted: OCRResponse = {
      folder_id: updatedFolder.id.toString(),
      user_id: updatedFolder.userId,
      folder_name: updatedFolder.name,
      imageText: updatedFolder.imageText,
    };

    return formatted;
  },

  /**
   * 폴더에 텍스트 추가 (PATCH 요청)
   */
  appendFolderImageText: async (
    folder_id: bigint,
    additional_text: string,
  ): Promise<OCRResponse> => {
    const folder = await prisma.memoFolder.findUnique({
      where: {id: folder_id},
    });

    if (!folder) {
      throw new Error('Folder not found');
    }

    const updatedText = (folder.imageText || '') + '\n' + additional_text;

    const updatedFolder = await prisma.memoFolder.update({
      where: {id: folder_id},
      data: {imageText: updatedText},
    });

    const formatted: OCRResponse = {
      folder_id: updatedFolder.id.toString(),
      user_id: updatedFolder.userId,
      folder_name: updatedFolder.name,
      imageText: updatedFolder.imageText,
    };

    return formatted;
  },
};
