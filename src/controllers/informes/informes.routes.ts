import express, { Router } from 'express';
import { InformesController } from './informes.controller';

const informesRoutes: Router = express.Router();
const informesController = new InformesController();

informesRoutes.get('/:studyId', informesController.GetInforme);
informesRoutes.post('/:studyId', informesController.SaveInforme);
informesRoutes.put('/:studyId', informesController.UpdateInforme);

export { informesRoutes };