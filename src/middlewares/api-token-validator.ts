import { Request, Response, NextFunction } from 'express';

import { logger } from '../loggin-service';

// middleware que verifica la validez del token
// se usa para verificar que las llamadas las haga una api autorizada
export const apiTokenValidator = (request: Request, response: Response, next: NextFunction) => {
    const token = request.header('api-token');
    if (!token) {
        logger.warn(`Acceso denegado. Intento de llamado sin api token desde: ${request.ip}`);
        response.status(401).json({ error: 'Acceso denegado' });
        return;
    }
    try {
        const apiTokens = process.env.API_TOKENS.split("|");
        if (!apiTokens.includes(token)) { throw Error("Acceso Denegado"); }

        next(); // continuamos
    } catch (error) {
        logger.warn(`${request.path} - Llapado a la API con token invalido desde ip: ${request.ip}.`);
        response.status(401).json({ error: 'Token no es válido' });
    }
}
