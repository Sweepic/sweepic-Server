import {Tag} from '@prisma/client';
import {DateToTags} from '../dtos/tsoaTag.dto.js';
import {prisma} from '../db.config.js';
import {DBError} from '../errors.js';

export const selectTagsByDate = async (
  dto: DateToTags,
  endDate: Date,
): Promise<Pick<Tag, 'content'>[]> => {
  console.log(dto.createdAt);
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
    .catch(err => {
      console.log(err);
      throw new DBError();
    });

  return tags;
};
