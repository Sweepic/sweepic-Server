import { ResponseFromMostTag } from '../models/history.model.js';
import {prisma} from '../db.config.js';
import { AwardImageError, DuplicateAwardError, NoDataFoundError } from '../errors.js';
import { Award, AwardImage } from '@prisma/client';

export const getMostTagged = async (userId: bigint): Promise<ResponseFromMostTag[]> => {
    const currentTime: Date = new Date();
    const currentMonth: Date = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1);  //이번 달의 시작
    const nextMonth: Date = new Date(currentTime.getFullYear() + (
        currentTime.getMonth() === 1 
        ? 1 
        : 0
    ),(currentTime.getMonth() + 1) % 12, 1); //다음 달의 시작. 12월이면 하나 올리기

    const userImages = await prisma.image.findMany({
        where: {
            AND: [
                {userId: userId},
                {updatedAt: {
                    lt: nextMonth,
                    gte: currentMonth
                }}
            ]
        },
        select: {
            id: true
        }
    });

    //console.log(userImages);

    if(!userImages){
        throw new NoDataFoundError({reason: `유저 ${userId}의 이번 달 사진이 없습니다.`});
    }

    const imageTags = await prisma.imageTag.findMany({
        where: {
            imageId: {
                in: userImages.map((value: {id: bigint;}) => value.id)
            }
        },
        select: {
            tagId: true
        }
    });

    //console.log(imageTags);

    const countTagCategory = await prisma.tag.groupBy({
        by: ['tagCategoryId', 'content'],
        orderBy:{
            tagCategoryId: 'asc'
        },
        where: {
            id: {
                in: imageTags.map((value: {tagId: bigint;}) => value.tagId)
            },
            tagCategoryId: {
                lte: 3
            }
        },
        _count: {
            _all: true
        }
    });

    //console.log(countTagCategory);

    return countTagCategory;
};

export const newUserAward = async (id: bigint): Promise<Award | null> => {
    const currentDate: Date = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(1);
    currentDate.setHours(0, 0, 0, 0);

    const isAwardExist = await prisma.award.findFirst({
        where: {
            userId: id,
            awardMonth: currentDate
        }
    });

    if(isAwardExist){
        throw new DuplicateAwardError({reason: `${id} 유저의 ${currentDate.getMonth()}월의 어워드가 존재합니다.`});
    }

    const newAward = prisma.award.create({
        data: {
            userId: id,
            awardMonth: currentDate
        }
    });

    return newAward;
};

export const updateAwardImage = async (userId: bigint, awardId: bigint, imageId: bigint[]): Promise<AwardImage[]> => {
    if(imageId.length !== 5){
        throw new AwardImageError({reason: `${imageId.length}는 올바른 이미지 개수가 아닙니다. 
            총 5개의 이미지가 필요합니다.`});
    }
    
    const verifyImages = await prisma.image.findMany({
        where: {
            userId: userId,
            mediaId: {
                in: imageId
            }
        }
    });

    if(verifyImages === null || verifyImages.length === 0){
        throw new NoDataFoundError({reason: `${userId} 유저의 ${imageId} 이미지를 찾을 수 없습니다.`});
    }

    await prisma.awardImage.deleteMany({
        where: {
            awardId: awardId
        }
    });

    for(let i = 0; i < verifyImages.length; i++){
        await prisma.awardImage.create({
            data: {
                imageId: verifyImages[i].id,
                awardId: awardId
            }
        });
    }

    const result = await prisma.awardImage.findMany({
        where: {
            awardId: awardId
        }
    });

    return result;
};

export const getUserAwards = async (userId: bigint): Promise<Award[]> => {
    const userAwards: Award[] = await prisma.award.findMany({
        where: {
            userId: userId
        }
    });

    return userAwards;
};