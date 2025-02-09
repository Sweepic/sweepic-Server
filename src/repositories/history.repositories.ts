import { ResponseFromMostTag } from 'src/models/history.model.js';
import {prisma} from '../db.config.js';
import { DuplicateAwardError, NoDataFoundError } from 'src/errors.js';
import { Award } from '@prisma/client';

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

export const newUserAward = async(id: bigint): Promise<Award | null> => {
    const currentDate: Date = new Date();
    //console.log(currentDate);
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(1);
    currentDate.setHours(0, 0, 0, 0);
    //console.log(currentDate);

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