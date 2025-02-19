import { Challenge, LocationChallenge, DateChallenge } from '@prisma/client';
import { BodyToLocationCreation, BodyToWeeklyCreation, PhotoInfo, ResponseFromChallenge, ResponseFromGetByUserId, ResponseFromGetByUserIdReform, ResponseFromLocationChallenge, ResponseFromWeeklyChallenge } from '../models/challenge.entities.js';

export const responseFromLocationChallenge = ({
    location,
    challenge
}: {
    location: LocationChallenge;
    challenge: Challenge;
}): ResponseFromLocationChallenge => {
    const {id, title, context, requiredCount, remainingCount,
        userId, createdAt, updatedAt, acceptedAt, completedAt, status
    } = challenge;

    const {challengeLocation} = location;
    return {
        id: id.toString(), //json에서 bigint 처리 불가능하여 string으로 처리합니다.
        title,
        context,
        location: challengeLocation,
        requiredCount,
        remainingCount,
        userId: userId.toString(),
        createdAt,
        updatedAt,
        acceptedAt,
        completedAt,
        status
    };
};

export const responseFromWeeklyChallenge = ({
    weekly,
    challenge
}: {
    weekly: DateChallenge;
    challenge: Challenge
}): ResponseFromWeeklyChallenge => {
    const {id, title, context, requiredCount, remainingCount,
        userId, createdAt, updatedAt, acceptedAt, completedAt, status
    } = challenge;

    const {challengeDate} = weekly;

    return{
        id: id.toString(),
        title,
        context,
        challengeDate,
        requiredCount,
        remainingCount,
        userId: userId.toString(),
        createdAt,
        updatedAt,
        acceptedAt,
        completedAt,
        status
    };
};

export const responseFromChallenge = (challenge: Challenge): ResponseFromChallenge => {
    const {id, title, context, requiredCount, remainingCount, userId,
        createdAt, updatedAt, acceptedAt, completedAt, status
    } = challenge;

    return {
        id: id.toString(),
        title,
        context,
        requiredCount,
        remainingCount,
        userId: userId.toString(),
        createdAt,
        updatedAt,
        acceptedAt,
        completedAt,
        status
    };
};

export const responseFromGetByUserId = (
    challenges: ResponseFromGetByUserId[]
): ResponseFromGetByUserIdReform[] => {
    return challenges.map((value: ResponseFromGetByUserId) => {
        const {id, title, context, requiredCount, remainingCount, userId,
            createdAt, updatedAt, acceptedAt, completedAt, status, locationChallenge, dateChallenge, images
        } = value;

        const imageList: string[] = images.map((value: {image: {mediaId: bigint}}) => 
            {
                return value.image.mediaId.toString();
            });

        return {
            id: id.toString(),
            title,
            context,
            challengeLocation: locationChallenge?.challengeLocation,
            challengeDate: dateChallenge?.challengeDate,
            images: imageList,
            requiredCount,
            remainingCount,
            userId: userId.toString(),
            createdAt,
            updatedAt,
            acceptedAt,
            completedAt,
            status
        };
    });
};

export const bodyToLocationLogic = (photo: PhotoInfo[]): PhotoInfo[] => {
    return photo;
};

export const bodyToLocationCreation = (data: BodyToLocationCreation, userId: bigint) => {
    const {context, location, required} = data;
    
    return {
        userId: userId,
        context,
        location,
        required
    };
};

export const bodyToWeeklyCreation = (data: BodyToWeeklyCreation, userId: bigint) => {
    const {context, challengeDate, required} = data;

    return {
        userId: userId,
        context,
        challengeDate,
        required
    };
};

export const challengeImageUplaodBody = (imageIdList: {id: bigint}[], challengeId: bigint): {
    imageId: bigint,
    challengeId: bigint
}[] => {
    return imageIdList.map((value: {id: bigint}) => {
        return {
            imageId: value.id,
            challengeId
        };
    });
};