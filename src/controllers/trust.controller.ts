import {Request, Response} from 'express';
import * as trustService from '../services/trust.service.js';
import { SearchNoResultsError,ServerError } from 'src/errors.js';
import { StatusCodes } from 'http-status-codes';

export const handleImageStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const {imageId} = req.body;
        const parsedImageId = parseInt(imageId);
        if (isNaN(parsedImageId)) {
            throw new SearchNoResultsError({searchKeyword: 'impageId가 올바르지 않습니다'});
                }
        await trustService.deactivateImages(imageId);
        res.status(StatusCodes.OK).success(imageId);
    } catch (error) {
        throw new ServerError();
    }
};

export const handleImageRestore = async (req: Request, res: Response): Promise<void> => {
    try {
        const { imageIds } = req.body;
        if (!Array.isArray(imageIds)) {
            throw new SearchNoResultsError({searchKeyword: 'impageId가 올바르지 않습니다'});
        }
        await trustService.restoreImages(imageIds);
        res.status(StatusCodes.OK).success(imageIds);
    } catch (error) {
        throw new ServerError();
    }
};

export const handleImageDelete = async (req: Request, res: Response): Promise<void> => {
    try {
        const { imageIds } = req.body;
        if (!Array.isArray(imageIds)) {
            throw new SearchNoResultsError({searchKeyword: 'impageId가 올바르지 않습니다'});
        }
        const deleteable = await trustService.deleteImages(imageIds);
        if(!deleteable) {
            throw new SearchNoResultsError({searchKeyword: '이미지가 휴지통에 없습니다'});
        }
        res.status(StatusCodes.OK).success(deleteable);
    } catch (error) {
        throw new ServerError();
    }
};