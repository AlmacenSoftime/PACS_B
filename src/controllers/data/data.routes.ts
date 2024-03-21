import express, { Router } from 'express';
import { DataController } from './data.controller';

const dataController = new DataController();
const DataRoutes: Router = express.Router();

DataRoutes.get('/getData', dataController.getListData);

export { DataRoutes };
