import { Request, Response } from "express";
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
        response.json();
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
}