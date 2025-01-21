import {ImageAnnotatorClient} from '@google-cloud/vision';
import path from 'path';
import {fileURLToPath} from 'url';
import {folderRepository} from '../repositories/ocrRepository.js';

// __dirname 대체 코드
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Cloud Vision Client 초기화
const keyFilename = path.join(
  __dirname,
  '../../../sweepicai-00d515e813ea.json',
);
const visionClient = new ImageAnnotatorClient({keyFilename});

// type 선언
interface OCRRequest {
  folder_id: number;
  image_url: string;
  user_id: number;
}

export const processOCRAndSave = async ({
  folder_id,
  image_url,
  user_id,
}: OCRRequest) => {
  // OCR 처리

  if (folder_id) {
    // 폴더 조회
    const folder = await folderRepository.findFolderById(folder_id, user_id);

    if (!folder) {
      throw new Error('존재하지 않는 폴더입니다.');
    }
    const ocrText = await performOCR(image_url);

    if (!folder.image_text || folder.image_text.trim() === '') {
      // 새로 만들어진 폴더라면, 새롭게 Text 저장
      await folderRepository.updateFolderImageText(folder_id, ocrText);
    } else {
      // 이미 있는 폴더라 텍스트가 있는 경우에는 기존 텍스트에 추가
      await folderRepository.appendFolderImageText(folder_id, ocrText);
    }

    // 이미지 저장
    await folderRepository.addImageToFolder(folder_id, image_url);

    return {
      folder_id,
      image_text: ocrText,
      image_url,
    };
  }
  throw new Error('folder_id가 필요합니다.');
};

// 사진을 이미지로 변환하는 함수(OCR 처리)
export const performOCR = async (image_url: string): Promise<string> => {
  try {
    const [result] = await visionClient.textDetection(image_url);
    const annotations = result.textAnnotations;

    if (!annotations || annotations.length === 0) {
      throw new Error('이미지에서 글자를 찾지 못했습니다.');
    }

    return annotations[0].description || 'No text found.';
  } catch (error) {
    console.error('Error during OCR:', error);
    throw error;
  }
};
