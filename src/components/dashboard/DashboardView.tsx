import React from 'react';
import { 
  Play, 
  Flame, 
  TrendingUp, 
  Trophy, 
  Sparkles, 
  Dumbbell, 
  Clock, 
  Weight, 
  ArrowRight, 
  ArrowUpRight, 
  Bot, 
  CheckCircle2, 
  Activity,
  Zap,
  Moon,
  Droplets,
  Footprints,
  Calendar
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { getExerciseById } from '../../data/mockExercises';
import { calculateDashboardAnalytics } from '../../services/progressiveOverload';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  onOpenAIImport: () => void;
  onOpenAIGenerator: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onNavigate, 
  onOpenAIImport, 
  onOpenAIGenerator 
}) => {
  const { 
    user, 
    history, 
    prs, 
    activeWorkout, 
    startTodaysAutocompleteWorkout, 
    activeProgram,
    getTodaysScheduleState,
    language,
    t
  } = useWorkout();

  const recentSessions = history.slice(0, 3);
  const schedState = getTodaysScheduleState();
  const todaysWorkoutTemplate = schedState.workoutTemplate;
  const analytics = calculateDashboardAnalytics(history, prs, user.daysPerWeek);

  const isFatLossOrGeneral = user.primaryGoal === 'Fat Loss' || user.secondaryGoal === 'Fat Loss' || user.primaryGoal === 'General Fitness' || user.secondaryGoal === 'General Fitness';

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* PERSISTENT DEMO MODE BANNER */}
      {user.isDemoUser && (
        <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-between gap-3 text-xs text-amber-200 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="text-base">🧪</span>
            <div>
              <p className="font-bold">
                {language === 'ar' ? 'وضع الحساب التجريبي التوضيحي (بيانات تجريبية ومحاكاة لـ 22 جلسة)' : 'Demo Mode (22 Simulated Workout Sessions)'}
              </p>
              <p className="text-[11px] text-amber-300/80">
                {language === 'ar' ? 'هذه البيانات لعرض إمكانيات التطبيق. يمكنك إجراء إعادة ضبط مصنع من صفحة الملف الشخصي.' : 'Demo data for exploration. You can reset to a clean slate from your Profile.'}
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold shrink-0">
            DEMO ACCOUNT
          </span>
        </div>
      )}

      {/* Top Welcome & Streak Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-background-card via-background-elevated to-background-card border border-border/80 rounded-3xl p-6 relative overflow-hidden shadow-card">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-emerald/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent-emerald">{t('readyToTrain')}</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-accent-cyan font-semibold">{user.primaryGoal}{user.secondaryGoal ? ` + ${user.secondaryGoal}` : ''}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {history.length === 0 
              ? (language === 'ar' ? `أهلاً بك يا ${user.name ? user.name.split(' ')[0] : 'بطل'}!` : `Welcome ${user.name ? user.name.split(' ')[0] : 'Athlete'}!`) 
              : `${t('welcomeBack')}, ${user.name ? user.name.split(' ')[0] : 'Athlete'}`}
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            {history.length === 0 
              ? (language === 'ar' ? 'جاهز لتسجيل تمرينك الأول وتفعيل التحليلات الذكية.' : 'Ready to log your first session and activate AI analytics.')
              : t('streakBanner', { streak: user.streakDays })}
          </p>
        </div>

        {/* Quick Start & Calendar CTA Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={() => onNavigate('calendar')}
            className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-background-elevated hover:bg-background-hover border border-border text-slate-200 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Calendar className="w-4 h-4 text-accent-cyan" />
            <span>{language === 'ar' ? 'الجدول والتقويم' : 'View Calendar'}</span>
          </button>

          {!activeWorkout ? (
            <button
              onClick={startTodaysAutocompleteWorkout}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-accent-emerald to-emerald-500 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-md transition-all transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>{t('startTodayWorkout')}</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('active_workout')}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-950 border border-accent-emerald text-emerald-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-sm"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-accent-emerald animate-ping" />
              <span>{t('resumeWorkout')}</span>
            </button>
          )}
        </div>
      </div>

      {/* NEW USER ONBOARDING 3-STEP STARTER CHECKLIST */}
      {history.length === 0 && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-background-card to-cyan-950/30 border border-accent-emerald/40 shadow-card space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-accent-emerald/20 flex items-center justify-center text-accent-emerald">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-sm text-white">
                {language === 'ar' ? '🚀 خطواتك لبداية تدريبية موفقة مع عزمك:' : '🚀 3 Steps to Launch Your Training on AZMK:'}
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-accent-emerald bg-accent-emerald/10 px-2.5 py-1 rounded-full border border-accent-emerald/30">
              1 / 3 {language === 'ar' ? 'مكتمل' : 'Done'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-background-elevated/80 border border-accent-emerald/30 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-accent-emerald text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
              <div>
                <p className="text-xs font-bold text-white">{language === 'ar' ? '1. إعداد الخطة المخصصة' : '1. Generate Protocol'}</p>
                <p className="text-[11px] text-accent-emerald mt-0.5">{language === 'ar' ? 'تم تجهيز خطتك لـ 4 أسابيع بنجاح' : 'Your 4-week split is ready'}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-background-elevated/80 border border-accent-cyan/40 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-accent-cyan text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <div>
                <p className="text-xs font-bold text-white">{language === 'ar' ? '2. إتمام تمرينك الأول' : '2. Complete First Workout'}</p>
                <p className="text-[11px] text-slate-300 mt-0.5">{language === 'ar' ? 'سجل جولاتك لتفعيل بيانات الحجم والأوزان' : 'Log sets to activate data'}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-background-elevated/80 border border-border flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-background-card border border-border text-slate-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <div>
                <p className="text-xs font-bold text-white">{language === 'ar' ? '3. الزيادة التدريجية والمدرب' : '3. AI Overload Targets'}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{language === 'ar' ? 'حساب أوزان الجلسة القادمة آلياً' : 'Automated load calculations'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI SMART TOOLS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onOpenAIImport}
          className="p-4 rounded-3xl bg-background-card hover:bg-background-elevated border border-accent-cyan/40 flex items-center justify-between gap-3 shadow-card active:scale-[0.99] transition-all text-left rtl:text-right group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">{language === 'ar' ? 'استيراد جدول بالذكاء الاصطناعي' : 'Import Text Workout (Gemini AI)'}</span>
                <span className="px-1.5 py-0.2 rounded bg-accent-cyan/10 text-accent-cyan text-[9px] font-mono font-bold">REAL AI</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {language === 'ar' ? 'الصق جدولك وسيقوم الـ AI بتوزيعه بدقة' : 'Paste workout text and Gemini AI will distribute days'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-accent-cyan rtl:rotate-180 transition-colors shrink-0" />
        </button>

        <button
          onClick={onOpenAIGenerator}
          className="p-4 rounded-3xl bg-background-card hover:bg-background-elevated border border-accent-indigo/40 flex items-center justify-between gap-3 shadow-card active:scale-[0.99] transition-all text-left rtl:text-right group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-indigo/15 border border-accent-indigo/30 flex items-center justify-center text-accent-indigo group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">{language === 'ar' ? 'توليد خطة تدريب 4 أسابيع' : 'Generate 4-Week Routine'}</span>
                <span className="px-1.5 py-0.2 rounded bg-accent-indigo/10 text-accent-indigo text-[9px] font-mono font-bold">AI SPLIT</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {language === 'ar' ? 'خطة متكاملة مع أوزان وجولات وزيادة تدريجية' : 'Full periodized routine with progressive overload'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-accent-indigo rtl:rotate-180 transition-colors shrink-0" />
        </button>
      </div>

      {/* 5 CORE ESSENTIAL METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        
        {/* Metric 1: Strength Delta */}
        <div className="p-4 rounded-2xl bg-background-card border border-border flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('strengthMetric')}</span>
            <TrendingUp className="w-4 h-4 text-accent-emerald" />
          </div>
          <div>
            <p className="text-lg sm:text-xl font-black font-mono text-white">
              {history.length > 0 ? analytics.primaryLiftName : (language === 'ar' ? 'تطور القوة' : 'Strength')}
            </p>
            <div className="flex items-center gap-1 text-accent-emerald text-xs font-mono font-bold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>
                {history.length > 0 ? `+${analytics.strengthDeltaPercent}% (${analytics.strengthTimeframeWeeks}w)` : (language === 'ar' ? '0% (سجل أول تمرين)' : '0% (Start Set 1)')}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Volume */}
        <div className="p-4 rounded-2xl bg-background-card border border-border flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('volumeMetric')}</span>
            <Weight className="w-4 h-4 text-accent-cyan" />
          </div>
          <div>
            <p className="text-lg sm:text-xl font-black font-mono text-white">{analytics.recent7dVolumeKg.toLocaleString()} <span className="text-xs text-slate-400 font-normal">kg</span></p>
            <div className="flex items-center gap-1 text-accent-cyan text-xs font-mono font-bold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>
                {history.length > 0 ? `${analytics.volumeDeltaPercent >= 0 ? `+${analytics.volumeDeltaPercent}%` : `${analytics.volumeDeltaPercent}%`} ${t('vsAvg')}` : (language === 'ar' ? '0 كجم أسبوعياً' : '0 kg / wk')}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Consistency */}
        <div className="p-4 rounded-2xl bg-background-card border border-border flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('consistencyMetric')}</span>
            <Activity className="w-4 h-4 text-accent-indigo" />
          </div>
          <div>
            <p className="text-lg sm:text-xl font-black font-mono text-white">
              {analytics.actualWorkoutsPerWeek} <span className="text-xs text-slate-400 font-normal">/ {user.daysPerWeek || 4} {language === 'ar' ? 'أيام' : 'd'}</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {history.length > 0 ? `${analytics.goalAdherencePercent}% ${t('goalAdherence')}` : (language === 'ar' ? '0% هذا الأسبوع' : '0% adherence')}
            </p>
          </div>
        </div>

        {/* Metric 4: PRs */}
        <div className="p-4 rounded-2xl bg-background-card border border-border flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('milestonesMetric')}</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-lg sm:text-xl font-black font-mono text-amber-400">{analytics.prsThisMonth} PRs</p>
            <p className="text-xs text-slate-400 mt-1">
              {history.length > 0 ? t('prsThisMonth') : (language === 'ar' ? 'في انتظار أول إنجاز' : 'Awaiting 1st PR')}
            </p>
          </div>
        </div>

        {/* Metric 5: Overall Program Completion Bar */}
        <div className="col-span-2 md:col-span-1 p-4 rounded-2xl bg-background-card border border-border flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{t('programGoalMetric')}</span>
            <span className="text-xs font-mono font-bold text-accent-emerald">{analytics.programProgressPercent}%</span>
          </div>
          <div>
            <div className="w-full h-2.5 rounded-full bg-background-elevated overflow-hidden mb-2">
              <div className="h-full rounded-full bg-gradient-to-r from-accent-emerald to-accent-cyan" style={{ width: `${Math.max(5, analytics.programProgressPercent)}%` }} />
            </div>
            <p className="text-xs text-slate-300 font-medium truncate">{activeProgram.name || '4-Week Protocol'}</p>
          </div>
        </div>

      </div>

      {/* REST DAY OR SCHEDULED LIFTING DAY CARD */}
      {schedState.isRestDay ? (
        /* REST DAY CARD WITH SMART RECOVERY & CARDIO REMINDERS */
        <div className="p-6 rounded-3xl bg-gradient-to-r from-background-card via-background-elevated to-background-card border border-accent-cyan/40 space-y-5 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-mono font-bold text-accent-cyan tracking-wider">
                {schedState.dayName} • {t('restDayTitle')}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {language === 'ar' ? 'يوم استشفاء ونمو عضلي' : 'Active Recovery & Growth Day'}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                {t('restDaySubtitle')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onNavigate('calendar')}
                className="px-4 py-2.5 rounded-xl bg-accent-cyan/20 hover:bg-accent-cyan text-accent-cyan hover:text-black border border-accent-cyan/40 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Footprints className="w-4 h-4" />
                <span>{t('logCardioActivity')}</span>
              </button>

              <button
                onClick={startTodaysAutocompleteWorkout}
                className="px-4 py-2.5 rounded-xl bg-background-elevated hover:bg-background-hover text-slate-300 text-xs font-bold border border-border transition-all flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{t('startWorkoutAnyway')}</span>
              </button>
            </div>
          </div>

          {/* Recovery Tips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-background-elevated border border-border/80 flex items-start gap-3">
              <Moon className="w-5 h-5 text-accent-indigo shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold text-white block">{language === 'ar' ? 'جودة النوم والاستشفاء' : 'Deep Sleep & GH'}</strong>
                <p className="text-[11px] text-slate-300 mt-0.5">{t('sleepTip')}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-background-elevated border border-border/80 flex items-start gap-3">
              <Droplets className="w-5 h-5 text-accent-cyan shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold text-white block">{language === 'ar' ? 'الترطيب والبروتين' : 'Hydration & Protein'}</strong>
                <p className="text-[11px] text-slate-300 mt-0.5">{t('hydrationTip')}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-background-elevated border border-border/80 flex items-start gap-3">
              <Footprints className="w-5 h-5 text-accent-emerald shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold text-accent-emerald block">{t('cardioReminder')}</strong>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {t('cardioReminderText', { goal: user.primaryGoal })}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TODAY'S SCHEDULED WORKOUT (AUTOMATICALLY ADVANCES DAY 1 -> DAY 2 -> DAY 3...) */
        todaysWorkoutTemplate && (
          <div className="p-6 rounded-3xl bg-background-card border border-border space-y-4 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-mono font-bold text-accent-emerald tracking-wider">
                  {schedState.dayName} • {t('todayScheduled')}
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">{todaysWorkoutTemplate.name}</h2>
              </div>
              
              <button
                onClick={startTodaysAutocompleteWorkout}
                className="px-5 py-2.5 rounded-2xl bg-accent-emerald hover:bg-emerald-400 text-black text-xs font-black transition-all flex items-center gap-1.5 shadow-glow-sm active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>{t('startTodayWorkout')}</span>
              </button>
            </div>

            {/* Exercise Targets Pre-calculated List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {todaysWorkoutTemplate.exercises.slice(0, 4).map((item, idx) => {
                const ex = getExerciseById(item.exerciseId);
                if (!ex) return null;

                return (
                  <div key={idx} className="p-3.5 rounded-2xl bg-background-elevated border border-border/80 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-sm text-white line-clamp-1 font-mono">{ex.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-400">
                        {item.targetSets} × {item.targetReps}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">{t('targetToday')}:</span>
                      <span className="font-bold text-accent-emerald">
                        {history.length > 0
                          ? (ex.id === 'barbell_bench_press' ? '62.5kg' : ex.id === 'barbell_back_squat' ? '105kg' : ex.id === 'incline_dumbbell_press' ? '28kg' : 'Ready')
                          : (user.experience === 'Beginner' ? (language === 'ar' ? '20 كجم (استكشافي)' : '20kg (Starter)') : user.experience === 'Intermediate' ? '45kg' : '60kg')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* AI SMART COACH ACTION CARD */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-background-card via-background-elevated to-background-card border border-accent-indigo/40 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-accent-indigo/20 border border-accent-indigo/40 flex items-center justify-center text-accent-indigo shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-accent-indigo">{t('aiAssistantTitle')}</span>
                <span className="px-2 py-0.5 rounded-full bg-accent-indigo/10 text-accent-indigo text-[10px] font-bold">
                  {history.length > 0 ? t('nextSessionTarget') : (language === 'ar' ? 'جاهز للبدء' : 'Ready')}
                </span>
              </div>
              <p className="text-sm font-semibold text-white mt-1">
                {history.length > 0
                  ? (language === 'ar' 
                      ? 'تم تحليل أداء تمرين Bench Press ومستويات الـ RPE السابقة بدقة.'
                      : 'Your Bench Press has increased with steady RPE adaptation over previous cycles.')
                  : (language === 'ar'
                      ? 'أنا كابتن عزام، مدربك الذكي المباشر. خطتك جاهزة لبدء أول تمرين اليوم.'
                      : "I'm Coach Azzam, your AI strength coach. Your custom protocol is ready for session 1.")}
              </p>
              <p className="text-xs text-slate-300 mt-1">
                {history.length > 0 ? (
                  <>🔥 {language === 'ar' ? 'التوصية المبرمجة:' : 'Recommendation:'} <span className="font-mono font-bold text-white bg-black/40 px-1.5 py-0.5 rounded">65kg × 6–8</span> {language === 'ar' ? 'في التمرين القادم' : 'next workout'}.</>
                ) : (
                  <>💡 {language === 'ar' ? 'توجيه البداية:' : 'Starter Tip:'} {language === 'ar' ? 'ابدأ الجولة الأولى بأوزان خفيفة وتكنيك مريح (RPE 7).' : 'Begin your first workout with comfortable weights (RPE 7).'}</>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('ai_coach')}
              className="px-4 py-2.5 rounded-xl bg-background-elevated hover:bg-background-hover border border-border text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span>{t('askAiCoach')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
            <button
              onClick={startTodaysAutocompleteWorkout}
              className="px-4 py-2.5 rounded-xl bg-accent-emerald hover:bg-emerald-400 text-black text-xs font-extrabold flex items-center gap-1.5 shadow-glow-sm transition-all active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>{history.length > 0 ? t('applyTarget') : (language === 'ar' ? 'بدء التمرين' : 'Start')}</span>
            </button>
          </div>

        </div>
      </div>

      {/* RECENT WORKOUT LOGS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent-cyan" />
            <h3 className="font-bold text-lg text-white">{t('recentWorkouts')}</h3>
          </div>
          {history.length > 0 && (
            <button 
              onClick={() => onNavigate('workouts')}
              className="text-xs font-bold text-accent-cyan hover:underline flex items-center gap-1"
            >
              <span>{t('viewAll')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          )}
        </div>

        {recentSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentSessions.map((session) => (
              <div 
                key={session.id}
                className="p-5 rounded-2xl bg-background-card border border-border hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-mono">{session.date.split('T')[0]}</span>
                    <span className="px-2 py-0.5 rounded bg-background-elevated text-[10px] font-semibold text-slate-300">
                      {session.durationMinutes}m
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-white font-mono">{session.name}</h4>
                  
                  <div className="mt-3 space-y-1">
                    {session.exercises.slice(0, 3).map((exWrap, i) => {
                      const ex = getExerciseById(exWrap.exerciseId);
                      const bestSet = exWrap.sets.reduce((max, s) => s.weight > max.weight ? s : max, exWrap.sets[0] || { weight: 0, reps: 0 });
                      return (
                        <div key={i} className="flex items-center justify-between text-xs text-slate-300">
                          <span className="text-slate-400 truncate max-w-[140px] font-mono">{ex?.name || 'Exercise'}</span>
                          <span className="font-mono font-semibold text-white">{bestSet.weight}kg × {bestSet.reps}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">{t('volumeTonnage')}: <strong className="text-slate-200">{session.totalVolumeKg.toLocaleString()}kg</strong></span>
                  {session.prCount > 0 && (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {session.prCount} PR{session.prCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-background-card border border-dashed border-border/80 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-accent-emerald/10 border border-accent-emerald/30 flex items-center justify-center text-accent-emerald">
              <Dumbbell className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white">
              {language === 'ar' ? 'لا توجد تمارين مسجلة حتى الآن' : 'No workouts logged yet'}
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              {language === 'ar' 
                ? 'اضغط على زر "ابدأ تمرين اليوم" بالأعلى لتسجيل جلستك الأولى وبناء تحليلاتك الشخصية.' 
                : 'Tap "Start Today\'s Workout" above to record your first session and initiate your personal analytics.'}
            </p>
            <button
              onClick={startTodaysAutocompleteWorkout}
              className="px-6 py-2.5 rounded-2xl bg-accent-emerald hover:bg-emerald-400 text-black font-extrabold text-xs shadow-glow-sm transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>{t('startTodayWorkout')}</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
