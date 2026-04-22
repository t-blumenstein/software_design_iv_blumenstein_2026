import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, RouterModule],
  templateUrl: './homepage.html',
})
export class Homepage {
  protected readonly title = signal('Word Game');
  private readonly auth = inject(AuthService);

  constructor() {}

  protected isLoggedIn(): boolean {
    return !!this.auth.getToken();
  }
}
