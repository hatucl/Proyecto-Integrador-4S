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

    removeFromCart(index: number) {
        this.items.splice(index, 1);
        this.cartCount.set(this.items.length);

        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('miCarrito', JSON.stringify(this.items));
        }
    }

    clearCart() {
        this.items = [];
        this.cartCount.set(0);
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('miCarrito');
        }
    }
}