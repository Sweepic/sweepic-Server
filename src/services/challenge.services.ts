import {Challenge} from '@prisma/client';
import {
  responseFromChallenge,
  responseFromGetByUserId,
} from '../dtos/challenge.dtos.js';
import {
  ChallengeModify,
  ResponseFromChallenge,
  ResponseFromGetByUserId,
  ResponseFromGetByUserIdReform,
  ResponseFromUpdateChallenge,
} from '../models/challenge.entities.js';
import {
  updateChallenge,
  deleteChallenge,
  acceptChallenge,
  getChallengeByUserId,
  completeChallenge,
} from '../repositories/challenge.repositories.js';
import {
  ChallengeUpdateError,
  ChallengeDeletionError,
  ChallengeAcceptError,
  ChallengeCompleteError,
  ChallengeNotFoundError,
} from '../errors.js';

export const serviceUpdateChallenge = async (
  data: ChallengeModify,
): Promise<ResponseFromUpdateChallenge> => {
  try {
    const updatedChallenge: Challenge | null = await updateChallenge(data);

    if (updatedChallenge === null) {
      throw new ChallengeUpdateError({challengeId: BigInt(data.id)});
    }

    return responseFromChallenge(updatedChallenge);
  } catch (error) {
    throw error;
  }
};

export const serviceDeleteChallenge = async (data: bigint): Promise<void> => {
  try {
    const deletedChallengeId: bigint | null = await deleteChallenge(data);

    if (deletedChallengeId === null) {
      throw new ChallengeDeletionError({challengeId: data});
    }
  } catch (error) {
    throw error;
  }
};

export const serviceAcceptChallenge = async (
  data: bigint,
): Promise<ResponseFromChallenge> => {
  try {
    const accepted: Challenge | null = await acceptChallenge(data);

    if (!accepted) {
      throw new ChallengeAcceptError({
        challengeId: data,
        reason: '챌린지를 수락할 수 없습니다.',
      });
    }

    return responseFromChallenge(accepted);
  } catch (error) {
    throw error;
  }
};

export const serviceCompleteChallenge = async (
  data: bigint,
): Promise<ResponseFromChallenge> => {
  try {
    const completed: Challenge | null = await completeChallenge(data);

    if (!completed) {
      throw new ChallengeCompleteError({
        challengeId: data,
        reason: '해당 챌린지를 완료할 수 없습니다.',
      });
    }

    return responseFromChallenge(completed);
  } catch (error) {
    throw error;
  }
};

export const serviceGetByUserId = async (
  data: bigint,
): Promise<ResponseFromGetByUserIdReform[]> => {
  try {
    const challenges: ResponseFromGetByUserId[] =
      await getChallengeByUserId(data);

    if (challenges.length === 0) {
      throw new ChallengeNotFoundError({userId: data});
    }

    return responseFromGetByUserId(challenges);
  } catch (error) {
    throw error;
  }
};
