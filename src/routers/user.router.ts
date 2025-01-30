import express from 'express';
export const userRouter = express.Router();
import { updateUserNameController, updateUserGoalCountController } from '../controllers/user.controller.js';

userRouter.patch('/name', updateUserNameController);
userRouter.patch('/goal', updateUserGoalCountController);