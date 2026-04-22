import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.html',
  // styles managed via Tailwind; no local stylesheet
})
export class Login {
  protected readonly submitted = signal(false);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);

  protected registered = signal(false);

  protected form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false)
  });

  protected async onSubmit() {
    this.submitted.set(true);
    if (this.form.invalid) return;

    const payload = {
      email: this.form.value.email,
      password: this.form.value.password,
      rememberMe: !!this.form.value.rememberMe
    };

    try {
      const loginResp: any = await this.http.post('/api/auth/login', payload).toPromise();

      const token = loginResp?.accessToken || loginResp?.access_token || loginResp?.token;

      // persist token via AuthService
      this.auth.setToken(token ?? null);

      await this.router.navigate(['/']);
    } catch (err) {
      console.error('Login failed', err);
    }
  }

  // initialize registered flag from query params
  constructor() {
    try {
      this.registered.set(this.route.snapshot.queryParamMap.get('registered') === '1');
    } catch {
      // ignore if snapshot not available
    }
  }
}
