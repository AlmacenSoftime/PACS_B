import express, { Router } from 'express';
import { UserSettingsController } from './user-settings.controller';

const UserSettingsRoutes: Router = express.Router();
const userSettingsController = new UserSettingsController();

UserSettingsRoutes.get('/', userSettingsController.getSettings);
UserSettingsRoutes.post('/', userSettingsController.postOrPutSettings);
UserSettingsRoutes.put('/', userSettingsController.postOrPutSettings);
UserSettingsRoutes.delete('/:configName', userSettingsController.deleteSettings);

export { UserSettingsRoutes };
