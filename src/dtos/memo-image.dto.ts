import { BodyToMemoImage, MemoImageRequestDto } from '../models/memo-image.model.js';

export const bodyToMemoImage = ({url}: BodyToMemoImage) : MemoImageRequestDto => {
    return {
        url
    };
};
