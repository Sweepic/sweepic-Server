import express from 'express';
export const trustRouter = express.Router();
import {
  handleImageStatus,
  handleImageRestore,
  handleImageDelete,
} from '../controllers/trust.controller.js';

trustRouter.patch('/active', handleImageStatus); // 이미지 비활성화
trustRouter.patch('/restore', handleImageRestore); //이미지 복구
trustRouter.delete('/', handleImageDelete); // 비활성화된 이미지 삭제
