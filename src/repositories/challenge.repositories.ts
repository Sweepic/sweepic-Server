import { prisma } from '../db.config.js';
import { ChallengeModify, LocationChallengeCreation } from '../models/challenge.entities.js';

export const newLocationChallenge = async (data: LocationChallengeCreation) => {
    const existingChallenge = await prisma.challenge.findFirst({
        where: {
            userId: data.userId,
            title: data.title
        }
    });

    if(existingChallenge){
        console.log('Already Exists');
        return;
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

export const updateLocationChallenge = async (data: ChallengeModify) => {
    const updated = await prisma.challenge.update({
        where: { id: data.id },
        data: {
            requiredCount: data.required,
            remainingCount: data.remaining
        }
    });

    return updated;
};

export const deleteLocationChallenge = async (data: bigint) => {
    const deleted = await prisma.challenge.delete({
        where: {id: data}
    });

    return deleted.id;
};

export const getChallenge = async (data: bigint) => {
    const idBigNum = data;
    const userChallenge = await prisma.challenge.findFirst({
        where: {id: idBigNum}
    });

    return userChallenge;
};

export const getLocation = async (data: bigint) => {
    const idBigNum = data;
    const challengeLocation = await prisma.locationChallenge.findFirst({
        where: {challengeId: idBigNum}
    });

    return challengeLocation;
};