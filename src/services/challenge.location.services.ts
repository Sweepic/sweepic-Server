import {Challenge} from '@prisma/client';
import {
  LocationChallengeCreation,
  PhotoInfo,
  ResponseFromChallenge,
  ResponseFromLocationChallenge,
} from '../models/challenge.entities.js';
import {
  getChallenge,
  getLocation,
  newLocationChallenge,
} from '../repositories/challenge.repositories.js';
import {
  responseFromChallenge,
  responseFromLocationChallenge,
} from '../dtos/challenge.dtos.js';
import {getHashedLocation} from '../utils/challenge.utils.js';
import {
  LocationChallengeCreationError,
  LocationChallengeNotFoundError,
  PhotoDataNotFoundError,
} from '../errors.js';

export const serviceCreateNewLocationChallenge = async (
  data: LocationChallengeCreation,
): Promise<ResponseFromChallenge> => {
  try {
    const newChallenge: Challenge | null = await newLocationChallenge(data);
    if (newChallenge === null) {
      throw new LocationChallengeCreationError({
        reason: '이미 존재하는 챌린지입니다.',
      });
    }

    return responseFromChallenge(newChallenge);
  } catch (error) {
    throw error;
  }
};

export const serviceGetLocationChallenge = async (
  data: bigint,
): Promise<ResponseFromLocationChallenge> => {
  try {
    const challenge = await getChallenge(data);
    const location = await getLocation(data);

    if (challenge === null || location === null) {
      throw new LocationChallengeNotFoundError({challengeId: data});
    }

    return responseFromLocationChallenge({location, challenge});
  } catch (error) {
    throw error;
  }
};

export const serviceLocationLogic = async (
  data: PhotoInfo[],
): Promise<PhotoInfo[]> => {
  try {
    if (!data || data.length === 0) {
      throw new PhotoDataNotFoundError({
        reason: '사진 데이터가 존재하지 않습니다.',
      });
    }

    let challengePics: PhotoInfo[] = [];
    const iterator: ArrayIterator<[number, PhotoInfo]> = data.entries();
    const hashPosition: Map<string, number> = new Map<string, number>(); //hash된 위치의 map 각 key를 위치로, value를 개수로 설정함

    for (const [, photo] of iterator) {   //lint 규칙에 어긋나지만 문법 상 index가 필요하지만, 밑의 반복문에서는 필요하지 않습니다.
      if (photo.latitude === null || photo.longitude === null) {
        continue;
      }

      photo.location = getHashedLocation(
        `${photo.latitude} ${photo.longitude}`,
      );

      const currentValue: number = hashPosition.get(photo.location) || 0;
      hashPosition.set(photo.location, currentValue + 1);
    }

    hashPosition.forEach(
      (value: number, key: string) => {
        if (value > 0 && value < 5) {
          challengePics = data.filter(
            (photo: PhotoInfo) => photo.location === key,
          );
        }
      },
    );

    return challengePics;
  } catch (error) {
    throw error;
  }
};
