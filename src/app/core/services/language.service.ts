import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type Lang = 'en' | 'ar';

export const TRANSLATIONS: Record<string, Record<Lang, string>> = {
  // Navigation
  'nav.newSession':   { en: 'New Session',    ar: 'جلسة جديدة' },
  'nav.interview':    { en: 'Interview',       ar: 'المقابلة' },
  'nav.progress':     { en: 'My Progress',     ar: 'تقدمي' },
  'nav.signOut':      { en: 'Sign out',        ar: 'تسجيل الخروج' },
  'nav.voice':         { en: 'Voice',            ar: 'صوتي' },
  'nav.soon':          { en: 'Soon',             ar: 'قريبا' },
  'nav.contact':       { en: 'About Me',         ar: 'عنّي' },
  'nav.developedBy':   { en: 'Developed by',    ar: 'تم التطوير بواسطة' },

  // Voice (coming soon)
  'voice.title':       { en: 'Voice Interview',                             ar: 'مقابلة صوتية' },
  'voice.description': { en: 'Practice interviews using your voice — speak your answers naturally just like a real conversation. This feature is coming soon.', ar: 'تدرّب على المقابلات باستخدام صوتك — أجب بشكل طبيعي كأنك في محادثة حقيقية. هذه الميزة قادمة قريباً.' },
  'voice.backToInterview': { en: 'Back to text interview', ar: 'العودة للمقابلة النصية' },

  // About page
  'about.role':        { en: 'Software Engineer',              ar: 'مهندس برمجيات' },
  'about.uni':         { en: 'KFUPM — King Fahd University of Petroleum and Minerals', ar: 'جامعة الملك فهد للبترول والمعادن' },
  'about.bio':         { en: 'Software engineer graduated from KFUPM, interested in full-stack development and cloud technologies. Feel free to reach out.', ar: 'مهندس برمجيات خريج جامعة الملك فهد للبترول والمعادن، مهتم بتطوير الويب الشامل وتقنيات الحوسبة السحابية. لا تتردد في التواصل.' },

  // Session Start
  'session.heroTitle':         { en: 'Start a New Interview',    ar: 'ابدأ مقابلة جديدة' },
  'session.heroSubtitle':      { en: 'Paste a job posting and our AI will generate a tailored mock interview with real questions based on the role requirements.', ar: 'الصق إعلان الوظيفة وسيقوم الذكاء الاصطناعي بإنشاء مقابلة تدريبية مخصصة بأسئلة حقيقية بناءً على متطلبات الدور.' },
  'session.ctaBtn':            { en: 'Add Job Posting',          ar: 'أضف إعلان الوظيفة' },
  'session.ctaHint':           { en: 'Copy a job description from any platform and paste it here', ar: 'انسخ الوصف الوظيفي من أي منصة والصقه هنا' },
  'session.back':              { en: 'Back',                     ar: 'رجوع' },
  'session.editorTitle':       { en: 'Paste the Job Posting',    ar: 'الصق إعلان الوظيفة' },
  'session.editorSubtitle':    { en: 'Paste the full job description below. The AI will analyze the requirements and generate a targeted interview.', ar: 'الصق الوصف الوظيفي الكامل أدناه. سيحلل الذكاء الاصطناعي المتطلبات وينشئ مقابلة مستهدفة.' },
  'session.placeholder':       { en: 'Paste the full job description here...\n\nExample:\n\nSenior Backend Engineer — Fintech Startup\n\nWe are looking for a senior backend engineer to design and build scalable microservices. You will work with Go, PostgreSQL, and Kubernetes in a fast-paced environment...\n\nRequirements:\n- 5+ years experience with Go or Java\n- Strong understanding of distributed systems\n- Experience with cloud infrastructure (AWS/GCP)\n- ...', ar: 'الصق الوصف الوظيفي الكامل هنا...\n\nمثال:\n\nمهندس خلفية أول — شركة تقنية مالية\n\nنبحث عن مهندس خلفية أول لتصميم وبناء خدمات مصغرة قابلة للتوسع...\n\nالمتطلبات:\n- خبرة 5+ سنوات في Go أو Java\n- فهم قوي للأنظمة الموزعة\n- ...' },
  'session.generateBtn':       { en: 'Generate Interview',       ar: 'إنشاء المقابلة' },
  'session.generating':        { en: 'Generating your interview…', ar: 'جاري إنشاء المقابلة...' },
  'session.generatingHint':    { en: 'Analyzing the job posting and crafting tailored questions', ar: 'جاري تحليل إعلان الوظيفة وصياغة أسئلة مخصصة' },
  'session.errorRequired':     { en: 'Please paste a job description', ar: 'يرجى لصق وصف وظيفي' },
  'session.errorMinLength':    { en: 'The description seems too short — paste the full posting', ar: 'الوصف يبدو قصيرًا جدًا — الصق الإعلان الكامل' },
  'session.limitTitle':        { en: 'Interview Limit Reached',        ar: 'تم الوصول للحد الأقصى من المقابلات' },
  'session.limitMessage':      { en: 'This is the first version of Qabel, restricted to 2 interviews per account. We\'d love to hear your feedback to keep improving!', ar: 'هذه النسخة الأولى من قابيل، وهي مقيّدة بـ 2 مقابلة لكل حساب. نودّ سماع ملاحظاتك لمواصلة التحسين!' },
  'session.limitContact':      { en: 'Share Your Feedback',            ar: 'شارك ملاحظاتك' },

  // Interview
  'interview.question':        { en: 'Question',                ar: 'سؤال' },
  'interview.of':              { en: 'of',                      ar: 'من' },
  'interview.loading':         { en: 'Generating your interview questions…', ar: 'جاري إنشاء أسئلة المقابلة...' },
  'interview.yourAnswer':      { en: 'Your Answer',             ar: 'إجابتك' },
  'interview.answerPlaceholder':{ en: 'Write your answer here… be as detailed as possible.', ar: 'اكتب إجابتك هنا... كن مفصلًا قدر الإمكان.' },
  'interview.submit':          { en: 'Submit Answer',           ar: 'إرسال الإجابة' },
  'interview.evaluating':      { en: 'Evaluating your answer…', ar: 'جاري تقييم إجابتك...' },
  'interview.feedback':        { en: 'AI Feedback',             ar: 'تقييم الذكاء الاصطناعي' },
  'interview.strengths':       { en: 'Strengths',               ar: 'نقاط القوة' },
  'interview.improvements':    { en: 'Improvements',            ar: 'نقاط التحسين' },
  'interview.next':            { en: 'Next Question',           ar: 'السؤال التالي' },
  'interview.finish':          { en: 'Finish Session',          ar: 'إنهاء الجلسة' },
  'interview.complete':        { en: 'Session Complete',        ar: 'اكتملت الجلسة' },
  'interview.answered':        { en: 'You answered',            ar: 'لقد أجبت على' },
  'interview.questions':       { en: 'questions',               ar: 'أسئلة' },
  'interview.avgScore':        { en: '/ 100 Average Score',     ar: '/ 100 متوسط الدرجات' },
  'interview.viewProgress':    { en: 'View My Progress',        ar: 'عرض تقدمي' },
  'interview.idealAnswer':     { en: 'Ideal Answer',            ar: 'الإجابة المثالية' },
  'interview.followUp':        { en: 'Follow-up Questions',     ar: 'أسئلة المتابعة' },

  // Progress
  'progress.title':            { en: 'My Progress',             ar: 'تقدمي' },
  'progress.newSession':       { en: 'New Session',             ar: 'جلسة جديدة' },
  'progress.totalSessions':    { en: 'Total Sessions',          ar: 'إجمالي الجلسات' },
  'progress.completed':        { en: 'Completed',               ar: 'مكتمل' },
  'progress.avgScore':         { en: 'Average Score',           ar: 'متوسط الدرجات' },
  'progress.topicBreakdown':   { en: 'Topic Breakdown',         ar: 'تفصيل المواضيع' },
  'progress.recentSessions':   { en: 'Recent Sessions',         ar: 'الجلسات الأخيرة' },
  'progress.date':             { en: 'Date',                    ar: 'التاريخ' },
  'progress.role':             { en: 'Role',                    ar: 'الدور' },
  'progress.difficulty':       { en: 'Difficulty',              ar: 'الصعوبة' },
  'progress.score':            { en: 'Score',                   ar: 'الدرجة' },
  'progress.questions':        { en: 'questions',               ar: 'أسئلة' },
  'progress.loading':          { en: 'Loading your progress…',  ar: 'جاري تحميل تقدمك...' },

  // Auth
  'auth.signIn':               { en: 'Sign In',                 ar: 'تسجيل الدخول' },
  'auth.createAccount':        { en: 'Create Account',          ar: 'إنشاء حساب' },
  'auth.tagline':              { en: 'AI-Powered Interview Preparation', ar: 'تحضير للمقابلات بالذكاء الاصطناعي' },
  'auth.email':                { en: 'Email',                   ar: 'البريد الإلكتروني' },
  'auth.password':             { en: 'Password',                ar: 'كلمة المرور' },
  'auth.name':                 { en: 'Full Name',               ar: 'الاسم الكامل' },
  'auth.noAccount':            { en: "Don't have an account?",  ar: 'ليس لديك حساب؟' },
  'auth.hasAccount':           { en: 'Already have an account?', ar: 'لديك حساب بالفعل؟' },
  'auth.createOne':            { en: 'Create one',              ar: 'أنشئ حسابًا' },
  'auth.signInLink':           { en: 'Sign in',                 ar: 'تسجيل الدخول' },
  'auth.signingIn':            { en: 'Signing in…',             ar: 'جاري تسجيل الدخول...' },
  'auth.creatingAccount':      { en: 'Creating account…',       ar: 'جاري إنشاء الحساب...' },
  'auth.loginRequired':        { en: 'Please sign in to access the interview.', ar: 'يرجى تسجيل الدخول للوصول إلى المقابلة.' },
  'auth.sessionExpired':       { en: 'Your session has expired. Please sign in again.', ar: 'انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى.' },
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly doc = inject(DOCUMENT);
  readonly lang = signal<Lang>('en');

  constructor() {
    effect(() => {
      const l = this.lang();
      this.doc.documentElement.dir  = l === 'ar' ? 'rtl' : 'ltr';
      this.doc.documentElement.lang = l;
    });
  }

  toggle(): void {
    this.lang.update((l) => (l === 'en' ? 'ar' : 'en'));
  }

  t(key: string): string {
    return TRANSLATIONS[key]?.[this.lang()] ?? key;
  }
}
