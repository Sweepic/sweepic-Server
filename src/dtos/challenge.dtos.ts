import { Challenge, LocationChallenge } from '@prisma/client';
import { BodyToLocationCreation, PhotoInfo } from '../models/challenge.entities.js';

export const locationChallengeToClient = ({
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

export const responseFromChallenge = (challenge: Challenge) => {
    const {id, title, context, requiredCount, remainingCount, userId,
        createdAt, updatedAt, acceptedAt, completedAt, status
    } = challenge;

    const idString: string = challenge.id.toString();
    const userIdString: string = challenge.userId.toString();

    return {
        id: idString,
        title,
        context,
        requiredCount,
        remainingCount,
        userId: userIdString,
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
    const userIdNum: bigint = BigInt(userId);
    return {
        userId: userIdNum,
        title,
        context,
        location,
        required
    };
};