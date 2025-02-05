import {WeeklyChallengeCreation} from '../models/challenge.entities.js';
import {Challenge, DateChallenge} from '@prisma/client';
import {prisma} from '../db.config.js';

export const newWeeklyChallenge = async (
  data: WeeklyChallengeCreation,
): Promise<Challenge | null> => {
  const isExisting = await prisma.challenge.findFirst({
    where: {
      userId: data.userId,
      title: data.title,
    },
  });

  if (isExisting) {
    return null;
  }

  const newChallenge = await prisma.challenge.create({
    data: {
      userId: data.userId,
      title: data.title,
      context: data.context,
      requiredCount: data.required,
      remainingCount: data.required,
    },
  });

  await prisma.dateChallenge.create({
    data: {
      challengeId: newChallenge.id,
      challengeDate: data.challengeDate,
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
