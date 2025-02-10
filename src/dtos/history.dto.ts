import { Award, AwardImage } from '@prisma/client';
import { ResponseFromMostTag, ResponseFromMostTagToClient, ResponseFromAward, ResponseFromUpdateAward } from '../models/history.model.js';

export const responseFromMostTag = (
    arr: ResponseFromMostTag[]
): ResponseFromMostTagToClient[] => {
    return arr.map((value: ResponseFromMostTag) => {
        const {_count, tagCategoryId, content} = value;
        
        return{
            _count,
            tagCategoryId: tagCategoryId.toString(),
            content
        };
    });
};

export const responseFromNewAward = (
    newAward: Award
): ResponseFromAward => {
    const {id, awardMonth, createdAt, updatedAt, status, userId} = newAward;

    return {
        id: id.toString(),
        awardMonth,
        createdAt,
        updatedAt,
        status,
        userId: userId.toString()
    };
};

export const responseFromUpdateAward = (
    images: AwardImage[]
): ResponseFromUpdateAward[] => {
    return images.map((value: AwardImage) => {
        const {imageId, createdAt, updatedAt, status, awardId} = value;

        return {
            imageId: imageId.toString(),
            createdAt,
            updatedAt,
            status,
            awardId: awardId.toString()
        };
    });
};

export const bodyToUpdateAward = (
    ids: string[]
): bigint[] => {
    return ids.map((value: string) => {
        return BigInt(value);
    });
};

export const responseFromGetAward = (
    awards: Award[]
): ResponseFromAward[] => {
    return awards.map((value: Award) => {
        const {id, userId, awardMonth, createdAt, updatedAt, status} = value;

        return {
            id: id.toString(),
            userId: userId.toString(),
            awardMonth,
            createdAt,
            updatedAt,
            status
        };
    });
};