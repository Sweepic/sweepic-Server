import { Challenge, DateChallenge } from '@prisma/client';
import { ResponseFromChallenge, WeeklyChallengeCreation } from '../models/challenge.entities.js';
import { getWeekly, newWeeklyChallenge } from '../repositories/weekly.repositories.js';
import { responseFromChallenge, responseFromWeeklyChallenge } from '../dtos/challenge.dtos.js';
import { getChallenge } from '../repositories/challenge.repositories.js';

export const serviceCreateNewWeeklyChallenge = async(data: WeeklyChallengeCreation): Promise<ResponseFromChallenge> => {
    const newChallenge: Challenge | null = await newWeeklyChallenge(data);
    if(newChallenge === null){
        throw new Error('Existing challenge.');
    }

    return responseFromChallenge(newChallenge);
};

export const serviceGetWeeklyChallenge = async(data: bigint) => {
    const challenge: Challenge | null = await getChallenge(data);
    const weekly: DateChallenge | null = await getWeekly(data);

    if(challenge === null || weekly === null){
        throw new Error(`Could not get Challenge ID ${data}.`);
    }

    return responseFromWeeklyChallenge({weekly, challenge});
};