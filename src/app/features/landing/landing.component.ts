import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  signal,
  computed,
  ChangeDetectionStrategy,
  ElementRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

interface LangContent {
  navHowItWorks: string;
  navFeatures: string;
  navContact: string;
  navSignIn: string;
  navGetStarted: string;
  eyebrow: string;
  heroLine1: string;
  heroLine2: string;
  subtitle1: string;
  subtitle2: string;
  ctaPrimary: string;
  ctaSecondary: string;
  howItWorksTitle: string;
  steps: { num: string; title: string; desc: string }[];
  featuresTitle: string;
  featureCards: { title: string; desc: string }[];
  voiceCardTitle: string;
  ctaSectionTitle: string;
  ctaSectionDesc: string;
  ctaSectionBtn: string;
  footerCopy: string;
  langToggle: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgClass],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly el         = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly roles = [
    'Software Engineer',
    'Product Manager',
    'Finance Analyst',
    'Data Analyst',
    'Marketing Manager',
    'UX Designer',
    'Business Analyst',
    'DevOps Engineer',
    'HR Manager',
    'Operations Manager',
  ];

  readonly displayText = signal('');
  readonly showCursor  = signal(true);
  readonly isArabic    = signal(false);

  private roleIndex  = 0;
  private charIndex  = 0;
  private isDeleting = false;
  private timer:       ReturnType<typeof setTimeout>  | null = null;
  private cursorTimer: ReturnType<typeof setInterval> | null = null;
  private observer:    IntersectionObserver           | null = null;

  private readonly en: LangContent = {
    navHowItWorks: 'How it works',
    navFeatures: 'Features',
    navContact: 'About',
    navSignIn: 'Sign in',
    navGetStarted: 'Get started',
    eyebrow: 'AI-powered mock interviews',
    heroLine1: 'Ace Your',
    heroLine2: 'Interview',
    subtitle1: 'Practice through typing and get immediate results.',
    subtitle2: 'No AI avatars. Harsh feedback. Real improvement.',
    ctaPrimary: 'Start Practicing',
    ctaSecondary: 'Sign in →',
    howItWorksTitle: 'How it works',
    steps: [
      { num: '01', title: 'Start a new interview', desc: 'Click the + button to kick off a fresh mock interview session in seconds.' },
      { num: '02', title: 'Paste the job description', desc: 'Drop in the job posting you\'re targeting — the AI tailors every question to that specific role.' },
      { num: '03', title: 'Answer the questions', desc: 'Type your answers naturally and think through your reasoning — just like a real interview.' },
      { num: '04', title: 'See your feedback', desc: 'Get instant, unfiltered AI scoring and feedback on every answer. No sugarcoating.' },
    ],
    featuresTitle: 'Built for serious prep',
    featureCards: [
      { title: 'Instant evaluation', desc: 'No waiting. Get scored and explained the moment you submit your answer.' },
      { title: 'Deep analytics', desc: 'Session history, topic breakdown, and score trends to guide your prep.' },
      { title: 'Adaptive sessions', desc: 'Questions adapt to your weak spots so every session targets what matters.' },
    ],
    voiceCardTitle: 'Voice support',
    ctaSectionTitle: 'Ready to stop guessing?',
    ctaSectionDesc: 'Join professionals who prep smarter, not harder.',
    ctaSectionBtn: 'Start for free',
    footerCopy: '© 2026 Qabel. All rights reserved.',
    langToggle: 'عربي',
  };

  private readonly ar: LangContent = {
    navHowItWorks: 'كيف يعمل',
    navFeatures: 'المميزات',
    navContact: 'عنّي',
    navSignIn: 'تسجيل الدخول',
    navGetStarted: 'ابدأ الآن',
    eyebrow: 'مقابلات وظيفية بالذكاء الاصطناعي',
    heroLine1: 'اجتز مقابلة',
    heroLine2: 'بنجاح',
    subtitle1: 'تدرّب بالكتابة واحصل على نتائج فورية.',
    subtitle2: 'لا صور افتراضية. تقييم صريح. تحسّن حقيقي.',
    ctaPrimary: 'ابدأ التدريب',
    ctaSecondary: '← تسجيل الدخول',
    howItWorksTitle: 'كيف يعمل',
    steps: [
      { num: '01', title: 'ابدأ مقابلة جديدة', desc: 'اضغط على زر + لبدء جلسة مقابلة تجريبية جديدة في ثوانٍ.' },
      { num: '02', title: 'الصق وصف الوظيفة', desc: 'أضف إعلان الوظيفة المستهدفة — الذكاء الاصطناعي يخصّص كل سؤال لتلك الوظيفة تحديداً.' },
      { num: '03', title: 'أجب على الأسئلة', desc: 'اكتب إجابتك بشكل طبيعي وفكّر في منطقك — تماماً كالمقابلة الحقيقية.' },
      { num: '04', title: 'شاهد التقييم', desc: 'احصل على تقييم فوري وصريح من الذكاء الاصطناعي لكل إجابة. بدون مجاملات.' },
    ],
    featuresTitle: 'مصمّم للتحضير الجاد',
    featureCards: [
      { title: 'تقييم فوري', desc: 'بدون انتظار. احصل على تقييم وشرح فور إرسال إجابتك.' },
      { title: 'تحليلات عميقة', desc: 'سجل الجلسات، تفصيل المواضيع، واتجاهات الدرجات لتوجيه تحضيرك.' },
      { title: 'جلسات تكيّفية', desc: 'تتكيّف الأسئلة مع نقاط ضعفك لكي تستهدف كل جلسة ما يهم فعلاً.' },
    ],
    voiceCardTitle: 'دعم الصوت',
    ctaSectionTitle: 'هل أنت مستعد للتوقف عن التخمين؟',
    ctaSectionDesc: 'انضم للمحترفين الذين يتحضّرون بذكاء.',
    ctaSectionBtn: 'ابدأ مجاناً',
    footerCopy: '© 2026 قابل. جميع الحقوق محفوظة.',
    langToggle: 'English',
  };

  readonly c = computed(() => (this.isArabic() ? this.ar : this.en));

  toggleLang(): void {
    this.isArabic.update((v) => !v);
  }

  ngOnInit(): void {
    this.startTypewriter();
    this.cursorTimer = setInterval(() => {
      this.showCursor.update((v) => !v);
    }, 530);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    this.el.nativeElement
      .querySelectorAll('[data-reveal]')
      .forEach((el: Element) => this.observer!.observe(el));
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
    if (this.cursorTimer) clearInterval(this.cursorTimer);
    this.observer?.disconnect();
  }

  private startTypewriter(): void {
    const role = this.roles[this.roleIndex];

    if (!this.isDeleting) {
      this.displayText.set(role.substring(0, this.charIndex + 1));
      this.charIndex++;
      if (this.charIndex === role.length) {
        this.timer = setTimeout(() => {
          this.isDeleting = true;
          this.startTypewriter();
        }, 2200);
        return;
      }
    } else {
      this.displayText.set(role.substring(0, this.charIndex - 1));
      this.charIndex--;
      if (this.charIndex === 0) {
        this.isDeleting = false;
        this.roleIndex = (this.roleIndex + 1) % this.roles.length;
      }
    }

    const speed = this.isDeleting ? 55 : 95;
    this.timer = setTimeout(() => this.startTypewriter(), speed);
  }

  readonly questionCards = [
    {
      text: 'How would you prioritize a roadmap when every stakeholder thinks their feature is critical?',
      badge: 'Product Manager',
      badgeClass: 'badge-pm',
    },
    {
      text: 'Walk me through how you would build a DCF model for a growth-stage startup.',
      badge: 'Finance Analyst',
      badgeClass: 'badge-finance',
    },
    {
      text: 'How would you design an A/B test to measure the impact of a new onboarding flow?',
      badge: 'Data Analyst',
      badgeClass: 'badge-data',
    },
    {
      text: 'How would you design a distributed URL shortener at scale?',
      badge: 'Software Engineer',
      badgeClass: 'badge-system',
    },
  ];
}
