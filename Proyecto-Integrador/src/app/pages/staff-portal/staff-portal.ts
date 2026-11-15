import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../shared/auth'; 
@Component({
  selector: 'app-staff-portal',
  standalone: true,
  imports: [ReactiveFormsModule], 
  templateUrl: './staff-portal.html',
  styleUrl: './staff-portal.scss'
})
export class StaffPortal {
  staffForm = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {} 
  ingresarStaff() {
    if (this.staffForm.valid) {
      const { correo, password } = this.staffForm.value;
      const usuario = this.authService.loginStaff(correo!, password!);

      if (usuario) {
        if (usuario.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (usuario.role === 'agent') {
          this.router.navigate(['/agent']);
        }
      } else {
        this.errorMsg = 'Acceso denegado. Credenciales internas inválidas.';
      }
    }
  }
}