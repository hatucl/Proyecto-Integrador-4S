import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  games = [
    { id: 1, title: 'The Legend of Zelda', genre: 'Aventura', price: 60, image: 'https://via.placeholder.com/300x400/8a2be2/ffffff?text=Zelda' },
    { id: 2, title: 'Elden Ring', genre: 'RPG', price: 70, image: 'https://via.placeholder.com/300x400/8a2be2/ffffff?text=Elden+Ring' },
    { id: 3, title: 'Cyberpunk 2077', genre: 'Acción', price: 50, image: 'https://via.placeholder.com/300x400/8a2be2/ffffff?text=Cyberpunk' },
    { id: 4, title: 'Hollow Knight', genre: 'Metroidvania', price: 15, image: 'https://via.placeholder.com/300x400/8a2be2/ffffff?text=Hollow+Knight' },
    { id: 5, title: 'Super Mario Bros', genre: 'Plataformas', price: 60, image: 'https://via.placeholder.com/300x400/8a2be2/ffffff?text=Mario' },
    { id: 6, title: 'Halo Infinite', genre: 'Shooter', price: 60, image: 'https://via.placeholder.com/300x400/8a2be2/ffffff?text=Halo' }
  ];
}