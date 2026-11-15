import { pool } from '../../config/db';
import { ClienteDTO, AgenteDTO, AdministradorDTO } from './personas.model';

export class PersonasService {
  async login(correo: string, password: string) {
    const res = await pool.query(
      `SELECT p.identificacion, p.nombre_completo, p.correo, p.direccion, p.id_ciudad,
              c.puntos, c.recibir_publicidad,
              a.comision, a.anios_experiencia,
              adm.salario, adm.horario,
              CASE 
                WHEN adm.identificacion IS NOT NULL THEN 'admin'
                WHEN a.identificacion IS NOT NULL THEN 'agent'
                WHEN c.identificacion IS NOT NULL THEN 'client'
              END AS role
       FROM personas p
       LEFT JOIN clientes c ON p.identificacion = c.identificacion
       LEFT JOIN agentes a ON p.identificacion = a.identificacion
       LEFT JOIN administradores adm ON p.identificacion = adm.identificacion
       WHERE p.correo = $1 AND p.password = $2`,
      [correo, password]
    );
    return res.rows[0] || null;
  }

  private async guardarTelefonos(client: any, identificacion: string, telefonos?: string[]) {
    if (!telefonos || telefonos.length === 0) return;
    await client.query('DELETE FROM telefonos_persona WHERE identificacion_persona = $1', [identificacion]);
    for (const tel of telefonos) {
      if (tel.trim()) {
        await client.query(
          'INSERT INTO telefonos_persona (identificacion_persona, numero_telefono) VALUES ($1, $2)',
          [identificacion, tel.trim()]
        );
      }
    }
  }

  async getAllPersonas() {
    const res = await pool.query(`
      SELECT p.identificacion, p.nombre_completo, p.correo, p.direccion, p.id_ciudad,
             ci.nombre AS ciudad,
             COALESCE(array_agg(t.numero_telefono) FILTER (WHERE t.numero_telefono IS NOT NULL), '{}') AS telefonos
      FROM personas p
      JOIN ciudades ci ON p.id_ciudad = ci.id_ciudad
      LEFT JOIN telefonos_persona t ON p.identificacion = t.identificacion_persona
      GROUP BY p.identificacion, ci.nombre
      ORDER BY p.nombre_completo ASC
    `);
    return res.rows;
  }

  async deletePersona(identificacion: string) {
    const res = await pool.query('DELETE FROM personas WHERE identificacion = $1 RETURNING identificacion', [identificacion]);
    return res.rows[0];
  }

  async getAllClientes() {
    const res = await pool.query(`
      SELECT p.identificacion, p.nombre_completo, p.correo, p.direccion, p.id_ciudad,
             c.puntos, c.recibir_publicidad,
             COALESCE(array_agg(t.numero_telefono) FILTER (WHERE t.numero_telefono IS NOT NULL), '{}') AS telefonos
      FROM clientes c
      JOIN personas p ON c.identificacion = p.identificacion
      LEFT JOIN telefonos_persona t ON p.identificacion = t.identificacion_persona
      GROUP BY p.identificacion, c.puntos, c.recibir_publicidad
    `);
    return res.rows;
  }

  async getClienteById(id: string) {
    const res = await pool.query(`
      SELECT p.identificacion, p.nombre_completo, p.correo, p.direccion, p.id_ciudad,
             c.puntos, c.recibir_publicidad,
             COALESCE(array_agg(t.numero_telefono) FILTER (WHERE t.numero_telefono IS NOT NULL), '{}') AS telefonos
      FROM clientes c
      JOIN personas p ON c.identificacion = p.identificacion
      LEFT JOIN telefonos_persona t ON p.identificacion = t.identificacion_persona
      WHERE c.identificacion = $1
      GROUP BY p.identificacion, c.puntos, c.recibir_publicidad
    `, [id]);
    return res.rows[0];
  }

  async createCliente(data: ClienteDTO) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        'INSERT INTO personas (identificacion, nombre_completo, correo, password, direccion, id_ciudad) VALUES ($1, $2, $3, $4, $5, $6)',
        [data.identificacion, data.nombre_completo, data.correo, data.password, data.direccion, data.id_ciudad]
      );
      await client.query(
        'INSERT INTO clientes (identificacion, puntos, recibir_publicidad) VALUES ($1, $2, $3)',
        [data.identificacion, data.puntos ?? 0, data.recibir_publicidad ?? true]
      );
      await this.guardarTelefonos(client, data.identificacion, data.telefonos);
      await client.query('COMMIT');
      return await this.getClienteById(data.identificacion);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateCliente(id: string, data: ClienteDTO) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        'UPDATE personas SET nombre_completo = $1, correo = $2, direccion = $3, id_ciudad = $4 WHERE identificacion = $5',
        [data.nombre_completo, data.correo, data.direccion, data.id_ciudad, id]
      );
      await client.query(
        'UPDATE clientes SET puntos = $1, recibir_publicidad = $2 WHERE identificacion = $3',
        [data.puntos ?? 0, data.recibir_publicidad ?? true, id]
      );
      if (data.telefonos) {
        await this.guardarTelefonos(client, id, data.telefonos);
      }
      await client.query('COMMIT');
      return await this.getClienteById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getAllAgentes() {
    const res = await pool.query(`
      SELECT p.identificacion, p.nombre_completo, p.correo, p.direccion, p.id_ciudad,
             a.comision, a.anios_experiencia,
             COALESCE(array_agg(t.numero_telefono) FILTER (WHERE t.numero_telefono IS NOT NULL), '{}') AS telefonos
      FROM agentes a
      JOIN personas p ON a.identificacion = p.identificacion
      LEFT JOIN telefonos_persona t ON p.identificacion = t.identificacion_persona
      GROUP BY p.identificacion, a.comision, a.anios_experiencia
    `);
    return res.rows;
  }

  async getAgenteById(id: string) {
    const res = await pool.query(`
      SELECT p.identificacion, p.nombre_completo, p.correo, p.direccion, p.id_ciudad,
             a.comision, a.anios_experiencia,
             COALESCE(array_agg(t.numero_telefono) FILTER (WHERE t.numero_telefono IS NOT NULL), '{}') AS telefonos
      FROM agentes a
      JOIN personas p ON a.identificacion = p.identificacion
      LEFT JOIN telefonos_persona t ON p.identificacion = t.identificacion_persona
      WHERE a.identificacion = $1
      GROUP BY p.identificacion, a.comision, a.anios_experiencia
    `, [id]);
    return res.rows[0];
  }

  async createAgente(data: AgenteDTO) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        'INSERT INTO personas (identificacion, nombre_completo, correo, password, direccion, id_ciudad) VALUES ($1, $2, $3, $4, $5, $6)',
        [data.identificacion, data.nombre_completo, data.correo, data.password, data.direccion, data.id_ciudad]
      );
      await client.query(
        'INSERT INTO agentes (identificacion, comision, anios_experiencia) VALUES ($1, $2, $3)',
        [data.identificacion, data.comision ?? 5.0, data.anios_experiencia ?? 0]
      );
      await this.guardarTelefonos(client, data.identificacion, data.telefonos);
      await client.query('COMMIT');
      return await this.getAgenteById(data.identificacion);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateAgente(id: string, data: AgenteDTO) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        'UPDATE personas SET nombre_completo = $1, correo = $2, direccion = $3, id_ciudad = $4 WHERE identificacion = $5',
        [data.nombre_completo, data.correo, data.direccion, data.id_ciudad, id]
      );
      await client.query(
        'UPDATE agentes SET comision = $1, anios_experiencia = $2 WHERE identificacion = $3',
        [data.comision ?? 5.0, data.anios_experiencia ?? 0, id]
      );
      if (data.telefonos) {
        await this.guardarTelefonos(client, id, data.telefonos);
      }
      await client.query('COMMIT');
      return await this.getAgenteById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // ================= CRUD ADMINISTRADORES =================
  async getAllAdministradores() {
    const res = await pool.query(`
      SELECT p.identificacion, p.nombre_completo, p.correo, p.direccion, p.id_ciudad,
             adm.salario, adm.horario,
             COALESCE(array_agg(t.numero_telefono) FILTER (WHERE t.numero_telefono IS NOT NULL), '{}') AS telefonos
      FROM administradores adm
      JOIN personas p ON adm.identificacion = p.identificacion
      LEFT JOIN telefonos_persona t ON p.identificacion = t.identificacion_persona
      GROUP BY p.identificacion, adm.salario, adm.horario
    `);
    return res.rows;
  }

  async getAdministradorById(id: string) {
    const res = await pool.query(`
      SELECT p.identificacion, p.nombre_completo, p.correo, p.direccion, p.id_ciudad,
             adm.salario, adm.horario,
             COALESCE(array_agg(t.numero_telefono) FILTER (WHERE t.numero_telefono IS NOT NULL), '{}') AS telefonos
      FROM administradores adm
      JOIN personas p ON adm.identificacion = p.identificacion
      LEFT JOIN telefonos_persona t ON p.identificacion = t.identificacion_persona
      WHERE adm.identificacion = $1
      GROUP BY p.identificacion, adm.salario, adm.horario
    `, [id]);
    return res.rows[0];
  }

  async createAdministrador(data: AdministradorDTO) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        'INSERT INTO personas (identificacion, nombre_completo, correo, password, direccion, id_ciudad) VALUES ($1, $2, $3, $4, $5, $6)',
        [data.identificacion, data.nombre_completo, data.correo, data.password, data.direccion, data.id_ciudad]
      );
      await client.query(
        'INSERT INTO administradores (identificacion, salario, horario) VALUES ($1, $2, $3)',
        [data.identificacion, data.salario, data.horario]
      );
      await this.guardarTelefonos(client, data.identificacion, data.telefonos);
      await client.query('COMMIT');
      return await this.getAdministradorById(data.identificacion);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async updateAdministrador(id: string, data: AdministradorDTO) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        'UPDATE personas SET nombre_completo = $1, correo = $2, direccion = $3, id_ciudad = $4 WHERE identificacion = $5',
        [data.nombre_completo, data.correo, data.direccion, data.id_ciudad, id]
      );
      await client.query(
        'UPDATE administradores SET salario = $1, horario = $2 WHERE identificacion = $3',
        [data.salario, data.horario, id]
      );
      if (data.telefonos) {
        await this.guardarTelefonos(client, id, data.telefonos);
      }
      await client.query('COMMIT');
      return await this.getAdministradorById(id);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}