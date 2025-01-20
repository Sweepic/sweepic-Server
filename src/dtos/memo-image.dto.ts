import { BodyToMemoImage } from '../models/memo-image.model.js';

export const bodyToMemoImage = ({url}: BodyToMemoImage) => {
    return {
        url
    };
};
