import { Request, Response, NextFunction } from 'express';
import { updateUserName, updateUserGoalCount } from '../services/user.service.js';
import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../models/user.model.js';

declare global {
  namespace Express {
    export interface Request {
      user?: UserModel;
    }
  }
}

// 사용자 이름 변경
export const updateUserNameController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  /* 
    #swagger.tags = ['User']
    #swagger.summary = '사용자 이름 변경 API'
    #swagger.description = '로그인한 사용자의 이름을 변경하는 API입니다.'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", description: "변경할 사용자 이름" }
            },
            required: ["name"]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "사용자 이름 변경 성공",
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "SUCCESS" },
          error: { type: "object", nullable: true, example: null },
          success: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              name: { type: "string", example: "John Doe" },
              updatedAt: { type: "string", format: "date-time" }
            }
          }
        }
      }
    }
  */
  const userId = req.user?.id;
  if (!userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      resultType: "ERROR",
      error: { message: 'Unauthorized access' },
      success: null,
    });
    return;
  }

  const { name } = req.body;

  if (!name) {
    res.status(StatusCodes.BAD_REQUEST).json({
      resultType: "ERROR",
      error: { message: 'Name is required.' },
      success: null,
    });
    return;
  }

  try {
    const updatedUser = await updateUserName(Number(userId), name);
    res.status(StatusCodes.OK).json({
      resultType: "SUCCESS",
      error: null,
      success: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// 사용자 목표 장수 변경
export const updateUserGoalCountController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  /* 
    #swagger.tags = ['User']
    #swagger.summary = '사용자 목표 장수 변경 API'
    #swagger.description = '로그인한 사용자의 목표 장수를 변경하는 API입니다.'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              goalCount: { type: "integer", description: "변경할 목표 장수" }
            },
            required: ["goalCount"]
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "목표 장수 변경 성공",
      schema: {
        type: "object",
        properties: {
          resultType: { type: "string", example: "SUCCESS" },
          error: { type: "object", nullable: true, example: null },
          success: {
            type: "object",
            properties: {
              id: { type: "integer", example: 1 },
              goalCount: { type: "integer", example: 5 },
              updatedAt: { type: "string", format: "date-time" }
            }
          }
        }
      }
    }
  */
  const userId = req.user?.id;
  if (!userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      resultType: "ERROR",
      error: { message: 'Unauthorized access' },
      success: null,
    });
    return;
  }

  const { goalCount } = req.body;

  if (goalCount === undefined || goalCount < 0) {
    res.status(StatusCodes.BAD_REQUEST).json({
      resultType: "ERROR",
      error: { message: 'Valid goalCount is required.' },
      success: null,
    });
    return;
  }

  try {
    const updatedUser = await updateUserGoalCount(Number(userId), goalCount);
    res.status(StatusCodes.OK).json({
      resultType: "SUCCESS",
      error: null,
      success: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
