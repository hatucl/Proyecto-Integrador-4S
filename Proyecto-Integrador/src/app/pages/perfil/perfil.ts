import { Component, OnInit, computed, signal } from '@angular/core';
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
  cargando = signal(true);
  errorCarga = signal(false);

  totalGastado = computed(() =>
    this.reservas()
      .filter((r) => r.estado !== 'Cancelada')
      .reduce((suma, r) => suma + Number(r.valor_total), 0)
  );

  entradasActivas = computed(() =>
    this.reservas()
      .filter((r) => r.estado !== 'Cancelada')
      .reduce((suma, r) => suma + Number(r.numero_entradas), 0)
  );

  constructor(
    public authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user && user.role === 'client') {
      this.apiService.getReservasByCliente(user.identificacion).subscribe({
        next: (data) => {
          this.reservas.set(data);
          this.cargando.set(false);
        },
        error: () => {
          this.errorCarga.set(true);
          this.cargando.set(false);
        }
      });
    } else {
      this.cargando.set(false);
    }
  }

  iniciales(nombre: string): string {
    return (nombre || '?').split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
  }

  etiquetaRol(role: string): string {
    return role === 'admin' ? 'Administrador' : role === 'agent' ? 'Agente' : 'Cliente';
  }

  claseEstado(estado: string): string {
    return 'status status-' + (estado || '').toLowerCase();
  }
}
