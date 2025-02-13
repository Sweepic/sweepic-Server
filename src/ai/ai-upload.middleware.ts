import {Request, Response, NextFunction} from 'express';
import upload from './ai-upload.js';

export const uploadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload.single('base64_image')(req, res, err => {
    if (err) {
      next(err);
    } else {
      next();
    }
  });
};
