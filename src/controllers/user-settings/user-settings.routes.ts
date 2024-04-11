import express, { Router } from 'express';
import { UserSettingsController } from './user-settings.controller';

const UserSettingsRoutes: Router = express.Router();
const userSettingsController = new UserSettingsController();

UserSettingsRoutes.get('/', userSettingsController.getSettings);
UserSettingsRoutes.post('/', userSettingsController.postSettings);
UserSettingsRoutes.put('/', userSettingsController.putSettings);
UserSettingsRoutes.delete('/', userSettingsController.deleteSettings);

export { UserSettingsRoutes };
