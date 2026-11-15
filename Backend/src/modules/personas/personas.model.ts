export interface PersonaBase {
  identificacion: string;
  nombre_completo: string;
  correo: string;
  password?: string;
  direccion: string;
  id_ciudad: number;
  telefonos?: string[];
}

export interface ClienteDTO extends PersonaBase {
  puntos?: number;
  recibir_publicidad?: boolean;
}

export interface AgenteDTO extends PersonaBase {
  comision?: number;
  anios_experiencia?: number;
}

export interface AdministradorDTO extends PersonaBase {
  salario: number;
  horario: string;
}