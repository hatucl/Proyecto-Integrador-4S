import { Router } from 'express';
import { PersonasController } from './personas.controller';

const router = Router();
const controller = new PersonasController();

router.post('/auth/login', controller.login);

router.get('/personas', controller.getPersonas);
router.delete('/personas/:id', controller.deletePersona);

router.get('/clientes', controller.getClientes);
router.get('/clientes/:id', controller.getClienteById);
router.post('/clientes', controller.createCliente);
router.put('/clientes/:id', controller.updateCliente);
router.delete('/clientes/:id', controller.deletePersona);

router.get('/agentes', controller.getAgentes);
router.get('/agentes/:id', controller.getAgenteById);
router.post('/agentes', controller.createAgente);
router.put('/agentes/:id', controller.updateAgente);
router.delete('/agentes/:id', controller.deletePersona);

router.get('/administradores', controller.getAdministradores);
router.get('/administradores/:id', controller.getAdministradorById);
router.post('/administradores', controller.createAdministrador);
router.put('/administradores/:id', controller.updateAdministrador);
router.delete('/administradores/:id', controller.deletePersona);

export default router;