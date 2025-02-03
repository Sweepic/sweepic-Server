import express from 'express';
export const myPageRouter = express.Router();

import {getUser, updateUser,deleteUser} from '../controllers/user.mypage.controllers.js';

myPageRouter.get('/mypage', getUser);
myPageRouter.patch('/mypage', updateUser);
myPageRouter.delete('/mypage', deleteUser);