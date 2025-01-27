import {ImageAnnotatorClient} from '@google-cloud/vision';
import {LabelDetectionError, LabelNotFoundError} from '../errors.js';

import path from 'path';

const keyFilename = path.resolve('../sweepicai-00d515e813ea.json');

const visionClient = new ImageAnnotatorClient({keyFilename});
export const detectLabels = async (
  base64Image: string,
): Promise<{description: string; score: number}[]> => {
  try {
    // Vision API 호출
    const [result] = await visionClient.labelDetection({
      image: {content: base64Image},
    });

    const labels = result.labelAnnotations;

    // 라벨이 없으면 LabelNotFoundError 발생
    if (!labels || labels.length === 0) {
      throw new LabelNotFoundError({
        reason: '이미지에서 라벨을 감지하지 못했습니다.',
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
  } catch (error) {
    console.error('Error in detectLabels service:', error);
    throw new LabelDetectionError({
      reason: '라벨링 처리 중 오류가 발생했습니다.',
    });
  }
};
