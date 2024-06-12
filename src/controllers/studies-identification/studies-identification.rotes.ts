import express, { Router } from 'express';
import { StudiesIdentificationController } from './studies-identification.controller';

const studiesIdentificationRoute: Router = express.Router();
const studiesIdentificationController = new StudiesIdentificationController();

studiesIdentificationRoute.get('/:accessionNumber', studiesIdentificationController.get);

export { studiesIdentificationRoute };
