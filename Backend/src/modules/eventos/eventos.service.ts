import { pool } from '../../config/db';
import { Evento } from './eventos.model';

export class EventosService {
  async getAll() {
    const res = await pool.query(`
      SELECT e.*, c.nombre AS nombre_ciudad, d.nombre AS nombre_departamento, p.nombre AS nombre_pais,
             per.nombre_completo AS nombre_agente,
             COALESCE((SELECT SUM(r.numero_entradas) FROM reservas r
                       WHERE r.codigo_evento = e.codigo_evento AND r.estado <> 'Cancelada'), 0)::int AS entradas_reservadas,
             GREATEST(e.capacidad_total - COALESCE((SELECT SUM(r.numero_entradas) FROM reservas r
                       WHERE r.codigo_evento = e.codigo_evento AND r.estado <> 'Cancelada'), 0), 0)::int AS disponibles
      FROM eventos e
      JOIN ciudades c ON e.id_ciudad = c.id_ciudad
      JOIN departamentos d ON c.id_departamento = d.id_departamento
      JOIN paises p ON d.id_pais = p.id_pais
      JOIN agentes a ON e.id_agente_creador = a.identificacion
      JOIN personas per ON a.identificacion = per.identificacion
      ORDER BY e.fecha_inicio ASC
    `);
    return res.rows;
  }

  async getById(codigo: string) {
    const res = await pool.query(`
      SELECT e.*, c.nombre AS nombre_ciudad, d.nombre AS nombre_departamento, p.nombre AS nombre_pais,
             per.nombre_completo AS nombre_agente,
             COALESCE((SELECT SUM(r.numero_entradas) FROM reservas r
                       WHERE r.codigo_evento = e.codigo_evento AND r.estado <> 'Cancelada'), 0)::int AS entradas_reservadas,
             GREATEST(e.capacidad_total - COALESCE((SELECT SUM(r.numero_entradas) FROM reservas r
                       WHERE r.codigo_evento = e.codigo_evento AND r.estado <> 'Cancelada'), 0), 0)::int AS disponibles
      FROM eventos e
      JOIN ciudades c ON e.id_ciudad = c.id_ciudad
      JOIN departamentos d ON c.id_departamento = d.id_departamento
      JOIN paises p ON d.id_pais = p.id_pais
      JOIN agentes a ON e.id_agente_creador = a.identificacion
      JOIN personas per ON a.identificacion = per.identificacion
      WHERE e.codigo_evento = $1
    `, [codigo]);
    return res.rows[0];
  }

  async create(data: Evento) {
    const res = await pool.query(
      `INSERT INTO eventos (
        codigo_evento, nombre, descripcion, teatro, id_ciudad, 
        fecha_inicio, fecha_fin, capacidad_total, precio_base, 
        observaciones, estado, id_agente_creador, categoria, destacado
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [
        data.codigo_evento, data.nombre, data.descripcion, data.teatro, data.id_ciudad,
        data.fecha_inicio, data.fecha_fin, data.capacidad_total, data.precio_base,
        data.observaciones || '', data.estado || 'Programado', data.id_agente_creador,
        data.categoria || 'Concierto', data.destacado ?? false
      ]
    );
    return res.rows[0];
  }

  async update(codigo: string, data: Evento) {
    const res = await pool.query(
      `UPDATE eventos SET 
        nombre = $1, descripcion = $2, teatro = $3, id_ciudad = $4,
        fecha_inicio = $5, fecha_fin = $6, capacidad_total = $7, precio_base = $8,
        observaciones = $9, estado = $10, categoria = $11, destacado = $12
       WHERE codigo_evento = $13 RETURNING *`,
      [
        data.nombre, data.descripcion, data.teatro, data.id_ciudad,
        data.fecha_inicio, data.fecha_fin, data.capacidad_total, data.precio_base,
        data.observaciones || '', data.estado,
        data.categoria || 'Concierto', data.destacado ?? false, codigo
      ]
    );
    return res.rows[0];
  }

  async delete(codigo: string) {
    const res = await pool.query('DELETE FROM eventos WHERE codigo_evento = $1 RETURNING *', [codigo]);
    return res.rows[0];
  }
}