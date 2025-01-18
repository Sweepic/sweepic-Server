import { BodyToMemoImage } from '../models/memo-image.model.js';

export const bodyToMemoImage = (body: BodyToMemoImage) => {
    return {
        url: body.url
    };
};
