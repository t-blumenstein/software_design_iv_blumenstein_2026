import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

interface JwtPayload {
  name?: string;
  unique_name?: string;
  sub?: string;
  email?: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return (
      localStorage.getItem('token') ||
      localStorage.getItem('access_token') ||
      localStorage.getItem('id_token') ||
      null
    );
  }

  setToken(token: string | null) {
    try {
      if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
    } catch {}
  }

  clearToken() {
    try { localStorage.removeItem('token'); } catch {}
  }

  decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const fn = (jwt_decode as any).default ?? (jwt_decode as any);
      return fn(token) as JwtPayload;
    } catch (e) {
      return null;
    }
  }
}
