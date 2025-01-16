import {ImageAnnotatorClient} from '@google-cloud/vision';
import path from 'path';
import {fileURLToPath} from 'url';

// __dirname 대체 코드
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Cloud Vision Client 초기화
const keyFilename = path.join(
  __dirname,
  '../../../sweepicai-00d515e813ea.json',
);
const visionClient = new ImageAnnotatorClient({keyFilename});

export const performOCR = async (imageUrl: string): Promise<string> => {
  try {
    const [result] = await visionClient.textDetection(imageUrl);
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
