import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie-service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
})
export class MovieCard {
  private _router = inject(Router);
  private _movieService = inject(MovieService);

  @Input() movie: Movie | null = null;

  public view(): void {
    this._movieService.selectMovie(this.movie);

    this._router.navigate([`/movies/${this.movie?.id}`])
  }
}
