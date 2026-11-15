import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion() {
    if (this.loginForm.valid) {
      const { correo, password } = this.loginForm.value;
      const acceso = this.authService.loginCliente(correo!, password!);

      if (acceso) {
        this.router.navigate(['/']);
      } else {
        this.errorMsg = 'Credenciales incorrectas o usuario no registrado.';
      }
    }
  }
}