import { Challenge } from '@prisma/client';
import { responseFromChallenge } from '../dtos/challenge.dtos.js';
import { ChallengeModify, ResponseFromUpdateChallenge } from '../models/challenge.entities.js';
import { updateChallenge, deleteChallenge } from '../repositories/challenge.repositories.js';
import { LocationChallengeUpdateError, LocationChallengeDeletionError } from '../errors.js';

export const serviceUpdateChallenge = async (data: ChallengeModify): Promise<ResponseFromUpdateChallenge> => {
  try{
    const updatedChallenge: Challenge | null = await updateChallenge(data);

    if (updatedChallenge === null) {
      throw new LocationChallengeUpdateError({challengeId: data.id});
    }

    console.log(
      `Updated challenge ${updatedChallenge.id}: requiredCount=${updatedChallenge.requiredCount}, remainingCount=${updatedChallenge.remainingCount}`,
    );

    return responseFromChallenge(updatedChallenge);
  } catch (error) {
    console.error('Error updating location challenge:', error);
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
      throw new LocationChallengeDeletionError({challengeId: data});
    }

    console.log('Deleted challenge with ID:', deletedChallengeId);
  } catch (error) {
    console.error('Error deleting location challenge:', error);
    throw error;
  }
};