import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Movie } from '../../models/movie';
import { MovieCard } from '../movie-card/movie-card';

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
  hasSearched: boolean = false;

  public search(inputValue?: string): void {
    const valueForQuery = (inputValue ?? this.searchQuery).trim();

    if (!valueForQuery) {
      this.searchResults = [];
      this.hasSearched = true;
      return;
    }

    this.searchQuery = valueForQuery;
    this.hasSearched = true;

    const params = new HttpParams().set('title', valueForQuery);

    this._http.get<Movie[]>('/api/movies/search', { params }).subscribe((results) => {
      this.searchResults = results;
    });
  }
}
