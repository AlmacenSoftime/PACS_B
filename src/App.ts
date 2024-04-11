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
app.use(nocache);

// Rutas a los controladores
app.use('/authentication', AuthenticationRoutes);
// rutas protegidas por validacion de token
app.use('/list', tokenValidator, DataRoutes);
app.use('/settings', tokenValidator, UserSettingsRoutes);
app.use('/roles', tokenValidator, RolesRoutes);
app.use('/admin-users', tokenValidator,/* permissionsValidator([]),*/ UserAdministrationRoutes);

console.log({ CONFIGURATION: process.env.CONFIGURATION });

// swagger
if (process.env.CONFIGURATION === 'dev') {
    logger.info("Configuracion DEV");
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.listen(port, () => logger.info(`API PACS Softime corriendo en el puerto ${port}`));

function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}
