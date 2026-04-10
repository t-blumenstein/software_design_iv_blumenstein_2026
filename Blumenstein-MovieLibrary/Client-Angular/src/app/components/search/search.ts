import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Movie } from '../../models/movie';
import { MovieCard } from '../movie-card/movie-card';
import { catchError, finalize, map, of, timeout } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, MovieCard],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  private _http = inject(HttpClient);
  
  searchQuery: string = '';
  searchResults: Movie[] = [];
  isSearching: boolean = false;
  hasSearched: boolean = true;

  public search(): void {
    const query = this.searchQuery.trim();

    if (!query) {
      this.searchResults = [];
      this.hasSearched = true;
      this.isSearching = false;
      return;
    }

    this.isSearching = true;

    const params = new HttpParams().set('title', query);

    this._http.get<Movie[]>('/api/movies/search', { params }).pipe(
      timeout(8000),
      map((results) =>
        results.filter((movie) =>
          (movie.title ?? '').toLowerCase().includes(query.toLowerCase())
        )
      ),
      catchError((error) => {
        console.error('Search error:', error);
        return of([] as Movie[]);
      }),
      finalize(() => {
        this.isSearching = false;
        this.hasSearched = true;
      })
    ).subscribe((results) => {
      this.searchResults = results;
    });
  }
}
