import { Router } from 'express';
import { ReportesController } from './reportes.controller';

const router = Router();
const controller = new ReportesController();

router.get('/dashboard', controller.getDashboardCompleto);

export default router;