import {Request, Response, NextFunction} from 'express';
import {imageUploader} from './image.uploader.js';
// import {PhotoValidationError} from '../errors.js';

export const ImageUploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  imageUploader.single('image')(req, res, err => {
    if (err) {
      next(err);
    }
    next();
  });
};
