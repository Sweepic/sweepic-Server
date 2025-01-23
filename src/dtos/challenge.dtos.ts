import { Challenge, LocationChallenge, DateChallenge } from '@prisma/client';
import { BodyToLocationCreation, BodyToWeeklyCreation, PhotoInfo } from '../models/challenge.entities.js';

export const responseFromLocationChallenge = ({
    location,
    challenge
}: {
    location: LocationChallenge;
    challenge: Challenge;
}) => {
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
}) => {
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
    }
};

export const responseFromChallenge = (challenge: Challenge) => {
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

export const bodyToLocationLogic = (photo: PhotoInfo[]) => {
    return photo;
};

export const bodyToLocationCreation = (data: BodyToLocationCreation) => {
    const {userId, title, context, location, required} = data;
    
    return {
        userId: BigInt(userId),
        title,
        context,
        location,
        required
    };
};

export const bodyToWeeklyCreation = (data: BodyToWeeklyCreation) => {
    const {userId, title, context, challengeDate, required} = data;

    return {
        userId: BigInt(userId),
        title,
        context,
        challengeDate,
        required
    }
}