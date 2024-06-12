import dotenv from 'dotenv';
// configura la data de configuracion cargada en el archivo .env
// algo parecido al environment en angular
dotenv.config();

import express from 'express';
import cors, { CorsOptions } from "cors";
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from './docs/swagger.json';

// aca se van a listar los controladores de las diferentes rutas
import {
    AuthenticationRoutes,
    DataRoutes,
    UserAdministrationRoutes,
    UserSettingsRoutes,
    informesRoutes
} from './controllers';

import { logger } from './loggin-service';
import { tokenValidator } from './middlewares/token-validator';
import { RolesRoutes } from './controllers/roles/rol.routes';
import { apiTokenValidator } from './middlewares/api-token-validator';
import { studiesIdentificationRoute } from './controllers/studies-identification/studies-identification.rotes';
//import { permissionsValidator } from './middlewares/permissions-validator';
//import { PERMISOS } from './constants';

logger.info('Iniciando servicio...');
const app = express();
const port = process.env.PORT;

// middleware para evitar error de CORS
const corsOptions: CorsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200
}
// middleware para parsear request json
app.use(express.json());

// Rutas a los controladores
app.use('/authentication', cors(corsOptions), AuthenticationRoutes);
// rutas protegidas por validacion de token
// Lista de estudios
app.use(
    '/list',
    cors(corsOptions),
    tokenValidator,
    //permissionsValidator([PERMISOS.VISUALIZAR_INFORMES]),
    DataRoutes
);

// settings de usuario
app.use(
    '/settings',
    cors(corsOptions),
    tokenValidator,
    UserSettingsRoutes
);

// roles
app.use(
    '/roles',
    cors(corsOptions),
    tokenValidator,
    //permissionsValidator([PERMISOS.ABM_USUARIOS]),
    RolesRoutes
);

// Administracion de usuarios
app.use(
    '/admin-users',
    cors(corsOptions),
    tokenValidator,
    //permissionsValidator([PERMISOS.ABM_USUARIOS]),
    UserAdministrationRoutes
);

// Administracion de Informes
app.use(
    '/informes',
    cors(corsOptions),
    tokenValidator,
    //permissionsValidator([PERMISOS.ABM_USUARIOS]),
    informesRoutes
);

app.use(
    '/study-identification',
    apiTokenValidator,
    studiesIdentificationRoute
);

// swagger
if (process.env.CONFIGURATION === 'dev') {
    logger.info("Configuracion DEV");
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.listen(port, () => logger.info(`API PACS Softime corriendo en el puerto ${port}`));
