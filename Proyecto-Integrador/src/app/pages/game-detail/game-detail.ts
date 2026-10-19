import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GameService } from '../../shared/game';
import { CartService } from '../../shared/cart';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-game-detail',
  styleUrl: './game-detail.scss',
  templateUrl: './game-detail.html',
})
export class GameDetailComponent {
  game: any;

  constructor(
    private route: ActivatedRoute, 
    private gameService: GameService, 
    private cartService: CartService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.game = this.gameService.getGameById(id);
  }

  reservarJuego() {
    if (this.game) {
      this.cartService.addToCart(this.game);
    }
  }
}
