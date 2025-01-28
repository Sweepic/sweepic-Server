import { Challenge } from '@prisma/client';
import { responseFromChallenge, responseFromGetByUserId } from '../dtos/challenge.dtos.js';
import { ChallengeModify, ResponseFromGetByUserId, ResponseFromGetByUserIdReform, ResponseFromUpdateChallenge } from '../models/challenge.entities.js';
import { updateChallenge, deleteChallenge, acceptChallenge, getChallengeByUserId, completeChallenge } from '../repositories/challenge.repositories.js';
import { ChallengeUpdateError, ChallengeDeletionError, ChallengeAcceptError, ChallengeCompleteError, ChallengeNotFoundError } from '../errors.js';

export const serviceUpdateChallenge = async (data: ChallengeModify): Promise<ResponseFromUpdateChallenge> => {
  try{
    const updatedChallenge: Challenge | null = await updateChallenge(data);

    if (updatedChallenge === null) {
      throw new ChallengeUpdateError({challengeId: data.id});
    }

    console.log(
      `Updated challenge ${updatedChallenge.id}: requiredCount=${updatedChallenge.requiredCount}, remainingCount=${updatedChallenge.remainingCount}`,
    );

    return responseFromChallenge(updatedChallenge);
  } catch (error) {
    console.error('Error updating challenge:', error);
    throw error;
  }
};

export const serviceDeleteChallenge = async (
  data: bigint,
): Promise<void> => {
    try {
        const deletedChallengeId: bigint | null =
          await deleteChallenge(data);
    
        if (deletedChallengeId === null) {
          throw new ChallengeDeletionError({challengeId: data});
        }
    
        console.log('Deleted challenge with ID:', deletedChallengeId);
    } catch (error) {
        console.error('Error deleting challenge:', error);
        throw error;
    }
};

export const serviceAcceptChallenge = async (data: bigint): Promise<Challenge> => {
    try{
        const accepted: Challenge | null = await acceptChallenge(data);

        if(!accepted){
            throw new ChallengeAcceptError({challengeId: data, reason: '챌린지를 수락할 수 없습니다.'});
        }

        return accepted;
    } catch(error){
        console.error('Error accepting challenge:', error);
        throw error;
    }
};

export const serviceCompleteChallenge = async (data: bigint): Promise<Challenge> => {
    try{
        const completed: Challenge | null = await completeChallenge(data);

        if(!completed){
            throw new ChallengeCompleteError({challengeId: data, reason: '해당 챌린지를 완료할 수 없습니다.'});
        }

        return completed;
    } catch(error){
        console.error('Error completing challenge:', error);
        throw error;
    }
};

export const serviceGetByUserId = async (data: bigint): Promise<ResponseFromGetByUserIdReform[]> => {
    try{
        const challenges: ResponseFromGetByUserId[] = await getChallengeByUserId(data);

        if(challenges.length === 0){
            throw new ChallengeNotFoundError({userId: data});
        }

        return responseFromGetByUserId(challenges);
    } catch (error){
        console.error('Error getting user challenges:', error);
        throw error;
    }
};