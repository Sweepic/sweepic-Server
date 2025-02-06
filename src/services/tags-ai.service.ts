import {ImageAnnotatorClient} from '@google-cloud/vision';
import {LabelDetectionError, LabelInsufficientError} from '../errors.js';
import {Buffer} from 'buffer';
import process from 'process';

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

export const detectLabels = async (
  base64Image: string,
): Promise<{description: string; score: number}[]> => {
  try {
    // Vision API 호출
    const [result] = await visionClient.labelDetection({
      image: {content: base64Image},
    });

    const labels = result.labelAnnotations;

    // 라벨을 발견하지 못하면, 해당 에러 발생
    if (!labels || labels.length === 0) {
      throw new LabelInsufficientError({
        reason: '해당 이미지는 정보가 부족합니다.',
      });
    }

    // 상위 3개의 라벨 반환
    return labels
      .sort((a, b) => (b.score || 0) - (a.score || 0)) // 정확도 내림차순 정렬
      .slice(0, 3) // 상위 3개만 선택
      .map(label => ({
        description: label.description || 'Unknown',
        score: label.score || 0,
      }));
  } catch {
    //try에서 예외 상황 발생시 500에러 커스텀해서 전달하도록 함
    throw new LabelDetectionError({
      reason: '라벨링 처리 중 오류가 발생했습니다.',
    });
  }
};
