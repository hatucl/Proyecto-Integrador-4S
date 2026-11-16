import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Perfil } from './pages/perfil/perfil';
import { AgentDashboard } from './pages/agents-dashboard/agents-dashboard';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AuthService } from './shared/auth';

// Exige sesión iniciada y, opcionalmente, uno de los roles indicados
const roleGuard = (allowedRoles?: string[]) => {
  return () => {
    const user = inject(AuthService).currentUser();
    if (user && (!allowedRoles || allowedRoles.includes(user.role))) {
      return true;
    }
    return inject(Router).createUrlTree(['/login']);
  };
};

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'EventTickets · Eventos' },
  { path: 'login', component: Login, title: 'Iniciar sesión · EventTickets' },
  { path: 'registro', component: Registro, title: 'Crear cuenta · EventTickets' },
  { path: 'perfil', component: Perfil, canActivate: [roleGuard()], title: 'Mi perfil · EventTickets' },
  { path: 'agent', component: AgentDashboard, canActivate: [roleGuard(['agent', 'admin'])], title: 'Gestión de eventos · EventTickets' },
  { path: 'admin', component: AdminDashboard, canActivate: [roleGuard(['admin'])], title: 'Panel de administración · EventTickets' },
  { path: '**', redirectTo: '' }
];
