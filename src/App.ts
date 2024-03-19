import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';

import { AuthenticationRoutes } from './controllers/authentication/authentication.routes';
import { DataRoutes } from './controllers/data/data.routes';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(express.json());

// Rutas a los controladores
app.use('/authentication', AuthenticationRoutes);
app.use('/list', DataRoutes);

// endpoint de prueba
app.get('/test', (req, res) => { res.send('Hello World!'); });

app.listen(port, () => console.log(`API PACS Softime corriendo en el puerto ${port}`));
