import {
  BodyToMemoImage,
  BodyToMemoImagesToDelete,
  BodyToMemoImagesToMove,
  MemoImageRequestDto,
} from '../models/memo-image.model.tsoa.js';

export const bodyToMemoImage = ({
  url,
}: BodyToMemoImage): MemoImageRequestDto => {
  return {
    url,
  };
};

export const bodyToMemoImagesToMove = ({
  targetFolderId,
  imageId,
}: BodyToMemoImagesToMove): BodyToMemoImagesToMove => {
  return {
    targetFolderId,
    imageId,
  };
};

export const bodyToMemoImagesToDelete = ({
  imageId,
}: BodyToMemoImagesToDelete): BodyToMemoImagesToDelete => {
  return {
    imageId,
  };
};
