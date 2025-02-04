import {ImageAnnotatorClient} from '@google-cloud/vision';
import path from 'path';
import {folderRepository} from '../repositories/memo-OCR.repositoy.js';
import {OCRRequest} from '../models/memo-OCR.model.js';
import {
  FolderNotFoundError,
  FolderDuplicateError,
  PhotoDataNotFoundError,
  OCRProcessError,
} from '../errors.js';

// 환경변수에서 Base64로 인코딩된 JSON 키 가져오기
const keyFileBase64 = process.env.GOOGLE_CLOUD_KEY_FILE;

if (!keyFileBase64) {
  throw new Error('GOOGLE_CLOUD_KEY_FILE 환경변수가 설정되지 않았습니다.');
}

// Base64로 인코딩된 JSON 키 디코딩
const keyFileBuffer = Buffer.from(keyFileBase64, 'base64');
const keyFileJson = JSON.parse(keyFileBuffer.toString());

// Google Cloud Vision 클라이언트 초기화
const visionClient = new ImageAnnotatorClient({credentials: keyFileJson});

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
    folder = await folderRepository.findFolderById(folder_id, userIdBigInt);

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

    const [result] = await visionClient.textDetection({
      image: {content: base64Data},
    });

    console.log('Google Vision API response received:', result);

    const annotations = result.textAnnotations;

    if (!annotations || annotations.length === 0) {
      console.log('No text annotations found.');
      throw new PhotoDataNotFoundError({
        reason: '이미지에서 텍스트를 찾지 못하였습니다.',
      });
    }

    console.log('OCR result:', annotations[0].description);
    return annotations[0].description || '텍스트를 찾을 수 없습니다';
  } catch (error) {
    console.error(error);
    throw new OCRProcessError();
  }
};
