import { Component } from '@angular/core';
import { CartService } from '../cart';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-navbar',
  styleUrl: './navbar.scss',
  templateUrl: './navbar.html',
})
export class Navbar {
  constructor(public cartService: CartService) {}
}