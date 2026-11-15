import { Request, Response } from 'express';
import { ReservasService } from './reservas.service';

const service = new ReservasService();

export class ReservasController {
  async getAll(_req: Request, res: Response) {
    try {
      res.json(await service.getAll());
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar reservas', detalle: error });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const reserva = await service.getById(Number(req.params.id));
      if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });
      res.json(reserva);
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar reserva', detalle: error });
    }
  }

  async getByCliente(req: Request, res: Response) {
    try {
      res.json(await service.getByCliente(String(req.params.idCliente)));
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar historial del cliente', detalle: error });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const nueva = await service.create(req.body);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear reserva', detalle: error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const actualizada = await service.update(Number(req.params.id), req.body);
      if (!actualizada) return res.status(404).json({ error: 'Reserva no encontrada' });
      res.json(actualizada);
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar reserva', detalle: error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const eliminada = await service.delete(Number(req.params.id));
      if (!eliminada) return res.status(404).json({ error: 'Reserva no encontrada' });
      res.json({ mensaje: 'Reserva eliminada', eliminada });
    } catch (error) {
      res.status(400).json({ error: 'Error al eliminar reserva', detalle: error });
    }
  }
}