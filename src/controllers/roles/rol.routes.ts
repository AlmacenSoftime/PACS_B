import express, { Router } from 'express';
import { RolController } from './rol.controller';

const RolesRoutes: Router = express.Router();
const rolController = new RolController();

RolesRoutes.get('/', rolController.getRoles);

export { RolesRoutes };
