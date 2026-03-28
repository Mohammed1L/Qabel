import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ReviewService } from '../../../core/services/review.service';
import { SessionReview } from '../../../shared/models/review.models';
import { ErrorBannerComponent } from '../../../shared/components/error-banner/error-banner.component';

@Component({
  selector: 'app-review',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, ErrorBannerComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
})
export class ReviewComponent implements OnInit {
  private readonly route         = inject(ActivatedRoute);
  private readonly router        = inject(Router);
  private readonly reviewService = inject(ReviewService);

  readonly review  = signal<SessionReview | null>(null);
  readonly loading = signal(true);
  readonly error   = signal<string | null>(null);

  /** Set of questionIds whose ideal answer panel is open. */
  readonly expandedIds = signal<Set<string>>(new Set());

  readonly jobTitle = computed(() => {
    const jp = this.review()?.jobPosting ?? '';
    return jp.length > 60 ? jp.slice(0, 60) + '…' : jp;
  });

  readonly answeredCount = computed(() =>
    this.review()?.questions.filter((q) => q.userAnswer !== null).length ?? 0,
  );

  readonly averageScore = computed(() => {
    const scores = (this.review()?.questions ?? [])
      .map((q) => q.aiScore)
      .filter((s): s is number => s !== null);
    if (!scores.length) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  });

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('sessionId');
    if (!sessionId) {
      this.router.navigate(['/app/session/start']);
      return;
    }

    this.reviewService.getSessionReview(sessionId).subscribe({
      next: (data) => {
        this.review.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to load review.');
        this.loading.set(false);
      },
    });
  }

  toggleIdeal(questionId: string): void {
    this.expandedIds.update((set) => {
      const next = new Set(set);
      next.has(questionId) ? next.delete(questionId) : next.add(questionId);
      return next;
    });
  }

  isExpanded(questionId: string): boolean {
    return this.expandedIds().has(questionId);
  }

  getCategoryClass(category: string): string {
    const c = category.toLowerCase();
    if (c.includes('technical'))    return 'cat-technical';
    if (c.includes('system'))       return 'cat-system';
    if (c.includes('problem'))      return 'cat-problem';
    if (c.includes('behavioral'))   return 'cat-behavioral';
    if (c.includes('adaptability')) return 'cat-adaptability';
    return 'cat-default';
  }

  getDifficultyClass(difficulty: string): string {
    const d = difficulty.toUpperCase();
    if (d === 'EASY') return 'diff-easy';
    if (d === 'HARD') return 'diff-hard';
    return 'diff-medium';
  }

  getScoreClass(score: number | null): string {
    if (score === null) return '';
    if (score >= 75) return 'score-green';
    if (score >= 50) return 'score-orange';
    return 'score-red';
  }

  goToNewInterview(): void {
    this.router.navigate(['/app/session/start']);
  }

  goToDashboard(): void {
    this.router.navigate(['/app/progress']);
  }
}
