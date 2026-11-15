import { Injectable, signal, afterNextRender } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  currentUser = signal<any>(null);

  constructor(private http: HttpClient, private router: Router) {
    afterNextRender(() => {
      const savedUser = localStorage.getItem('sesionActiva');
      if (savedUser) {
        this.currentUser.set(JSON.parse(savedUser));
      }
    });
  }

  login(correo: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { correo, password }).pipe(
      tap((usuario) => {
        this.currentUser.set(usuario);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('sesionActiva', JSON.stringify(usuario));
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
      localStorage.removeItem('sesionActiva');
    }
    this.router.navigate(['/login']);
  }
}