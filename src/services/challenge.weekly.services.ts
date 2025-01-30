import { Challenge, DateChallenge } from '@prisma/client';
import { ResponseFromChallenge, WeeklyChallengeCreation } from '../models/challenge.entities.js';
import { getWeekly, newWeeklyChallenge } from '../repositories/weekly.repositories.js';
import { responseFromChallenge, responseFromWeeklyChallenge } from '../dtos/challenge.dtos.js';
import { getChallenge } from '../repositories/challenge.repositories.js';
import { DateChallengeCreationError, DateChallengeNotFoundError } from '../errors.js';

export const serviceCreateNewWeeklyChallenge = async(data: WeeklyChallengeCreation): Promise<ResponseFromChallenge> => {
    try{
        const newChallenge: Challenge | null = await newWeeklyChallenge(data);
        if(newChallenge === null){
            throw new DateChallengeCreationError({reason: '이미 존재하는 챌린지입니다.'});
        }

        return responseFromChallenge(newChallenge);
    } catch(error){
        console.error('Error creating date challenge:', error);
        throw error;
    }
};

export const serviceGetWeeklyChallenge = async(data: bigint) => {
    try{
        const challenge: Challenge | null = await getChallenge(data);
        const weekly: DateChallenge | null = await getWeekly(data);

        if(challenge === null || weekly === null){
            throw new DateChallengeNotFoundError({challengeId: data});
        }

        return responseFromWeeklyChallenge({weekly, challenge});
    } catch(error){
        console.error('Error getting date challenge:', error);
        throw error;
    }
};