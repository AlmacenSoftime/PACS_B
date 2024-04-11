
import "reflect-metadata"
import { DataSource } from "typeorm"

import { Permiso, Rol, Usuario } from "./models";
import { logger } from "../loggin-service";

const debugMode = process.env.CONFIGURATION === 'dev';

const dbConnection = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Usuario, Rol, Permiso],
    poolSize: 100,
    logger: "advanced-console",
    logging: debugMode
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
