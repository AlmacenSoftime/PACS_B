import { Request, Response } from "express";
import Joi from "joi";
import jwt from 'jsonwebtoken';

import { logger } from "../../loggin-service";

/**
 * @description Controlador para manejar temas de autenticacion
 * @export
 * @class AuthenticationController
 */
export class AuthenticationController {

    // con esta propiedad creo un esquema para validar que lo objetos tengan esas propiedades
    private readonly schemaLogin = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(4).max(1024).required()
    });

    /**
     * @description Metodo para realizar el login. Obtiene el usuario de la base y firma el JWT.
     * Responde 401 en caso de token invalido
     * @param {Request} request
     * @param {Response} response
     * @memberof AuthenticationController
     */
    public readonly login = async (request: Request, response: Response): Promise<void> => {
        // obtengo el json del body
        const requestData: LoginRequest = request.body;

        // Valido el body que me traiga datos validos (emial y password)
        const { error } = this.schemaLogin.validate(requestData);
        if (error) {
            response.status(400).json({ error: error.details });
            return;
        }

        let user = null;
        // TODO: arreglar y llamar a la base/api o lo que sea
        if (requestData.password === "admin") {
            user = await Promise.resolve(MOCK_USER);
        }
        else {
            user = await Promise.resolve(null);
        }

        // si el controlador me trae un usuario, el login es correcto
        if (user) {
            // firmo un JWT y lo envio como respuesta
            const signedJWT = jwt.sign(
                user,
                process.env.TOKEN_SECRET,
                { expiresIn: process.env.TOKEN_DURATION || 600 }
            );
            logger.info(`${request.url} - Usuario ${user.fullName} logueado correctamente.`);
            response.status(200).json(signedJWT);
        }

        // el login es invalido
        logger.warn(`${request.url} -Intento de login inválido con el mail ${requestData.email}`);
        response.status(401).json({ message: 'Login inválido. Revise sus crendenciales.' });
    }

    /**
     * @description Decodifica el objeto User del token junto con los perfiles y roles.
     * Responde con 401 en caso de token invaldo
     * @param {Request} request
     * @param {Response} response
     * @memberof AuthenticationController
     */
    public readonly user = async (request: Request, response: Response): Promise<void> => {
        const token = request.header('Auth-Token');
        if (!token) {
            logger.warn(`${request.url} -Acceso denegado. Intento de llamado sin token desde: ${request.ip}`);
            response.status(401).json({ error: 'Access denied' });
            return;
        }
        try {
            // decodifico el token verificado. si la verificacion falla por cualquier motivo, el token no es valido y mando 401
            jwt.verify(token, process.env.TOKEN_SECRET)
            const decodedToken = jwt.decode(token);
            if (decodedToken == null) throw "error";
            response.status(200).json(decodedToken);
        } catch (error) {
            response.status(401).json({ error: 'Access denied' });
        }
    }

    /**
     * @description Actualiza un token valido cambiandolo por uno nuevo con los mismo datos y nuevo tiempo de expiracion.
     * Responde con 401 en caso de token invaldo
     * @param {Request} request
     * @param {Response} response
     * @memberof AuthenticationController
     */
    public readonly refresh = async (request: Request, response: Response): Promise<void> => {
        const token = request.header('Auth-Token');
        if (!token) {
            logger.warn(`${request.url} - Acceso denegado. Intento de llamado sin token desde: ${request.ip}`);
            response.status(401).json({ error: 'Access denied' });
            return;
        }
        try {
            const payload = jwt.verify(token, process.env.TOKEN_SECRET) as jwt.JwtPayload;
            if (payload == null) throw "error";
            delete payload.iat;
            delete payload.exp;
            delete payload.nbf;
            delete payload.jti;

            const refreshedToken = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_DURATION || 600 });

            response.status(200).json(refreshedToken);

        } catch (error) {
            response.status(401).json({ error: 'Access denied' });
        }
    }
}

/**
 * @description 
 * @interface LoginRequest
 */
interface LoginRequest {
    email: string;
    password: string;
}

/**
 * @description
 * @interface User
 */
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