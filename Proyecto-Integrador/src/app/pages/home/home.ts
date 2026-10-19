import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameService } from '../../shared/game';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  games: any[] = [];

  constructor(private gameService: GameService) {
      this.games = this.gameService.games;
  }
}