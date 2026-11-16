import { Component, signal } from '@angular/core';
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

  errorMsg = signal('');
  cargando = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion() {
    if (this.loginForm.invalid || this.cargando()) return;

    const { correo, password } = this.loginForm.value;
    this.cargando.set(true);
    this.errorMsg.set('');

    this.authService.login(correo!, password!).subscribe({
      next: (usuario) => {
        this.cargando.set(false);
        if (usuario.role === 'admin') this.router.navigate(['/admin']);
        else if (usuario.role === 'agent') this.router.navigate(['/agent']);
        else this.router.navigate(['/']);
      },
      error: (err) => {
        this.cargando.set(false);
        this.errorMsg.set(
          err.status === 401
            ? 'Correo o contraseña incorrectos.'
            : 'No se pudo conectar con el servidor. Inténtalo de nuevo en unos segundos.'
        );
      }
    });
  }
}
