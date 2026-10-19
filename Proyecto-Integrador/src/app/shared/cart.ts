import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items: any[] = [];

  cartCount = signal(0);

  addToCart(game: any) {
    this.items.push(game);
    this.cartCount.set(this.items.length);
    console.log('Juego añadido:', game.title);
  }
}