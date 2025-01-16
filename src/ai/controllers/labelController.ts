import {Request, Response} from 'express';
import {performLabelDetection} from '../services/labelDetection.js';

// 라벨 감지 컨트롤러 함수
export const getLabel = async (req: Request, res: Response): Promise<void> => {
  const {imageUrl} = req.body;

  // 요청에 imageUrl이 없을 경우
  if (!imageUrl) {
    res.status(400).json({error: 'imageUrl is required'});
    return;
  }

  try {
    // 서비스 함수 호출
    const labels = await performLabelDetection(imageUrl);
    res.status(200).json({labels}); // 성공 응답
  } catch (error) {
    console.error('Error in getLabel controller:', error);

    // 에러 핸들링
    if (error instanceof Error) {
      res.status(500).json({error: error.message});
    } else {
      res.status(500).json({error: 'An unknown error occurred.'});
    }
  }
};
