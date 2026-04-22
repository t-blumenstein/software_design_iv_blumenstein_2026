import { Component, signal, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { GameService, GameDto } from '../../services/game.service';

@Component({
  selector: 'app-gameplay',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './gameplay.html',
})
export class Gameplay {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly gameService = inject(GameService);

  protected game = signal<GameDto | null>(null);
  protected guess = signal('');
  protected error = signal('');
  @ViewChild('guessInput') protected guessInput!: ElementRef<HTMLInputElement>;

  protected get spacedView(): string {
    const view = this.game()?.view ?? '';
    if (view) return view.split('').join(' ');

    const target = this.game()?.target ?? '';
    const guessesRaw = this.game()?.guesses ?? '';
    const guesses = guessesRaw.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    if (!target) return '-';
    return target.split('').map(ch => {
      if (ch === ' ') return ' ';
      const lower = ch.toLowerCase();
      if (/[^a-z0-9]/i.test(lower)) return ch;
      return guesses.includes(lower) ? ch : '_';
    }).join(' ');
  }

  protected get spacedAnswer(): string {
    const t = this.game()?.target ?? '';
    if (!t) return '';
    return t.split('').join(' ');
  }

  protected get spacedGuesses(): string {
    const g = this.game()?.guesses ?? '';
    if (!g) return '';
    return g.split(',').join(' ');
  }

  constructor(){
    const id = Number(this.route.snapshot.paramMap.get('id')) || 0;
    if (!id) {
      this.router.navigate(['/wordgame']);
    } else {
      this.load(id);
    }
  }

  protected async load(id: number){
    try {
      const g = await this.gameService.get(id).toPromise();
      this.game.set(g || null);
    } catch (e) {
      console.error('Failed to load game', e);
      this.router.navigate(['/wordgame']);
    }
  }

  protected async submitGuess(){
    const g = this.guess().trim();
    if (!g || g.length !== 1) return;
    try {
      const updated = await this.gameService.guess(this.game()!.id, g).toPromise();
      this.game.set(updated ?? null);
      this.guess.set('');
      this.error.set('');
      // refocus the input for the next guess
      try {
        setTimeout(() => this.guessInput?.nativeElement?.focus(), 0);
      } catch {}
    } catch (e) {
      console.error('Guess failed', e);
      // Attempt to show a friendly server message (e.error may be string)
      try {
        // Http error with string body
        const msg = (e as any)?.error ?? (e as any)?.message ?? 'Guess failed';
        this.error.set(String(msg));
      } catch {
        this.error.set('Guess failed');
      }
    }
  }
}
