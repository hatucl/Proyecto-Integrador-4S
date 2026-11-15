import { Component } from '@angular/core';
import { AuthService } from '../../shared/auth';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './agents-dashboard.html',
  styleUrl: './agents-dashboard.scss'
})
export class AgentDashboard {
  juegosInventario = [
    { id: 1, titulo: 'God of War: Laufey', precio: 69.99, stock: 45, estado: 'Preventa' },
    { id: 2, titulo: 'Fable', precio: 59.99, stock: 30, estado: 'Preventa' },
    { id: 3, titulo: 'Final Fantasy VII Revelation', precio: 69.99, stock: 20, estado: 'Disponible' }
  ];

  constructor(public authService: AuthService) {}
}