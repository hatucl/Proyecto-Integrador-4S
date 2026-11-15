import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/auth';
import { ApiService } from '../../shared/api.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class Registro implements OnInit {
  ciudades: any[] = [];
  errorMsg = '';

  registroForm = new FormGroup({
    identificacion: new FormControl('', Validators.required),
    nombre_completo: new FormControl('', Validators.required),
    correo: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    direccion: new FormControl('', Validators.required),
    id_ciudad: new FormControl('', Validators.required),
    telefonos: new FormControl('', Validators.required),
    recibir_publicidad: new FormControl(true)
  });

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.apiService.getCiudades().subscribe({
      next: (data) => (this.ciudades = data),
      error: (err) => console.error('Error cargando ciudades', err)
    });
  }

  registrar() {
    if (this.registroForm.invalid) return;
    const val = this.registroForm.value;
    const payload = {
      identificacion: val.identificacion,
      nombre_completo: val.nombre_completo,
      correo: val.correo,
      password: val.password,
      direccion: val.direccion,
      id_ciudad: Number(val.id_ciudad),
      telefonos: val.telefonos ? val.telefonos.split(',').map((t) => t.trim()) : [],
      recibir_publicidad: val.recibir_publicidad
    };

    this.authService.registrarCliente(payload).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => (this.errorMsg = err.error?.error || 'Error al registrar cliente')
    });
  }
}