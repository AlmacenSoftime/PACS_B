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
    UserSettingsRoutes
} from './controllers';

import { logger } from './loggin-service';
import { tokenValidator } from './middlewares/token-validator';
import { UserAdministrationRoutes } from './controllers/users-administrations/users.administration.routes';
import { RolesRoutes } from './controllers/roles/rol.routes';
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
app.use(cors(corsOptions));
// middleware para parsear request json
app.use(express.json());

// Rutas a los controladores
app.use('/authentication', AuthenticationRoutes);
// rutas protegidas por validacion de token
// Lista de estudios
app.use(
    '/list',
    tokenValidator,
    //permissionsValidator([PERMISOS.VISUALIZAR_INFORMES]),
    DataRoutes
);

// settings de usuario
app.use(
    '/settings',
    tokenValidator,
    UserSettingsRoutes
);

// roles
app.use(
    '/roles',
    tokenValidator,
    //permissionsValidator([PERMISOS.ABM_USUARIOS]),
    RolesRoutes
);

// Administracion de usuarios
app.use(
    '/admin-users',
    tokenValidator,
    //permissionsValidator([PERMISOS.ABM_USUARIOS]),
    UserAdministrationRoutes
);

// swagger
if (process.env.CONFIGURATION === 'dev') {
    logger.info("Configuracion DEV");
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.listen(port, () => logger.info(`API PACS Softime corriendo en el puerto ${port}`));
