import express from 'express';
export const memoFolderRouter = express.Router();

import {
  handlerMemoFolderDelete,
  handlerMemoImageAdd,
  handlerMemoImageMove,
} from '../controllers/memo-image.controller.js';
import {createFolderOCR} from '../controllers/memo-createFolderOCR.Controller.js';
import {updateFolderOCR} from '../controllers/memo-updateFolderOCR.Controller.js';
import {
  handlerMemoFolderAdd,
  handlerMemoFolderImageCreate,
  handlerMemoFolderList,
  handlerMemoFolderUpdate,
  handlerMemoImageDelete,
  handlerMemoSearch,
  handlerMemoTextImageList,
  handlerMemoTextUpdate,
} from '../controllers/memo-folder.controller.js';
import {imageUploader} from '../s3/image.uploader.js';
import upload from '../ai/ai-upload.js';

memoFolderRouter.post('/folders', handlerMemoFolderAdd);
memoFolderRouter.get('/folders/:folderId', handlerMemoTextImageList);
memoFolderRouter.patch('/folders/:folderId', handlerMemoFolderUpdate);

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

memoFolderRouter.get('/list', handlerMemoFolderList);
memoFolderRouter.get('/search', handlerMemoSearch);

memoFolderRouter.patch('/folders/:folderId/images/move', handlerMemoImageMove);
memoFolderRouter.patch('/folders/:folderId/text', handlerMemoTextUpdate);
memoFolderRouter.delete('/folders/:folderId/images', handlerMemoImageDelete);

memoFolderRouter.delete('/folders/:folderId', handlerMemoFolderDelete);

// OCR 요청 처리 추가
memoFolderRouter.post(
  '/text-format/folders',
  upload.single('base64_image'), // OCR을 위한 파일 업로드
  createFolderOCR,
); // 새 폴더의 OCR 처리

memoFolderRouter.patch(
  '/text-format/folders/:folderId',
  upload.single('base64_image'), // OCR을 위한 파일 업로드
  updateFolderOCR,
); // 기존 폴더의 OCR 처리
