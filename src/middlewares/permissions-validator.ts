import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { logger } from '../loggin-service';
import { Permiso } from '../db-connection/models';

// middleware que verifica la validez del token
// se usa para verificar que las llamadas las haga un usuario autenticado
export const permissionsValidator = (permisosRequeridos: number[]) => {
    return (request: Request, response: Response, next: NextFunction) => {
        const token = request.header('Auth-Token');
        if (!token) {
            logger.warn(`Acceso denegado. Intento de llamado sin token desde: ${request.ip}`);
            response.status(401).json({ error: 'Acceso denegado' });
            return;
        }
        try {
            const user = jwt.decode(token) as any;
            // Obtengo todos los permisos de los roles asignados al usuario
            const permisosUsuario: Array<Permiso> = [];
            (user.roles || user.Roles).forEach(r => permisosUsuario.concat(r.Permisos));
            const hasAllRequiedRoles = permisosRequeridos.every((p) => !!permisosUsuario.find(x => x.id === p));
            if (hasAllRequiedRoles)
                next(); // continuamos
            else
                response.status(401).json("No tiene permisos para acceder a esta funcionalidad");
        } catch (error) {
            const decodedToken = jwt.decode(token);
            logger.warn(`Usuario ${decodedToken ? decodedToken['nombreCompleto'] : 'desconocido'} usuario sin el rol correspondiente desde ip: ${request.ip}.`);
            response.status(401).json({ error: 'No tiene los roles requeridos para acceder a esta funcionalidad' });
        }
    }
}
