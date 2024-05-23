import { Request, Response } from "express";
import { DataSource } from "typeorm";
import bcrypt from 'bcrypt';
import Joi from "joi";
import jwt from 'jsonwebtoken';

import { logger } from "../../loggin-service";
import { Usuario } from "../../db-connection/models";
import { createConnection } from "../../db-connection/DbConnection";

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
        try {
            const dataSource: DataSource = await createConnection();

            // obtengo el json del body
            const requestData: LoginRequest = request.body;

            // Valido el body que me traiga datos validos (emial y password)
            const { error } = this.schemaLogin.validate(requestData);
            if (error) {
                response.status(400).json({ error: error.details });
                return;
            }

            // Obtengo al usuario desde la base de datos con su e-mail
            let userDb: Usuario = null;
            userDb = await dataSource.manager.findOne(Usuario,
                {
                    where:
                        { eMail: requestData.email },
                    relations: ['Roles', 'Roles.Permisos'],
                    loadEagerRelations: true
                }
            );

            if (userDb) {
                // comparo la password plana contra el hash de la base de datos
                if (await bcrypt.compare(requestData.password, userDb.password)) {
                    // Si el login es correcto, pero no tiene roles, se le prohibe el accesso
                    if (!userDb.Roles.length) {
                        logger.warn(`${request.url} - No existen roles asignados para el usuario ${requestData.email}`);
                        response.status(401).json({ message: 'Usuario sin permiso para acceder. Contacte con el administrador.' });
                        return;
                    }

                    // firmo un JWT y lo envio como respuesta
                    const signedJWT = jwt.sign(
                        {
                            userID: userDb.id,
                            usuario: userDb.usuario,
                            nombreCompleto: userDb.nombreApellido,
                            fotoPerfil: userDb.fotoPefil,
                            roles: Array.from(userDb.Roles || []),
                            email: userDb.eMail
                        },
                        process.env.TOKEN_SECRET,
                        { expiresIn: process.env.TOKEN_DURATION || 600 }
                    );
                    logger.info(`${request.url} - Usuario ${userDb.nombreApellido} logueado correctamente.`);
                    response.status(200).json(signedJWT);
                }
                else {
                    // el login es invalido
                    logger.warn(`${request.url} - Intento de login inválido con el mail ${requestData.email}`);
                    response.status(401).json({ message: 'Login inválido. Revise sus crendenciales.' });
                }
            }
            else {
                // si no trae registro, el email no esta registrdo
                logger.warn(`${request.url} - El email ${requestData.email} no se encuentra registrado`);
                response.status(401).json({ message: 'Login inválido. Revise sus crendenciales.' });
            }
        }
        catch (error) {
            // Error inesperado
            logger.warn(`${request.url} - Error inesperado ${JSON.stringify(error)}`);
            response.status(500).json({ message: 'Error Inesperado' });
        }
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
            logger.warn(`${request.url} - Acceso denegado. Intento de llamado sin token desde: ${request.ip}`);
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
            if (payload == null) throw "Error al verificar el token";
            delete payload.iat;
            delete payload.exp;
            delete payload.nbf;
            delete payload.jti;

            const refreshedToken = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_DURATION || 600 });

            response.status(200).json(refreshedToken);

        } catch (error) {
            logger.error(`Error en ${request.url} - ${error?.message ? error?.message : error}`);
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
