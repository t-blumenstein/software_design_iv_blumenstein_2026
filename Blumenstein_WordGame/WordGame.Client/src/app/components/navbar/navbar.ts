import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule],
  templateUrl: './navbar.html',
  // no local stylesheet; Tailwind handles styling
})
export class Navbar {
  protected readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  protected isLoggedIn(): boolean {
    return !!this.auth.getToken();
  }

  protected async logout() {
    this.auth.clearToken();
    await this.router.navigate(['/auth/login']);
  }
}
