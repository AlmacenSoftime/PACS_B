import { DataSource } from "typeorm";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

import { createConnection } from "../../db-connection/DbConnection";
import { EstudioInforme } from "../../db-connection/models";
import { logger } from "../../loggin-service";


export class InformesController {

    public readonly GetInforme = async (request: Request, response: Response): Promise<void> => {
        try {
            const dataSource: DataSource = await createConnection();
            const informeRepository = dataSource.getRepository(EstudioInforme);
            const studyId = request.params.studyId;

            const informe = await informeRepository
                .findOne({ where: { EstudioId: studyId }, order: { id: "DESC" } });

            response.status(200).json(informe);
        }
        catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.sendStatus(500);
        }
    }

    public readonly SaveInforme = async (request: Request, response: Response): Promise<void> => {
        try {
            const dataSource: DataSource = await createConnection();
            const informeRepository = dataSource.getRepository(EstudioInforme);
            const informeBody = request.body.content as string;
            const studyId = request.params.studyId;
            const informeObj = new EstudioInforme();
            informeObj.Usuario = this.getUserFromToken(request).userID;
            informeObj.Preinforme = informeBody;
            informeObj.EstudioId = studyId;
            informeObj.AudAccion = '';
            informeObj.AudFechaHora = new Date();
            informeObj.Estado = 'INFORMADO'

            await informeRepository.save(informeObj);

            response.status(200).json({ result: true });
        }
        catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.sendStatus(500);
        }
    }

    public readonly CloseInforme = async (request: Request, response: Response): Promise<void> => {
        try {
            const dataSource: DataSource = await createConnection();
            const informeRepository = dataSource.getRepository(EstudioInforme);
            const studyId = request.params.studyId;

            const informe = await informeRepository
                .findOne({ where: { EstudioId: studyId }, order: { id: "DESC" } });

            informe.FechaCierre = new Date();
            informe.UsuarioCierre = this.getUserFromToken(request).id;
            informe.Estado = "CERRADO"

            await informeRepository.save(informe);

            response.status(200).json({ result: true });
        }
        catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.sendStatus(500);
        }
    }

    public readonly ReOpenInforme = async (request: Request, response: Response): Promise<void> => {
        try {
            const dataSource: DataSource = await createConnection();
            const informeRepository = dataSource.getRepository(EstudioInforme);
            const studyId = request.params.studyId;

            const informe = await informeRepository
                .findOne({ where: { EstudioId: studyId }, order: { id: "DESC" } });

            informe.FechaCierre = null;
            informe.UsuarioCierre = null;
            informe.Estado = "INFORMADO"

            await informeRepository.save(informe);

            response.status(200).json({ result: true });
        }
        catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.sendStatus(500);
        }
    }

    private getUserFromToken(request: Request): any {
        const token = request.header('Auth-Token');
        return jwt.decode(token) as any;
    }
}