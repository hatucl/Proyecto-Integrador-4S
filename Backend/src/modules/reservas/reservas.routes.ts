import { Router } from 'express';
import { ReservasController } from './reservas.controller';

const router = Router();
const controller = new ReservasController();

router.get('/', controller.getAll);
router.get('/cliente/:idCliente', controller.getByCliente);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;