import { Request, Response } from 'express';
import { PersonasService } from './personas.service';

const service = new PersonasService();

export class PersonasController {
  async login(req: Request, res: Response) {
    try {
      const { correo, password } = req.body;
      const usuario = await service.login(correo, password);
      if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Error en autenticación', detalle: error });
    }
  }

  async getPersonas(_req: Request, res: Response) {
    try {
      res.json(await service.getAllPersonas());
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar personas', detalle: error });
    }
  }

  async deletePersona(req: Request, res: Response) {
    try {
      const eliminado = await service.deletePersona(String(req.params.id));
      if (!eliminado) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json({ mensaje: 'Eliminado correctamente', eliminado });
    } catch (error) {
      res.status(400).json({ error: 'No se puede eliminar (tiene registros asociados)', detalle: error });
    }
  }

  async getClientes(_req: Request, res: Response) {
    try {
      res.json(await service.getAllClientes());
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar clientes', detalle: error });
    }
  }

  async getClienteById(req: Request, res: Response) {
    try {
      const cliente = await service.getClienteById(String(req.params.id));
      if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar cliente', detalle: error });
    }
  }

  async createCliente(req: Request, res: Response) {
    try {
      const nuevo = await service.createCliente(req.body);
      res.status(201).json(nuevo);
    } catch (error: any) {
      console.error('🔴 Error real en createCliente:', error);
      res.status(400).json({ 
        error: error.detail || error.message || 'Error al registrar cliente' 
      });
    }
  }

  async updateCliente(req: Request, res: Response) {
    try {
      const actualizado = await service.updateCliente(String(req.params.id), req.body);
      if (!actualizado) return res.status(404).json({ error: 'Cliente no encontrado' });
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar cliente', detalle: error });
    }
  }

  async getAgentes(_req: Request, res: Response) {
    try {
      res.json(await service.getAllAgentes());
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar agentes', detalle: error });
    }
  }

  async getAgenteById(req: Request, res: Response) {
    try {
      const agente = await service.getAgenteById(String(req.params.id));
      if (!agente) return res.status(404).json({ error: 'Agente no encontrado' });
      res.json(agente);
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar agente', detalle: error });
    }
  }

  async createAgente(req: Request, res: Response) {
    try {
      const nuevo = await service.createAgente(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ error: 'Error al registrar agente', detalle: error });
    }
  }

  async updateAgente(req: Request, res: Response) {
    try {
      const actualizado = await service.updateAgente(String(req.params.id), req.body);
      if (!actualizado) return res.status(404).json({ error: 'Agente no encontrado' });
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar agente', detalle: error });
    }
  }

  async getAdministradores(_req: Request, res: Response) {
    try {
      res.json(await service.getAllAdministradores());
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar administradores', detalle: error });
    }
  }

  async getAdministradorById(req: Request, res: Response) {
    try {
      const admin = await service.getAdministradorById(String(req.params.id));
      if (!admin) return res.status(404).json({ error: 'Administrador no encontrado' });
      res.json(admin);
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar administrador', detalle: error });
    }
  }

  async createAdministrador(req: Request, res: Response) {
    try {
      const nuevo = await service.createAdministrador(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ error: 'Error al registrar administrador', detalle: error });
    }
  }

  async updateAdministrador(req: Request, res: Response) {
    try {
      const actualizado = await service.updateAdministrador(String(req.params.id), req.body);
      if (!actualizado) return res.status(404).json({ error: 'Administrador no encontrado' });
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar administrador', detalle: error });
    }
  }
}