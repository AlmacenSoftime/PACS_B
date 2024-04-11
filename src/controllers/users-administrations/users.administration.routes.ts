import express, { Router } from 'express';
import { UserAdministrationController } from './users-administration.controller';

const UserAdministrationRoutes: Router = express.Router();
const userAdministrationController = new UserAdministrationController();

UserAdministrationRoutes.get('/', userAdministrationController.getAllUsers);
UserAdministrationRoutes.get('/:userID', userAdministrationController.getUser);
UserAdministrationRoutes.post('/', userAdministrationController.createUser);
UserAdministrationRoutes.put('/', userAdministrationController.putUser);
UserAdministrationRoutes.delete('/:userID', userAdministrationController.deleteUser);

export { UserAdministrationRoutes };
