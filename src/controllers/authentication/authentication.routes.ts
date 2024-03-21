import express, { Router } from 'express';
import * as jwt from 'jsonwebtoken';

import Joi from 'joi';

import { logger } from '../../loggin-service';
import { AuthenticationController, LoginRequest } from './authentication.controller';

const authenticationController = new AuthenticationController();

// creo un esquema del objeto login para validar que lo que venga sea correcto
const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(4).max(1024).required()
});
const AuthenticationRoutes: Router = express.Router();

// endpoint para realizar el login
AuthenticationRoutes.post('/login', async (req, res) => {
    const requestData: LoginRequest = req.body;

    // Valido el body que me traiga datos validos
    const { error } = schemaLogin.validate(requestData);
    if (error) { return res.status(400).json({ error: error.details }); }

    // Llamo al controlador para que verifique al usuario
    const user = await authenticationController.login(requestData).catch(() => {
        logger.warn(`${req.url} - usuario ${requestData.email} no encontrado.`);
        return null;
    });

    // si el controlador me trae un usuario, el login es correcto
    if (user) {
        // firmo un JWT y lo envio como respuesta
        const signedJWT = jwt.sign(
            user,
            process.env.TOKEN_SECRET,
            { expiresIn: process.env.TOKEN_DURATION || 600 }
        );
        logger.info(`${req.url} - Usuario ${user.fullName} logueado correctamente.`);
        return res.status(200).json(signedJWT);
    }

    // el login es invalido
    logger.warn(`${req.url} -Intento de login inválido con el mail ${requestData.email}`);
    return res.status(401).json({ message: 'Login inválido. Revise sus crendenciales.' });
});

// endpoint que devuelve el objeto "user" decodificado del token (si es valido)
AuthenticationRoutes.get('/user', (request, response) => {
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
});

// endpoint para que la app refresque el token de manera automatica
AuthenticationRoutes.post('/refresh', (request, response) => {
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
});

export { AuthenticationRoutes };
