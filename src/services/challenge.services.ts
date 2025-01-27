import { Challenge } from '@prisma/client';
import { responseFromChallenge, responseFromGetByUserId } from '../dtos/challenge.dtos.js';
import { ChallengeModify, ResponseFromGetByUserId, ResponseFromGetByUserIdReform, ResponseFromUpdateChallenge } from '../models/challenge.entities.js';
import { updateChallenge, deleteChallenge, updateStatus, getChallengeByUserId } from '../repositories/challenge.repositories.js';

export const serviceUpdateChallenge = async (data: ChallengeModify): Promise<ResponseFromUpdateChallenge> => {
    const update: Challenge = await updateChallenge(data);

    if(update === null){
        throw new Error(`Update Error: No challenge ${data.id}`);
    }

    console.log(`Updated ${update.id} challenge ${update.requiredCount}, ${update.remainingCount}`);

    return responseFromChallenge(update);
};

export const serviceDeleteChallenge = async (data: bigint): Promise<void> => {
    const deleted: bigint = await deleteChallenge(data);

    if(deleted === null){
        throw new Error(`Delete Error: No challenge ${data}`);
    }

    console.log('Deleted Challenge: ' + deleted);
};

export const serviceAcceptChallenge = async (data: bigint): Promise<Challenge> => {
    const accepted: Challenge | null = await updateStatus(data, 2);

    if(!accepted){
        throw new Error(`Could not accept challenge. Wrong ID number: ${data}.`);
    }

    return accepted;
};

export const serviceCompleteChallenge = async (data: bigint): Promise<Challenge> => {
    const completed: Challenge | null = await updateStatus(data, 3);

    if(!completed){
        throw new Error(`Could not complete challenge. Wrong ID number: ${data}.`);
    }

    return completed;
};

export const serviceGetByUserId = async (data: bigint): Promise<ResponseFromGetByUserIdReform[]> => {
    const challenges: ResponseFromGetByUserId[] = await getChallengeByUserId(data);

    if(challenges.length === 0){
        throw new Error(`Could not find challenges of user ${data}`);
    }

    return responseFromGetByUserId(challenges);
};