import express, { Router } from 'express';
import { UserSettingsController } from './user-settings.controller';

const UserSettingsRoutes: Router = express.Router();
const userSettingsController = new UserSettingsController();

UserSettingsRoutes.get('/:userId/:configName', userSettingsController.getSettings);
UserSettingsRoutes.post('/:userId/:configName', userSettingsController.postSettings);
UserSettingsRoutes.put('/:userId/:configName', userSettingsController.putSettings);
UserSettingsRoutes.delete('/:userId/:configName', userSettingsController.deleteSettings);

export { UserSettingsRoutes };
