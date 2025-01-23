import express from 'express';
export const memoFolderRouter = express.Router();
import { handlerMemoFolderAdd, handlerMemoFolderImageCreate, handlerMemoFolderList, handlerMemoSearch, handlerMemoTextImageList } from '../controllers/memo-folder.controller.js';
import { imageUploader } from '../s3/image.uploader.js';
import { handlerMemoImageAdd } from '../controllers/memo-image.controller.js';

memoFolderRouter.post('/folders', handlerMemoFolderAdd);
memoFolderRouter.post('/image-format/folders', imageUploader.single('image'), handlerMemoFolderImageCreate);
memoFolderRouter.post('/image-format/folders/:folderId', imageUploader.single('image'), handlerMemoImageAdd);
memoFolderRouter.get('/list', handlerMemoFolderList);
memoFolderRouter.get('/search', handlerMemoSearch);
memoFolderRouter.get('/folders/:folderId', handlerMemoTextImageList);