import {Request, Response} from 'express';
import {performOCR} from '../services/ocrService.js';

export const getText = async (req: Request, res: Response): Promise<void> => {
  const {imageUrl} = req.body;

  if (!imageUrl) {
    res.status(400).json({error: 'imageUrl is required'});
    return;
  }

  try {
    const text = await performOCR(imageUrl);
    res.status(200).json({text});
  } catch (error) {
    console.error('Error in getText controller:', error);

    // error가 `Error` 타입임을 선언
    if (error instanceof Error) {
      res.status(500).json({error: error.message});
    } else {
      // 에러 처리리
      res.status(500).json({error: 'An unknown error occurred.'});
    }
  }
};
