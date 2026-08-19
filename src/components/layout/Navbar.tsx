import React from 'react';
import { 
  Zap, 
  Crown, 
  Flame, 
  Settings, 
  User as UserIcon,
  Globe
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

interface NavbarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenOnboarding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onNavigate, onOpenOnboarding }) => {
  const { 
    user, 
    activeWorkout, 
    workoutDuration, 
    toggleSubscriptionTier, 
    language, 
    setLanguage, 
    t 
  } = useWorkout();

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md border-b border-border/80 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 pt-safe">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Brand Logo: AZMK / عزمك */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0" onClick={() => onNavigate('dashboard')}>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-accent-emerald to-emerald-400 flex items-center justify-center shadow-glow-sm relative shrink-0">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-black fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-black text-lg sm:text-2xl tracking-tight text-white font-mono leading-none">
                {language === 'ar' ? 'عزمك' : 'AZMK'}
              </span>
              
              {/* Small AI Badge with Lightning Icon */}
              <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 rounded-md bg-accent-emerald/15 border border-accent-emerald/40 text-accent-emerald text-[9px] sm:text-[10px] font-black tracking-wider shadow-glow-sm">
                <Zap className="w-2.5 h-2.5 fill-accent-emerald" />
                <span>AI</span>
              </div>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium tracking-wide hidden xs:block">
              {language === 'ar' ? 'تمرّن بهدف' : 'Train with purpose'}
            </p>
          </div>
        </div>

        {/* Center / Active Workout Live Pill (Desktop & Tablet) */}
        {activeWorkout ? (
          <div 
            onClick={() => onNavigate('active_workout')}
            className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-accent-emerald/40 text-emerald-400 cursor-pointer animate-pulse-slow hover:bg-emerald-900/60 transition-all shadow-glow-sm"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-accent-emerald animate-ping" />
            <span className="text-xs font-semibold tracking-wide uppercase truncate max-w-[200px]">{t('activeTag')}: {activeWorkout.name}</span>
            <span className="text-xs font-mono font-bold bg-black/40 px-2 py-0.5 rounded text-white">
              {formatTimer(workoutDuration)}
            </span>
          </div>
        ) : null}

        {/* Right Action Icons & User Stats */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Language Switcher (AR / EN) */}
          <button
            onClick={toggleLanguage}
            title={language === 'en' ? 'التحويل للغة العربية' : 'Switch to English'}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-background-card hover:bg-background-elevated border border-border text-xs font-bold text-slate-200 transition-all shadow-sm active:scale-95"
          >
            <Globe className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="font-mono text-[11px] sm:text-xs">{language === 'en' ? 'عربي' : 'EN'}</span>
          </button>

          {/* Streak Indicator */}
          <div 
            title={`${user.streakDays} ${t('dayStreak')}`}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-background-card border border-border text-amber-400 font-mono text-xs font-bold cursor-default"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{user.streakDays}d</span>
          </div>

          {/* Pro / Free Badge */}
          <button
            onClick={() => onNavigate('premium')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              user.tier === 'premium'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold shadow-sm active:scale-95'
            }`}
          >
            <Crown className={`w-3.5 h-3.5 ${user.tier === 'premium' ? 'fill-amber-300' : 'fill-black'}`} />
            <span className="hidden sm:inline">{user.tier === 'premium' ? t('premiumPlan') : 'Pro'}</span>
          </button>

          {/* User Profile Avatar */}
          <button 
            onClick={() => onNavigate('profile')}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-background-elevated hover:bg-background-hover border border-border flex items-center justify-center text-slate-300 hover:text-white transition-all overflow-hidden"
          >
            <span className="font-mono text-xs font-bold text-accent-emerald">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </button>

        </div>

      </div>

      {/* Mobile-Only Active Workout Floating Banner (When a workout is in progress) */}
      {activeWorkout && (
        <div 
          onClick={() => onNavigate('active_workout')}
          className="md:hidden mt-2 flex items-center justify-between px-3 py-1.5 rounded-2xl bg-emerald-950/80 border border-accent-emerald/40 text-emerald-300 cursor-pointer shadow-glow-sm animate-pulse-slow"
        >
          <div className="flex items-center gap-2 truncate">
            <div className="w-2 h-2 rounded-full bg-accent-emerald animate-ping shrink-0" />
            <span className="text-[11px] font-bold uppercase truncate">{t('activeTag')}: {activeWorkout.name}</span>
          </div>
          <span className="text-[11px] font-mono font-bold bg-black/60 px-2 py-0.5 rounded text-white shrink-0 ml-2">
            {formatTimer(workoutDuration)}
          </span>
        </div>
      )}

    </header>
  );
};
