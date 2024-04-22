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
            const userRepository = dataSource.getRepository(Usuario);
            const user: Usuario = this.getUserFromToken(request);
            const configFromUser = await userRepository.createQueryBuilder()
                .select('sConfigDashBoardJson', 'Config')
                .where({ usuario: user.usuario })
                .limit(1)
                .execute()
                .then((res) => res[0]?.Config);
            response.status(200).json(JSON.parse(configFromUser));
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
    public readonly postOrPutSettings = async (request: Request, response: Response): Promise<void> => {
        try {
            const dataSource: DataSource = await createConnection();
            const userRepository = dataSource.getRepository(Usuario);
            const user: Usuario = this.getUserFromToken(request);
            const configRequest = request.body as any;

            const userFormDB = await userRepository.findOne({ where: { usuario: user.usuario }, relations: [] });

            // Seteo los settings al usuario
            userFormDB.config = JSON.stringify(configRequest);

            // limpio la contraseña para que no se modifique nada
            delete userFormDB.password;
            delete userFormDB.Roles;

            await userRepository.update(userFormDB.id, userFormDB);

            response.status(200).json({ result: true });

        } catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.status(500).json({ result: false });
        }
    }


    /**
     * @description
     * @param {Request} request
     * @param {Response} response
     * @memberof UserSettingsController
     */
    public readonly deleteSettings = async (request: Request, response: Response): Promise<void> => {
        try {
            const dataSource: DataSource = await createConnection();
            const userRepository = dataSource.getRepository(Usuario);
            const configName = request.params.configName
            const user: Usuario = this.getUserFromToken(request);

            const userFormDB = await userRepository.findOne({ where: { usuario: user.usuario }, relations: [] });

            const parsedConfig = JSON.parse(userFormDB.config);
            delete parsedConfig[configName]
            userFormDB.config = JSON.stringify(parsedConfig);

            // limpio la contraseña para que no se modifique nada
            delete userFormDB.password;
            delete userFormDB.Roles;

            await userRepository.update(userFormDB.id, userFormDB);

            response.status(200).json({ result: true });

        } catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.status(500).json({ result: false });
        }
    }

    private getUserFromToken(request: Request): Usuario {
        const token = request.header('Auth-Token');
        return jwt.decode(token) as Usuario;
    }

}