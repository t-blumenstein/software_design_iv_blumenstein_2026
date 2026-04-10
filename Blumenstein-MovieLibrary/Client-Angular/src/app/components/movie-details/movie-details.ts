import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie-service';
import { EMPTY, Observable, switchMap } from 'rxjs';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-movie-details',
  imports: [AsyncPipe],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails implements OnInit{
  private _route = inject(ActivatedRoute);
  private _movieService = inject(MovieService);
  public movie$ = this._movieService.movie$;

  public getMovieFromRoute(): Observable<Movie>{
    return this._route.paramMap.pipe(
      switchMap((params) => {
        const movieId = Number(params.get('movieId') ?? -1);

        if(movieId){
          return this._movieService.getMovieById(movieId);
        }

        return EMPTY;
      }),
    );
  }

  ngOnInit(): void {
    if(!this._movieService.movie){
      this.getMovieFromRoute().subscribe();
    }
  }
}
