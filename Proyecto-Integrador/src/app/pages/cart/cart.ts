import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../shared/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent {
  items: any[] = [];

  constructor(private cartService: CartService) {
    this.items = this.cartService.items;
  }

  get total() {
    return this.items.reduce((suma, item) => suma + item.price, 0);
  }
}