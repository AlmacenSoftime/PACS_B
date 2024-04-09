
import "reflect-metadata"
import { DataSource } from "typeorm"

import { Permiso, Rol, Usuario } from "./models";
import { logger } from "../loggin-service";

const dbConnection = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Usuario, Rol, Permiso],
    logging: true,
    logger: "advanced-console"
});

export const createConnection = async () => {
    try {
        return await dbConnection.initialize();
    } catch (err) {
        logger.error('DB: Error: ' + JSON.stringify(err));
        throw err;
    }
}
