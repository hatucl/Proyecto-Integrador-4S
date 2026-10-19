import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { GameDetailComponent } from './pages/game-detail/game-detail'; 
import { CartComponent } from './pages/cart/cart';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game/:id', component: GameDetailComponent },
  { path: 'cart', component: CartComponent}, 
  { path: '**', redirectTo: '' }
];