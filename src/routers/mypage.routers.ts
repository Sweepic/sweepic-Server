import express from 'express';
export const myPageRouter = express.Router();
import { updateUserNameController, updateUserGoalCountController } from '../controllers/user.controller.js';
import {getUser, logOutUser, deleteUser} from '../controllers/user.mypage.controllers.js';

myPageRouter.get('/', getUser);
myPageRouter.patch('/name', updateUserNameController);
myPageRouter.patch('/goal', updateUserGoalCountController);
myPageRouter.get('/logout', logOutUser);
myPageRouter.delete('/', deleteUser);