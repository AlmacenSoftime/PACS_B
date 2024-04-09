import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { DataSource } from "typeorm";

import { Usuario } from "../../db-connection/models";
import { createConnection } from "../../db-connection/DbConnection";
import { logger } from "../../loggin-service";

export class UserAdministrationController {

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
            await dataSource.destroy();
        } catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.sendStatus(500);
        }
    }

    public readonly getUser = async (request: Request, response: Response): Promise<void> => {
        try {
            const usuario = request.params.userID;
            const dataSource = await createConnection();

            const user: Usuario = await dataSource.manager.findOne(Usuario, {
                where: { usuario },
                relations: ['Roles'],
                loadEagerRelations: true
            });

            response.status(200).json(user);
            await dataSource.destroy();
        } catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.sendStatus(500);
        }
    }

    public readonly createUser = async (request: Request, response: Response): Promise<void> => {
        try {
            const dataSource: DataSource = await createConnection();
            const userBody = request.body as Usuario;
            const entityUser = new Usuario();

            entityUser.Roles = userBody.Roles;
            entityUser.config = userBody.config;
            entityUser.eMail = userBody.eMail;
            entityUser.estado = 'HAB';
            entityUser.fotoPefil = userBody.fotoPefil;
            entityUser.nombreApellido = userBody.nombreApellido
            entityUser.prefijo = userBody.prefijo;
            entityUser.telefono = userBody.telefono;
            entityUser.usuario = userBody.usuario;
            entityUser.password = await bcrypt.hash(userBody.password, 10);

            response.sendStatus(200);

            await dataSource.manager.save(entityUser);
            await dataSource.destroy();
        } catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.sendStatus(500);
        }
    }

    public readonly putUser = async (request: Request, response: Response): Promise<void> => {
        try {
            const dataSource: DataSource = await createConnection();
            const usuarioId = +request.params.userID;
            const userBody = request.body as Usuario;

            await dataSource.getRepository(Usuario)
                .update(usuarioId,
                    {
                        Roles: userBody.Roles,
                        config: userBody.config,
                        eMail: userBody.eMail,
                        estado: 'HAB',
                        fotoPefil: userBody.fotoPefil,
                        //id: userBody.id,
                        nombreApellido: userBody.nombreApellido,
                        prefijo: userBody.prefijo,
                        telefono: userBody.telefono,
                        usuario: userBody.usuario
                    }
                );

            if (userBody.password) {
                await dataSource.getRepository(Usuario)
                    .update(userBody.id,
                        {
                            password: await bcrypt.hash(userBody.password, 10)
                        }
                    );
            }

            response.sendStatus(200);
            await dataSource.destroy();
        } catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.sendStatus(500);
        }
    }

    public readonly deleteUser = async (request: Request, response: Response): Promise<void> => {
        try {
            const dataSource: DataSource = await createConnection();
            const usuarioId = +request.params.userID;

            await dataSource.getRepository(Usuario).delete(usuarioId);
            response.sendStatus(200);
            await dataSource.destroy();
        } catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.sendStatus(500);
        }
    }
}
