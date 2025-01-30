import { Response, Request, NextFunction } from 'express';
import { ResponseFromChallenge, WeeklyChallengeCreation } from '../models/challenge.entities.js';
import { bodyToWeeklyCreation } from '../dtos/challenge.dtos.js';
import { StatusCodes } from 'http-status-codes';
import { serviceCreateNewWeeklyChallenge, serviceGetWeeklyChallenge } from '../services/challenge.weekly.services.js';
import { DataValidationError } from '../errors.js';

export const handleNewWeeklyChallenge = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    /*
    #swagger.tags = ['challenge-weekly-controller']
    #swagger.summary = '날짜 기반 챌린지 생성 API';
    #swagger.description = '날짜 기반 챌린지를 생성하는 API입니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        userId: { type: "string", description: "유저 Id" },
                        title: { type: "string", description: "챌린지 제목" },
                        context: { type: "string", description: "챌린지 내용" },
                        challengeDate: { type: "string", format: "date-time", description: "챌린지 날짜" },
                        required: { type: "number", description: "챌린지 장수" }
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "날짜 챌린지 생성 성공 응답",
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
    try{
        if(!req.body){
            throw new DataValidationError({reason: '날짜 챌린지를 생성할 데이터가 없습니다.'});
        }

        const data: WeeklyChallengeCreation = bodyToWeeklyCreation(req.body);
        const result: ResponseFromChallenge = await serviceCreateNewWeeklyChallenge(data);
        res.status(StatusCodes.OK).success(result);
        console.log(req.headers);
    } catch(error){
        next(error);
    }
};

export const handleGetWeeklyChallenge = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    /*
    #swagger.tags = ['challenge-weekly-controller']
    #swagger.summary = '날짜 기반 챌린지 불러오기 API';
    #swagger.description = '날짜 기반 챌린지를 불러오는 API입니다.'
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
        description: "날짜 챌린지 불러오기 성공 응답",
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
                                challengeDate: { type: "string", format: "date-time", example: "challenge-location" },
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
    try{
        if(!req.params.id){
            throw new DataValidationError({reason: '올바른 parameter값이 필요합니다.'});
        }
        
        const result = await serviceGetWeeklyChallenge(BigInt(req.params.id));
        res.status(StatusCodes.OK).success(result);
    } catch(error){
        next(error);
    }
};