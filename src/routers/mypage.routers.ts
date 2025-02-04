import express from 'express';
export const myPageRouter = express.Router();
import { updateUserNameController, updateUserGoalCountController } from '../controllers/user.controller.js';
import {getUser, deleteUser} from '../controllers/user.mypage.controllers.js';

myPageRouter.get('/mypage', getUser);
myPageRouter.patch('/mypage/name', updateUserNameController);
myPageRouter.patch('/mypage/goal', updateUserGoalCountController);
myPageRouter.delete('/mypage', deleteUser);