import express from 'express';
export const memoFolderRouter = express.Router();
import expressAsyncHandler from 'express-async-handler';
import { handlerMemoFolderAdd, handlerMemoFolderImageCreate } from '../controllers/memo-folder.controller.js';
import { imageUploader } from '../s3/image.uploader.js';
import { handlerMemoImageAdd } from '../controllers/memo-image.controller.js';

memoFolderRouter.post('/folders', expressAsyncHandler(handlerMemoFolderAdd));
memoFolderRouter.post('/image-format/folders', imageUploader.single('image'), expressAsyncHandler(handlerMemoFolderImageCreate));
memoFolderRouter.post('/image-format/folders/:folderId', imageUploader.single('image'), expressAsyncHandler(handlerMemoImageAdd));