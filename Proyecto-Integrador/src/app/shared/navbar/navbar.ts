import { Component, ElementRef, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  menuAbierto = signal(false);

  constructor(
    public authService: AuthService,
    private el: ElementRef<HTMLElement>
  ) {}

  iniciales(nombre: string): string {
    return (nombre || '?')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');
  }

  toggleMenu() {
    this.menuAbierto.update((v) => !v);
  }

  cerrarMenu() {
    this.menuAbierto.set(false);
  }

  // Cierra el menú de usuario al hacer clic en cualquier otro lugar
  @HostListener('document:click', ['$event'])
  clicFuera(event: Event) {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.menuAbierto.set(false);
    }
  }

  salir() {
    this.cerrarMenu();
    this.authService.cerrarSesion();
  }
}
