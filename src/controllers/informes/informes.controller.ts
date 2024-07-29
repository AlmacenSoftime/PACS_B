import { DataSource } from "typeorm";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';

import { createConnection } from "../../db-connection/DbConnection";
import { EstudioInforme, Usuario } from "../../db-connection/models";
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
            const informeBody = request.body.content as string;
            const studyId = request.params.studyId;
            await this.saveInforme(informeBody, studyId, this.getUserFromToken(request), "INFORMADO");
            response.status(200).json({ result: true });
        }
        catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.sendStatus(500);
        }
    }

    public readonly CloseInforme = async (request: Request, response: Response): Promise<void> => {
        try {
            const informeBody = request.body.content as string;
            const studyId = request.params.studyId;
            await this.saveInforme(informeBody, studyId, this.getUserFromToken(request));
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

    private async saveInforme(informeBody: string, studyId: string, usuario: Usuario, estado: string = "CERRADO"): Promise<EstudioInforme> {

        const dataSource: DataSource = await createConnection();
        const informeRepository = dataSource.getRepository(EstudioInforme);

        const informeObj =
            (await informeRepository.findOne({ where: { EstudioId: studyId }, order: { id: "DESC" } }))
            ??
            new EstudioInforme();

        informeObj.EstudioId = studyId;
        informeObj.Usuario = usuario?.['userID'];
        informeObj.Preinforme = informeBody;

        if (informeObj?.Estado != 'CERRADO') {
            informeObj.Estado = estado;
        }

        if (!informeObj.FechaCierre && !informeObj.UsuarioCierreID && estado === "CERRADO") {
            informeObj.FechaCierre = new Date();
            informeObj.UsuarioCierreID = usuario?.['userID'];
            informeObj.MedicoInformante = usuario?.['nombreCompleto'];
        }
        else {
            informeObj.FechaCierre = null;
            informeObj.UsuarioCierreID = null;
            informeObj.MedicoInformante = usuario?.['nombreCompleto'];
        }

        informeObj.AudAccion = !informeObj.id ? 'A' : 'M';
        informeObj.AudFechaHora = new Date();

        return informeRepository.save(informeObj);
    }
}