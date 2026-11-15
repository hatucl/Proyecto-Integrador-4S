import { Request, Response } from 'express';
import { LocalizacionService } from './localizacion.service';

const service = new LocalizacionService();

export class LocalizacionController {
  async getPaises(_req: Request, res: Response) {
    try {
      res.json(await service.getAllPaises());
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener países', detalle: error });
    }
  }

  async getPaisById(req: Request, res: Response) {
    try {
      const pais = await service.getPaisById(Number(req.params.id));
      if (!pais) return res.status(404).json({ error: 'País no encontrado' });
      res.json(pais);
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar país', detalle: error });
    }
  }

  async createPais(req: Request, res: Response) {
    try {
      const nuevo = await service.createPais(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ error: 'Error al registrar país', detalle: error });
    }
  }

  async updatePais(req: Request, res: Response) {
    try {
      const actualizado = await service.updatePais(Number(req.params.id), req.body);
      if (!actualizado) return res.status(404).json({ error: 'País no encontrado' });
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar país', detalle: error });
    }
  }

  async deletePais(req: Request, res: Response) {
    try {
      const eliminado = await service.deletePais(Number(req.params.id));
      if (!eliminado) return res.status(404).json({ error: 'País no encontrado' });
      res.json({ mensaje: 'País eliminado', eliminado });
    } catch (error) {
      res.status(400).json({ error: 'Error al eliminar país', detalle: error });
    }
  }

  async getDepartamentos(_req: Request, res: Response) {
    try {
      res.json(await service.getAllDepartamentos());
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener departamentos', detalle: error });
    }
  }

  async getDepartamentoById(req: Request, res: Response) {
    try {
      const depto = await service.getDepartamentoById(Number(req.params.id));
      if (!depto) return res.status(404).json({ error: 'Departamento no encontrado' });
      res.json(depto);
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar departamento', detalle: error });
    }
  }

  async createDepartamento(req: Request, res: Response) {
    try {
      const nuevo = await service.createDepartamento(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ error: 'Error al registrar departamento', detalle: error });
    }
  }

  async updateDepartamento(req: Request, res: Response) {
    try {
      const actualizado = await service.updateDepartamento(Number(req.params.id), req.body);
      if (!actualizado) return res.status(404).json({ error: 'Departamento no encontrado' });
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar departamento', detalle: error });
    }
  }

  async deleteDepartamento(req: Request, res: Response) {
    try {
      const eliminado = await service.deleteDepartamento(Number(req.params.id));
      if (!eliminado) return res.status(404).json({ error: 'Departamento no encontrado' });
      res.json({ mensaje: 'Departamento eliminado', eliminado });
    } catch (error) {
      res.status(400).json({ error: 'Error al eliminar departamento', detalle: error });
    }
  }

  async getCiudades(_req: Request, res: Response) {
    try {
      res.json(await service.getAllCiudades());
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener ciudades', detalle: error });
    }
  }

  async getCiudadById(req: Request, res: Response) {
    try {
      const ciudad = await service.getCiudadById(Number(req.params.id));
      if (!ciudad) return res.status(404).json({ error: 'Ciudad no encontrada' });
      res.json(ciudad);
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar ciudad', detalle: error });
    }
  }

  async createCiudad(req: Request, res: Response) {
    try {
      const nueva = await service.createCiudad(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: 'Error al registrar ciudad', detalle: error });
    }
  }

  async updateCiudad(req: Request, res: Response) {
    try {
      const actualizada = await service.updateCiudad(Number(req.params.id), req.body);
      if (!actualizada) return res.status(404).json({ error: 'Ciudad no encontrada' });
      res.json(actualizada);
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar ciudad', detalle: error });
    }
  }

  async deleteCiudad(req: Request, res: Response) {
    try {
      const eliminada = await service.deleteCiudad(Number(req.params.id));
      if (!eliminada) return res.status(404).json({ error: 'Ciudad no encontrada' });
      res.json({ mensaje: 'Ciudad eliminada', eliminada });
    } catch (error) {
      res.status(400).json({ error: 'Error al eliminar ciudad', detalle: error });
    }
  }
}