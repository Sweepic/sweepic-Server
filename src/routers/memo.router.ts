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

memoFolderRouter.post('/folders/not-tsoa', handlerMemoFolderAdd);
memoFolderRouter.get('/folders/:folderId/not-tsoa', handlerMemoTextImageList);
memoFolderRouter.patch('/folders/:folderId/not-tsoa', handlerMemoFolderUpdate);

memoFolderRouter.post(
  '/image-format/folders/not-tsoa',
  imageUploader.single('image'),
  handlerMemoFolderImageCreate,
);
memoFolderRouter.post(
  '/image-format/folders/:folderId/not-tsoa',
  imageUploader.single('image'),
  handlerMemoImageAdd,
);

memoFolderRouter.get('/list/not-tsoa', handlerMemoFolderList);
memoFolderRouter.get('/search/not-tsoa', handlerMemoSearch);

memoFolderRouter.patch(
  '/folders/:folderId/images/move/not-tsoa',
  handlerMemoImageMove,
);
memoFolderRouter.patch(
  '/folders/:folderId/text/not-tsoa',
  handlerMemoTextUpdate,
);
memoFolderRouter.post(
  '/folders/:folderId/images/delete/not-tsoa',
  handlerMemoImageDelete,
);

memoFolderRouter.delete('/folders/:folderId/not-tsoa', handlerMemoFolderDelete);

// OCR 요청 처리 추가
memoFolderRouter.post('/text-format/folders', createFolderOCR); // 새 폴더의 OCR 처리
memoFolderRouter.patch('/text-format/folders/:folderId', updateFolderOCR); // 기존 폴더의 OCR 처리
