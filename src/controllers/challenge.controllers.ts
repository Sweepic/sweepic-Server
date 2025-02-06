import {Controller, Get, Patch, Path, Query, Route, SuccessResponse, Tags} from 'tsoa';
import {Request, Response, NextFunction} from 'express';
import {
  serviceAcceptChallenge,
  serviceCompleteChallenge,
  serviceDeleteChallenge,
  serviceGetByUserId,
  serviceUpdateChallenge,
} from '../services/challenge.services.js';
import {StatusCodes} from 'http-status-codes';
import {
  getIdNumber,
  getReverseGeocode
} from '../utils/challenge.utils.js';
import {Challenge} from '@prisma/client';
import {ResponseFromGetByUserIdReform} from '../models/challenge.entities.js';
import {DataValidationError} from '../errors.js';

export const handleUpdateChallenge = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  /*
    #swagger.tags = ['challenge-controller']
    #swagger.summary = '챌린지 수정 API';
    #swagger.description = '챌린지를 수정하는 API입니다. 수정되는 내용은 정리 장수, 남은 장수 입니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: '챌린지 ID' },
                        required: { type: "number", description: '챌린지 장 수' },
                        remaining: { type: "number", description: '챌린지 남은 수' }
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "챌린지 수정 성공 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "SUCCESS" },
                        error: { type: "object", nullable: true, example: null },
                        success: {
                            type: "object", 
                            properties: {
                                id: { type: "string", example: '1' },
                                required: { type: "string", example: 10 },
                                remaining: { type: "string", example: 10 }
                            }
                        }   
                    }
                }
            }
        }
    };
    */
  try {
    if (!req.body) {
      throw new DataValidationError({reason: '업데이트 내용이 없습니다.'});
    }

    serviceUpdateChallenge(req.body);
    res.status(StatusCodes.OK).success(req.body);
  } catch (error) {
    next(error);
  }
};

export const handleRemoveChallenge = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  /*
    #swagger.tags = ['challenge-controller'];
    #swagger.summary = '챌린지 삭제 API';
    #swagger.description = '챌린지를 삭제하는 API입니다.';
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    required: ['id'],
                    properties: {
                        id: { type: "string", description: "챌린지 ID" }
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "챌린지 삭제 성공 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "SUCCESS" },
                        error: { type: "object", nullable: true, example: null },
                        success: {
                            type: "object", 
                            properties: {
                                id: { type: "string", example: "1" }
                            }
                        }   
                    }
                }
            }
        }
    };
    */
  try {
    if (!req.body) {
      throw new DataValidationError({
        reason: '삭제할 챌린지의 정보가 없습니다.',
      });
    }
    serviceDeleteChallenge(getIdNumber(req.body));
    res.status(StatusCodes.OK).success(req.body);
  } catch (error) {
    next(error);
  }
};

export const handleAcceptChallenge = async (
  req: Request<{id: string}>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  /*
    #swagger.tags = ['challenge-controller'];
    #swagger.summary = '챌린지 수락 API';
    #swagger.description = '챌린지를 수락하는 API입니다.';
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: "챌린지 ID 입력",
        '@schema': {
            type: "string",
        }
    };
    #swagger.requestBody = {
        required: false
    };
    #swagger.responses[200] = {
        description: "챌린지 수락 성공 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "SUCCESS" },
                        error: { type: "object", nullable: true, example: null },
                        success: {
                            type: "object", 
                            properties: {
                                id: { type: "string", example: "1" },
                                title: { type: "string", example: "challenge-title" },
                                context: { type: "string", example: "challenge-context" },
                                requiredCount: { type: "number", example: 10 },
                                remainingCount: { type: "number", example: 10 },
                                userId: { type: "string", example: "1" },
                                createdAt: { type: "string", format: "date-time", example: "2025-01-20T18:19:47.415Z" },
                                updatedAt: { type: "string", format: "date-time", example: "2025-01-20T18:19:47.415Z" },
                                acceptedAt: { type: "string", format: "date-time", example: "2025-01-20T18:19:47.415Z" },
                                completedAt: { type: "string", format: "date-time", example: "2025-01-20T18:19:47.415Z" },
                                status: { type: "number", example: 1 }
                            }
                        }
                    }
                }
            }
        }
    };
    */
  try {
    if (!req.params.id) {
      throw new DataValidationError({
        reason: '올바른 parameter값이 필요합니다.',
      });
    }

    const result: Challenge = await serviceAcceptChallenge(
      BigInt(req.params.id),
    );
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

export const handleCompleteChallenge = async (
  req: Request<{id: string}>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  /*
    #swagger.tags = ['challenge-controller'];
    #swagger.summary = '챌린지 완료 API';
    #swagger.description = '챌린지를 완료하는 API입니다.';
    #swagger.parameters['id'] = {
        in: 'path',
        required: true,
        description: "챌린지 ID 입력",
        '@schema': {
            type: "string",
        }
    };
    #swagger.requestBody = {
        required: false
    };
    #swagger.responses[200] = {
        description: "챌린지 완료 성공 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "SUCCESS" },
                        error: { type: "object", nullable: true, example: null },
                        success: {
                            type: "object", 
                            properties: {
                                id: { type: "string", example: "1" },
                                title: { type: "string", example: "challenge-title" },
                                context: { type: "string", example: "challenge-context" },
                                requiredCount: { type: "number", example: 10 },
                                remainingCount: { type: "number", example: 10 },
                                userId: { type: "string", example: "1" },
                                createdAt: { type: "string", format: "date-time", example: "2025-01-20T18:19:47.415Z" },
                                updatedAt: { type: "string", format: "date-time", example: "2025-01-20T18:19:47.415Z" },
                                acceptedAt: { type: "string", format: "date-time", example: "2025-01-20T18:19:47.415Z" },
                                completedAt: { type: "string", format: "date-time", example: "2025-01-20T18:19:47.415Z" },
                                status: { type: "number", example: 1}
                            }
                        }   
                    }
                }
            }
        }
    };
    */
  try {
    if (!req.params.id) {
      throw new DataValidationError({
        reason: '올바른 parameter값이 필요합니다.',
      });
    }

    const result: Challenge = await serviceCompleteChallenge(
      BigInt(req.params.id),
    );
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};

export const handleGetByUserId = async (
  req: Request<{userId: string}>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  /*
    #swagger.tags = ['challenge-controller'];
    #swagger.summary = '특정 유저의 챌린지 조회 API';
    #swagger.description = '특정 유저의 모든 챌린지를 조회하는 API입니다.';
    #swagger.parameters['userId'] = {
        in: 'path',
        required: true,
        description: "유저 ID 입력",
        '@schema': {
            type: "string"
        }
    };
    #swagger.requestBody = {
        required: false
    };
    #swagger.responses[200] = {
        description: "유저 챌린지 조회 성공 응답",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        resultType: { type: "string", example: "SUCCESS" },
                        error: { type: "object", nullable: true, example: null },
                        success: {
                            type: "array", 
                            items: {
                                type: "object",
                                properties: {
                                    id: {type: "string", example: "1"},
                                    title: {type: "string"},
                                    context: {type: "string"},
                                    challengeLocation: {type: "string"},
                                    challengeDate: {type: "string", format: "date-time"},
                                    requiredCount: {type: "number"},
                                    remainingCount: {type: "number"},
                                    userId: {type: "string"},
                                    createdAt: {type: "string", format: "date-time"},
                                    updatedAt: {type: "string", format: "date-time"},
                                    acceptedAt: {type: "string", format: "date-time"},
                                    completedAt: {type: "string", format: "date-time"},
                                    status: {type: "number"}
                                }
                            }
                        }     
                    }
                }
            }
        }
    };
    */
    try{
        if(req.user === null || req.user === undefined){
            throw new DataValidationError({reason: 'req.user 정보가 없습니다.'});
        }
        const result: ResponseFromGetByUserIdReform[] = await serviceGetByUserId(BigInt(req.user.id));
        res.status(StatusCodes.OK).success(result);
    } catch(error){
        next(error);
    }
};

export const naverController = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
  try{
    if(req.query.hashedLocation as string === null){
      throw new DataValidationError({reason: 'query문이 비었습니다. hashedLocation에 geohash값을 넣어주세요.'});
    }
    const data: string = await getReverseGeocode(req.query.hashedLocation as string);
    res.status(StatusCodes.OK).success(data);
  }
  catch(error){
    next(error);
  }
};