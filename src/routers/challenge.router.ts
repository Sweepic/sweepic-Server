import express from 'express';
export const challengeRouter = express.Router();
import { handleGetLocationChallenge, handleLocationLogic, handleNewLocationChallenge } from '../controllers/challenge.location.controllers.js';
import { handleUpdateChallenge, handleRemoveChallenge, handleAcceptChallenge, handleCompleteChallenge, handleGetByUserId } from '../controllers/challenge.controllers.js';
import { handleGetWeeklyChallenge, handleNewWeeklyChallenge } from '../controllers/challenge.weekly.controllers.js';

challengeRouter.patch('/update', handleUpdateChallenge);
challengeRouter.delete('/delete', handleRemoveChallenge);
challengeRouter.patch('/accept/:id', handleAcceptChallenge);
challengeRouter.patch('/complete/:id', handleCompleteChallenge);
challengeRouter.get('/get/:userId', handleGetByUserId);
challengeRouter.get('/location_challenge/get/:id', handleGetLocationChallenge);
challengeRouter.post('/location_logic/test', handleLocationLogic);
challengeRouter.post('/location_challenge/create', handleNewLocationChallenge);
challengeRouter.get('/weekly_challenge/get/:id', handleGetWeeklyChallenge);
challengeRouter.post('/weekly_challenge/create', handleNewWeeklyChallenge);