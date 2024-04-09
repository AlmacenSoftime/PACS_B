import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { DataSource } from "typeorm";

import { logger } from "../../loggin-service";
import { Usuario } from "../../db-connection/models";
import { createConnection } from "../../db-connection/DbConnection";
//import { logger } from '../../loggin-service';

/**
 * @description Controlador para manejar las configuraciones del usuario
 * @export
 * @class UserSettingsController
 */
export class UserSettingsController {
    /**
     * @description
     * @param {Request} request
     * @param {Response} response
     * @memberof UserSettingsController
     */
    public readonly getSettings = async (request: Request, response: Response): Promise<void> => {
        try {
            const dataSource: DataSource = await createConnection();
            const user: Usuario = this.getUserFromToken(request);
            const configFromUser = await dataSource.manager.findOne(Usuario, { where: { usuario: user.usuario }, relations: [], select: ["config"] });
            response.status(200).json(JSON.parse(configFromUser?.config));
            await dataSource.destroy();
        } catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.sendStatus(500);
        }
    }

    /**
     * @description
     * @param {Request} request
     * @param {Response} response
     * @memberof UserSettingsController
     */
    public readonly postSettings = async (request: Request, response: Response): Promise<void> => {
        response.json();
    }

    /**
     * @description
     * @param {Request} request
     * @param {Response} response
     * @memberof UserSettingsController
     */
    public readonly putSettings = async (request: Request, response: Response): Promise<void> => {
        response.json();
    }

    /**
     * @description
     * @param {Request} request
     * @param {Response} response
     * @memberof UserSettingsController
     */
    public readonly deleteSettings = async (request: Request, response: Response): Promise<void> => {
        response.json();
    }

    private getUserFromToken(request: Request): Usuario {
        const token = request.header('Auth-Token');
        return jwt.decode(token) as Usuario;
    }

}