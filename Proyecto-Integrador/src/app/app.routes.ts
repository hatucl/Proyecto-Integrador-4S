import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { GameDetail } from './pages/game-detail/game-detail'; 

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game/:id', component: GameDetail }, 
  { path: '**', redirectTo: '' }
];