import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { GameDetailComponent } from './pages/game-detail/game-detail'; 

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game/:id', component: GameDetailComponent }, 
  { path: '**', redirectTo: '' }
];