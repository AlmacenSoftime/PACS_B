import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { logger } from '../loggin-service';

export const tokenValidator = (request: Request, response: Response, next: NextFunction) => {
    const token = request.header('Auth-Token');    
    if (!token) {
        logger.warn('Acceso denegado. Intento de llamado sin token desde: ' + request.ip);
        return response.status(401).json({ error: 'Access denied' });
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        console.log(verified);
        
        //request.user = verified

        next() // continuamos
    } catch (error) {
        const decodedToken = jwt.decode(token);
        logger.warn(`Usuario ${decodedToken['fullName']} con token invalido.`);
        response.status(400).json({ error: 'token no es válido' });
    }
}