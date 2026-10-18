import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home }, // Ruta vacía = Página de inicio
  { path: '**', redirectTo: '' }          // Si el usuario escribe una URL que no existe, lo devuelve al inicio
];