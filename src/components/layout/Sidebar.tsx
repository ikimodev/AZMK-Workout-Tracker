import React from 'react';
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
  Plus
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

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'calendar', label: t('calendar'), icon: CalendarDays },
    { id: 'workouts', label: t('workouts'), icon: Dumbbell, badge: activeWorkout ? t('activeTag') : undefined },
    { id: 'programs', label: t('programs'), icon: CalendarDays },
    { id: 'progress', label: t('progress'), icon: TrendingUp },
    { id: 'ai_coach', label: t('aiCoach'), icon: Bot, highlight: true },
    { id: 'exercises', label: t('exercises'), icon: BookOpen },
    { id: 'prs', label: t('prs'), icon: Trophy },
    { id: 'referrals', label: t('referrals'), icon: Users },
    { id: 'premium', label: t('pricing'), icon: Sparkles },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-background-secondary/60 border-r rtl:border-r-0 rtl:border-l border-border p-4 sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto">
      
      {/* Quick Start / Autocomplete CTA */}
      <div className="mb-6">
        {!activeWorkout ? (
          <button
            onClick={startTodaysAutocompleteWorkout}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-accent-emerald to-emerald-500 hover:from-emerald-400 hover:to-emerald-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all transform active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>{t('startTodayWorkout')}</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('active_workout')}
            className="w-full py-3 px-4 rounded-xl bg-emerald-950/80 border border-accent-emerald text-emerald-300 font-bold text-sm flex items-center justify-center gap-2 shadow-glow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-accent-emerald animate-ping" />
            <span>{t('resumeWorkout')}</span>
          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'workouts' && activeTab === 'active_workout');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-background-elevated'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-accent-emerald' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-accent-emerald text-black animate-pulse">
                  {item.badge}
                </span>
              )}
              {item.highlight && !isActive && (
                <span className="w-2 h-2 rounded-full bg-accent-indigo" />
              )}
            </button>
          );
        })}
      </nav>

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
