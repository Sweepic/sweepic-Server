import express from 'express';
export const myPageRouter = express.Router();
import {getUser, deleteUser} from '../controllers/user.mypage.controllers.js';

myPageRouter.get('/', getUser);
myPageRouter.delete('/', deleteUser);