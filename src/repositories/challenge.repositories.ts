import { challengeImageUplaodBody } from 'src/dtos/challenge.dtos.js';
import {prisma} from '../db.config.js';
import {
  ChallengeAcceptError, 
  ChallengeCompleteError, 
  ChallengeDeletionError, 
  ChallengeImageMissingError, 
  ChallengeImageUploadError, 
  ChallengeUpdateError
} from '../errors.js';
import {
  ChallengeModify,
  LocationChallengeCreation,
  ResponseFromGetByUserId,
} from '../models/challenge.entities.js';
import {Challenge, LocationChallenge} from '@prisma/client';

export const challengeExist = async (userId: bigint): Promise<Boolean> => {
  const currentTime = new Date(); //현재 시간
  const minute: number = currentTime.getMinutes() > 30 ? 30 : 0;
  currentTime.setMinutes(minute, 0, 0); //시간 초기화
  const nextTime = new Date();
  nextTime.setMinutes(currentTime.getMinutes() + 30, 0, 0);

  // if(minute === 30){
  //   currentTime.setHours(currentTime.getHours() - 1);
  //   nextTime.setHours(nextTime.getHours() - 1);
  // }

  // console.log(currentTime);
  // console.log(nextTime);
  // console.log(new Date(currentTime.toUTCString()));
  // console.log(new Date(nextTime.toUTCString()));
  
  const isExistChallenge = await prisma.challenge.findFirst({
    where: {
      userId: userId,
      createdAt: {
        lt: new Date(nextTime.toUTCString()),
        gte: new Date(currentTime.toUTCString())
      }
    }
  });

  if(isExistChallenge){
    return true;
  }
  else{
    return false;
  }
};

export const newLocationChallenge = async (
  data: LocationChallengeCreation,
): Promise<Challenge | null> => {
  const newChal = await prisma.challenge.create({
    data: {
      userId: data.userId,
      title: `${data.location}에서의 사진 챌린지!`,
      context: data.context,
      requiredCount: data.required,
      remainingCount: data.required,
    },
  });

  const newId = newChal.id;

  await prisma.locationChallenge.create({
    data: {
      challengeId: newId,
      challengeLocation: data.location,
    },
  });

  return newChal;
};

export const updateChallenge = async (
  data: ChallengeModify,
): Promise<Challenge> => {
  const isExistChallenge = await prisma.challenge.findFirst({
    where: {id: BigInt(data.id)}
  });

  if(!isExistChallenge){
    throw new ChallengeUpdateError({challengeId: BigInt(data.id)});
  }

  const updated = await prisma.challenge.update({
    where: {id: BigInt(data.id)},
    data: {
      requiredCount: data.required,
      remainingCount: data.remaining,
    },
  });

  return updated;
};

export const deleteChallenge = async (data: bigint): Promise<bigint> => {
  const isExistChallenge = await prisma.challenge.findFirst({
    where: {id: data}
  });

  if(!isExistChallenge){
    throw new ChallengeDeletionError({challengeId: data});
  }
  
  const deleted = await prisma.challenge.delete({
    where: {id: data},
  });

  return deleted.id;
};

export const getChallenge = async (data: bigint): Promise<Challenge | null> => {
  const userChallenge = await prisma.challenge.findFirst({
    where: {id: data},
  });

  return userChallenge;
};

export const getLocation = async (
  data: bigint,
): Promise<LocationChallenge | null> => {
  const challengeLocation = await prisma.locationChallenge.findFirst({
    where: {challengeId: data},
  });

  return challengeLocation;
};

export const acceptChallenge = async (
  data: bigint,
): Promise<Challenge | null> => {
  const state: {status: number} | null = await prisma.challenge.findFirst({
    where: {id: data},
    select: {
      status: true,
    },
  });

  if (!state) {
    throw new ChallengeAcceptError({
      challengeId: data,
      reason: '챌린지가 존재하지 않습니다.',
    });
  }

  if (state.status === 2 || state.status === 3) {
    throw new ChallengeAcceptError({
      challengeId: data,
      reason: '챌린지가 이미 수락되거나 완료되었습니다.',
    });
  }

  const updatedChallenge = await prisma.challenge.update({
    where: {id: data},
    data: {
      status: 2,
      acceptedAt: new Date(),
    }, //status: 1 = created, 2 = accepted, 3 = completed
  });

  return updatedChallenge;
};

export const completeChallenge = async (
  data: bigint,
): Promise<Challenge | null> => {
  const state: {status: number} | null = await prisma.challenge.findFirst({
    where: {id: data},
    select: {
      status: true,
    },
  });

  if (!state) {
    throw new ChallengeCompleteError({
      challengeId: data,
      reason: '챌린지가 존재하지 않습니다.',
    });
  }

  if (state.status !== 2) {
    throw new ChallengeCompleteError({
      challengeId: data,
      reason: '챌린지가 수락되지 않았습니다.',
    });
  }

  const updatedChallenge = await prisma.challenge.update({
    where: {id: data},
    data: {
      status: 3,
      completedAt: new Date(),
    }, //status: 1 = created, 2 = accepted, 3 = completed
  });

  return updatedChallenge;
};

export const getChallengeByUserId = async (
  data: bigint,
): Promise<ResponseFromGetByUserId[]> => {
  const challenges = await prisma.challenge.findMany({
    where: {userId: data},
    include: {
      locationChallenge: {
        select: {
          challengeLocation: true,
        },
      },
      dateChallenge: {
        select: {
          challengeDate: true,
        },
      },
      images: {
        select: {
          image: {
            select: {
              mediaId: true
            }
          }
        }
      }
    },
  });

  //console.log(challenges[0].images);

  return challenges;
};

export const challengeImageUpload = async (
  imageIdList: bigint[], 
  challengeId: bigint, 
  userId: bigint
): Promise<{count: number}> => {
  const duplicateChallenge = await prisma.challengeImage.findFirst({
    where: {
      challengeId: challengeId
    }
  });

  if(duplicateChallenge){
    throw new ChallengeImageUploadError({reason: `${challengeId}챌린지에 이미지가 이미 존재합니다.`});
  }
  
  const foundImage = await prisma.image.findMany({
    where: {
      mediaId: {
        in: imageIdList
      },
      userId: userId
    },
    select: {
      id: true
    }
  });

  if(foundImage.length !== imageIdList.length){
    throw new ChallengeImageMissingError({reason: '서버에 존재하지 않는 이미지가 있습니다.'});
  }

  const inputData = challengeImageUplaodBody(foundImage, challengeId);

  const upload = await prisma.challengeImage.createMany({
    data: inputData
  });

  return upload;
};