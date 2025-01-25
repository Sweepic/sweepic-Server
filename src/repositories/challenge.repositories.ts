import { prisma } from '../db.config.js';
import { ChallengeModify, LocationChallengeCreation } from '../models/challenge.entities.js';
import { Challenge, LocationChallenge } from '@prisma/client';

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

export const updateLocationChallenge = async (data: ChallengeModify): Promise<Challenge> => {
    const updated = await prisma.challenge.update({
        where: { id: data.id },
        data: {
            requiredCount: data.required,
            remainingCount: data.remaining
        }
    });

    return updated;
};

export const deleteLocationChallenge = async (data: bigint): Promise<bigint> => {
    const deleted = await prisma.challenge.delete({
        where: {id: data}
    });

    return deleted.id;
};

export const getChallenge = async (data: bigint): Promise<Challenge | null> => {
    const idBigNum = data;
    const userChallenge = await prisma.challenge.findFirst({
        where: {id: idBigNum}
    });

    return userChallenge;
};

export const getLocation = async (data: bigint): Promise<LocationChallenge | null> => {
    const idBigNum = data;
    const challengeLocation = await prisma.locationChallenge.findFirst({
        where: {challengeId: idBigNum}
    });

    return challengeLocation;
};