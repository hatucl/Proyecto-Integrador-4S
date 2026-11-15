import { Component } from '@angular/core';
import { CartService } from '../cart';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-navbar',
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {

  menuAbierto = false;

  constructor(
    public cartService: CartService, 
    public authService: AuthService
  ) {}

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  salir() {
    this.menuAbierto = false;
    this.authService.cerrarSesion(); 
  }
}