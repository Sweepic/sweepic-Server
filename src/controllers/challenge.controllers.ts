import { NextFunction } from 'express';
import { Response, Request } from 'express';
import { serviceCreateNewLocationChallenge, serviceUpdateLocationChallenge, serviceDeleteLocationChallenge, serviceGetLocationChallenge, serviceLocationLogic } from '../services/challenge.services.js';
import { StatusCodes } from 'http-status-codes';
import { getIdNumber } from '../utils/challenge.utils.js';

export const handleNewLocationChallenge = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = await serviceCreateNewLocationChallenge(req.body);
    res.status(StatusCodes.OK).success(result);
    console.log(req.body);
};

export const handleUpdateLocationChallenge = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    serviceUpdateLocationChallenge(req.body);
    res.status(StatusCodes.OK).success(req.body);
    console.log(req.body);
};

export const handleRemoveLocationChallenge = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    serviceDeleteLocationChallenge(getIdNumber(req.body));
    res.status(StatusCodes.OK).success(req.body);
    console.log(req.body);
};

export const handleGetLocationChallenge = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = await serviceGetLocationChallenge(getIdNumber(req.body));
    res.status(StatusCodes.OK).success(result);
    console.log(getIdNumber(req.body));
};

export const handleLocationLogic = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = await serviceLocationLogic(req.body);
    res.status(StatusCodes.OK).success(result);
};