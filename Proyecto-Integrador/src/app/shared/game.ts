import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  games = [
    { id: 1, title: 'The Legend of Zelda', genre: 'Aventura', price: 60, image: 'https://via.placeholder.com/300x400/8a2be2/ffffff?text=Zelda', description: 'Explora un mundo abierto lleno de misterios y calabozos.' },
    { id: 2, title: 'Elden Ring', genre: 'RPG', price: 70, image: 'https://via.placeholder.com/300x400/8a2be2/ffffff?text=Elden+Ring', description: 'Un desafiante juego de rol de acción en un mundo de fantasía oscura.' },
    { id: 3, title: 'Cyberpunk 2077', genre: 'Acción', price: 50, image: 'https://via.placeholder.com/300x400/8a2be2/ffffff?text=Cyberpunk', description: 'Una aventura de mundo abierto en la megalópolis de Night City.' },
    { id: 4, title: 'Hollow Knight', genre: 'Metroidvania', price: 15, image: 'https://via.placeholder.com/300x400/8a2be2/ffffff?text=Hollow+Knight', description: 'Desciende al mundo de Hallownest en esta aventura épica.' },
    { id: 5, title: 'Super Mario Bros', genre: 'Plataformas', price: 60, image: 'https://via.placeholder.com/300x400/8a2be2/ffffff?text=Mario', description: 'El clásico juego de plataformas para disfrutar en familia.' },
    { id: 6, title: 'Halo Infinite', genre: 'Shooter', price: 60, image: 'https://via.placeholder.com/300x400/8a2be2/ffffff?text=Halo', description: 'La legendaria saga de disparos regresa con la campaña más grande hasta la fecha.' }
  ];

  getGameById(id: number) {
    return this.games.find(g => g.id === id);
  }
}