import express from 'express';
import cors, { CorsOptions } from "cors";
import dotenv from 'dotenv';
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

logger.info('Iniciando servicio...');

// configura la data de configuracion cargada en el archivo .env
// algo parecido al environment en angular
dotenv.config();

const app = express();
const port = process.env.PORT;

// middleware para evitar error de CORS
const corsOptions: CorsOptions = {
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
// middleware para parsear request json
app.use(express.json());

// Rutas a los controladores
app.use('/authentication', AuthenticationRoutes);
// rutas protegidas por validacion de token
app.use('/list', tokenValidator, DataRoutes);
app.use('/settings', tokenValidator, UserSettingsRoutes);

// swagger
if (process.env.CONFIGURATION === 'dev') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.listen(port, () => logger.info(`API PACS Softime corriendo en el puerto ${port}`));
