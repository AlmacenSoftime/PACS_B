import express, { Router } from 'express';
import { InformesController } from './informes.controller';

const informesRoutes: Router = express.Router();
const informesController = new InformesController();

informesRoutes.get('/:studyId');
informesRoutes.post('/');

export { informesRoutes };