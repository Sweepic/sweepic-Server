import {Challenge, LocationChallenge} from '@prisma/client';
import {
  locationChallengeToClient,
  responseFromChallenge,
} from '../dtos/challenge.dtos.js';
import {
  ChallengeModify,
  ResponseFromLocationChallenge,
  ResponseFromChallenge,
  LocationChallengeCreation,
  PhotoInfo,
  ResponseFromUpdateChallenge,
} from '../models/challenge.entities.js';
import {
  updateLocationChallenge,
  newLocationChallenge,
  deleteLocationChallenge,
  getChallenge,
  getLocation,
} from '../repositories/challenge.repositories.js';
import {getHashedLocation} from '../utils/challenge.utils.js';
import {
  LocationChallengeCreationError,
  LocationChallengeDeletionError,
  LocationChallengeNotFoundError,
  LocationChallengeUpdateError,
  PhotoDataNotFoundError,
} from '../errors.js';
export const serviceCreateNewLocationChallenge = async (
  data: LocationChallengeCreation,
): Promise<ResponseFromChallenge> => {
  const newChallenge: Challenge | null = await newLocationChallenge(data);
  if (newChallenge === null) {
    throw new Error('Invalid creation error.');
  }

  return responseFromChallenge(newChallenge);
};

export const serviceUpdateLocationChallenge = async (
  data: ChallengeModify,
): Promise<ResponseFromUpdateChallenge> => {
  try {
    const updatedChallenge: Challenge | null =
      await updateLocationChallenge(data);

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

export const serviceDeleteLocationChallenge = async (
  data: bigint,
): Promise<void> => {
  try {
    const deletedChallengeId: bigint | null =
      await deleteLocationChallenge(data);

    if (deletedChallengeId === null) {
      throw new LocationChallengeDeletionError({challengeId: data});
    }

    console.log('Deleted challenge with ID:', deletedChallengeId);
  } catch (error) {
    console.error('Error deleting location challenge:', error);
    throw error;
  }
};
export const serviceGetLocationChallenge = async (
  data: bigint,
): Promise<ResponseFromLocationChallenge> => {
  try {
    const challenge: Challenge | null = await getChallenge(data);
    const location: LocationChallenge | null = await getLocation(data);

    if (challenge === null || location === null) {
      throw new LocationChallengeNotFoundError({challengeId: data});
    }

    console.log('Retrieved challenge:', challenge);
    console.log('Retrieved location:', location);

    return locationChallengeToClient({location, challenge});
  } catch (error) {
    console.error('Error retrieving location challenge:', error);
    throw error;
  }
};

export const serviceLocationLogic = async (
  data: PhotoInfo[],
): Promise<PhotoInfo[]> => {
  try {
    // 데이터 유효성 검사
    if (!data || data.length === 0) {
      throw new PhotoDataNotFoundError({
        reason: '사진 데이터가 존재하지 않습니다.',
      });
    }

    // 위치별 사진 개수 맵 생성
    const hashPosition: Map<string, number> = new Map();
    const challengePics: PhotoInfo[] = [];

    // 각 사진의 위치 해싱 및 맵 업데이트
    for (const photo of data) {
      if (photo.latitude === null || photo.longitude === null) {
        console.warn('Photo with missing latitude or longitude skipped.');
        continue;
      }

      const locationHash = getHashedLocation(
        `${photo.latitude} ${photo.longitude}`,
      );
      const currentValue = hashPosition.get(locationHash) || 0;
      hashPosition.set(locationHash, currentValue + 1);

      // 사진의 해시 위치 저장
      photo.location = locationHash;
      console.log(
        `Photo location: ${locationHash}, count: ${hashPosition.get(locationHash)}`,
      );
    }

    hashPosition.forEach((value, key) => {
      if (value > 0 && value < 5) {
        challengePics.push(...data.filter(photo => photo.location === key));
      }
    });

    console.log('Filtered challenge photos:', challengePics);
    return challengePics;
  } catch (error) {
    console.error('Error processing location logic:', error);

    throw error;
  }
};
