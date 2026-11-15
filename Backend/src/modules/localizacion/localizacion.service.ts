import { pool } from '../../config/db';
import { Pais, Departamento, Ciudad } from './localizacion.model';

export class LocalizacionService {
  async getAllPaises() {
    const res = await pool.query('SELECT * FROM paises ORDER BY id_pais ASC');
    return res.rows;
  }

  async getPaisById(id: number) {
    const res = await pool.query('SELECT * FROM paises WHERE id_pais = $1', [id]);
    return res.rows[0];
  }

  async createPais(data: Pais) {
    const res = await pool.query(
      'INSERT INTO paises (nombre) VALUES ($1) RETURNING *',
      [data.nombre]
    );
    return res.rows[0];
  }

  async updatePais(id: number, data: Pais) {
    const res = await pool.query(
      'UPDATE paises SET nombre = $1 WHERE id_pais = $2 RETURNING *',
      [data.nombre, id]
    );
    return res.rows[0];
  }

  async deletePais(id: number) {
    const res = await pool.query('DELETE FROM paises WHERE id_pais = $1 RETURNING *', [id]);
    return res.rows[0];
  }

  async getAllDepartamentos() {
    const res = await pool.query(`
      SELECT d.*, p.nombre AS nombre_pais 
      FROM departamentos d 
      JOIN paises p ON d.id_pais = p.id_pais 
      ORDER BY d.id_departamento ASC
    `);
    return res.rows;
  }

  async getDepartamentoById(id: number) {
    const res = await pool.query('SELECT * FROM departamentos WHERE id_departamento = $1', [id]);
    return res.rows[0];
  }

  async createDepartamento(data: Departamento) {
    const res = await pool.query(
      'INSERT INTO departamentos (nombre, id_pais) VALUES ($1, $2) RETURNING *',
      [data.nombre, data.id_pais]
    );
    return res.rows[0];
  }

  async updateDepartamento(id: number, data: Departamento) {
    const res = await pool.query(
      'UPDATE departamentos SET nombre = $1, id_pais = $2 WHERE id_departamento = $3 RETURNING *',
      [data.nombre, data.id_pais, id]
    );
    return res.rows[0];
  }

  async deleteDepartamento(id: number) {
    const res = await pool.query('DELETE FROM departamentos WHERE id_departamento = $1 RETURNING *', [id]);
    return res.rows[0];
  }

  async getAllCiudades() {
    const res = await pool.query(`
      SELECT c.*, d.nombre AS nombre_departamento, p.nombre AS nombre_pais
      FROM ciudades c
      JOIN departamentos d ON c.id_departamento = d.id_departamento
      JOIN paises p ON d.id_pais = p.id_pais
      ORDER BY c.id_ciudad ASC
    `);
    return res.rows;
  }

  async getCiudadById(id: number) {
    const res = await pool.query('SELECT * FROM ciudades WHERE id_ciudad = $1', [id]);
    return res.rows[0];
  }

  async createCiudad(data: Ciudad) {
    const res = await pool.query(
      'INSERT INTO ciudades (nombre, id_departamento) VALUES ($1, $2) RETURNING *',
      [data.nombre, data.id_departamento]
    );
    return res.rows[0];
  }

  async updateCiudad(id: number, data: Ciudad) {
    const res = await pool.query(
      'UPDATE ciudades SET nombre = $1, id_departamento = $2 WHERE id_ciudad = $3 RETURNING *',
      [data.nombre, data.id_departamento, id]
    );
    return res.rows[0];
  }

  async deleteCiudad(id: number) {
    const res = await pool.query('DELETE FROM ciudades WHERE id_ciudad = $1 RETURNING *', [id]);
    return res.rows[0];
  }
}