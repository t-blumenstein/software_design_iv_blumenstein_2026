import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Movie } from "../models/movie";

@Injectable({
  providedIn: 'root'
})

export class MovieService {

  private _http = inject(HttpClient);

  //behavior subjects
  private _movieListSubject: BehaviorSubject<Movie[]>
    = new BehaviorSubject<Movie[]>([] as Movie[]);

  private _movieSubject: BehaviorSubject<Movie | null>
    = new BehaviorSubject<Movie | null>(null);

  //observables
  public movieList$: Observable<Movie[]> = this._movieListSubject.asObservable();

  public movie$: Observable<Movie | null> = this._movieSubject.asObservable();

  //Methods to see into the subject without subscribing to the observable
  public get movieList(): Movie[] {
    return this._movieListSubject.value;
  }

  public get movie(): Movie | null {
    return this._movieSubject.value;
  }

  //getAllMovies
  public getAllMovies(): Observable<Movie[]> {
    return this._http.get<Movie[]>('/api/movies').pipe(
      tap((movieList) => {
        console.log(movieList);
        this._movieListSubject.next(movieList);
      })
    );
  }

  //getMovieById
  public getMovieById(movieId: number): Observable<Movie> {
    return this._http.get<Movie>(`'.api/movies/${movieId}'`).pipe(
      tap((movie) => {
        console.log(movie);
        this._movieSubject.next(movie);
      })
    )
  }

  //selectMovie
  public selectMovie(movie: Movie | null): void {
    this._movieSubject.next(movie);
  }
}