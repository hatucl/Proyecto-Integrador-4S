export interface Reserva {
  id_reserva?: number;
  id_cliente: string;
  codigo_evento: string;
  fecha_reserva?: string;
  numero_entradas: number;
  valor_total: number;
  observaciones?: string;
  estado: 'Reservada' | 'Confirmada' | 'Cancelada';
}