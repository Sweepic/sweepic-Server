import { Request, Response, NextFunction } from 'express';
import { serviceAcceptChallenge, serviceCompleteChallenge, serviceDeleteChallenge, serviceGetByUserId, serviceUpdateChallenge } from '../services/challenge.services.js';
import { StatusCodes } from 'http-status-codes';
import { getIdNumber } from '../utils/challenge.utils.js';
import { Challenge } from '@prisma/client';
import { ResponseFromGetByUserIdReform } from '../models/challenge.entities.js';



export const handleUpdateChallenge = async (
    req: Request,
    res: Response,
    next: NextFunction
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
    serviceUpdateChallenge(req.body);
    res.status(StatusCodes.OK).success(req.body);
    console.log(req.body);
};

export const handleRemoveChallenge = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    /*
    #swagger.tags = ['challenge-controller']
    #swagger.summary = '챌린지 삭제 API';
    #swagger.description = '챌린지를 삭제하는 API입니다.'
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
    serviceDeleteChallenge(getIdNumber(req.body));
    res.status(StatusCodes.OK).success(req.body);
    console.log(req.body);
};

export const handleAcceptChallenge = async (
    req: Request<{id: string}>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const result: Challenge = await serviceAcceptChallenge(BigInt(req.params.id));
    res.status(StatusCodes.OK).success(result);
};

export const handleCompleteChallenge = async (
    req: Request<{id: string}>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const result: Challenge = await serviceCompleteChallenge(BigInt(req.params.id));
    res.status(StatusCodes.OK).success(result);
};

export const handleGetByUserId = async (
    req: Request<{userId: string}>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    /*
    #swagger.tags = ['challenge-controller']
    #swagger.summary = '특정 유저의 챌린지 조회 API';
    #swagger.description = '특정 유저의 모든 챌린지를 조회하는 API입니다.'
    #swagger.parameters['userId'] = {
        in: 'path',
        required: true,
        description: "유저 ID 입력",
        '@schema': {
            type: "string"
        }
    };
    #swagger.responses[200] = {
        description: "메모 조회 성공 응답",
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
    const result: ResponseFromGetByUserIdReform[] = await serviceGetByUserId(BigInt(req.params.userId));
    res.status(StatusCodes.OK).success(result);
};