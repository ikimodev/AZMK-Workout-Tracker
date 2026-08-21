import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar,
  Dumbbell, 
  Bot, 
  Menu,
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
  HelpCircle,
  Zap,
  Play
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
    startTodaysAutocompleteWorkout, 
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
      icon: Menu,
      isMore: true
    }
  ];

  const moreFeatures = [
    { id: 'progress', label: t('progress'), icon: TrendingUp, color: 'text-accent-emerald' },
    { id: 'exercises', label: t('exercises'), icon: BookOpen, color: 'text-accent-cyan' },
    { id: 'prs', label: t('prs'), icon: Trophy, color: 'text-amber-400' },
    { id: 'programs', label: t('programs'), icon: Calendar, color: 'text-accent-indigo' },
    { id: 'referrals', label: t('referrals'), icon: Users, color: 'text-purple-400' },
    { id: 'premium', label: t('pricing'), icon: Sparkles, color: 'text-amber-300' },
    { id: 'profile', label: t('profile'), icon: User, color: 'text-slate-300' },
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

      {/* MOBILE "MORE" BOTTOM SHEET DRAWER */}
      {isMoreMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end animate-fade-in"
          onClick={() => setIsMoreMenuOpen(false)}
        >
          <div 
            className="bg-background-card border-t border-border rounded-t-3xl p-5 pb-safe max-h-[85vh] overflow-y-auto space-y-4 animate-slide-up shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 rounded-full bg-slate-700 mx-auto mb-2" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-accent-emerald/20 flex items-center justify-center text-accent-emerald">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-white font-mono">
                  {language === 'ar' ? 'قائمة الميزات والإعدادات' : 'AZMK Navigation & Features'}
                </h3>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1.5 rounded-full bg-background-elevated text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AI Tools Mobile Section */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  if (onOpenAIImport) onOpenAIImport();
                }}
                className="p-3 rounded-2xl bg-gradient-to-r from-accent-cyan/20 to-cyan-600/20 border border-accent-cyan/40 flex items-center gap-2.5 text-left rtl:text-right active:scale-95 transition-all"
              >
                <Sparkles className="w-5 h-5 text-accent-cyan shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">{language === 'ar' ? 'استيراد بالـ AI' : 'AI Text Import'}</p>
                  <p className="text-[10px] text-slate-400">{language === 'ar' ? 'لصق أو كتابة تمرين' : 'Paste text workout'}</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  if (onOpenAIGenerator) onOpenAIGenerator();
                }}
                className="p-3 rounded-2xl bg-gradient-to-r from-accent-indigo/20 to-indigo-600/20 border border-accent-indigo/40 flex items-center gap-2.5 text-left rtl:text-right active:scale-95 transition-all"
              >
                <Bot className="w-5 h-5 text-accent-indigo shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">{language === 'ar' ? 'توليد خطة AI' : 'Generate AI Plan'}</p>
                  <p className="text-[10px] text-slate-400">{language === 'ar' ? 'خطة 4 أسابيع' : '4-Week routine'}</p>
                </div>
              </button>
            </div>

            {/* Quick Navigation Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {moreFeatures.map(f => {
                const Icon = f.icon;
                const isSelected = activeTab === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => handleMoreItemClick(f.id)}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all text-left rtl:text-right active:scale-95 ${
                      isSelected
                        ? 'bg-accent-emerald/15 border-accent-emerald text-white'
                        : 'bg-background-elevated/70 border-border/80 hover:bg-background-elevated text-slate-200'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${f.color}`} />
                    <span className="text-xs font-bold truncate">{f.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Actions & Settings */}
            <div className="pt-3 border-t border-border space-y-2">
              
              {/* Language Switch */}
              <button
                onClick={() => {
                  setLanguage(language === 'en' ? 'ar' : 'en');
                  setIsMoreMenuOpen(false);
                }}
                className="w-full p-3 rounded-2xl bg-background-elevated border border-border flex items-center justify-between text-xs font-bold text-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-accent-cyan" />
                  <span>{language === 'ar' ? 'تغيير اللغة إلى English' : 'Switch Language to العربية'}</span>
                </div>
                <span className="font-mono text-accent-cyan">{language === 'ar' ? 'EN' : 'عربي'}</span>
              </button>

              {/* Full Factory Reset */}
              <button
                onClick={() => {
                  if (confirm(language === 'ar' ? 'هل تريد إجراء إعادة ضبط مصنع شاملة؟' : 'Perform full factory reset?')) {
                    resetAllDemoData();
                    setIsMoreMenuOpen(false);
                  }
                }}
                className="w-full p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between text-xs font-bold text-rose-300"
              >
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-rose-400" />
                  <span>{language === 'ar' ? 'إعادة ضبط المصنع (البدء من الصفر)' : 'Full Factory Reset'}</span>
                </div>
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};
