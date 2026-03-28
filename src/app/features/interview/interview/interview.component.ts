import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { InterviewService } from '../../../core/services/interview.service';
import { LanguageService } from '../../../core/services/language.service';
import { Question } from '../../../shared/models/question.models';
import { AnswerFeedback, FollowUpQuestion } from '../../../shared/models/answer.models';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '../../../shared/components/error-banner/error-banner.component';

export interface ChatBubble {
  id: string;
  role: 'ai' | 'user';
  text: string;
  category?: string;
  difficulty?: string;
  isFollowUp: boolean;
  questionId?: string;
  feedbackData?: AnswerFeedback;
  feedbackShown: boolean;
}

@Component({
  selector: 'app-interview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgClass, LoadingSpinnerComponent, ErrorBannerComponent],
  templateUrl: './interview.component.html',
  styleUrl: './interview.component.scss',
})
export class InterviewComponent implements OnInit {
  @ViewChild('chatMessages') private chatMessages!: ElementRef;

  private readonly route            = inject(ActivatedRoute);
  private readonly router           = inject(Router);
  private readonly interviewService = inject(InterviewService);
  readonly lang                     = inject(LanguageService);

  private sessionId          = '';
  private isCurrentFollowUp = false;

  readonly chatBubbles       = signal<ChatBubble[]>([]);
  readonly followUpQueue     = signal<FollowUpQuestion[]>([]);
  readonly currentQuestion   = signal<Question | null>(null);
  readonly loading           = signal(true);
  readonly submitting        = signal(false);
  readonly error             = signal<string | null>(null);
  readonly allFeedbacks      = signal<AnswerFeedback[]>([]);
  /** Set when the backend signals the interview is over. */
  readonly completionReason  = signal<string | null>(null);
  /** Controls the "are you sure?" confirmation dialog. */
  readonly showEndConfirm    = signal(false);
  readonly ending            = signal(false);

  readonly answerControl = new FormControl('', [
    Validators.required,
    Validators.minLength(20),
  ]);

  /** True when the last bubble is from AI — waiting for user input. */
  readonly isWaitingForAnswer = computed(() => {
    const b = this.chatBubbles();
    return b.length > 0 && b[b.length - 1].role === 'ai';
  });

  readonly isComplete = computed(() => this.completionReason() !== null);

  ngOnInit(): void {
    const sid = this.route.snapshot.queryParamMap.get('sessionId');
    if (!sid) {
      this.router.navigate(['/app/session/start']);
      return;
    }
    this.sessionId = sid;
    this.loadNextMainQuestion();
  }

  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      const el = this.chatMessages?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private loadNextMainQuestion(): void {
    this.loading.set(true);
    this.interviewService.generateQuestion({ sessionId: this.sessionId }).subscribe({
      next: (q) => {
        if (q.interviewComplete) {
          // Backend signals session end
          this.completionReason.set(q.completionReason ?? 'Interview complete.');
          this.loading.set(false);
          this.scrollToBottom();
          return;
        }
        this.currentQuestion.set(q);
        this.isCurrentFollowUp = false;
        this.pushAiBubble({
          text: q.questionText!,
          category: q.category ?? undefined,
          difficulty: q.difficulty ?? undefined,
          isFollowUp: false,
          questionId: q.id!,
        });
        this.loading.set(false);
        this.scrollToBottom();
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to generate question.');
        this.loading.set(false);
      },
    });
  }

  private pushAiBubble(opts: Omit<ChatBubble, 'id' | 'role' | 'feedbackShown'>): void {
    this.chatBubbles.update((b) => [
      ...b,
      { id: crypto.randomUUID(), role: 'ai', feedbackShown: false, ...opts },
    ]);
  }

  private processNextInQueue(): void {
    const [next, ...rest] = this.followUpQueue();
    if (next) {
      this.followUpQueue.set(rest);
      this.isCurrentFollowUp = true;
      this.pushAiBubble({ text: next.question, isFollowUp: true });
      this.scrollToBottom();
    } else {
      // Ask the backend for the next question — it decides if the session ends
      this.loadNextMainQuestion();
    }
  }

  // ── Public actions ──────────────────────────────────────────────────────────

  sendAnswer(): void {
    if (this.answerControl.invalid) return;
    const text = this.answerControl.value!;

    this.chatBubbles.update((b) => [
      ...b,
      { id: crypto.randomUUID(), role: 'user', text, isFollowUp: false, feedbackShown: false },
    ]);
    this.answerControl.reset();
    this.scrollToBottom();

    // Follow-up answers are conversational — no backend submission
    if (this.isCurrentFollowUp) {
      this.processNextInQueue();
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this.interviewService
      .submitAnswer({ questionId: this.currentQuestion()!.id!, answerText: text })
      .subscribe({
        next: (feedback) => {
          this.allFeedbacks.update((arr) => [...arr, feedback]);

          // Attach feedback to the nearest preceding AI question bubble
          this.chatBubbles.update((bubbles) => {
            const revIdx = [...bubbles]
              .reverse()
              .findIndex((b) => b.role === 'ai' && b.questionId != null);
            if (revIdx === -1) return bubbles;
            const idx = bubbles.length - 1 - revIdx;
            return bubbles.map((b, i) => (i === idx ? { ...b, feedbackData: feedback } : b));
          });

          if (feedback.followUpQuestions?.length) {
            this.followUpQueue.set([...feedback.followUpQuestions]);
          }
          this.submitting.set(false);
          this.processNextInQueue();
        },
        error: (err) => {
          this.error.set(err?.error?.message ?? 'Failed to submit answer.');
          this.submitting.set(false);
          // Remove the optimistically added user bubble
          this.chatBubbles.update((b) => b.slice(0, -1));
        },
      });
  }

  showFeedback(bubbleId: string): void {
    this.chatBubbles.update((bubbles) =>
      bubbles.map((b) => (b.id === bubbleId ? { ...b, feedbackShown: true } : b)),
    );
    this.scrollToBottom();
  }

  confirmEndInterview(): void {
    this.showEndConfirm.set(true);
  }

  cancelEndInterview(): void {
    this.showEndConfirm.set(false);
  }

  endInterview(): void {
    this.ending.set(true);
    this.showEndConfirm.set(false);
    this.interviewService.endInterview(this.sessionId).subscribe({
      next: () => {
        this.completionReason.set('You ended the interview early.');
        this.ending.set(false);
        this.scrollToBottom();
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Failed to end interview.');
        this.ending.set(false);
      },
    });
  }

  goToReview(): void {
    this.router.navigate(['/app/interview/review'], {
      queryParams: { sessionId: this.sessionId },
    });
  }

  getCategoryClass(category?: string): string {
    if (!category) return 'cat--default';
    const c = category.toLowerCase();
    if (c.includes('technical'))  return 'cat--technical';
    if (c.includes('behavioral')) return 'cat--behavioral';
    if (c.includes('system'))     return 'cat--system';
    if (c.includes('problem'))    return 'cat--problem';
    return 'cat--default';
  }
}
