import {ImageAnnotatorClient} from '@google-cloud/vision';

import {folderRepository} from '../repositories/memo-OCR.repositoy.js';
import {OCRRequest} from '../models/memo-OCR.model.js';
import {
  FolderNotFoundError,
  FolderDuplicateError,
  PhotoDataNotFoundError,
} from '../errors.js';

import path from 'path';

// Google Cloud Vision 클라이언트 초기화
const keyFilename = path.resolve('../sweepicai-00d515e813ea.json');

const visionClient = new ImageAnnotatorClient({keyFilename});

export const processOCRAndSave = async ({
  folder_id,
  base64_image,
  user_id,
  folder_name,
}: OCRRequest) => {
  let folder;

  // user_id를 BigInt로 변환
  const userIdBigInt = BigInt(user_id);

  if (!folder_id) {
    // POST 요청 - folder_name으로 폴더 생성 또는 조회
    if (!folder_name) {
      throw new FolderNotFoundError({folderId: BigInt(folder_id || 0)});
    }

    // 폴더 이름으로 folder 조회
    folder = await folderRepository.findFolderByNameAndUserId(
      folder_name,
      userIdBigInt,
    );

    // 폴더가 이미 존재하면 중복 에러 반환
    if (folder) {
      console.log('폴더 중복 에러 발생:', folder_name); // 로그 추가
      const error = new FolderDuplicateError({folderName: folder_name});
      console.log('생성된 에러 객체:', error); // 에러 객체 확인
      throw error;
    }

    // 폴더 생성 (folder_name을 사용)
    folder = await folderRepository.createFolder(userIdBigInt, folder_name);
    folder_id = Number(folder.folder_id); // 생성된 폴더 ID를 number로 변환하여 업데이트
  } else {
    // PATCH 요청 - folder_id로 폴더 조회
    folder = await folderRepository.findFolderById(
      BigInt(folder_id),
      userIdBigInt,
    );

    if (!folder) {
      throw new FolderNotFoundError({folderId: BigInt(folder_id)});
    }
  }

  // OCR 수행 - 이미지를 문자로 변환 (AI 적용)
  const ocrText = await performOCR(base64_image);

  // 폴더에 텍스트 저장 또는 추가
  if (folder.imageText) {
    await folderRepository.appendFolderImageText(
      BigInt(folder.folder_id),
      ocrText,
    );
  } else {
    await folderRepository.updateFolderImageText(
      BigInt(folder.folder_id),
      ocrText,
    );
  }

  return {
    folder_id: folder.folder_id,
    image_text: ocrText,
  };
};

// Google Vision API를 사용하여 OCR 수행 함수 (Base64 지원 및 MIME 제거)
export const performOCR = async (base64_image: string): Promise<string> => {
  try {
    // Base64 데이터에서 MIME 타입 제거 (data:image/jpeg;base64, 등)
    const base64Data = base64_image.replace(/^data:image\/\w+;base64,/, '');

    // Vision API 요청 형식에 맞게 데이터 설정
    const [result] = await visionClient.textDetection({
      image: {
        content: base64Data, // MIME 제거된 Base64 데이터 전달
      },
    });

    const annotations = result.textAnnotations;

    if (!annotations || annotations.length === 0) {
      throw new PhotoDataNotFoundError();
    }

    return annotations[0].description || '텍스트를 찾을 수 없습니다';
  } catch (error) {
    console.error('OCR 처리 중 오류 발생:', error);
    throw error;
  }
};
