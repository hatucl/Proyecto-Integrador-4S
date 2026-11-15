import { Router } from 'express';
import { LocalizacionController } from './localizacion.controller';

const router = Router();
const controller = new LocalizacionController();

router.get('/paises', controller.getPaises);
router.get('/paises/:id', controller.getPaisById);
router.post('/paises', controller.createPais);
router.put('/paises/:id', controller.updatePais);
router.delete('/paises/:id', controller.deletePais);

router.get('/departamentos', controller.getDepartamentos);
router.get('/departamentos/:id', controller.getDepartamentoById);
router.post('/departamentos', controller.createDepartamento);
router.put('/departamentos/:id', controller.updateDepartamento);
router.delete('/departamentos/:id', controller.deleteDepartamento);

router.get('/ciudades', controller.getCiudades);
router.get('/ciudades/:id', controller.getCiudadById);
router.post('/ciudades', controller.createCiudad);
router.put('/ciudades/:id', controller.updateCiudad);
router.delete('/ciudades/:id', controller.deleteCiudad);

export default router;