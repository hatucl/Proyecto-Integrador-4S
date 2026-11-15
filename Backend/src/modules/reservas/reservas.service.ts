import { pool } from '../../config/db';
import { Reserva } from './reservas.model';

export class ReservasService {
  async getAll() {
    const res = await pool.query(`
      SELECT r.*, p.nombre_completo AS nombre_cliente, p.correo AS correo_cliente,
             e.nombre AS nombre_evento, e.teatro, e.fecha_inicio
      FROM reservas r
      JOIN clientes c ON r.id_cliente = c.identificacion
      JOIN personas p ON c.identificacion = p.identificacion
      JOIN eventos e ON r.codigo_evento = e.codigo_evento
      ORDER BY r.fecha_reserva DESC
    `);
    return res.rows;
  }

  async getById(id: number) {
    const res = await pool.query('SELECT * FROM reservas WHERE id_reserva = $1', [id]);
    return res.rows[0];
  }

  async getByCliente(idCliente: string) {
    const res = await pool.query(`
      SELECT r.*, e.nombre AS nombre_evento, e.teatro, e.fecha_inicio, ci.nombre AS ciudad
      FROM reservas r
      JOIN eventos e ON r.codigo_evento = e.codigo_evento
      JOIN ciudades ci ON e.id_ciudad = ci.id_ciudad
      WHERE r.id_cliente = $1
      ORDER BY r.fecha_reserva DESC
    `, [idCliente]);
    return res.rows;
  }

  async create(data: Reserva) {
    const res = await pool.query(
      `INSERT INTO reservas (id_cliente, codigo_evento, numero_entradas, valor_total, observaciones, estado)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [data.id_cliente, data.codigo_evento, data.numero_entradas, data.valor_total, data.observaciones || '', data.estado || 'Reservada']
    );
    return res.rows[0];
  }

  async update(id: number, data: Partial<Reserva>) {
    const res = await pool.query(
      `UPDATE reservas SET 
        numero_entradas = COALESCE($1, numero_entradas),
        valor_total = COALESCE($2, valor_total),
        observaciones = COALESCE($3, observaciones),
        estado = COALESCE($4, estado)
       WHERE id_reserva = $5 RETURNING *`,
      [data.numero_entradas, data.valor_total, data.observaciones, data.estado, id]
    );
    return res.rows[0];
  }

  async delete(id: number) {
    const res = await pool.query('DELETE FROM reservas WHERE id_reserva = $1 RETURNING *', [id]);
    return res.rows[0];
  }
}