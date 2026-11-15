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
      this.authService.login(correo!, password!).subscribe({
        next: (usuario) => {
          if (usuario.role === 'admin') this.router.navigate(['/admin']);
          else if (usuario.role === 'agent') this.router.navigate(['/agent']);
          else this.router.navigate(['/']);
        },
        error: () => {
          this.errorMsg = 'Credenciales incorrectas o usuario no registrado.';
        }
      });
    }
  }
}