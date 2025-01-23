import {BodyToImage, ResponseFromImage} from '../models/image.model.js';

export function bodyToImage(image: BodyToImage): BodyToImage {
  const {mediaId, userId} = image;
  return {
    mediaId,
    userId,
  };
}

export function responseFromImage(image: ResponseFromImage): ResponseFromImage {
  const {id, mediaId, userId, createdAt, updatedAt, status} = image;
  return {
    id,
    mediaId,
    userId,
    createdAt,
    updatedAt,
    status,
  };
}
