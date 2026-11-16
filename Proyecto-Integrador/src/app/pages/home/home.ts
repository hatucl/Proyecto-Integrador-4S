import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth';

const ICONOS: Record<string, string> = {
  concierto: '🎤',
  festival: '🎪',
  teatro: '🎭',
  comedia: '😂',
  gaming: '🎮',
  familiar: '🎈',
  cultura: '🎬',
  gastronomia: '🍽️',
  conferencia: '💡'
};

const MAX_ENTRADAS = 10;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  eventos = signal<any[]>([]);
  cargando = signal(true);
  errorCarga = signal(false);

  // Filtros
  busqueda = signal('');
  categoriaActiva = signal('Todas');
  ciudadActiva = signal('Todas');
  mostrarPasados = signal(false);

  // Reserva
  eventoSeleccionado = signal<any>(null);
  cantidad = signal(1);
  observaciones = signal('');
  enviando = signal(false);
  modalError = signal('');

  // Mensajes
  mensajeExito = signal('');
  mensajeError = signal('');

  private esActivo = (e: any) => e.estado !== 'Finalizado' && e.estado !== 'Cancelado';

  proximos = computed(() => this.eventos().filter(this.esActivo));

  categorias = computed(() => {
    const set = new Set(this.eventos().map((e) => e.categoria).filter(Boolean));
    return ['Todas', ...Array.from(set).sort()];
  });

  ciudades = computed(() => {
    const set = new Set(this.proximos().map((e) => e.nombre_ciudad).filter(Boolean));
    return ['Todas', ...Array.from(set).sort()];
  });

  destacados = computed(() => this.proximos().filter((e) => e.destacado).slice(0, 3));

  filtrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const cat = this.categoriaActiva();
    const ciudad = this.ciudadActiva();
    const pasados = this.mostrarPasados();

    return this.eventos().filter((e) => {
      if (!pasados && !this.esActivo(e)) return false;
      if (cat !== 'Todas' && e.categoria !== cat) return false;
      if (ciudad !== 'Todas' && e.nombre_ciudad !== ciudad) return false;
      if (texto) {
        const pajar = `${e.nombre} ${e.descripcion} ${e.teatro} ${e.nombre_ciudad} ${e.categoria}`.toLowerCase();
        if (!pajar.includes(texto)) return false;
      }
      return true;
    });
  });

  hayFiltros = computed(
    () => this.busqueda() !== '' || this.categoriaActiva() !== 'Todas' || this.ciudadActiva() !== 'Todas'
  );

  maxEntradas = computed(() => {
    const ev = this.eventoSeleccionado();
    return ev ? Math.max(1, Math.min(MAX_ENTRADAS, ev.disponibles)) : MAX_ENTRADAS;
  });

  totalReserva = computed(() => {
    const ev = this.eventoSeleccionado();
    return ev ? this.cantidad() * Number(ev.precio_base) : 0;
  });

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarEventos();
  }

  cargarEventos() {
    this.cargando.set(true);
    this.errorCarga.set(false);
    this.apiService.getEventos().subscribe({
      next: (data) => {
        this.eventos.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error cargando eventos', err);
        this.errorCarga.set(true);
        this.cargando.set(false);
      }
    });
  }

  limpiarFiltros() {
    this.busqueda.set('');
    this.categoriaActiva.set('Todas');
    this.ciudadActiva.set('Todas');
  }

  irAEventos() {
    document.getElementById('eventos')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ---------- helpers de presentación ----------
  claseCategoria(cat: string): string {
    const slug = (cat || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return 'cat-' + slug;
  }

  icono(cat: string): string {
    const slug = (cat || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return ICONOS[slug] ?? '🎟️';
  }

  claseEstado(estado: string): string {
    switch (estado) {
      case 'En Boletería': return 'status status-boleteria';
      case 'En Vivo': return 'status status-envivo';
      case 'Finalizado': return 'status status-finalizado';
      case 'Cancelado': return 'status status-cancelado';
      default: return 'status status-programado';
    }
  }

  porcentajeOcupado(e: any): number {
    return Math.min(100, Math.round((e.entradas_reservadas / e.capacidad_total) * 100));
  }

  pocasEntradas(e: any): boolean {
    return e.disponibles > 0 && e.disponibles / e.capacidad_total <= 0.15;
  }

  puedeReservar(e: any): boolean {
    return this.esActivo(e) && e.disponibles > 0;
  }

  textoBoton(e: any): string {
    if (e.estado === 'Cancelado') return 'Cancelado';
    if (e.estado === 'Finalizado') return 'Finalizado';
    if (e.disponibles <= 0) return 'Agotado';
    return 'Reservar';
  }

  // ---------- reserva ----------
  abrirModalReserva(evento: any) {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    if (user.role !== 'client') {
      this.mostrarError('Solo las cuentas de cliente pueden realizar reservas.');
      return;
    }
    this.cantidad.set(1);
    this.observaciones.set('');
    this.modalError.set('');
    this.eventoSeleccionado.set(evento);
  }

  cerrarModal() {
    if (this.enviando()) return;
    this.eventoSeleccionado.set(null);
  }

  cambiarCantidad(delta: number) {
    const nueva = this.cantidad() + delta;
    this.cantidad.set(Math.min(this.maxEntradas(), Math.max(1, nueva)));
  }

  confirmarReserva() {
    const evento = this.eventoSeleccionado();
    const user = this.authService.currentUser();
    if (!evento || !user || this.enviando()) return;

    this.enviando.set(true);
    this.modalError.set('');

    this.apiService.createReserva({
      id_cliente: user.identificacion,
      codigo_evento: evento.codigo_evento,
      numero_entradas: this.cantidad(),
      valor_total: this.totalReserva(),
      observaciones: this.observaciones(),
      estado: 'Reservada'
    }).subscribe({
      next: () => {
        this.enviando.set(false);
        this.eventoSeleccionado.set(null);
        this.mostrarExito(`¡Reserva registrada para ${evento.nombre}! Puedes verla en "Mis reservas".`);
        this.cargarEventos();
      },
      error: (err) => {
        this.enviando.set(false);
        this.modalError.set(err.error?.error || 'No se pudo registrar la reserva. Inténtalo de nuevo.');
        this.cargarEventos(); // refresca la disponibilidad por si cambió
      }
    });
  }

  private mostrarExito(msg: string) {
    this.mensajeExito.set(msg);
    setTimeout(() => this.mensajeExito.set(''), 5000);
  }

  private mostrarError(msg: string) {
    this.mensajeError.set(msg);
    setTimeout(() => this.mensajeError.set(''), 4500);
  }
}
