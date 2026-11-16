import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth';

const CATEGORIAS = ['Concierto', 'Festival', 'Teatro', 'Comedia', 'Gaming', 'Familiar', 'Cultura', 'Gastronomía', 'Conferencia'];

// Convierte una fecha a "YYYY-MM-DDTHH:mm" en HORA LOCAL (lo que espera <input type="datetime-local">).
// Usar toISOString() (UTC) corría las horas al editar un evento.
function aInputLocal(valor: string): string {
  if (!valor) return '';
  const d = new Date(valor);
  const dos = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}T${dos(d.getHours())}:${dos(d.getMinutes())}`;
}

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './agents-dashboard.html',
  styleUrl: './agents-dashboard.scss'
})
export class AgentDashboard implements OnInit {
  eventos = signal<any[]>([]);
  reservas = signal<any[]>([]);
  ciudades = signal<any[]>([]);
  
  categorias = CATEGORIAS;

  vistaActiva = signal<'eventos' | 'reservas'>('eventos');
  mostrarFormulario = signal(false);
  modoEdicion = signal(false);
  mensaje = signal('');
  errorMsg = signal('');

  eventoForm = new FormGroup({
    codigo_evento: new FormControl('', Validators.required),
    nombre: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    teatro: new FormControl('', Validators.required),
    id_ciudad: new FormControl('', Validators.required),
    fecha_inicio: new FormControl('', Validators.required),
    fecha_fin: new FormControl('', Validators.required),
    capacidad_total: new FormControl(100, [Validators.required, Validators.min(1)]),
    precio_base: new FormControl(50000, [Validators.required, Validators.min(0)]),
    observaciones: new FormControl(''),
    estado: new FormControl('Programado', Validators.required),
    categoria: new FormControl('Concierto', Validators.required),
    destacado: new FormControl(false)
  });

  constructor(
    private apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.apiService.getEventos().subscribe({
      next: (data) => this.eventos.set(data),
      error: (err) => console.error('Error cargando eventos', err)
    });

    this.apiService.getReservas().subscribe({
      next: (data) => this.reservas.set(data),
      error: (err) => console.error('Error cargando reservas', err)
    });

    this.apiService.getCiudades().subscribe({
      next: (data) => this.ciudades.set(data),
      error: (err) => console.error('Error cargando ciudades', err)
    });
  }

  abrirNuevoEvento() {
    this.modoEdicion.set(false);
    this.eventoForm.reset({
      capacidad_total: 100,
      precio_base: 50000,
      estado: 'Programado',
      categoria: 'Concierto',
      destacado: false
    });
    this.eventoForm.get('codigo_evento')?.enable();
    this.mostrarFormulario.set(true);
  }

  editarEvento(ev: any) {
    this.modoEdicion.set(true);
    const fInicio = aInputLocal(ev.fecha_inicio);
    const fFin = aInputLocal(ev.fecha_fin);

    this.eventoForm.patchValue({
      codigo_evento: ev.codigo_evento,
      nombre: ev.nombre,
      descripcion: ev.descripcion,
      teatro: ev.teatro,
      id_ciudad: ev.id_ciudad,
      fecha_inicio: fInicio,
      fecha_fin: fFin,
      capacidad_total: ev.capacidad_total,
      precio_base: ev.precio_base,
      observaciones: ev.observaciones,
      estado: ev.estado,
      categoria: ev.categoria || 'Concierto',
      destacado: !!ev.destacado
    });
    this.eventoForm.get('codigo_evento')?.disable();
    this.mostrarFormulario.set(true);
  }

  guardarEvento() {
    if (this.eventoForm.invalid) return;
    if (new Date(this.eventoForm.value.fecha_fin!) <= new Date(this.eventoForm.value.fecha_inicio!)) {
      this.mostrarError('La fecha de fin debe ser posterior a la de inicio.');
      return;
    }
    const raw = this.eventoForm.getRawValue();
    const user = this.authService.currentUser();

    const payload = {
      ...raw,
      id_ciudad: Number(raw.id_ciudad),
      capacidad_total: Number(raw.capacidad_total),
      precio_base: Number(raw.precio_base),
      id_agente_creador: user?.identificacion
    };

    if (this.modoEdicion()) {
      this.apiService.updateEvento(raw.codigo_evento!, payload).subscribe({
        next: () => {
          this.mostrarFormulario.set(false);
          this.cargarDatos();
          this.notificar('Evento actualizado correctamente.');
        },
        error: (err) => this.mostrarError(err.error?.error || 'Error al actualizar el evento')
      });
    } else {
      this.apiService.createEvento(payload).subscribe({
        next: () => {
          this.mostrarFormulario.set(false);
          this.cargarDatos();
          this.notificar('Evento registrado correctamente.');
        },
        error: (err) => this.mostrarError(err.error?.error || 'Error al crear el evento')
      });
    }
  }

  eliminarEvento(codigo: string) {
    if (!confirm(`¿Seguro que deseas eliminar el evento ${codigo}? También se eliminarán todas sus reservas.`)) return;
    this.apiService.deleteEvento(codigo).subscribe({
      next: () => {
        this.cargarDatos();
        this.notificar('Evento eliminado.');
      },
      error: (err) => this.mostrarError(err.error?.error || 'No se pudo eliminar el evento')
    });
  }

  actualizarEstadoReserva(reserva: any, nuevoEstado: string) {
    let obs = reserva.observaciones || '';
    if (nuevoEstado === 'Cancelada') {
      const causa = prompt('Ingresa la causa de cancelación de la reserva:', obs);
      if (causa === null) return; // Canceló el prompt
      obs = causa;
    }

    this.apiService.updateReserva(reserva.id_reserva, {
      estado: nuevoEstado,
      observaciones: obs
    }).subscribe({
      next: () => {
        this.cargarDatos();
        this.notificar(`Reserva #${reserva.id_reserva} actualizada a ${nuevoEstado}.`);
      },
      error: () => this.mostrarError('Error al actualizar el estado de la reserva')
    });
  }

  claseEstadoEvento(estado: string): string {
    switch (estado) {
      case 'En Boletería': return 'status status-boleteria';
      case 'En Vivo': return 'status status-envivo';
      case 'Finalizado': return 'status status-finalizado';
      case 'Cancelado': return 'status status-cancelado';
      default: return 'status status-programado';
    }
  }

  private mostrarError(msg: string) {
    this.errorMsg.set(msg);
    setTimeout(() => this.errorMsg.set(''), 4500);
  }

  private notificar(msg: string) {
    this.mensaje.set(msg);
    setTimeout(() => this.mensaje.set(''), 4000);
  }
}