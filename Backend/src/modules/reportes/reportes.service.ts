import { pool } from '../../config/db';

export class ReportesService {
  async getConteoGeneral() {
    const res = await pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM clientes) AS total_clientes,
        (SELECT COUNT(*)::int FROM agentes) AS total_agentes,
        (SELECT COUNT(*)::int FROM administradores) AS total_administradores,
        (SELECT COUNT(*)::int FROM reservas) AS total_reservas,
        (SELECT COUNT(*)::int FROM eventos) AS total_eventos
    `);
    return res.rows[0];
  }

  async getPromedioIngresosAgente() {
    const res = await pool.query(`
      SELECT p.identificacion, p.nombre_completo AS agente,
             COALESCE(AVG(r.valor_total), 0)::numeric(12,2) AS promedio_ingresos,
             COALESCE(SUM(r.valor_total), 0)::numeric(12,2) AS total_ingresos
      FROM agentes a
      JOIN personas p ON a.identificacion = p.identificacion
      LEFT JOIN eventos e ON a.identificacion = e.id_agente_creador
      LEFT JOIN reservas r ON e.codigo_evento = r.codigo_evento AND r.estado != 'Cancelada'
      GROUP BY p.identificacion, p.nombre_completo
    `);
    return res.rows;
  }

  async getPromedioIngresosCliente() {
    const res = await pool.query(`
      SELECT p.identificacion, p.nombre_completo AS cliente,
             COALESCE(AVG(r.valor_total), 0)::numeric(12,2) AS promedio_gasto,
             COALESCE(SUM(r.valor_total), 0)::numeric(12,2) AS total_gasto
      FROM clientes c
      JOIN personas p ON c.identificacion = p.identificacion
      LEFT JOIN reservas r ON c.identificacion = r.id_cliente AND r.estado != 'Cancelada'
      GROUP BY p.identificacion, p.nombre_completo
    `);
    return res.rows;
  }

  async getIngresosPorMes2026() {
    const res = await pool.query(`
      SELECT EXTRACT(MONTH FROM fecha_reserva)::int AS mes,
             TO_CHAR(fecha_reserva, 'TMMonth') AS nombre_mes,
             COALESCE(SUM(valor_total), 0)::numeric(12,2) AS ingresos_totales
      FROM reservas
      WHERE EXTRACT(YEAR FROM fecha_reserva) = 2026 AND estado != 'Cancelada'
      GROUP BY mes, nombre_mes
      ORDER BY mes ASC
    `);
    return res.rows;
  }

  async getReservasPorEventoYMes2026() {
    const res = await pool.query(`
      SELECT e.codigo_evento, e.nombre AS evento,
             EXTRACT(MONTH FROM r.fecha_reserva)::int AS mes,
             COUNT(r.id_reserva)::int AS cantidad_reservas
      FROM eventos e
      LEFT JOIN reservas r ON e.codigo_evento = r.codigo_evento 
        AND EXTRACT(YEAR FROM r.fecha_reserva) = 2026
      GROUP BY e.codigo_evento, e.nombre, mes
      ORDER BY e.nombre, mes
    `);
    return res.rows;
  }

  async getEventosPorAgenteYCiudad() {
    const res = await pool.query(`
      SELECT p.nombre_completo AS agente, c.nombre AS ciudad,
             COUNT(e.codigo_evento)::int AS cantidad_eventos
      FROM agentes a
      JOIN personas p ON a.identificacion = p.identificacion
      LEFT JOIN eventos e ON a.identificacion = e.id_agente_creador
      LEFT JOIN ciudades c ON e.id_ciudad = c.id_ciudad
      GROUP BY p.nombre_completo, c.nombre
      ORDER BY cantidad_eventos DESC
    `);
    return res.rows;
  }

  async getEventosPorUbicacion() {
    const res = await pool.query(`
      SELECT pa.nombre AS pais, d.nombre AS departamento, c.nombre AS ciudad,
             e.codigo_evento, e.nombre AS evento, e.teatro, e.estado, e.precio_base
      FROM eventos e
      JOIN ciudades c ON e.id_ciudad = c.id_ciudad
      JOIN departamentos d ON c.id_departamento = d.id_departamento
      JOIN paises pa ON d.id_pais = pa.id_pais
      ORDER BY pa.nombre, d.nombre, c.nombre
    `);
    return res.rows;
  }

  async getReservasCanceladas() {
    const res = await pool.query(`
      SELECT r.id_reserva, r.fecha_reserva, r.numero_entradas, r.valor_total,
             r.observaciones AS causa_cancelacion,
             p.nombre_completo AS cliente, e.nombre AS evento
      FROM reservas r
      JOIN personas p ON r.id_cliente = p.identificacion
      JOIN eventos e ON r.codigo_evento = e.codigo_evento
      WHERE r.estado = 'Cancelada'
    `);
    return res.rows;
  }

  async getEventosCancelados() {
    const res = await pool.query(`
      SELECT e.codigo_evento, e.nombre AS evento, e.teatro, e.fecha_inicio,
             e.observaciones AS causa_cancelacion,
             p.nombre_completo AS agente_responsable
      FROM eventos e
      JOIN personas p ON e.id_agente_creador = p.identificacion
      WHERE e.estado = 'Cancelado'
    `);
    return res.rows;
  }
}