import { DataSource } from "typeorm";
import { Request, Response } from "express";

import { createConnection } from "../../db-connection/DbConnection";
import { EstudioInforme } from "../../db-connection/models";
import { logger } from "../../loggin-service";


export class InformesController {

    public readonly GetInforme = async (request: Request, response: Response): Promise<void> => {
        try {
            const dataSource: DataSource = await createConnection();
            const informeRepository = dataSource.getRepository(EstudioInforme);
            const studyId = request.params.studyId;

            const informe = await informeRepository.findOneBy({ id: +studyId });

            response.status(200).json(informe);
        }
        catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.sendStatus(500);
        }

    }
}