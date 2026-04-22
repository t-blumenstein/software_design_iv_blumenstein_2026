import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
	{ path: '', loadComponent: () => import('./components/homepage/homepage').then(m => m.Homepage) },
	{ path: 'auth/register', loadComponent: () => import('./components/registration/registration').then(m => m.Registration) },
	{ path: 'auth/login', loadComponent: () => import('./components/login/login').then(m => m.Login) },
	{ path: 'wordgame', canActivate: [authGuard], loadComponent: () => import('./components/gamepage/gamepage').then(m => m.Gamepage) },
	{ path: 'wordgame/:id', canActivate: [authGuard], loadComponent: () => import('./components/gameplay/gameplay').then(m => m.Gameplay) },
	{ path: '**', loadComponent: () => import('./components/not-found/not-found').then(m => m.NotFound) }
];
