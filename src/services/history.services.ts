import { Award } from '@prisma/client';
import { responseFromMostTag, responseFromNewAward } from 'src/dtos/history.dto.js';
import { DuplicateAwardError, NoDataFoundError } from 'src/errors.js';
import { ResponseFromMostTag, ResponseFromMostTagToClient, ResponseFromNewAward } from 'src/models/history.model.js';
import { getMostTagged, newUserAward } from 'src/repositories/history.repositories.js';


export const serviceGetMostTagged = async (userId: bigint): Promise<ResponseFromMostTagToClient[]> => {
    const result: ResponseFromMostTag[] = await getMostTagged(userId);

    if(result === null || result.length === 0){
        throw new NoDataFoundError({reason: `유저 ${userId}의 태그를 찾을 수 없습니다.`});
    }

    result.sort((a: ResponseFromMostTag, b: ResponseFromMostTag) =>
        parseInt((a.tagCategoryId - b.tagCategoryId).toString()) || 
    b._count._all - a._count._all);

    //console.log(result);

    let category: bigint = 1n;
    const sortedResult: ResponseFromMostTag[] = result.filter((a: ResponseFromMostTag) => {
        if(a.tagCategoryId === category){
            category++;
            return true;
        }
        
        return false;
    });

    //console.log(sortedResult);

    return responseFromMostTag(sortedResult);
};

export const serviceNewAward = async (id: bigint): Promise<ResponseFromNewAward> => {
    const newAward: Award | null = await newUserAward(id);

    if(newAward === null){
        throw new DuplicateAwardError({reason: `${id} 유저의 이번 달 어워드가 존재합니다.`});
    }

    return responseFromNewAward(newAward);
};