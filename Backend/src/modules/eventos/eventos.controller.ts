import { Request, Response } from 'express';
import { EventosService } from './eventos.service';

const service = new EventosService();

export class EventosController {
  async getAll(_req: Request, res: Response) {
    try {
      res.json(await service.getAll());
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar eventos', detalle: error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const evento = await service.getById(String(req.params.id));
      if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
      res.json(evento);
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar evento', detalle: error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const nuevo = await service.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear evento', detalle: error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const actualizado = await service.update(String(req.params.id), req.body);
      if (!actualizado) return res.status(404).json({ error: 'Evento no encontrado' });
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar evento', detalle: error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const eliminado = await service.delete(String(req.params.id));
      if (!eliminado) return res.status(404).json({ error: 'Evento no encontrado' });
      res.json({ mensaje: 'Evento eliminado', eliminado });
    } catch (error) {
      res.status(400).json({ error: 'Error al eliminar evento', detalle: error });
    }
  }
}