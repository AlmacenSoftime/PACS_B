import Joi from "joi";
import * as jwt from 'jsonwebtoken';

import { logger } from "../../loggin-service";

export class AuthenticationController {
    private readonly schemaLogin = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(4).max(1024).required()
    });

    public readonly login = async (request, response): Promise<void> => {
        /*
            #swagger.path = '/authentication/login'
            #swagger.tag = 'Autenticacion'
            #swagger.method = 'post'
            #swagger.description = 'login'
            #swagger.produces = ['application/json']
            #swagger.parameters['loginRequest'] = {
                in: 'body',
                description: 'Objeto con email y password.',
                schema: { $ref: '#/definitions/loginRequest' }
            } 
        */
        // #swagger.responses[200]
        // #swagger.responses[401]
        const requestData: LoginRequest = request.body;

        // Valido el body que me traiga datos validos
        const { error } = this.schemaLogin.validate(requestData);
        if (error) { return response.status(400).json({ error: error.details }); }

        let user = null;
        // TODO: arreglar y llamar a la base/api o lo que sea
        if (requestData.password === "admin") {
            user = await Promise.resolve(MOCK_USER);
        }
        user = await Promise.reject(null);

        // si el controlador me trae un usuario, el login es correcto
        if (user) {
            // firmo un JWT y lo envio como respuesta
            const signedJWT = jwt.sign(
                user,
                process.env.TOKEN_SECRET,
                { expiresIn: process.env.TOKEN_DURATION || 600 }
            );
            logger.info(`${request.url} - Usuario ${user.fullName} logueado correctamente.`);
            return response.status(200).json(signedJWT);
        }

        // el login es invalido
        logger.warn(`${request.url} -Intento de login inválido con el mail ${requestData.email}`);
        return response.status(401).json({ message: 'Login inválido. Revise sus crendenciales.' });
    }

    public readonly user = async (request, response): Promise<void> => {
        const token = request.header('auth-token');
        if (!token) {
            logger.warn(`${request.url} -Acceso denegado. Intento de llamado sin token desde: ${request.ip}`);
            return response.status(401).json({ error: 'Access denied' });
        }
        try {
            // decodifico el token verificado. si la verificacion falla por cualquier motivo, el token no es valido y mando 401
            jwt.verify(token, process.env.TOKEN_SECRET)
            const decodedToken = jwt.decode(token);
            if (decodedToken == null) throw "error";
            return response.status(200).json(decodedToken);
        } catch (error) {
            return response.status(401).json({ error: 'Access denied' });
        }
    }

    public readonly refresh = async (request, response) => {
        const token = request.header('auth-token');
        if (!token) {
            logger.warn(`${request.url} - Acceso denegado. Intento de llamado sin token desde: ${request.ip}`);
            return response.status(401).json({ error: 'Access denied' });
        }
        try {
            const payload = jwt.verify(token, process.env.TOKEN_SECRET) as jwt.JwtPayload;
            if (payload == null) throw "error";
            delete payload.iat;
            delete payload.exp;
            delete payload.nbf;
            delete payload.jti;

            const refreshedToken = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_DURATION || 600 });

            return response.status(200).json(refreshedToken);

        } catch (error) {
            return response.status(401).json({ error: 'Access denied' });
        }
    }
}

interface LoginRequest {
    email: string;
    password: string;
}

interface User {
    id: number | string;
    fullName: string;
    roles: string[],
    profiles: string[]
}

// TODO: Usuario MOCK. Eliminar cuando se aplique la obtencion del usuario
const MOCK_USER: User = {
    id: 1,
    fullName: 'USUARIO DE PRUEBAS',
    roles: ['DOCTOR'],
    profiles: ['ADMIN']
}