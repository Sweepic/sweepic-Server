import { Challenge, LocationChallenge } from '@prisma/client';
import { PhotoInfo } from '../models/challenge.entities.js';

export const locationChallengeToClient = ({
    location,
    challenge
}: {
    location: LocationChallenge;
    challenge: Challenge;
}) => {
    const id: string = challenge.id.toString();   //json에서 bigint 처리 불가하여 string으로 반환합니다.
    const userId: string = challenge.userId.toString();
    return {
        id: id,
        title: challenge.title,
        context: challenge.context,
        location: location.challengeLocation,
        requiredCount: challenge.requiredCount,
        remainingCount: challenge.remainingCount,
        userId: userId,
        createdAt: challenge.createdAt,
        updatedAt: challenge.updatedAt,
        acceptedAt: challenge.acceptedAt,
        completedAt: challenge.completedAt,
        status: challenge.status
    };
};

export const responseFromChallenge = (challenge: Challenge) => {
    const id: string = challenge.id.toString();
    const userId: string = challenge.userId.toString();
    return {
        id: id,
        title: challenge.title,
        context: challenge.context,
        requiredCount: challenge.requiredCount,
        remainingCount: challenge.remainingCount,
        userId: userId,
        createdAt: challenge.createdAt,
        updatedAt: challenge.updatedAt,
        acceptedAt: challenge.acceptedAt,
        completedAt: challenge.completedAt,
        status: challenge.status
    };
};

export const bodyToLocationLogic = (photo: PhotoInfo[]) => {
    return photo;
};