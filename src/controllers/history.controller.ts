import { Controller, Get, Route, SuccessResponse, Tags, Request, Post} from 'tsoa';
import { Request as ExpressRequest } from 'express';
import { DataValidationError } from 'src/errors.js';
import { serviceGetMostTagged, serviceNewAward } from 'src/services/history.services.js';
import { ResponseFromMostTagToClient } from 'src/models/history.model.js';
import {Response} from '../models/tsoaResponse.js';

@Route('user')
export class MostTaggedController extends Controller{
    @Get('/history/most_tagged/get')
    @Tags('History')
    @SuccessResponse('200', 'OK')
    public async getMostTagged(
        @Request() req: ExpressRequest,
    ): Promise<Response> {
        if(!req.user){
           throw new DataValidationError({reason: '유저 정보가 없습니다. 다시 로그인 해주세요.'});
        }
        const userId: bigint = req.user.id;

        const result: ResponseFromMostTagToClient[] = await serviceGetMostTagged(userId);
        
        //console.log(result);

        return new Response(result);
    }
}

@Route('user')
export class AwardController extends Controller{
    @Post('/history/award/create')
    @Tags('Award')
    @SuccessResponse('200', 'OK')
    public async createNewAward(
        @Request() req: ExpressRequest
    ): Promise<Response> {
        try{
            if(!req.user){
                throw new DataValidationError({reason: '유저 정보가 없습니다.'});
            }

            serviceNewAward(req.user.id);
        }
        catch(error){
            //console.error('Controller error');
            throw error;
        }

        return new Response('success');
    }
}