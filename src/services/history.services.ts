import { Award, AwardImage } from '@prisma/client';
import { responseFromGetAward, responseFromMostTag, responseFromNewAward, responseFromUpdateAward } from '../dtos/history.dto.js';
import { AwardUpdateError, DuplicateAwardError, NoDataFoundError } from '../errors.js';
import { ResponseFromMostTag, ResponseFromMostTagToClient, ResponseFromAward } from '../models/history.model.js';
import { getMostTagged, getUserAwards, newUserAward, updateAwardImage } from '../repositories/history.repositories.js';


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

export const serviceNewAward = async (id: bigint): Promise<ResponseFromAward> => {
    const newAward: Award | null = await newUserAward(id);

    if(newAward === null){
        throw new DuplicateAwardError({reason: `${id} 유저의 이번 달 어워드가 존재합니다.`});
    }

    return responseFromNewAward(newAward);
};

export const serviceUpdateAward = async (userId: bigint, awardId: bigint, mediaId: bigint[]) => {
    const updatedAwardImages: AwardImage[] | null = await updateAwardImage(userId, awardId, mediaId);

    if(updatedAwardImages === null || updatedAwardImages.length === 0){
        throw new AwardUpdateError({reason: `${mediaId} 사진들을 업데이트할 수 없습니다.`});
    }

    return responseFromUpdateAward(updatedAwardImages);
};

export const serviceGetAward = async (userId: bigint): Promise<ResponseFromAward[]> => {
    const result: Award[] | null = await getUserAwards(userId);

    if(result === null || result.length === 0){
        throw new NoDataFoundError({reason: `${userId} 유저의 어워드가 존재하지 않습니다.`});
    }

    return responseFromGetAward(result);
};