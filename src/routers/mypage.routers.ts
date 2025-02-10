import express from 'express';
export const myPageRouter = express.Router();
import {getUser, logOutUser, deleteUser} from '../controllers/user.mypage.controllers.js';

myPageRouter.get('/', getUser);
myPageRouter.get('/logout', logOutUser);
myPageRouter.patch('/', deleteUser);
