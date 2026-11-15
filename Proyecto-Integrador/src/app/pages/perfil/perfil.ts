import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/auth';
import { ApiService } from '../../shared/api.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class Perfil implements OnInit {
  reservas = signal<any[]>([]);

  constructor(
    public authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user && user.role === 'client') {
      this.cargarReservas(user.identificacion);
    }
  }

  cargarReservas(idCliente: string) {
    this.apiService.getReservasByCliente(idCliente).subscribe({
      next: (data) => this.reservas.set(data),
      error: (err) => console.error('Error cargando historial de reservas', err)
    });
  }
}