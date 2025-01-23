import { Challenge, LocationChallenge } from '@prisma/client';
import { locationChallengeToClient, responseFromChallenge } from '../dtos/challenge.dtos.js';
import { ChallengeModify, ResponseFromLocationChallenge, ResponseFromChallenge, LocationChallengeCreation, PhotoInfo, ResponseFromUpdateChallenge } from '../models/challenge.entities.js';
import { updateLocationChallenge, newLocationChallenge, deleteLocationChallenge, getChallenge, getLocation } from '../repositories/challenge.repositories.js';
import { getHashedLocation } from '../utils/challenge.utils.js';

export const serviceCreateNewLocationChallenge = async (data: LocationChallengeCreation): Promise<ResponseFromChallenge> => {
    const newChallenge: Challenge | null = await newLocationChallenge(data);
    if(newChallenge === null){
        throw new Error('Invalid creation error.');
    }

    return responseFromChallenge(newChallenge);
};

export const serviceUpdateLocationChallenge = async (data: ChallengeModify): Promise<ResponseFromUpdateChallenge> => {
    const update: Challenge = await updateLocationChallenge(data);

    if(update === null){
        throw new Error(`Update Error: No challenge ${data.id}`);
    }

    console.log(`Updated ${update.id} challenge ${update.requiredCount}, ${update.remainingCount}`);

    return responseFromChallenge(update);
};

export const serviceDeleteLocationChallenge = async (data: bigint): Promise<void> => {
    const deleted: bigint = await deleteLocationChallenge(data);

    if(deleted === null){
        throw new Error(`Delete Error: No challenge ${data}`);
    }

    console.log('Deleted Challenge: ' + deleted);
};

export const serviceGetLocationChallenge = async (data: bigint): Promise<ResponseFromLocationChallenge> => {
    const challenge = await getChallenge(data);
    const location = await getLocation(data);

    if(challenge === null || location === null){
        throw new Error('No challenge found.');
    }

    console.log(challenge);
    console.log(location);

    return locationChallengeToClient({location, challenge});
};

export const serviceLocationLogic = async (data: PhotoInfo[]): Promise<PhotoInfo[]> => {
    if(!data){
        throw new Error('No photos data found.');
    }

    let isCreateChallenge: boolean = false;
    let challengePics: PhotoInfo[] = [];
    const iterator: ArrayIterator<[number, PhotoInfo]> = data.entries();
    let hashPosition: Map<string, number> = new Map<string, number>();    //hash된 위치의 map 각 key를 위치로, value를 개수로 설정함

    for(const [index, photo] of iterator){
        if(photo.latitude === null || photo.longitude === null){
            continue;
        }

        photo.location = getHashedLocation(photo.latitude + ' ' + photo.longitude);

        const currentValue: number = hashPosition.get(photo.location) || 0;
        hashPosition.set(photo.location, currentValue + 1);
        console.log(photo.location + ' ' + hashPosition.get(photo.location));
    }

    hashPosition.forEach((value: number, key: string, map: Map<string, number>) => {
        if(value > 0 && value < 5){
            isCreateChallenge = true;
            challengePics = data.filter((photo: PhotoInfo) => photo.location === key);
        }
    });

    console.log('created: ' + isCreateChallenge);
    console.log(challengePics);

    return challengePics;
};