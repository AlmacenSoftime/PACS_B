import express, { Router } from 'express';

//import { logger } from '../../loggin-service';
//import { UserSettingsController } from './user-settings.controller';

const UserSettingsRoutes: Router = express.Router();
//const userSettingsController = new UserSettingsController();

// endpoint que se usa para obtener una configuracion
UserSettingsRoutes.get('/:userId/:configName', (request, response) => {
    response.json();
});

// endpoint que se usa para crear una configuracion
UserSettingsRoutes.post('/:userId/:configName', (request, response) => {
    response.json();
});

// endpoint que se usa para editar una configuracion
UserSettingsRoutes.put('/:userId/:configName', (request, response) => {
    response.json();
});

// endpoint que se usa para eliminar una configuracion
UserSettingsRoutes.delete('/:userId/:configName', (request, response) => {
    response.json();
});

export { UserSettingsRoutes };
