import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#0b0620] text-[#e9e1ff]">
      <div class="w-full max-w-3xl bg-[#150629]/80 rounded p-8">
        <h1 class="text-5xl font-bold mb-4">404</h1>
        <p class="mb-6">Page Not Found</p>
        <a routerLink="/" class="bg-[#7b2cff] px-4 py-2 rounded text-white">Go Home</a>
      </div>
    </div>
  `
})
export class NotFound {}
