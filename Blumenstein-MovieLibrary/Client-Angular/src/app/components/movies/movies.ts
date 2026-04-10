import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MovieCard } from '../movie-card/movie-card';
import { MovieService } from '../../services/movie-service';

@Component({
  selector: 'app-movies',
  imports: [AsyncPipe, MovieCard],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class Movies  implements OnInit{
  private _movieService = inject(MovieService);

  public movieList$ = this._movieService.movieList$;

  ngOnInit(): void {
    this._movieService.getAllMovies().subscribe();
  }
}
