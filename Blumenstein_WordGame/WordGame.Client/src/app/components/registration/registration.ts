import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './registration.html',
})
export class Registration {
  protected readonly submitted = signal(false);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  protected readonly errors = signal<string[]>([]);

  protected form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false)
  });

  protected async onSubmit() {
    this.submitted.set(true);
    console.log('Registration submitted', this.form.value);
    if (this.form.invalid) {
      // mark controls so validation messages appear
      Object.values(this.form.controls).forEach(c => c.markAsTouched());
      console.warn('Form invalid', this.form.errors, this.form.controls);
      return;
    }

    const payload = {
      email: this.form.value.email,
      password: this.form.value.password,
      confirmPassword: this.form.value.confirmPassword,
      rememberMe: !!this.form.value.rememberMe
    };

    try {
      await this.http.post('/api/auth/register', payload).toPromise();
      // On success, navigate to the login page so the user can sign in
      console.log('Registration successful');
      await this.router.navigate(['/auth/login'], { queryParams: { registered: '1' } });
    } catch (err: any) {
      console.error('Registration error', err);
      try {
        const serverErr = err?.error;
        if (Array.isArray(serverErr)) {
          this.errors.set(serverErr.map((e: any) => String(e)));
        } else if (serverErr && typeof serverErr === 'object') {
          const msgs: string[] = [];
          for (const key of Object.keys(serverErr)) {
            const v = serverErr[key];
            if (Array.isArray(v)) msgs.push(...v.map((s: any) => String(s)));
            else msgs.push(String(v));
          }
          this.errors.set(msgs);
        } else {
          this.errors.set([err?.message || err?.statusText || 'Registration failed']);
        }
      } catch {
        this.errors.set(['Registration failed']);
      }
    }
  }
}
