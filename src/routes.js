import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Administration users
routes.post('/users', UserController.store);
routes.put('/users', authMiddleware, UserController.update);

// Login session
routes.post('/sessions', SessionController.store);

// Recipient
routes.post('/recipients', authMiddleware, RecipientController.store);
routes.put('/recipients/:id', authMiddleware, RecipientController.update);

export default routes;
