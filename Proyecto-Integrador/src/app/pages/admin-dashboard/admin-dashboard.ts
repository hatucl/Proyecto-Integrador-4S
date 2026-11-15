import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { AuthService } from '../../shared/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {
  reportes = signal<any>(null);
  agentes = signal<any[]>([]);
  clientes = signal<any[]>([]);
  ciudades = signal<any[]>([]);

  pestanaActiva = signal<'reportes' | 'usuarios'>('reportes');
  mostrarFormAgente = signal(false);
  mensaje = signal('');
  errorMsg = signal('');

  agenteForm = new FormGroup({
    identificacion: new FormControl('', Validators.required),
    nombre_completo: new FormControl('', Validators.required),
    correo: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    direccion: new FormControl('', Validators.required),
    id_ciudad: new FormControl('', Validators.required),
    telefonos: new FormControl('', Validators.required),
    comision: new FormControl(5.0, [Validators.required, Validators.min(0)]),
    anios_experiencia: new FormControl(1, [Validators.required, Validators.min(0)])
  });

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarTodo();
  }

  cargarTodo() {
    this.apiService.getDashboardReportes().subscribe({
      next: (data) => this.reportes.set(data),
      error: (err) => console.error('Error cargando reportes', err)
    });

    this.apiService.getAgentes().subscribe({
      next: (data) => this.agentes.set(data)
    });

    this.apiService.getClientes().subscribe({
      next: (data) => this.clientes.set(data)
    });

    this.apiService.getCiudades().subscribe({
      next: (data) => this.ciudades.set(data)
    });
  }

  registrarAgente() {
    if (this.agenteForm.invalid) return;
    const val = this.agenteForm.value;
    const payload = {
      identificacion: val.identificacion,
      nombre_completo: val.nombre_completo,
      correo: val.correo,
      password: val.password,
      direccion: val.direccion,
      id_ciudad: Number(val.id_ciudad),
      telefonos: val.telefonos ? val.telefonos.split(',').map((t) => t.trim()) : [],
      comision: Number(val.comision),
      anios_experiencia: Number(val.anios_experiencia)
    };

    this.authService.registrarAgente(payload).subscribe({
      next: () => {
        this.mostrarFormAgente.set(false);
        this.agenteForm.reset({ comision: 5.0, anios_experiencia: 1 });
        this.cargarTodo();
        this.notificar('Agente registrado exitosamente en el sistema.');
      },
      error: (err) => {
        this.errorMsg.set(err.error?.error || 'Error al registrar agente');
        setTimeout(() => this.errorMsg.set(''), 4000);
      }
    });
  }

  eliminarUsuario(id: string, nombre: string) {
    if (!confirm(`¿Seguro que deseas eliminar a ${nombre}?`)) return;
    this.apiService.deletePersona(id).subscribe({
      next: () => {
        this.cargarTodo();
        this.notificar('Usuario eliminado.');
      },
      error: () => {
        this.errorMsg.set('No se puede eliminar este usuario porque tiene eventos o reservas asociadas.');
        setTimeout(() => this.errorMsg.set(''), 4000);
      }
    });
  }

  private notificar(msg: string) {
    this.mensaje.set(msg);
    setTimeout(() => this.mensaje.set(''), 4000);
  }
}