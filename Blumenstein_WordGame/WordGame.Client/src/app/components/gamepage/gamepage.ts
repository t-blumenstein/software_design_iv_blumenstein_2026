import { Component, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Router } from '@angular/router';
import { GameService, GameDto } from '../../services/game.service';

@Component({
  selector: 'app-gamepage',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, RouterModule],
  templateUrl: './gamepage.html',
})
export class Gamepage {
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  protected games = signal<GameDto[]>([]);

  protected get score() {
    return this.games().filter(g => (g.status || '').toLowerCase() === 'win' || (g.status || '').toLowerCase() === 'won').length;
  }

  constructor() {
    this.load();
  }

  protected openGame(id: number) {
    this.router.navigate(['/wordgame', id]);
  }

  protected statusClassFor(g: GameDto) {
    const s = (g?.status || '').toLowerCase();
    if (s === 'unfinished' || s === 'inprogress' || s === 'in progress') return 'border-l-4 border-[#ffd700]/60';
    if (s === 'loss' || s === 'lost') return 'border-l-4 border-[#ff4d4d]/60';
    if (s === 'win' || s === 'won') return 'border-l-4 border-[#3ddc84]/60';
    return '';
  }

  protected spacedViewFor(g: GameDto): string {
    const view = g?.view ?? '';
    if (view) return view.split('').join(' ');

    const target = g?.target ?? '';
    const guessesRaw = g?.guesses ?? '';
    const guesses = guessesRaw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    if (!target) return '-';
    return target.split('').map(ch => {
      if (ch === ' ') return ' ';
      const lower = ch.toLowerCase();
      if (/[^a-z0-9]/i.test(lower)) return ch;
      return guesses.includes(lower) ? ch : '_';
    }).join(' ');
  }

  protected spacedAnswerFor(g: GameDto): string {
    const t = g?.target ?? '';
    if (!t) return '';
    return t.split('').join(' ');
  }

  protected finishedFor(g: GameDto): boolean {
    const s = (g?.status || '').toLowerCase();
    return s === 'won' || s === 'win' || s === 'lost' || s === 'loss';
  }

  protected statusClassFor2(g: GameDto) {
    return this.statusClassFor(g);
  }

  protected statusTextFor(g: GameDto): string {
    const s = (g?.status || '').toLowerCase();
    if (s === 'win' || s === 'won') return 'text-[#3ddc84]';
    if (s === 'loss' || s === 'lost') return 'text-[#ff4d4d]';
    if (s === 'unfinished' || s === 'inprogress' || s === 'in progress') return 'text-[#ffd700]';
    return 'text-[#e8d5ff]';
  }

  protected async load() {
    try {
      const list = await this.gameService.list().toPromise();
      this.games.set(list || []);
    } catch (e) {
      console.error('Failed to load games', e);
    }
  }

  protected async newGame() {
    try {
      await this.gameService.create().toPromise();
      await this.load();
    } catch (e) {
      console.error('Failed to create game', e);
    }
  }

  protected async deleteGame(id: number) {
    try {
      await this.gameService.delete(id).toPromise();
      this.games.set(this.games().filter(g => g.id !== id));
    } catch (e) {
      console.error('Failed to delete game', e);
    }
  }
}
