import { Award } from '@prisma/client';
import { ResponseFromMostTag, ResponseFromMostTagToClient, ResponseFromNewAward } from 'src/models/history.model.js';

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
): ResponseFromNewAward => {
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