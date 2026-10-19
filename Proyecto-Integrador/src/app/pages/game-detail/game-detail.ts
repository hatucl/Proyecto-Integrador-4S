import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GameService } from '../../shared/game';

@Component({
  imports: [RouterLink],
  selector: 'app-game-detail',
  styleUrl: './game-detail.scss',
  templateUrl: './game-detail.html',
})
export class GameDetailComponent {
  game: any;

  constructor(private route: ActivatedRoute, private gameService: GameService) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.game = this.gameService.getGameById(id);
  }
}
