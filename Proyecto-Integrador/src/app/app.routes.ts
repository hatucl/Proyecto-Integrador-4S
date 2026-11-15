import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { GameDetailComponent } from './pages/game-detail/game-detail';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { StaffPortal } from './pages/staff-portal/staff-portal';
import { Perfil } from './pages/perfil/perfil';
import { AgentDashboard } from './pages/agents-dashboard/agents-dashboard';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AuthService } from './shared/auth';

// Guard para validar roles internos
const roleGuard = (allowedRoles: string[]) => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser();

    if (user && allowedRoles.includes(user.role)) {
      return true;
    }
    return router.createUrlTree(['/login']);
  };
};

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game/:id', component: GameDetailComponent },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'staff-access', component: StaffPortal },
  { path: 'perfil', component: Perfil },
  { 
    path: 'agent', 
    component: AgentDashboard, 
    canActivate: [roleGuard(['agent', 'admin'])] 
  },
  { 
    path: 'admin', 
    component: AdminDashboard, 
    canActivate: [roleGuard(['admin'])] 
  },
  { path: '**', redirectTo: '' }
];