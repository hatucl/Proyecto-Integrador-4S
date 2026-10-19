import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    items: any[] = [];

    cartCount = signal(0);

    constructor() {
        if (typeof localStorage !== 'undefined') {
            const carritoGuardado = localStorage.getItem('miCarrito');

            if (carritoGuardado) {
                this.items = JSON.parse(carritoGuardado);
                this.cartCount.set(this.items.length);
            }
        }
    }

    addToCart(game: any) {
        this.items.push(game);
        this.cartCount.set(this.items.length);
        console.log('Juego añadido:', game.title);

        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('miCarrito', JSON.stringify(this.items));
        }

        console.log('Juego añadido: ', game.title);
    }
}