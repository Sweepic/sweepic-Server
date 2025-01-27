import { Challenge } from '@prisma/client';
import { responseFromChallenge } from '../dtos/challenge.dtos.js';
import { ChallengeModify, ResponseFromUpdateChallenge } from '../models/challenge.entities.js';
import { updateChallenge, deleteChallenge } from '../repositories/challenge.repositories.js';

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

