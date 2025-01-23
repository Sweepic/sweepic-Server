import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';

import {imageStatusUpdate} from '../services/trust.service.js';
import {bodyToImage} from '../dtos/image.dto.js';

async function handleImageStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('handleImageStatus 실행');
  console.log('req.params: ', req.params);
  console.log('req.body: ', req.body);
  const updateImageStatus = await imageStatusUpdate(bodyToImage(req.body));
  res.status(StatusCodes.OK).success(updateImageStatus);
}

// async function handleImageDelete(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> {}

export {handleImageStatus};
