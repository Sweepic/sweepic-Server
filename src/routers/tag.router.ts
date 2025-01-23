import express from 'express';
export const tagRouter = express.Router();
import {handleNewTag, handleUpdateTag} from '../controllers/tag.controller.js';

tagRouter.post('/', handleNewTag); // 태그 생성
tagRouter.patch('/:id', handleUpdateTag);
