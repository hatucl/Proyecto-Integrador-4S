import { Request, Response } from 'express';
import { ReportesService } from './reportes.service';

const service = new ReportesService();

export class ReportesController {
  async getDashboardCompleto(_req: Request, res: Response) {
    try {
      const [
        general,
        promedioAgente,
        promedioCliente,
        ingresosMes2026,
        reservasEventoMes2026,
        eventosAgenteCiudad,
        eventosUbicacion,
        reservasCanceladas,
        eventosCancelados
      ] = await Promise.all([
        service.getConteoGeneral(),
        service.getPromedioIngresosAgente(),
        service.getPromedioIngresosCliente(),
        service.getIngresosPorMes2026(),
        service.getReservasPorEventoYMes2026(),
        service.getEventosPorAgenteYCiudad(),
        service.getEventosPorUbicacion(),
        service.getReservasCanceladas(),
        service.getEventosCancelados()
      ]);

      res.json({
        general,
        comerciales: {
          promedioAgente,
          promedioCliente,
          ingresosMes2026,
          reservasEventoMes2026,
          eventosAgenteCiudad
        },
        cobertura: eventosUbicacion,
        cancelaciones: {
          reservasCanceladas,
          eventosCancelados
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al generar reportes del sistema', detalle: error });
    }
  }
}