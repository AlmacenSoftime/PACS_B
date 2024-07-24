import { Request, Response } from "express";

import { OrthancConnector } from "../../orthanc-connection";
import { createConnection } from "../../db-connection/DbConnection";
import { EstudioInforme } from "../../db-connection/models";

/**
 * @description Controlador con metodos para el manejo de la grilla principal del sistema
 * @export
 * @class DataController
 */
export class DataController {

    private DICOMConnector: OrthancConnector;

    constructor() { this.DICOMConnector = new OrthancConnector(); }

    /**
     * @description Devuelve los datos para popular la grilla principal
     * @param {Request} request
     * @param {Response} response
     * @memberof DataController
     */
    public readonly getListData = async (request: Request, response: Response): Promise<void> => {
        try {
            const estudios = await this.DICOMConnector.getStudies();
            const dbConn = await createConnection();
            const studiesRepository = dbConn.getRepository(EstudioInforme);

            for (const estudio of estudios) {
                const id = estudio['ID']

                const joinData = (await studiesRepository
                    .createQueryBuilder()
                    .select(['sEstadoID', 'sMedicoFirmante'])
                    .where({ EstudioId: id })
                    .limit(1)
                    .execute()
                    .then((res) => res[0]));

                estudio['Estado'] = joinData?.sEstadoID || 'COMPLETO';
                estudio['Medico Informante'] = joinData?.sMedicoFirmante;
            }

            response.status(200).json(estudios);
        } catch (error) {
            response.status(500).json(error);
        }
    }
}
