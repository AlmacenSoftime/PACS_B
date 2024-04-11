import { Request, Response } from "express";
import { DataSource } from "typeorm";

import { logger } from "../../loggin-service";
import { createConnection } from "../../db-connection/DbConnection";
import { Rol } from "../../db-connection/models";

/**
 * @description controlador para obtener roles
 * TODO: crear y borrar roles
 * @export
 * @class RolController
 */
export class RolController {

    /**
     * @description Obtiene los roles junto con los permisos asignados
     * @param {Request} request
     * @param {Response} response
     * @memberof RolController
     */
    public readonly getRoles = async (request: Request, response: Response): Promise<void> => {
        try {
            const dataSource: DataSource = await createConnection();
            const roles: Rol[] = await dataSource.getRepository(Rol).find({ relations: ['Permisos'], loadEagerRelations: true });
            response.status(200).json(roles);
        } catch (error) {
            logger.error(`${request.url} - Error inesperado: ${JSON.stringify(error)}`);
            response.sendStatus(500);
        }
    }
}
