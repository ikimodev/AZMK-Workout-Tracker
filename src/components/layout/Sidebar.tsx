import { 
  LayoutDashboard, 
  Dumbbell, 
  CalendarDays, 
  TrendingUp, 
  Bot, 
  BookOpen, 
  Trophy, 
  User, 
  Sparkles, 
  Users, 
  Play, 
  Lock, 
  Plus,
  BarChart3
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenAIImport: () => void;
  onOpenAIGenerator: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onNavigate, 
  onOpenAIImport, 
  onOpenAIGenerator 
}) => {
  const { user, activeWorkout, startTodaysAutocompleteWorkout, startWorkout, language, t } = useWorkout();

  const primaryNavItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'workouts', label: activeWorkout ? (language === 'ar' ? 'تمرين نشط' : 'Active Workout') : t('workouts'), icon: Dumbbell, badge: activeWorkout ? t('activeTag') : undefined },
    { id: 'calendar', label: t('calendar'), icon: CalendarDays },
    { id: 'progress', label: t('progress'), icon: TrendingUp },
    { id: 'ai_coach', label: t('aiCoach'), icon: Bot, highlight: true },
  ];

  const secondaryNavItems = [
    { id: 'programs', label: t('programs'), icon: CalendarDays },
    { id: 'prs', label: t('prs'), icon: Trophy },
    { id: 'exercises', label: t('exercises'), icon: BookOpen },
    { id: 'referrals', label: t('referrals'), icon: Users },
    { id: 'premium', label: t('pricing'), icon: Sparkles },
    { id: 'profile', label: t('profile'), icon: User },
    ...(user.role === 'admin' ? [{ id: 'admin', label: language === 'ar' ? 'لوحة الإدارة 📊' : 'Admin & Analytics 📊', icon: BarChart3 }] : [])
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-background-secondary/60 border-r rtl:border-r-0 rtl:border-l border-border p-4 sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto">
      
      {/* Quick Start / Autocomplete CTA */}
      <div className="mb-5">
        {!activeWorkout ? (
          <button
            onClick={startTodaysAutocompleteWorkout}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-accent-emerald to-emerald-500 hover:from-emerald-400 hover:to-emerald-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-sm transition-all transform active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>{t('startTodayWorkout')}</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('active_workout')}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-950/80 border border-accent-emerald text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 shadow-glow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-accent-emerald animate-ping" />
            <span>{t('resumeWorkout')}</span>
          </button>
        )}
      </div>

      {/* Primary Navigation Links */}
      <nav className="space-y-1">
        <div className="px-2 pb-1">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 font-mono">
            {language === 'ar' ? 'القائمة الرئيسية' : 'MAIN MENU'}
          </p>
        </div>
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'workouts' && activeTab === 'active_workout');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-background-elevated'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-accent-emerald' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded-full bg-accent-emerald text-black animate-pulse">
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="text-[10px] text-accent-emerald font-bold">✓</span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-indigo" />
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Secondary / More Tools Navigation */}
      <div className="pt-4 mt-4 border-t border-border/80 space-y-1">
        <div className="px-2 pb-1">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 font-mono">
            {language === 'ar' ? 'أدوات إضافية والمزيد' : 'MORE TOOLS'}
          </p>
        </div>
        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-background-elevated text-accent-cyan border border-accent-cyan/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-background-elevated/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-accent-cyan' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && (
                <span className="text-[10px] text-accent-cyan font-bold">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI & Manual Workout Creation Tools */}
      <div className="pt-4 mt-4 border-t border-border space-y-2">
        <div className="flex items-center justify-between px-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {language === 'ar' ? 'أدوات التمارين' : 'Workout Tools'}
          </p>
          {user.tier === 'free' && (
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">
              PRO
            </span>
          )}
        </div>

        {/* Manual Workout Builder (Always available for free) */}
        <button
          onClick={() => {
            startWorkout(language === 'ar' ? 'تمرين مخصص جديد' : 'Custom Manual Workout', [
              {
                id: `we_man_${Date.now()}_0`,
                exerciseId: 'barbell_bench_press',
                order: 1,
                restTimerSeconds: 90,
                sets: [
                  { id: `s_man_${Date.now()}_1`, setNumber: 1, weight: 60, reps: 8, isCompleted: false, previousWeight: 60, previousReps: 8, targetWeight: 62.5, targetRepsMin: 8, targetRepsMax: 10 }
                ]
              }
            ]);
            onNavigate('active_workout');
          }}
          className="w-full text-left rtl:text-right px-3 py-2 rounded-xl bg-accent-emerald/10 hover:bg-accent-emerald/20 border border-accent-emerald/30 text-xs font-semibold text-accent-emerald flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>{language === 'ar' ? 'إضافة تمرين يدوياً (مجاني)' : 'Add Workout Manually'}</span>
          </div>
        </button>

        {/* AI Text Importer (Gated for Pro) */}
        <button
          onClick={() => {
            if (user.tier === 'free') {
              onNavigate('premium');
            } else {
              onOpenAIImport();
            }
          }}
          className="w-full text-left rtl:text-right px-3 py-2 rounded-xl bg-background-elevated/70 hover:bg-background-elevated border border-border/80 text-xs font-medium text-slate-300 hover:text-white flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-accent-cyan" />
            <span>{t('importTextWorkout')}</span>
          </div>
          {user.tier === 'free' && <Lock className="w-3 h-3 text-amber-400" />}
        </button>

        {/* AI 4-Week Program Generator (Gated for Pro after initial onboarding) */}
        <button
          onClick={() => {
            if (user.tier === 'free') {
              onNavigate('premium');
            } else {
              onOpenAIGenerator();
            }
          }}
          className="w-full text-left rtl:text-right px-3 py-2 rounded-xl bg-background-elevated/70 hover:bg-background-elevated border border-border/80 text-xs font-medium text-slate-300 hover:text-white flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-2">
            <Bot className="w-3.5 h-3.5 text-accent-indigo" />
            <span>{t('generate4WeekProg')}</span>
          </div>
          {user.tier === 'free' && <Lock className="w-3 h-3 text-amber-400" />}
        </button>
      </div>

    </aside>
  );
};
