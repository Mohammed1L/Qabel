import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/landing/landing.component').then(
        (m) => m.LandingComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'oauth2/callback',
    loadComponent: () =>
      import('./features/auth/google-callback/google-callback.component').then(
        (m) => m.GoogleCallbackComponent
      ),
  },
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'session',
        loadChildren: () =>
          import('./features/session/session.routes').then(
            (m) => m.SESSION_ROUTES
          ),
      },
      {
        path: 'interview',
        loadChildren: () =>
          import('./features/interview/interview.routes').then(
            (m) => m.INTERVIEW_ROUTES
          ),
      },
      {
        path: 'progress',
        loadChildren: () =>
          import('./features/progress/progress.routes').then(
            (m) => m.PROGRESS_ROUTES
          ),
      },
      {
        path: 'voice',
        loadComponent: () =>
          import('./features/voice/voice.component').then(
            (m) => m.VoiceComponent
          ),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/contact/contact.component').then(
            (m) => m.ContactComponent
          ),
      },
      { path: '', redirectTo: 'session/start', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '/' },
];
