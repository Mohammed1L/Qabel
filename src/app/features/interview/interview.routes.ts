import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const INTERVIEW_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./interview/interview.component').then((m) => m.InterviewComponent),
  },
  {
    path: 'review',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./review/review.component').then((m) => m.ReviewComponent),
  },
];
