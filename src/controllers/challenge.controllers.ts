import { Request, Response, NextFunction } from 'express';
import { serviceDeleteChallenge, serviceUpdateChallenge } from '../services/challenge.services.js';
import { StatusCodes } from 'http-status-codes';
import { getIdNumber } from '../utils/challenge.utils.js';



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