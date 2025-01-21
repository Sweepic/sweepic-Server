import { NextFunction } from 'express';
import { Response, Request } from 'express';
import { serviceCreateNewLocationChallenge, serviceUpdateLocationChallenge, serviceDeleteLocationChallenge, serviceGetLocationChallenge, serviceLocationLogic } from '../services/challenge.services.js';
import { StatusCodes } from 'http-status-codes';
import { getIdNumber } from '../utils/challenge.utils.js';
import { LocationChallengeCreation } from '../models/challenge.entities.js';
import { bodyToLocationCreation } from '../dtos/challenge.dtos.js';

export const handleNewLocationChallenge = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    /*
    #swagger.tags = ['challenge-location-controller']
    #swagger.summary = '위치 기반 챌린지 생성 API';
    #swagger.description = '위치 기반 챌린지를 생성하는 API입니다.'
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
                        location: { type: "string", description: "챌린지 위치" },
                        required: { type: "number", description: "챌린지 장수" }
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "위치 챌린지 생성 성공 응답",
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
    const data: LocationChallengeCreation = bodyToLocationCreation(req.body);
    const result = await serviceCreateNewLocationChallenge(req.body);
    res.status(StatusCodes.OK).success(result);
    console.log(req.body);
};

export const handleUpdateLocationChallenge = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    /*
    #swagger.tags = ['challenge-location-controller']
    #swagger.summary = '위치 기반 챌린지 수정 API';
    #swagger.description = '위치 기반 챌린지를 수정하는 API입니다. 수정되는 내용은 정리 장수, 남은 장수 입니다.'
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
        description: "위치 챌린지 수정 성공 응답",
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
    serviceUpdateLocationChallenge(req.body);
    res.status(StatusCodes.OK).success(req.body);
    console.log(req.body);
};

export const handleRemoveLocationChallenge = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    /*
    #swagger.tags = ['challenge-location-controller']
    #swagger.summary = '위치 기반 챌린지 삭제 API';
    #swagger.description = '위치 기반 챌린지를 삭제하는 API입니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "챌린지 ID" }
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "위치 챌린지 삭제 성공 응답",
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
                                id: { type: "string", description: "1" }
                            }
                        }   
                    }
                }
            }
        }
    };
    */
    serviceDeleteLocationChallenge(getIdNumber(req.body));
    res.status(StatusCodes.OK).success(req.body);
    console.log(req.body);
};

export const handleGetLocationChallenge = async (
    req: Request<{id: string}>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    /*
    #swagger.tags = ['challenge-location-controller']
    #swagger.summary = '위치 기반 챌린지 불러오기 API';
    #swagger.description = '위치 기반 챌린지를 불러오는 API입니다.'
    #swagger.requestBody = {
        required: false
    };
    #swagger.responses[200] = {
        description: "위치 챌린지 불러오기 성공 응답",
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
                                location: { type: "string", example: "challenge-location" },
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
    const result = await serviceGetLocationChallenge(BigInt(req.params.id));
    res.status(StatusCodes.OK).success(result);
    console.log(req.params.id);
};

export const handleLocationLogic = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    /*
    #swagger.tags = ['challenge-location-controller']
    #swagger.summary = '위치 기반 챌린지 사진 판별 API';
    #swagger.description = '위치 기반 챌린지를 위한 사진을 골라내는 API입니다.'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "사진 ID" },
                            displayName: { type: "string", description: "사진 이름" },
                            latitude: { type: "number", description: "사진 위도" },
                            longitude: { type: "number", description: "사진 경도" },
                            timestamp: { type: "string", format: "date-time", description: "사진 날짜" }
                        }
                    }
                }
            }
        }
    };
    #swagger.responses[200] = {
        description: "사진 위치 판별 응답",
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
                                    id: { type: "string", example: "100000001" },
                                    displayName: { type: "string", example: "20250116_123456.jpg" },
                                    latitude: { type: "number", example: 37.123456 },
                                    longitude: { type: "number", example: 127.123456 },
                                    timestamp: { type: "string", format: "date-time", example: "2025-01-16T12:34:56Z" },
                                    location: { type: "string", example: "wydg0y"}
                                }
                            }
                        }   
                    }
                }
            }
        }
    };
    */
    const result = await serviceLocationLogic(req.body);
    res.status(StatusCodes.OK).success(result);
};