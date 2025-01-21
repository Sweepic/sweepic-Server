import {Request, Response} from 'express';
import {processOCRAndSave} from '../services/ocrService.js';

export const handleOCRrequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {folder_id, image_url, user_id} = req.body;

  // 요청 데이터의 유효성 검사 수행
  if (!image_url) {
    res.status(400).json({error: 'imageUrl is required'});
    return;
  }

  // folder_id 와 folder_name 모두 존재하지 않을 경우 에러 처리
  if (!folder_id) {
    res.status(400).json({error: 'folder_id is required'});
    return;
  }

  if (!user_id) {
    res.status(400).json({error: 'user_id is required'});
    return;
  }

  try {
    const result = await processOCRAndSave({
      folder_id,
      image_url,
      user_id,
    });
    res.status(200).json({message: 'Success', data: result});
  } catch (error) {
    console.error('Error in handle OCR controller:', error);

    // 에러 응답 처리
    if (error instanceof Error) {
      res.status(500).json({error: error.message});
    } else {
      res.status(500).json({error: 'An unknown error occurred.'});
    }
  }
};
