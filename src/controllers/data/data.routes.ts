import express, { Router } from 'express';
import { DataController } from './data.controller';

const dataController = new DataController();
const DataRoutes: Router = express.Router();
DataRoutes.use(express.json());

DataRoutes.get('/getData', (req, res) => {
    dataController
        .getListData()
        .then((data) => {
            res.status(200).json(data);
        }).catch((err) => {
            res.status(500).send(err);
        });
});

export { DataRoutes };
