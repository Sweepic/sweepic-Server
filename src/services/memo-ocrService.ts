import {ImageAnnotatorClient} from '@google-cloud/vision';
import path from 'path';
import {fileURLToPath} from 'url';
import {folderRepository} from '../repositories/memo-OCR.repositoy.js';
import {OCRRequest} from '../models/memo-OCR.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Cloud Vision 클라이언트 초기화
const keyFilename = path.join(
  __dirname,
  '../../../sweepicai-00d515e813ea.json',
);
const visionClient = new ImageAnnotatorClient({keyFilename});

export const processOCRAndSave = async ({
  folder_id,
  image_url,
  user_id,
  folder_name,
}: OCRRequest) => {
  let folder;

  // user_id를 BigInt로 변환
  const userIdBigInt = BigInt(user_id);

  if (!folder_id) {
    // POST 요청 - folder_name으로 폴더 생성 또는 조회
    if (!folder_name) {
      throw new Error('폴더를 생성하려면 folder_name이 필요합니다');
    }

    // 폴더 이름으로 folder 조회
    folder = await folderRepository.findFolderByNameAndUserId(
      folder_name,
      userIdBigInt,
    );

    // 폴더가 이미 존재하면 중복 에러 반환
    if (folder) {
      throw new Error('해당 이름의 폴더가 이미 존재합니다');
    }

    // 폴더 생성
    folder = await folderRepository.createFolder(userIdBigInt, folder_name);
    folder_id = Number(folder_id); // 생성된 폴더 ID 업데이트
  } else {
    // PATCH 요청 - folder_id로 폴더 조회
    folder = await folderRepository.findFolderById(
      BigInt(folder_id),
      userIdBigInt,
    );

    if (!folder) {
      throw new Error('해당 폴더를 찾을 수 없습니다');
    }
  }

  // OCR 수행 - 이미지를 문자로 변환 (AI 적용)
  const ocrText = await performOCR(image_url);

  // 폴더에 텍스트 저장 또는 추가
  if (folder.imageText) {
    await folderRepository.appendFolderImageText(BigInt(folder_id), ocrText);
  } else {
    await folderRepository.updateFolderImageText(BigInt(folder_id), ocrText);
  }

  // 폴더에 이미지 저장
  await folderRepository.addImageToFolder(BigInt(folder_id), image_url);

  return {
    folder_id: folder_id,
    image_text: ocrText,
    image_url,
  };
};

// Google Vision API를 사용하여 OCR 수행 함수
export const performOCR = async (image_url: string): Promise<string> => {
  try {
    const [result] = await visionClient.textDetection(image_url);
    const annotations = result.textAnnotations;

    if (!annotations || annotations.length === 0) {
      throw new Error('이미지에서 텍스트를 찾을 수 없습니다');
    }

    return annotations[0].description || '텍스트를 찾을 수 없습니다';
  } catch (error) {
    console.error('OCR 처리 중 오류 발생:', error);
    throw error;
  }
};
