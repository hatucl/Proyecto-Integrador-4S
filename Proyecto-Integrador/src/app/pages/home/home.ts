import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  eventos = signal<any[]>([]);
  eventoSeleccionado = signal<any>(null);
  cantidadEntradas = 1;
  observacionesReserva = '';
  mensajeExito = signal('');
  mensajeError = signal('');

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.apiService.getEventos().subscribe({
      next: (data) => this.eventos.set(data),
      error: (err) => console.error('Error cargando eventos', err)
    });
  }

  abrirModalReserva(evento: any) {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    if (user.role !== 'client') {
      this.mensajeError.set('Solo los usuarios con perfil de Cliente pueden realizar reservas.');
      setTimeout(() => this.mensajeError.set(''), 4000);
      return;
    }
    this.cantidadEntradas = 1;
    this.observacionesReserva = '';
    this.eventoSeleccionado.set(evento);
  }

  cerrarModal() {
    this.eventoSeleccionado.set(null);
  }

  confirmarReserva() {
    const evento = this.eventoSeleccionado();
    const user = this.authService.currentUser();
    if (!evento || !user) return;

    const payload = {
      id_cliente: user.identificacion,
      codigo_evento: evento.codigo_evento,
      numero_entradas: Number(this.cantidadEntradas),
      valor_total: Number(this.cantidadEntradas) * Number(evento.precio_base),
      observaciones: this.observacionesReserva,
      estado: 'Reservada'
    };

    this.apiService.createReserva(payload).subscribe({
      next: () => {
        this.cerrarModal();
        this.mensajeExito.set(`¡Reserva registrada con éxito para ${evento.nombre}!`);
        setTimeout(() => this.mensajeExito.set(''), 5000);
      },
      error: (err) => {
        this.mensajeError.set(err.error?.error || 'Error al registrar la reserva.');
      }
    });
  }
}