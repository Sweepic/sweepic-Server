import {ImageAnnotatorClient} from '@google-cloud/vision';
import path from 'path';

// Google Cloud Vision Client 초기화
const keyFilename = path.join(
  __dirname,
  '../../../sweepicai-00d515e813ea.json',
);
const visionClient = new ImageAnnotatorClient({keyFilename});

// 라벨 감지 서비스 함수
export const performLabelDetection = async (
  imageUrl: string,
): Promise<string[]> => {
  try {
    const [result] = await visionClient.labelDetection(imageUrl);
    const labels = result.labelAnnotations;

    if (!labels || labels.length === 0) {
      throw new Error('No labels detected in the image.');
    }

    // score가 null 또는 undefined인지 확인하여 기본값 처리
    return labels.map(label => {
      const score = label.score ?? 0; // nullish coalescing 연산자 사용 (null 또는 undefined일 경우 0 사용)
      return `${label.description} (Confidence: ${(score * 100).toFixed(2)}%)`;
    });
  } catch (error) {
    console.error('Error during label detection:', error);
    throw error;
  }
};
