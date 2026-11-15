import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getCiudades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/localizacion/ciudades`);
  }
  getPaises(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/localizacion/paises`);
  }
  getDepartamentos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/localizacion/departamentos`);
  }

  getEventos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/eventos`);
  }
  getEventoById(codigo: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/eventos/${codigo}`);
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
  deleteReserva(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/reservas/${id}`);
  }

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/clientes`);
  }
  getAgentes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/agentes`);
  }
  deletePersona(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/personas/${id}`);
  }

  getDashboardReportes(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/reportes/dashboard`);
  }
}