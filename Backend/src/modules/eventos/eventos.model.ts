export interface Evento {
  codigo_evento: string;
  nombre: string;
  descripcion: string;
  teatro: string;
  id_ciudad: number;
  fecha_inicio: string;
  fecha_fin: string;
  capacidad_total: number;
  precio_base: number;
  observaciones?: string;
  estado: 'Programado' | 'En Boletería' | 'En Vivo' | 'Finalizado' | 'Cancelado';
  categoria?: string;
  destacado?: boolean;
  id_agente_creador: string;
}