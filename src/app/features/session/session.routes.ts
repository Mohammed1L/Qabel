import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const SESSION_ROUTES: Routes = [
  {
    path: 'start',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./session-start/session-start.component').then(
        (m) => m.SessionStartComponent
      ),
  },
  {
    path: ':id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./session-detail/session-detail.component').then(
        (m) => m.SessionDetailComponent
      ),
  },
  { path: '', redirectTo: 'start', pathMatch: 'full' },
];
