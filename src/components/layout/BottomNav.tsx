import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar,
  Dumbbell, 
  Bot, 
  LayoutGrid,
  TrendingUp, 
  BookOpen, 
  Trophy, 
  Users, 
  Sparkles, 
  User, 
  X, 
  ChevronRight, 
  Globe, 
  RotateCcw,
  Zap,
  ChevronLeft
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

interface BottomNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenAIImport?: () => void;
  onOpenAIGenerator?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  activeTab, 
  onNavigate, 
  onOpenAIImport, 
  onOpenAIGenerator 
}) => {
  const { 
    user, 
    activeWorkout, 
    resetAllDemoData,
    language, 
    setLanguage, 
    t 
  } = useWorkout();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const mainNavItems = [
    { 
      id: 'dashboard', 
      label: language === 'ar' ? 'الرئيسية' : 'Home', 
      icon: LayoutDashboard 
    },
    { 
      id: 'calendar', 
      label: language === 'ar' ? 'الجدول' : 'Schedule', 
      icon: Calendar 
    },
    { 
      id: activeWorkout ? 'active_workout' : 'workouts', 
      label: activeWorkout ? (language === 'ar' ? 'تمرين نشط' : 'Active') : (language === 'ar' ? 'تمرين' : 'Workout'), 
      icon: Dumbbell, 
      isCenter: true,
      hasActive: !!activeWorkout 
    },
    { 
      id: 'ai_coach', 
      label: language === 'ar' ? 'عزام AI' : 'Coach', 
      icon: Bot,
      isAI: true
    },
    { 
      id: 'more', 
      label: language === 'ar' ? 'المزيد' : 'More', 
      icon: LayoutGrid, // Changed from Menu to LayoutGrid
      isMore: true
    }
  ];

  const progressGroup = [
    { id: 'programs', label: t('programs'), icon: Calendar, color: 'text-accent-indigo' },
    { id: 'exercises', label: t('exercises'), icon: BookOpen, color: 'text-accent-cyan' },
    { id: 'progress', label: t('progress'), icon: TrendingUp, color: 'text-accent-emerald' },
    { id: 'prs', label: t('prs'), icon: Trophy, color: 'text-amber-400' },
  ];

  const accountGroup = [
    { id: 'profile', label: t('profile'), icon: User, color: 'text-slate-300' },
    { id: 'referrals', label: t('referrals'), icon: Users, color: 'text-purple-400' },
    { id: 'premium', label: t('pricing'), icon: Sparkles, color: 'text-amber-400', isPremium: true },
    ...(user.role === 'admin' ? [{ id: 'admin', label: language === 'ar' ? 'لوحة الإدارة 📊' : 'Admin & Analytics 📊', icon: TrendingUp, color: 'text-accent-emerald' }] : [])
  ];

  const handleTabClick = (item: typeof mainNavItems[0]) => {
    if (item.isMore) {
      setIsMoreMenuOpen(true);
    } else {
      setIsMoreMenuOpen(false);
      onNavigate(item.id);
    }
  };

  const handleMoreItemClick = (tabId: string) => {
    setIsMoreMenuOpen(false);
    onNavigate(tabId);
  };

  const ChevronIcon = language === 'ar' ? ChevronLeft : ChevronRight;

  return (
    <>
      {/* Mobile Native Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background-secondary/95 backdrop-blur-xl border-t border-border/80 px-2 py-1.5 pb-safe shadow-2xl flex items-center justify-around">
        {mainNavItems.map(item => {
          const Icon = item.icon;
          const isActive = 
            (!item.isMore && activeTab === item.id) || 
            (item.id === 'workouts' && (activeTab === 'workouts' || activeTab === 'active_workout'));

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={`relative -top-3 flex flex-col items-center justify-center p-3 rounded-2xl transition-all active:scale-95 shadow-glow-sm ${
                  item.hasActive
                    ? 'bg-gradient-to-tr from-accent-emerald to-emerald-400 text-black shadow-glow-md animate-pulse-slow'
                    : isActive
                    ? 'bg-accent-emerald text-black shadow-glow-sm'
                    : 'bg-background-elevated border border-accent-emerald/40 text-accent-emerald'
                }`}
              >
                <Icon className="w-6 h-6 stroke-[2.5]" />
                {item.hasActive && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-background animate-ping" />
                )}
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive && !item.isMore
                  ? 'text-accent-emerald font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-accent-emerald stroke-[2.5]' : 'text-slate-400'}`} />
                {item.isAI && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent-indigo" />
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium tracking-tight whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* MOBILE "MORE" FULL-SCREEN SHEET DRAWER */}
      {isMoreMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fade-in"
          onClick={() => setIsMoreMenuOpen(false)}
        >
          <div 
            className="bg-background border-t border-border rounded-t-[32px] h-[92vh] flex flex-col animate-slide-up shadow-[0_-10px_50px_rgba(0,0,0,0.8)]"
            onClick={e => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto mt-4 mb-2 shrink-0 z-10" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between px-6 pb-4 pt-2 border-b border-border/50 shrink-0 bg-background z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-emerald/20 flex items-center justify-center text-accent-emerald">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-lg text-white">
                  {language === 'ar' ? 'قائمة الوظائف والإعدادات' : 'AZMK Features'}
                </h3>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-2 rounded-full bg-background-card text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 custom-scrollbar pb-24">

              {/* Section 1: AI Power Tools (HERO) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
                  {language === 'ar' ? 'أدوات الذكاء الاصطناعي' : 'AI Power Tools'}
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      if (onOpenAIImport) onOpenAIImport();
                    }}
                    className="w-full p-4 rounded-2xl bg-gradient-to-r from-accent-cyan/15 to-cyan-600/10 border border-accent-cyan/40 flex items-center justify-between text-left rtl:text-right active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 flex items-center justify-center text-accent-cyan shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{language === 'ar' ? 'استيراد نص بالـ AI' : 'AI Text Import'}</p>
                        <p className="text-[11px] text-slate-400">{language === 'ar' ? 'لصق جدول التمارين الذكي' : 'Paste text workout'}</p>
                      </div>
                    </div>
                    <ChevronIcon className="w-5 h-5 text-accent-cyan opacity-60" />
                  </button>

                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      if (onOpenAIGenerator) onOpenAIGenerator();
                    }}
                    className="w-full p-4 rounded-2xl bg-gradient-to-r from-accent-indigo/15 to-indigo-600/10 border border-accent-indigo/40 flex items-center justify-between text-left rtl:text-right active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-accent-indigo/20 flex items-center justify-center text-accent-indigo shrink-0">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{language === 'ar' ? 'توليد خطة تدريب AI' : 'Generate AI Plan'}</p>
                        <p className="text-[11px] text-slate-400">{language === 'ar' ? 'برنامج 4 أسابيع مخصص' : 'Custom 4-Week routine'}</p>
                      </div>
                    </div>
                    <ChevronIcon className="w-5 h-5 text-accent-indigo opacity-60" />
                  </button>
                </div>
              </div>

              {/* Section 2: Programs & Progress */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
                  {language === 'ar' ? 'البرامج والتطور' : 'Programs & Progress'}
                </h4>
                <div className="bg-background-card border border-border rounded-2xl overflow-hidden divide-y divide-border/50">
                  {progressGroup.map((f, idx) => {
                    const Icon = f.icon;
                    const isSelected = activeTab === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => handleMoreItemClick(f.id)}
                        className={`w-full p-4 flex items-center justify-between text-left rtl:text-right active:bg-background-elevated transition-colors ${
                          isSelected ? 'bg-background-elevated' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <Icon className={`w-5 h-5 ${f.color}`} />
                          <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>{f.label}</span>
                        </div>
                        <ChevronIcon className="w-4 h-4 text-slate-500" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Account & Extra */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
                  {language === 'ar' ? 'الحساب والمكافآت' : 'Account & Extra'}
                </h4>
                <div className="bg-background-card border border-border rounded-2xl overflow-hidden divide-y divide-border/50">
                  {accountGroup.map((f, idx) => {
                    const Icon = f.icon;
                    const isSelected = activeTab === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => handleMoreItemClick(f.id)}
                        className={`w-full p-4 flex items-center justify-between text-left rtl:text-right active:bg-background-elevated transition-colors ${
                          isSelected ? 'bg-background-elevated' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <Icon className={`w-5 h-5 ${f.color}`} />
                          <span className={`text-sm font-bold ${isSelected ? 'text-white' : (f.isPremium ? 'text-amber-400' : 'text-slate-200')}`}>{f.label}</span>
                        </div>
                        <ChevronIcon className={`w-4 h-4 ${f.isPremium ? 'text-amber-500' : 'text-slate-500'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: App Settings */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
                  {language === 'ar' ? 'إعدادات التطبيق' : 'App Settings'}
                </h4>
                <div className="bg-background-card border border-border rounded-2xl overflow-hidden divide-y divide-border/50">
                  
                  {/* Language Switch */}
                  <button
                    onClick={() => {
                      setLanguage(language === 'en' ? 'ar' : 'en');
                      setIsMoreMenuOpen(false);
                    }}
                    className="w-full p-4 flex items-center justify-between text-left rtl:text-right active:bg-background-elevated transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <Globe className="w-5 h-5 text-accent-cyan" />
                      <span className="text-sm font-bold text-slate-200">
                        {language === 'ar' ? 'تغيير اللغة إلى English' : 'Switch Language to العربية'}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-accent-cyan px-2 py-1 bg-accent-cyan/10 rounded-md">
                      {language === 'ar' ? 'EN' : 'عربي'}
                    </span>
                  </button>

                  {/* Full Factory Reset */}
                  <button
                    onClick={() => {
                      if (confirm(language === 'ar' ? 'هل تريد إجراء إعادة ضبط مصنع شاملة؟' : 'Perform full factory reset?')) {
                        resetAllDemoData();
                        setIsMoreMenuOpen(false);
                      }
                    }}
                    className="w-full p-4 flex items-center justify-between text-left rtl:text-right active:bg-rose-950/30 transition-colors bg-rose-950/10"
                  >
                    <div className="flex items-center gap-3.5">
                      <RotateCcw className="w-5 h-5 text-rose-500" />
                      <span className="text-sm font-bold text-rose-400">
                        {language === 'ar' ? 'إعادة ضبط المصنع' : 'Full Factory Reset'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
