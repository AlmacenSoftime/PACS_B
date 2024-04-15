import { Request, Response } from "express";
import { OrthancConnector } from "../../orthanc-connection";

/**
 * @description Controlador con metodos para el manejo de la grilla principal del sistema
 * @export
 * @class DataController
 */
export class DataController {

    private DICOMConnector: OrthancConnector;

    constructor() {
        this.DICOMConnector = new OrthancConnector();
    }

    /**
     * @description Devuelve los datos para popular la grilla principal
     * @param {Request} request
     * @param {Response} response
     * @memberof DataController
     */
    public readonly getListData = async (request: Request, response: Response): Promise<void> => {
        try {
            const estudios = await this.DICOMConnector.getStudies();
            response.status(200).json(estudios);
        } catch (error) {
            response.status(500).json(error);
        }
    }
}
