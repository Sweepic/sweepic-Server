import express from 'express';
export const userRouter = express.Router();
import { updateUserNameController, updateUserGoalCountController } from '../controllers/user.controller.js';

userRouter.patch('/onboarding/name', updateUserNameController);
userRouter.patch('/onboarding/goal', updateUserGoalCountController);