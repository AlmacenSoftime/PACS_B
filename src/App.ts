import express from 'express';
import cors from "cors";
import * as dotenv from 'dotenv';


import { AuthenticationRoutes } from './controllers/authentication.routes';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors())

app.use(express.json());

// Rutas a los controladores
app.use('/authentication', AuthenticationRoutes);

// endpoint de prueba
app.get('/test', (req, res) => { res.send('Hello World!'); });

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});