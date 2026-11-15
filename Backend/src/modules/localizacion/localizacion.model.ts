export interface Pais {
  id_pais?: number;
  nombre: string;
}

export interface Departamento {
  id_departamento?: number;
  nombre: string;
  id_pais: number;
}

export interface Ciudad {
  id_ciudad?: number;
  nombre: string;
  id_departamento: number;
}