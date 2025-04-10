import express, { Router } from 'express';
import { StudiesViewersUrlsController } from './studies-viewers-urls.controller';

const studiesViewersUrlsRoutes: Router = express.Router();
const studiesViewersUrlsController = new StudiesViewersUrlsController();

studiesViewersUrlsRoutes.get('/:accessionNumber', studiesViewersUrlsController.getStudiesViewersUrls);

export { studiesViewersUrlsRoutes };