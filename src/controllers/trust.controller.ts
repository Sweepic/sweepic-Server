import {Request, Response} from 'express';
import * as trustService from '../services/trust.service.js';
import {SearchNoResultsError,ServerError,DataValidationError} from 'src/errors.js';
import {StatusCodes} from 'http-status-codes';

export const handleImageStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const {mediaId} = req.body;
        const parsedMediaId = parseInt(mediaId);
        if (isNaN(parsedMediaId)) {
            throw new SearchNoResultsError({searchKeyword: 'mediaId가 올바르지 않습니다'});
                }
        const updatedImage = await trustService.deactivateImages(mediaId);
        const result = {
            mediaId: updatedImage.mediaId,
            status: updatedImage.status
        };
        res.status(StatusCodes.OK).success(result);
    } catch (error) {
        throw new ServerError();
    }
};

export const handleImageRestore = async (req: Request, res: Response): Promise<void> => {
    try {
        const {mediaIds} = req.body;
        if (!Array.isArray(mediaIds)) {
            throw new SearchNoResultsError({searchKeyword: 'mediaIds가 올바르지 않습니다'});
        }
        const restoredImages = await trustService.restoreImages(mediaIds);
        const result = restoredImages.map(image => ({
            mediaId: image.mediaId,
            status: image.status
        }));
        res.status(StatusCodes.OK).success(result);
    } catch (error) {
        throw new ServerError();
    }
};

export const handleImageDelete = async (req: Request, res: Response): Promise<void> => {
    try {
        const { mediaIds } = req.body;
        if (!Array.isArray(mediaIds)) {
            throw new SearchNoResultsError({searchKeyword: 'mediaIds가 올바르지 않습니다'});
        }
        const deleteable = await trustService.deleteImages(mediaIds);
        if(!deleteable) {
            throw new DataValidationError({reason: '해당 사진이 휴지통에 존재하지 않습니다'});
        }
        res.status(StatusCodes.OK).success(deleteable);
    } catch (error) {
        throw new ServerError();
    }
};