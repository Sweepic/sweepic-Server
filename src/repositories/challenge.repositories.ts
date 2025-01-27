import { prisma } from '../db.config.js';
import { ChallengeAcceptError, ChallengeCompleteError, ChallengeNotFoundError } from '../errors.js';
import { ChallengeModify, LocationChallengeCreation, ResponseFromGetByUserId } from '../models/challenge.entities.js';
import { Challenge, DateChallenge, LocationChallenge } from '@prisma/client';

export const newLocationChallenge = async (data: LocationChallengeCreation): Promise<Challenge | null> => {
    const existingChallenge = await prisma.challenge.findFirst({
        where: {
            userId: data.userId,
            title: data.title
        }
    });

    if(existingChallenge){
        console.log('Already Exists');
        return null;
    }

    const newChal = await prisma.challenge.create({
        data: {
            userId: data.userId,
            title: data.title,
            context: data.context,
            requiredCount: data.required,
            remainingCount: data.required
        }
    });

    const newId = newChal.id;

    await prisma.locationChallenge.create({
        data: {
            challengeId: newId,
            challengeLocation: data.location
        }
    });

    console.log(newChal);
    return newChal;
};

export const updateChallenge = async (data: ChallengeModify): Promise<Challenge> => {
    const updated = await prisma.challenge.update({
        where: { id: data.id },
        data: {
            requiredCount: data.required,
            remainingCount: data.remaining
        }
    });

    return updated;
};

export const deleteChallenge = async (data: bigint): Promise<bigint> => {
    const deleted = await prisma.challenge.delete({
        where: {id: data}
    });

    return deleted.id;
};

export const getChallenge = async (data: bigint): Promise<Challenge | null> => {
    const userChallenge = await prisma.challenge.findFirst({
        where: {id: data}
    });

    return userChallenge;
};

export const getLocation = async (data: bigint): Promise<LocationChallenge | null> => {
    const challengeLocation = await prisma.locationChallenge.findFirst({
        where: {challengeId: data}
    });

    return challengeLocation;
};

export const acceptChallenge = async (data: bigint): Promise<Challenge | null> => {
    const state: {status: number} | null = await prisma.challenge.findFirst({
        where: {id: data},
        select: {
            status: true
        }
    });

    if(!state){
        throw new ChallengeAcceptError({challengeId: data, reason: '챌린지가 존재하지 않습니다.'});
    }

    if(state.status === 2 || state.status === 3){
        throw new ChallengeAcceptError({challengeId: data, reason: '챌린지가 이미 수락되거나 완료되었습니다.'});
    } 

    const updatedChallenge = await prisma.challenge.update({
        where: {id: data},
        data: {
            status: 2,
            acceptedAt: new Date()
        }  //status: 1 = created, 2 = accepted, 3 = completed
    });

    return updatedChallenge;
};

export const completeChallenge = async (data: bigint): Promise<Challenge | null> => {
    const state: {status: number} | null = await prisma.challenge.findFirst({
        where: {id: data},
        select: {
            status: true
        }
    });

    if(!state){
        throw new ChallengeCompleteError({challengeId: data, reason: '챌린지가 존재하지 않습니다.'});
    }

    if(state.status !== 2){
        throw new ChallengeCompleteError({challengeId: data, reason: '챌린지가 수락되지 않았습니다.'});
    } 

    const updatedChallenge = await prisma.challenge.update({
        where: {id: data},
        data: {
            status: 3,
            completedAt: new Date()
        }  //status: 1 = created, 2 = accepted, 3 = completed
    });

    return updatedChallenge;
};

export const getChallengeByUserId = async (data: bigint): Promise<ResponseFromGetByUserId[]> => {
    const challenges = await prisma.challenge.findMany({
        where: {userId: data},
        include: {
            locationChallenge: {
                select: {
                    challengeLocation: true
                }
            },
            dateChallenge: {
                select: {
                    challengeDate: true
                }
            }
        }
    });

    return challenges;
};