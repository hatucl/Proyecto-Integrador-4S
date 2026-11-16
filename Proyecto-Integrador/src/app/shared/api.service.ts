import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from './api.config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = API_URL;

  constructor(private http: HttpClient) {}

  // Localización
  getCiudades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/localizacion/ciudades`);
  }

  // Eventos
  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/eventos`);
  }
  createEvento(evento: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/eventos`, evento);
  }
  updateEvento(codigo: string, evento: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/eventos/${codigo}`, evento);
  }
  deleteEvento(codigo: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/eventos/${codigo}`);
  }

  // Reservas
  getReservas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reservas`);
  }
  getReservasByCliente(idCliente: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/reservas/cliente/${idCliente}`);
  }
  createReserva(reserva: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/reservas`, reserva);
  }
  updateReserva(id: number, datos: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/reservas/${id}`, datos);
  }

  // Personas
  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/clientes`);
  }
  getAgentes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/agentes`);
  }
  deletePersona(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/personas/${id}`);
  }

  // Reportes
  getDashboardReportes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/reportes/dashboard`);
  }
}
