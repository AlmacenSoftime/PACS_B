import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { DataSource } from "typeorm";

import { Usuario } from "../../db-connection/models";
import { createConnection } from "../../db-connection/DbConnection";
import { logger } from "../../loggin-service";

/**
 * @description
 * @export
 * @class UserAdministrationController
 */
export class UserAdministrationController {

    /**
     * @description
     * @param {Request} request
     * @param {Response} response
     * @memberof UserAdministrationController
     */
    public readonly getAllUsers = async (request: Request, response: Response): Promise<void> => {
        try {
            const dataSource: DataSource = await createConnection();
            const usuarios: Usuario[] = await dataSource
                .getRepository(Usuario)
                .find({
                    relations: ['Roles'],
                    select: ["Roles", "config", "eMail", "estado", "fotoPefil", "id", "nombreApellido", "prefijo", "telefono", "usuario"],
                    loadEagerRelations: true
                });
            response.status(200).json(usuarios);
        } catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.sendStatus(500);
        }
    }

    /**
     * @description
     * @param {Request} request
     * @param {Response} response
     * @memberof UserAdministrationController
     */
    public readonly getUser = async (request: Request, response: Response): Promise<void> => {
        try {
            const usuarioId = +request.params.userID;

            if (Number.isNaN(usuarioId)) {
                response.status(400).json('Debe enviar el ID de usuario NUMERICO');
                return;
            }

            const dataSource = await createConnection();
            const user: Usuario = await dataSource.manager.findOne(Usuario, {
                where: { id: usuarioId },
                select: ["Roles", "config", "eMail", "estado", "fotoPefil", "id", "nombreApellido", "prefijo", "telefono", "usuario"],
                relations: ['Roles'],
                loadEagerRelations: true
            });

            response.status(200).json(user);
        } catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.sendStatus(500);
        }
    }

    /**
     * @description
     * @param {Request} request
     * @param {Response} response
     * @memberof UserAdministrationController
     */
    public readonly createUser = async (request: Request, response: Response): Promise<void> => {
        try {
            const dataSource: DataSource = await createConnection();
            const userRepository = dataSource.getRepository(Usuario);

            const userBody = request.body as Usuario;
            userBody.password = await bcrypt.hash(userBody.password, 10);
            userBody.estado = 'HAB';

            await userRepository.save(userBody);

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
     * @memberof UserAdministrationController
     */
    public readonly putUser = async (request: Request, response: Response): Promise<void> => {
        try {
            const dataSource: DataSource = await createConnection();
            const userRepository = dataSource.getRepository(Usuario);
            const userBody = request.body as Usuario;

            if (userBody.password) {
                userBody.password = await bcrypt.hash(userBody.password, 10);
            }
            else {
                delete userBody.password;
            }

            // TODO: Ver que pasa con la foto de perfil!
            delete userBody.fotoPefil;

            const preloadedUser = await userRepository.preload(userBody);
            await userRepository.save(preloadedUser);

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
     * @memberof UserAdministrationController
     */
    public readonly deleteUser = async (request: Request, response: Response): Promise<void> => {
        try {
            const dataSource: DataSource = await createConnection();
            const usuarioId = +request.params.userID;

            await dataSource.getRepository(Usuario).delete(usuarioId);
            response.status(200).json({ result: true });
        } catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.status(500).json({ result: false });
        }
    }
}
