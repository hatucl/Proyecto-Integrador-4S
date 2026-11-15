import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.scss'
})
export class Registro {
  registroForm = new FormGroup({
    nombre: new FormControl('', Validators.required),
    correo: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  registrarse() {
    if (this.registroForm.valid) {
      const datos = this.registroForm.value as { nombre: string, correo: string, password: string };
      const exito = this.authService.registrarCliente(datos);

      if (exito) {
        alert('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      } else {
        this.errorMsg = 'Este correo ya está registrado.';
      }
    }
  }
}