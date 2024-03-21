import express, { Router } from 'express';

import { AuthenticationController } from './authentication.controller';

const authenticationController = new AuthenticationController();
const AuthenticationRoutes: Router = express.Router();

AuthenticationRoutes.post('/login', authenticationController.login);
AuthenticationRoutes.get('/user', authenticationController.user);
AuthenticationRoutes.post('/refresh', authenticationController.refresh);

export { AuthenticationRoutes };
