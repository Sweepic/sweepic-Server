import express, {Request} from 'express';
export const challengeRouter = express.Router();
import { handleGetLocationChallenge, handleLocationLogic, handleNewLocationChallenge, handleRemoveLocationChallenge, handleUpdateLocationChallenge } from '../controllers/challenge.controllers.js';

challengeRouter.post('/location_challenge/create', handleNewLocationChallenge);
challengeRouter.get('/location_challenge/get/:id', handleGetLocationChallenge);
challengeRouter.patch('/location_challenge/update', handleUpdateLocationChallenge);
challengeRouter.post('/location_logic/test', handleLocationLogic);
challengeRouter.delete('/location_challenge/delete', handleRemoveLocationChallenge);