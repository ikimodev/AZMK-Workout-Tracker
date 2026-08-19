import React from 'react';
import { Flame, Zap, Crown, Globe } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

interface NavbarProps {
  onOpenOnboarding: () => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const { user, activeWorkout, workoutDuration, toggleSubscriptionTier, language, setLanguage, t } = useWorkout();

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo: AZMK / عزمك */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-emerald to-emerald-400 flex items-center justify-center shadow-glow-sm relative">
            <Zap className="w-6 h-6 text-black fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl sm:text-2xl tracking-tight text-white font-mono">
                {language === 'ar' ? 'عزمك' : 'AZMK'}
              </span>
              
              {/* Small AI Badge with Lightning Icon */}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent-emerald/15 border border-accent-emerald/40 text-accent-emerald text-[10px] font-black tracking-wider shadow-glow-sm">
                <Zap className="w-2.5 h-2.5 fill-accent-emerald" />
                <span>AI</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              {language === 'ar' ? 'تمرّن بهدف • Train with purpose' : 'Train with purpose'}
            </p>
          </div>
        </div>

        {/* Center / Active Workout Live Pill */}
        {activeWorkout ? (
          <div 
            onClick={() => onNavigate('active_workout')}
            className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-accent-emerald/40 text-emerald-400 cursor-pointer animate-pulse-slow hover:bg-emerald-900/60 transition-all shadow-glow-sm"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-accent-emerald animate-ping" />
            <span className="text-xs font-semibold tracking-wide uppercase">{t('activeTag')}: {activeWorkout.name}</span>
            <span className="text-xs font-mono font-bold bg-black/40 px-2 py-0.5 rounded text-white">
              {formatTimer(workoutDuration)}
            </span>
          </div>
        ) : null}

        {/* Right Action Icons & User Stats */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Language Switcher (AR / EN) */}
          <button
            onClick={toggleLanguage}
            title={language === 'en' ? 'التحويل للغة العربية' : 'Switch to English'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-background-card hover:bg-background-elevated border border-border text-xs font-bold text-slate-200 transition-all shadow-sm active:scale-95"
          >
            <Globe className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="font-mono">{language === 'en' ? 'العربية' : 'English'}</span>
          </button>

          {/* Streak Indicator */}
          <div 
            title={`${user.streakDays} ${t('dayStreak')}`}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-background-card border border-border text-amber-400 font-mono text-sm font-semibold cursor-default"
          >
            <Flame className="w-4 h-4 fill-amber-400 text-amber-500 animate-bounce" />
            <span>{user.streakDays}d</span>
          </div>

          {/* Tier Switcher / Badge */}
          <button
            onClick={toggleSubscriptionTier}
            title="Click to toggle Free / Premium mode"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
              user.tier === 'premium'
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-300 border-amber-500/40 shadow-glow-sm'
                : 'bg-background-card text-slate-400 border-border hover:border-slate-600'
            }`}
          >
            <Crown className={`w-3.5 h-3.5 ${user.tier === 'premium' ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span className="uppercase tracking-wider">{user.tier === 'premium' ? t('premiumPlan') : t('freePlan')}</span>
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 pl-2 rtl:pl-0 rtl:pr-2 border-l rtl:border-l-0 rtl:border-r border-border hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-indigo to-purple-500 flex items-center justify-center font-bold text-xs text-white shadow">
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
            <span className="text-sm font-medium text-slate-300 hidden md:inline">{user.name ? user.name.split(' ')[0] : 'User'}</span>
          </button>

        </div>
      </div>
    </header>
  );
};
