import React, { useState } from 'react';
import { 
  User, 
  Crown, 
  Flame, 
  Trophy, 
  Dumbbell, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Users, 
  Settings,
  HelpCircle
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

interface ProfileViewProps {
  onNavigate: (tab: string) => void;
  onOpenOnboarding: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate, onOpenOnboarding }) => {
  const { 
    user, 
    updateUserProfile, 
    history, 
    prs, 
    resetAllDemoData, 
    loadPrepopulatedDemoAccount, 
    toggleSubscriptionTier,
    language,
    t
  } = useWorkout();
  
  const [name, setName] = useState(user.name);
  const [goal, setGoal] = useState(user.primaryGoal);
  const [secGoal, setSecGoal] = useState(user.secondaryGoal || 'Strength');
  const [exp, setExp] = useState(user.experience);
  const [days, setDays] = useState(user.daysPerWeek);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      primaryGoal: goal,
      secondaryGoal: secGoal,
      experience: exp,
      daysPerWeek: days
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-3xl mx-auto">
      
      {/* Profile Header */}
      <div className="bg-background-card border border-border rounded-3xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-accent-indigo to-purple-500 flex items-center justify-center font-black text-2xl text-white shadow-glow-indigo">
            {user.name ? user.name.charAt(0) : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{user.name || 'Athlete'}</h1>
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                user.tier === 'premium'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-background-elevated text-slate-300 border-border'
              }`}>
                {user.tier === 'premium' ? t('premiumPlan') : t('freePlan')}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
            <p className="text-xs text-slate-300 mt-1">
              {language === 'ar' ? 'الهدف:' : 'Goal:'} <strong className="text-accent-emerald">{user.primaryGoal}</strong> {user.secondaryGoal ? `+ ${user.secondaryGoal}` : ''}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => onNavigate('premium')}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-glow-sm transition-all active:scale-95"
          >
            <Crown className="w-4 h-4 fill-black" />
            <span>{t('upgradeToPro')}</span>
          </button>
        </div>
      </div>

      {/* 3 Quick Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-background-card border border-border text-center">
          <div className="flex items-center justify-center text-amber-400 mb-1">
            <Flame className="w-5 h-5 fill-amber-400" />
          </div>
          <span className="text-xs text-slate-400 font-semibold uppercase">{language === 'ar' ? 'سلسلة الأيام' : 'Active Streak'}</span>
          <p className="text-2xl font-black font-mono text-white mt-0.5">{user.streakDays}d</p>
        </div>

        <div className="p-4 rounded-2xl bg-background-card border border-border text-center">
          <div className="flex items-center justify-center text-accent-emerald mb-1">
            <Dumbbell className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 font-semibold uppercase">{language === 'ar' ? 'التمارين المسجلة' : 'Completed Logs'}</span>
          <p className="text-2xl font-black font-mono text-white mt-0.5">{history.length}</p>
        </div>

        <div className="p-4 rounded-2xl bg-background-card border border-border text-center">
          <div className="flex items-center justify-center text-amber-400 mb-1">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-xs text-slate-400 font-semibold uppercase">{language === 'ar' ? 'الأرقام القياسية' : 'PR Records'}</span>
          <p className="text-2xl font-black font-mono text-white mt-0.5">{prs.length}</p>
        </div>
      </div>

      {/* Edit Profile Preferences Form */}
      <form onSubmit={handleSave} className="bg-background-card border border-border rounded-3xl p-6 shadow-card space-y-4">
        <h3 className="font-bold text-base text-white">{language === 'ar' ? 'إعدادات الملف التدريبي' : 'Training Preferences & Profile'}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t('athleteName')}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-background-elevated border border-border rounded-xl text-white text-xs font-medium focus:outline-none focus:border-accent-emerald"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">{language === 'ar' ? 'مستوى الخبرة' : 'Experience Level'}</label>
            <select
              value={exp}
              onChange={e => setExp(e.target.value as any)}
              className="w-full px-4 py-2.5 bg-background-elevated border border-border rounded-xl text-white text-xs font-medium focus:outline-none focus:border-accent-emerald"
            >
              <option value="Beginner">Beginner (مبتدئ)</option>
              <option value="Intermediate">Intermediate (متوسط)</option>
              <option value="Advanced">Advanced (متقدم)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t('primaryGoal')}</label>
            <select
              value={goal}
              onChange={e => setGoal(e.target.value as any)}
              className="w-full px-4 py-2.5 bg-background-elevated border border-border rounded-xl text-white text-xs font-medium focus:outline-none focus:border-accent-emerald"
            >
              <option value="Muscle Gain">Muscle Gain (Hypertrophy)</option>
              <option value="Strength">Strength & Power</option>
              <option value="Fat Loss">Fat Loss & Conditioning</option>
              <option value="General Fitness">General Fitness</option>
              <option value="Endurance">Endurance</option>
              <option value="Mobility & Joint Health">Mobility & Joint Health</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-accent-cyan mb-1.5">{t('secondaryGoal')}</label>
            <select
              value={secGoal}
              onChange={e => setSecGoal(e.target.value as any)}
              className="w-full px-4 py-2.5 bg-background-elevated border border-border rounded-xl text-white text-xs font-medium focus:outline-none focus:border-accent-cyan"
            >
              <option value="Strength">Strength & Power</option>
              <option value="Muscle Gain">Muscle Gain (Hypertrophy)</option>
              <option value="Fat Loss">Fat Loss & Conditioning</option>
              <option value="General Fitness">General Fitness</option>
              <option value="Endurance">Endurance</option>
              <option value="Mobility & Joint Health">Mobility & Joint Health</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">{language === 'ar' ? 'أيام التمرين أسبوعياً' : 'Workouts per Week'}</label>
            <select
              value={days}
              onChange={e => setDays(parseInt(e.target.value, 10))}
              className="w-full px-4 py-2.5 bg-background-elevated border border-border rounded-xl text-white text-xs font-medium focus:outline-none focus:border-accent-emerald"
            >
              <option value={2}>2 Days / week (Upper / Lower)</option>
              <option value={3}>3 Days / week (Full Body A/B/C)</option>
              <option value={4}>4 Days / week (4-Day Split)</option>
              <option value={5}>5 Days / week (5-Day PPL+Upper/Lower)</option>
              <option value={6}>6 Days / week (6-Day PPL×2)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onOpenOnboarding}
            className="text-xs font-semibold text-slate-400 hover:text-white underline flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'إعادة تشغيل معالج الإعداد' : 'Re-run Onboarding Setup'}</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-accent-emerald hover:bg-emerald-400 text-black font-extrabold text-xs shadow-glow-sm flex items-center gap-1.5 transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>{t('saved')}</span>
              </>
            ) : (
              <span>{t('saveChanges')}</span>
            )}
          </button>
        </div>
      </form>

      {/* Developer & Demo Data Controls */}
      <div className="bg-background-card border border-border rounded-3xl p-6 shadow-card space-y-3">
        <h3 className="font-bold text-base text-white">{language === 'ar' ? 'إعادة الضبط والتحكم بالبيانات' : 'Reset & Demo Controls'}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {language === 'ar'
            ? 'يمكنك إجراء إعادة ضبط مصنع شاملة لتجربة التسجيل للمرة الأولى وتوليد الروتين المجاني، أو تحميل الحساب التجريبي المسبق.'
            : 'Perform a complete factory reset to experience the first-time onboarding and free routine generation, or reload the preloaded demo account.'}
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => {
              if (confirm(language === 'ar' ? 'هل تريد إجراء إعادة ضبط مصنع شاملة؟ سيتم إرجاعك لشاشة التسجيل الأولية.' : 'Perform a complete factory reset? You will be returned to the first-time setup screen to register and generate a new routine.')) {
                resetAllDemoData();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-bold border border-rose-500/40 flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('fullFactoryReset')}</span>
          </button>

          <button
            onClick={() => {
              loadPrepopulatedDemoAccount();
              alert(language === 'ar' ? 'تم تحميل الحساب التجريبي التوضيحي بنجاح.' : 'Demo account loaded.');
            }}
            className="px-4 py-2.5 rounded-xl bg-background-elevated hover:bg-background-hover text-slate-300 text-xs font-bold border border-border flex items-center gap-2 transition-all active:scale-95"
          >
            <span>🧪</span>
            <span>{language === 'ar' ? 'تحميل بيانات تجريبية توضيحية' : 'Load Demo Data (22 Sessions)'}</span>
          </button>

          {user.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className="px-4 py-2.5 rounded-xl bg-accent-emerald/20 hover:bg-accent-emerald/30 text-accent-emerald text-xs font-bold border border-accent-emerald/50 flex items-center gap-2 transition-all active:scale-95 shadow-glow-sm"
            >
              <span>📊</span>
              <span>{language === 'ar' ? 'لوحة تحليلات الإدارة (Admin)' : 'Admin & Analytics'}</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
