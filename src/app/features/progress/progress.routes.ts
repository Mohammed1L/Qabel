import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const PROGRESS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./progress/progress.component').then((m) => m.ProgressComponent),
  },
];
