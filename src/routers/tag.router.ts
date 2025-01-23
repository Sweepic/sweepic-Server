import express, {Request} from 'express';
export const tagRouter = express.Router();
import {handleNewTag} from '../controllers/tag.controller.js';

tagRouter.post('/create', handleNewTag); // 태그 생성
// tagRouter.patch('/tag/info/:id', handleUpdateTag);
