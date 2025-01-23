import {Tag} from '@prisma/client';
import {DateToTags} from '../dtos/tag.dto.js';
import {prisma} from '../db.config.js';

export const selectTagsByDate = async (
  dto: DateToTags,
  endDate: Date,
): Promise<Pick<Tag, 'content'>[]> => {
  const tags = await prisma.tag
    .findMany({
      where: {
        images: {
          some: {
            AND: [
              {
                image: {
                  createdAt: {
                    gte: dto.createdAt,
                    lt: endDate,
                  },
                },
              },
              {
                image: {
                  userId: dto.userId,
                },
              },
            ],
          },
        },
      },
      select: {
        content: true,
      },
      orderBy: {
        content: 'asc',
      },
    })
    .catch(() => {
      throw new Error('DB 에러');
    });

  console.log(dto.createdAt);
  console.log(endDate);
  return tags;
};
