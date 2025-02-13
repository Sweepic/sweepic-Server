import {Request, Response, NextFunction} from 'express';
import {imageUploader} from './image.uploader.js';
import {getMemoFolder} from 'src/repositories/memo-folder.repository.tsoa.js';
import {DataValidationError, FolderNotFoundError} from 'src/errors.js';
export const ImageUploadMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = BigInt(req.user!.id);
  if (req.params === null) {
    return next(
      new DataValidationError({reason: 'folderId가 유효하지 않습니다.'}),
    );
  }
  try {
    const folderId = req.params.folderId;
    const checkFolder = await getMemoFolder(BigInt(folderId));

    if (!checkFolder || checkFolder.userId !== userId) {
      return next(new FolderNotFoundError({folderId: BigInt(folderId)}));
    }
    const uploadDirectory = folderId;
    req.uploadDirectory = BigInt(uploadDirectory);
  } catch (error) {
    return next(error);
  }
  imageUploader.single('image')(req, res, err => {
    if (err) {
      next(err);
    }
    next();
  });
};
