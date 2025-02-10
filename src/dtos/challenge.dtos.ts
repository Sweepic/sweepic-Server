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
            createdAt, updatedAt, acceptedAt, completedAt, status, locationChallenge, dateChallenge
        } = value;

        return {
            id: id.toString(),
            title,
            context,
            challengeLocation: locationChallenge?.challengeLocation,
            challengeDate: dateChallenge?.challengeDate,
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
    const {title, context, location, required} = data;
    
    return {
        userId: userId,
        title,
        context,
        location,
        required
    };
};

export const bodyToWeeklyCreation = (data: BodyToWeeklyCreation, userId: bigint) => {
    const {title, context, challengeDate, required} = data;

    return {
        userId: userId,
        title,
        context,
        challengeDate,
        required
    };
};