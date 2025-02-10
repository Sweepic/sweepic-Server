import {WeeklyChallengeCreation} from '../models/challenge.entities.js';
import {Challenge, DateChallenge} from '@prisma/client';
import {prisma} from '../db.config.js';

export const newWeeklyChallenge = async (
  data: WeeklyChallengeCreation,
): Promise<Challenge | null> => {
  const currentDate: Date = new Date();
  const day: string = `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일 사진 챌린지!`;
  
  const newChallenge = await prisma.challenge.create({
    data: {
      userId: data.userId,
      title: day,
      context: data.context,
      requiredCount: data.required,
      remainingCount: data.required,
    },
  });

  await prisma.dateChallenge.create({
    data: {
      challengeId: newChallenge.id,
      challengeDate: currentDate,
    },
  });

  return newChallenge;
};

export const getWeekly = async (
  data: bigint,
): Promise<DateChallenge | null> => {
  const challenge = await prisma.dateChallenge.findFirst({
    where: {
      challengeId: data,
    },
  });

  return challenge;
};
