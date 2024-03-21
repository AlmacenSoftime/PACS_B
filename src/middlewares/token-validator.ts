import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { logger } from '../loggin-service';

// middleware que verifica la validez del token
// se usa para verificar que las llamadas las haga un usuario autenticado
export const tokenValidator = (request: Request, response: Response, next: NextFunction) => {
    const token = request.header('Auth-Token');
    if (!token) {
        logger.warn('Acceso denegado. Intento de llamado sin token desde: ' + request.ip);
        return response.status(401).json({ error: 'Acceso denegado' });
    }

    try {
        jwt.verify(token, process.env.TOKEN_SECRET);
        next() // continuamos
    } catch (error) {
        const decodedToken = jwt.decode(token);
        logger.warn(`Usuario ${decodedToken ? decodedToken['fullName'] : 'desconocido'} con token invalido desde ip: ${request.ip}.`);
        response.status(401).json({ error: 'Token no es válido' });
    }
}
