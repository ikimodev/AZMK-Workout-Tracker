import React from 'react';
import { 
  Play, 
  Trophy, 
  Sparkles, 
  Clock, 
  Weight, 
  ArrowRight,
  Bot,
  CheckCircle2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { getExerciseById } from '../../data/mockExercises';
import { calculateDashboardAnalytics } from '../../services/progressiveOverload';
import { getExerciseDisplayName, formatUnitDisplay } from '../../i18n/fitnessDictionary';

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
    getTodaysScheduleState,
    language,
    t
  } = useWorkout();

  const recentSessions = history.slice(0, 3);
  const schedState = getTodaysScheduleState();
  const todaysWorkoutTemplate = schedState.workoutTemplate;
  const analytics = calculateDashboardAnalytics(history, prs, user.daysPerWeek);

  // Generate the 7-day strip logic based on scheduled days
  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const allDaysAr = ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"];
  
  // To keep it simple, we use current day as index, but let's just render Mon-Sun
  const todayIndex = (new Date().getDay() + 6) % 7; // 0=Mon, 6=Sun

  return (
    <div className="space-y-4 pb-20 animate-fade-in max-w-lg mx-auto">
      
      {/* 1. HERO CARD */}
      <div className="rounded-3xl bg-gradient-to-br from-background-card to-background-elevated border border-border shadow-card overflow-hidden">
        {schedState.isRestDay ? (
          <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
             <div className="text-4xl mb-2">💤</div>
             <h2 className="text-xl font-black text-white">
               {language === 'ar' ? 'يوم للراحة والاستشفاء' : 'Rest & Recovery Day'}
             </h2>
             <p className="text-sm text-slate-400">
               {language === 'ar' ? 'عضلاتك تنمو أثناء الراحة. استمتع بيومك!' : 'Your muscles grow while you rest. Enjoy your day!'}
             </p>
             <button
                onClick={startTodaysAutocompleteWorkout}
                className="mt-2 text-xs font-bold text-accent-cyan hover:underline"
              >
                {language === 'ar' ? 'هل تريد التدرب على أي حال؟' : 'Train anyway?'}
              </button>
          </div>
        ) : (
          todaysWorkoutTemplate ? (
            <div className="p-5 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-full bg-accent-emerald/10 text-accent-emerald text-[10px] font-black uppercase tracking-widest border border-accent-emerald/20">
                  {schedState.dayName}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  {todaysWorkoutTemplate.exercises.length} {language === 'ar' ? 'تمارين' : 'Exercises'}
                </span>
              </div>
              
              <h2 className="text-2xl font-black text-white mb-4 line-clamp-2">
                {todaysWorkoutTemplate.name}
              </h2>

              {/* Horizontal Exercise Chips with Fade Mask */}
              <div className="relative mb-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pr-8">
                  {todaysWorkoutTemplate.exercises.map((item, idx) => {
                    const ex = getExerciseById(item.exerciseId);
                    if (!ex) return null;
                    return (
                      <div key={idx} className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-background text-slate-300 text-[11px] font-bold border border-border">
                        {getExerciseDisplayName(ex.id, language)}
                      </div>
                    );
                  })}
                </div>
                {/* Right Fade Gradient */}
                <div className="absolute top-0 right-0 bottom-1 w-8 bg-gradient-to-l from-background-elevated to-transparent pointer-events-none rounded-r-lg" />
              </div>

              {!activeWorkout ? (
                <button
                  onClick={startTodaysAutocompleteWorkout}
                  className="w-full py-4 rounded-2xl bg-accent-emerald text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-transform"
                >
                  <Play className="w-5 h-5 fill-black" />
                  <span>{t('startTodayWorkout')}</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('active_workout')}
                  className="w-full py-4 rounded-2xl bg-emerald-950 border border-accent-emerald text-emerald-400 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                  <div className="w-3 h-3 rounded-full bg-accent-emerald animate-ping" />
                  <span>{t('resumeWorkout')}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="p-6 text-center">
              <h2 className="text-xl font-black text-white">{language === 'ar' ? 'لا يوجد جدول' : 'No Active Program'}</h2>
              <button onClick={() => onNavigate('calendar')} className="mt-4 px-4 py-2 bg-accent-cyan text-black font-bold rounded-xl text-sm">
                {language === 'ar' ? 'اذهب للتقويم' : 'Go to Calendar'}
              </button>
            </div>
          )
        )}
      </div>

      {/* 2. AI ACTION PILLS */}
      <div className="flex gap-3">
        <button
          onClick={onOpenAIGenerator}
          className="flex-1 py-2.5 px-3 rounded-2xl bg-accent-indigo/10 border border-accent-indigo/20 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all"
        >
          <Bot className="w-4 h-4 text-accent-indigo" />
          <span className="text-xs font-bold text-accent-indigo">{language === 'ar' ? 'إنشاء ذكي' : 'AI Generator'}</span>
        </button>
        <button
          onClick={onOpenAIImport}
          className="flex-1 py-2.5 px-3 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-accent-cyan" />
          <span className="text-xs font-bold text-accent-cyan">{language === 'ar' ? 'استيراد نص' : 'AI Import'}</span>
        </button>
      </div>

      {/* 3. WEEKLY COMMITMENT STRIP */}
      <div className="p-4 rounded-3xl bg-background-card border border-border">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-slate-400">{language === 'ar' ? 'التزام الأسبوع' : 'Weekly Commitment'}</span>
          <button onClick={() => onNavigate('calendar')} className="text-slate-400 hover:text-white">
            <CalendarIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          {allDays.map((day, idx) => {
            const isToday = idx === todayIndex;
            const isScheduled = (user.scheduledDays || []).includes(day);
            const isPast = idx < todayIndex;
            
            // Very simplified logic for visual purposes
            let statusClass = "bg-background-elevated text-slate-500 border-border";
            let content = language === 'ar' ? allDaysAr[idx].charAt(0) : day.charAt(0);

            if (isToday) {
               statusClass = "bg-accent-cyan text-black border-accent-cyan ring-4 ring-accent-cyan/20";
            } else if (isScheduled && isPast) {
               statusClass = "bg-accent-emerald/20 text-accent-emerald border-accent-emerald/30";
               content = "✓";
            } else if (isScheduled) {
               statusClass = "bg-slate-800 text-white border-slate-600";
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-black border ${statusClass}`}>
                  {content}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. COMPACT METRICS PILLS */}
      <div className="flex gap-3">
        <div className="flex-1 p-4 rounded-3xl bg-background-card border border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-cyan/10 text-accent-cyan flex items-center justify-center shrink-0">
            <Weight className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'ar' ? 'حجم التدريب' : 'Volume'}</div>
            <div className="text-sm font-black text-white font-mono">
              {analytics.recent7dVolumeKg.toLocaleString()} <span className="text-[10px] text-slate-500">{t('kg')}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 rounded-3xl bg-background-card border border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'ar' ? 'أرقام قياسية' : 'PRs'}</div>
            <div className="text-sm font-black text-white font-mono">
              {analytics.prsThisMonth}
            </div>
          </div>
        </div>
      </div>

      {/* 5. NEW USER STARTER GUIDE (DISMISSABLE BY BEING HIDDEN AFTER 1 WORKOUT) */}
      {history.length === 0 && (
        <div className="p-4 rounded-3xl bg-emerald-950/30 border border-accent-emerald/30">
           <h3 className="text-xs font-bold text-accent-emerald mb-1">🚀 {language === 'ar' ? 'دليل البداية السريع' : 'Quick Starter Guide'}</h3>
           <p className="text-[11px] text-slate-300 leading-relaxed">
             {language === 'ar' ? 'بمجرد تسجيل أول تمرين لك، سيبدأ الذكاء الاصطناعي في تتبع تطورك وتقديم توصيات مخصصة تلقائياً.' : 'Once you log your first workout, the AI will start tracking your progress and provide personalized recommendations automatically.'}
           </p>
        </div>
      )}

      {/* RECENT WORKOUTS (Compact) */}
      {history.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-bold text-sm text-white">{t('recentWorkouts')}</h3>
            <button onClick={() => onNavigate('workouts')} className="text-[10px] font-bold text-accent-cyan uppercase">
              {t('viewAll')}
            </button>
          </div>
          <div className="space-y-2">
            {recentSessions.slice(0, 2).map((session) => (
              <div key={session.id} className="p-3 rounded-2xl bg-background-card border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-background-elevated flex items-center justify-center text-slate-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white">{session.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{session.date.split('T')[0]}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-accent-emerald">{session.totalVolumeKg.toLocaleString()}kg</div>
                  {session.prCount > 0 && <div className="text-[10px] text-amber-500 flex items-center gap-0.5 justify-end"><Trophy className="w-2.5 h-2.5"/> {session.prCount} PR</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
