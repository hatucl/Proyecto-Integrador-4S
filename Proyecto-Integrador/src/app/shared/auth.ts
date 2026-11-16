import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_URL } from './api.config';

const SESSION_KEY = 'sesionActiva';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = API_URL;
  currentUser = signal<any>(this.leerSesion());

  constructor(private http: HttpClient, private router: Router) {}

  // La sesión se restaura de inmediato (antes de que corran los guards de ruta),
  // así al recargar /agent o /admin no se pierde el acceso.
  private leerSesion(): any {
    if (typeof localStorage === 'undefined') return null;
    try {
      const guardada = localStorage.getItem(SESSION_KEY);
      return guardada ? JSON.parse(guardada) : null;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  login(correo: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { correo, password }).pipe(
      tap((usuario) => {
        this.currentUser.set(usuario);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
        }
      })
    );
  }

  registrarCliente(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes`, datos);
  }

  registrarAgente(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/agentes`, datos);
  }

  cerrarSesion() {
    this.currentUser.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
    }
    this.router.navigate(['/login']);
  }
}
