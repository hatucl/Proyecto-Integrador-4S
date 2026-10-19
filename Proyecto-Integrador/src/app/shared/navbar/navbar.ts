import { Component } from '@angular/core';
import { CartService } from '../cart';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-navbar',
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  constructor(public cartService: CartService) {}
}