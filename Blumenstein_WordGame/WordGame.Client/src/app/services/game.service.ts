import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GameDto {
  id: number;
  status: string;
  target?: string;
  guesses?: string;
  view?: string;
  remainingGuesses?: number;
}

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(private http: HttpClient) {}

  private authHeaders() {
    const token = (typeof window !== 'undefined' && localStorage.getItem('token')) || '';
    return { headers: new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' }) };
  }

  list(): Observable<GameDto[]> {
    return this.http.get<GameDto[]>('/api/gameplay/games', this.authHeaders());
  }

  create(): Observable<GameDto> {
    return this.http.post<GameDto>('/api/gameplay/games', {}, this.authHeaders());
  }

  get(id: number): Observable<GameDto> {
    return this.http.get<GameDto>(`/api/gameplay/games/${id}`, this.authHeaders());
  }

  guess(gameId: number, letter: string): Observable<GameDto> {
    // Make guess via POST to /games/{gameId}/guesses?guess={letter}
    return this.http.post<GameDto>(`/api/gameplay/games/${gameId}/guesses?guess=${encodeURIComponent(letter)}`, {}, this.authHeaders());
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`/api/gameplay/games/${id}`, this.authHeaders());
  }
}
