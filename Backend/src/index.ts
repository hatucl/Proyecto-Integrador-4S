import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/db';
import localizacionRoutes from './modules/localizacion/localizacion.routes';
import personasRoutes from './modules/personas/personas.routes';
import reportesRoutes from './modules/reportes/reportes.routes';
import reservasRoutes from './modules/reservas/reservas.routes';
import eventosRoutes from './modules/eventos/eventos.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'API Sistema de Eventos funcionando' });
});

app.use('/api/localizacion', localizacionRoutes);
app.use('/api', personasRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/eventos', eventosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});