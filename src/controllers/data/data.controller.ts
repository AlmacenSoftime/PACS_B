import { Request, Response } from "express";
import rawdata from '../../mock-data.json';

/**
 * @description Controlador con metodos para el manejo de la grilla principal del sistema
 * @export
 * @class DataController
 */
export class DataController {

    /**
     * @description Devuelve los datos para popular la grilla principal
     * @param {Request} request
     * @param {Response} response
     * @memberof DataController
     */
    public readonly getListData = async (request: Request, response: Response): Promise<void> => {
        response.status(200).json(await Promise.resolve(rawdata));
    }
}
