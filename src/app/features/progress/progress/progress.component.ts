import {
  Component,
  inject,
  signal,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ProgressService } from '../../../core/services/progress.service';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { UserProgress } from '../../../shared/models/progress.models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../../shared/components/error-banner/error-banner.component';

@Component({
  selector: 'app-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    DatePipe,
    DecimalPipe,
    LoadingSpinnerComponent,
    ErrorBannerComponent,
  ],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss',
})
export class ProgressComponent implements OnInit {
  private readonly progressService = inject(ProgressService);
  private readonly auth            = inject(AuthService);
  private readonly router          = inject(Router);
  readonly lang                    = inject(LanguageService);

  readonly progress = signal<UserProgress | null>(null);
  readonly loading  = signal(true);
  readonly error    = signal<string | null>(null);

  ngOnInit(): void {
    const userId = this.auth.userId();
    if (!userId) return;

    this.progressService.getProgress(userId).subscribe({
      next: (p) => {
        this.progress.set(p);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to load progress.');
        this.loading.set(false);
      },
    });
  }

  openSession(sessionId: string): void {
    this.router.navigate(['/app/interview/review'], {
      queryParams: { sessionId },
    });
  }

  getScoreClass(score: number): string {
    if (score >= 75) return 'score-green';
    if (score >= 50) return 'score-orange';
    return 'score-red';
  }
}
