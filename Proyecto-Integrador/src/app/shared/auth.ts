import { Injectable, signal, afterNextRender } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService { 
  currentUser = signal<any>(null);

  private staffUsers = [
    { nombre: 'Super Admin', correo: 'admin@gametickets.com', password: 'admin123', role: 'admin' },
    { nombre: 'Agente Ventas', correo: 'agente@gametickets.com', password: 'agente123', role: 'agent' }
  ];

  constructor(private router: Router) {
    afterNextRender(() => {
      const savedUser = localStorage.getItem('sesionActiva');
      if (savedUser) {
        this.currentUser.set(JSON.parse(savedUser));
      }
    });
  }

  registrarCliente(datos: { nombre: string, correo: string, password: string }): boolean {
    if (typeof localStorage === 'undefined') return false;

    const clientesGuardados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
    
    const existe = clientesGuardados.some((u: any) => u.correo === datos.correo);
    if (existe) return false;

    const nuevoCliente = { ...datos, role: 'client' };
    clientesGuardados.push(nuevoCliente);
    localStorage.setItem('usuariosRegistrados', JSON.stringify(clientesGuardados));
    return true;
  }

  loginCliente(correo: string, password: string): boolean {
    if (typeof localStorage === 'undefined') return false;

    const clientesGuardados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
    const usuarioEncontrado = clientesGuardados.find(
      (u: any) => u.correo === correo && u.password === password
    );

    if (usuarioEncontrado) {
      this.establecerSesion(usuarioEncontrado);
      return true;
    }
    return false;
  }

  loginStaff(correo: string, password: string): any {
    const staffEncontrado = this.staffUsers.find(
      (u) => u.correo === correo && u.password === password
    );

    if (staffEncontrado) {
      this.establecerSesion(staffEncontrado);
      return staffEncontrado;
    }
    return null;
  }

  private establecerSesion(usuario: any) {
    this.currentUser.set(usuario);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('sesionActiva', JSON.stringify(usuario));
    }
  }

  cerrarSesion() {
    this.currentUser.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('sesionActiva');
    }
    this.router.navigate(['/login']);
  }
}