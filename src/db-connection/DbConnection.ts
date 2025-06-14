
import "reflect-metadata"
import { DataSource } from "typeorm"

import {
    EstudioInforme,
    Modalidad,
    ParametrosSistema,
    Permiso,
    Rol,
    Usuario
} from "./models";
import { logger } from "../loggin-service";

const debugMode = true//process.env.CONFIGURATION === 'dev';

const dbConnection = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        Usuario,
        Rol,
        Permiso,
        EstudioInforme,
        Modalidad,
        ParametrosSistema
    ],
    logger: "advanced-console",
    logging: debugMode,
    poolSize: +process.env.DB_CONNECTION_POOL_SIZE || 20,
    acquireTimeout: +process.env.DB_CONNECTION_TIMEOUT || 60000,
    extra: {
        connectionLimit: 20,
        acquireTimeout: 60000,
        timeout: 60000,
    },
});

let isConnecting = false;

export const createConnection = async (): Promise<DataSource> => {
    return new Promise(async (resolve, reject) => {
        try {
            if (dbConnection.isInitialized || isConnecting) {
                if (isConnecting) {
                    setTimeout(() => {
                        resolve(dbConnection);
                    }, 1000);
                }
                else {
                    resolve(dbConnection);
                }
            } else {
                isConnecting = true;
                return resolve(await dbConnection.initialize().finally(() => isConnecting = false));
            }
        } catch (err) {
            logger.error('DB: Error: ' + JSON.stringify(err));
            reject(err);
        }
    });
}
