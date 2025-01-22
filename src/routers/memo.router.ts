import express from 'express';
export const memoFolderRouter = express.Router();
import {
  handlerMemoFolderAdd,
  handlerMemoFolderImageCreate,
} from '../controllers/memo-folder.controller.js';
import {imageUploader} from '../s3/image.uploader.js';
import {handlerMemoImageAdd} from '../controllers/memo-image.controller.js';
import {createFolderOCR} from '../controllers/memo-createFolderOCR.Controller.js';
import {updateFolderOCR} from '../controllers/memo-updateFolderOCR.Controller.js';
memoFolderRouter.post('/folders', handlerMemoFolderAdd);
memoFolderRouter.post(
  '/image-format/folders',
  imageUploader.single('image'),
  handlerMemoFolderImageCreate,
);
memoFolderRouter.post(
  '/image-format/folders/:folderId',
  imageUploader.single('image'),
  handlerMemoImageAdd,
);

// OCR 요청 처리 추가
memoFolderRouter.post('/text-format/folders', createFolderOCR); // 새 폴더의 OCR 처리
memoFolderRouter.patch('/text-format/folders/:folderId', updateFolderOCR); // 기존 폴더의 OCR 처리
