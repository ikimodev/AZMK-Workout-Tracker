import React, { useState } from 'react';
import { Sparkles, ArrowRight, Zap, Dumbbell, ShieldCheck, Check, Globe, ArrowLeft } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { generateAIProgram } from '../../services/aiProgramGenerator';
import { FitnessGoal } from '../../types';
import { trackUserSession } from '../../services/analyticsService';
import { FITNESS_GOALS_DICT, formatUnitDisplay, getFitnessGoalDisplayName } from '../../i18n/fitnessDictionary';

interface InitialSetupScreenProps {
  onComplete: () => void;
}

export const InitialSetupScreen: React.FC<InitialSetupScreenProps> = ({ onComplete }) => {
  const { updateUserProfile, saveGeneratedProgram, user, language, setLanguage, t } = useWorkout();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(user.name === 'Kareem Al-Otaibi' ? '' : user.name);
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>('Muscle Gain');
  const [secondaryGoal, setSecondaryGoal] = useState<FitnessGoal>('Strength');
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [days, setDays] = useState(4);
  const [duration, setDuration] = useState(60);
  const [equipment, setEquipment] = useState<'Full Gym' | 'Home Gym (Dumbbells & Bench)' | 'Bodyweight Only'>('Full Gym');
  const [startDayOption, setStartDayOption] = useState<'today' | 'tomorrow'>('today');
  const [baselineOption, setBaselineOption] = useState<'experienced' | 'beginner_rpe'>('beginner_rpe');
  const [isGenerating, setIsGenerating] = useState(false);

  const goalKeys: FitnessGoal[] = [
    'Muscle Gain',
    'Strength',
    'Fat Loss',
    'General Fitness',
    'Endurance',
    'Mobility & Joint Health'
  ];

  // Dynamic helper for split descriptions matching user experience level
  const getSplitDescription = (numDays: number, exp: 'Beginner' | 'Intermediate' | 'Advanced') => {
    if (exp === 'Beginner') {
      if (numDays === 2) return t('splitBeg2');
      if (numDays === 3) return t('splitBeg3');
      if (numDays === 4) return t('splitBeg4');
      return t('splitBegX', { days: numDays });
    }
    if (exp === 'Advanced') {
      if (numDays === 2) return t('splitAdv2');
      if (numDays === 3) return t('splitAdv3');
      if (numDays === 4) return t('splitAdv4');
      if (numDays === 5) return t('splitAdv5');
      return t('splitAdvX', { days: numDays });
    }
    // Intermediate default
    if (numDays === 2) return t('splitInt2');
    if (numDays === 3) return t('splitInt3');
    if (numDays === 4) return t('splitInt4');
    if (numDays === 5) return t('splitInt5');
    return t('splitInt6');
  };

  const handleSelectPrimaryGoal = (goal: FitnessGoal) => {
    setPrimaryGoal(goal);
    if (secondaryGoal === goal) {
      const remaining = goalKeys.filter(id => id !== goal);
      setSecondaryGoal(remaining[0] || 'Strength');
    }
  };

  const equipmentOptions = [
    {
      id: 'Full Gym',
      title: t('fullGym'),
      desc: t('fullGymDesc')
    },
    {
      id: 'Home Gym (Dumbbells & Bench)',
      title: t('homeGym'),
      desc: t('homeGymDesc')
    },
    {
      id: 'Bodyweight Only',
      title: t('bodyweightOnly'),
      desc: t('bodyweightDesc')
    },
  ];

  const handleFinishAndGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 650));

    const finalName = name.trim() || t('athletePlaceholder');

    updateUserProfile({
      name: finalName,
      email: `${finalName.toLowerCase().replace(/\s+/g, '')}@azmk.fit`,
      primaryGoal,
      secondaryGoal,
      experience,
      daysPerWeek: days,
      preferredDurationMinutes: duration,
      tier: 'free',
      role: 'user',
      isDemoUser: false,
      startingBaselineOption: baselineOption,
      streakDays: 0,
      hasCompletedOnboarding: true,
      startDayOption,
      programStartDate: new Date().toISOString().split('T')[0]
    });

    const generated = generateAIProgram({
      goal: primaryGoal,
      secondaryGoal,
      experience,
      daysPerWeek: days,
      durationMinutes: duration,
      equipment
    });

    saveGeneratedProgram(generated);

    trackUserSession(finalName);

    setIsGenerating(false);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden py-10">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-emerald/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent-indigo/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Language Switcher Bar at Top Right */}
      <div className="w-full max-w-xl flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-accent-emerald to-emerald-400 flex items-center justify-center shadow-glow-sm">
            <Zap className="w-4 h-4 text-black fill-black" />
          </div>
          <span className="font-black text-base tracking-tight text-white font-mono">
            {t('brandName')}
          </span>
          <span className="text-[10px] text-accent-emerald font-mono font-bold bg-accent-emerald/10 px-1.5 py-0.5 rounded">
            {t('aiBadge')}
          </span>
        </div>

        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-background-card hover:bg-background-elevated border border-border text-xs font-bold text-slate-300 transition-all shadow-sm active:scale-95"
        >
          <Globe className="w-3.5 h-3.5 text-accent-cyan" />
          <span className="font-mono">{language === 'ar' ? 'English' : 'عربي'}</span>
        </button>
      </div>

      <div className="w-full max-w-xl bg-background-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald text-xs font-mono font-bold uppercase tracking-wider mb-2 shadow-glow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('onboardingWelcomeTitle')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {step === 1 && t('step1Title')}
            {step === 2 && t('step2Title')}
            {step === 3 && t('step3Title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            {step === 1 && t('step1Subtitle')}
            {step === 2 && t('step2Subtitle')}
            {step === 3 && t('step3Subtitle')}
          </p>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-accent-emerald shadow-glow-sm' : 'bg-background-elevated'}`} />
          <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-accent-emerald shadow-glow-sm' : 'bg-background-elevated'}`} />
          <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-accent-emerald shadow-glow-sm' : 'bg-background-elevated'}`} />
        </div>

        {/* STEP 1: Athlete Name & Goals (Primary + Secondary) */}
        {step === 1 && (
          <div className="space-y-4 relative z-10">
            {/* Athlete Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                {t('athleteName')}
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                className="w-full px-4 py-3 bg-background-elevated border border-border rounded-2xl text-white text-sm focus:outline-none focus:border-accent-emerald transition-colors"
              />
            </div>

            {/* Primary Goal */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-accent-emerald uppercase font-mono tracking-wider">
                  1. {t('primaryGoalLabel')}
                </label>
                <span className="text-[10px] text-slate-400">
                  {t('primaryGoalHelp')}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {goalKeys.map(key => {
                  const isSelected = primaryGoal === key;
                  const term = FITNESS_GOALS_DICT[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelectPrimaryGoal(key)}
                      className={`p-3 rounded-2xl border text-left rtl:text-right transition-all active:scale-[0.98] ${
                        isSelected
                          ? 'bg-accent-emerald/20 border-accent-emerald text-white shadow-glow-sm ring-1 ring-accent-emerald'
                          : 'bg-background-elevated border-border text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs text-white">{language === 'ar' ? term.ar : term.en}</p>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-accent-emerald font-mono flex items-center gap-0.5">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            {t('selectedBadge')}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary Goal */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-accent-cyan uppercase font-mono tracking-wider">
                  2. {t('secondaryGoalLabel')}
                </label>
                <span className="text-[10px] text-slate-400">
                  {t('secondaryGoalHelp')}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {goalKeys.map(key => {
                  const isPrimary = key === primaryGoal;
                  const isSelected = secondaryGoal === key;
                  const term = FITNESS_GOALS_DICT[key];
                  
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={isPrimary}
                      onClick={() => setSecondaryGoal(key)}
                      className={`p-2.5 rounded-2xl border text-left rtl:text-right transition-all active:scale-[0.98] ${
                        isPrimary
                          ? 'opacity-40 bg-background-elevated/40 border-border text-slate-500 cursor-not-allowed'
                          : isSelected
                          ? 'bg-accent-cyan/20 border-accent-cyan text-white shadow-sm ring-1 ring-accent-cyan/50'
                          : 'bg-background-elevated border-border text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-bold text-xs text-white truncate">{language === 'ar' ? term.shortAr : term.shortEn}</p>
                        {isSelected && (
                          <Check className="w-3 h-3 text-accent-cyan stroke-[3] shrink-0" />
                        )}
                      </div>
                      {isPrimary && (
                        <span className="text-[9px] text-slate-500 block mt-0.5">{t('primaryGoalBadge')}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                if (!name.trim()) setName(language === 'ar' ? 'بطل' : 'Athlete');
                setStep(2);
              }}
              className="w-full mt-4 py-3.5 rounded-2xl bg-accent-emerald hover:bg-emerald-400 text-black font-black text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all active:scale-[0.98]"
            >
              <span>{t('nextScheduleBtn')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        )}

        {/* STEP 2: Experience & Schedule (Days & Duration) */}
        {step === 2 && (
          <div className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                {t('experienceLabel')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Beginner', title: t('beginner') },
                  { id: 'Intermediate', title: t('intermediate') },
                  { id: 'Advanced', title: t('advanced') }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setExperience(lvl.id as any)}
                    className={`py-2.5 rounded-2xl border text-xs font-bold text-center transition-all ${
                      experience === lvl.id
                        ? 'bg-accent-emerald text-black border-accent-emerald shadow-sm'
                        : 'bg-background-elevated border-border text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>{lvl.title}</span>
                      {experience === lvl.id && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  {t('daysPerWeekLabel')}: <span className="text-accent-emerald font-mono font-bold">{formatUnitDisplay(days, 'days', language)}</span>
                </label>
              </div>
              <p className="text-[11px] text-accent-cyan font-medium mb-2">
                • {getSplitDescription(days, experience)}
              </p>

              {/* Beginner Days Guidance Alert */}
              {experience === 'Beginner' && days >= 4 && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] mb-2 leading-relaxed flex items-start gap-2">
                  <span>💡</span>
                  <span>{t('beginnerDaysTip')}</span>
                </div>
              )}

              <div className="flex gap-2">
                {[2, 3, 4, 5, 6].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={`flex-1 py-3 rounded-2xl border font-mono font-black text-sm transition-all active:scale-95 ${
                      days === d
                        ? 'bg-accent-emerald text-black border-accent-emerald shadow-glow-sm'
                        : 'bg-background-elevated border-border text-slate-300'
                    }`}
                  >
                    {formatUnitDisplay(d, 'days', language)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                {t('sessionDurationLabel')}: <span className="text-accent-cyan font-mono font-bold">{formatUnitDisplay(duration, 'minutes', language)}</span>
              </label>
              <div className="flex gap-2">
                {[45, 60, 75, 90].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDuration(m)}
                    className={`flex-1 py-2.5 rounded-2xl border font-mono font-bold text-xs transition-all active:scale-95 ${
                      duration === m
                        ? 'bg-accent-cyan text-black border-accent-cyan'
                        : 'bg-background-elevated border-border text-slate-300'
                    }`}
                  >
                    {formatUnitDisplay(m, 'minutes', language)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-5 rounded-2xl bg-background-elevated text-slate-300 text-xs font-bold border border-border"
              >
                {t('backBtn')}
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-2xl bg-accent-emerald hover:bg-emerald-400 text-black font-black text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all active:scale-[0.98]"
              >
                <span>{t('nextEquipmentBtn')}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Available Equipment, Baseline Weights & 4-Week Routine Generation */}
        {step === 3 && (
          <div className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                {t('equipmentLabel')}
              </label>
              <div className="space-y-2">
                {equipmentOptions.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEquipment(item.id as any)}
                    className={`w-full p-3 rounded-2xl border text-left rtl:text-right transition-all active:scale-[0.98] ${
                      equipment === item.id
                        ? 'bg-accent-emerald/15 border-accent-emerald text-white shadow-glow-sm'
                        : 'bg-background-elevated border-border text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs text-white">{item.title}</p>
                      {equipment === item.id && (
                        <Check className="w-4 h-4 text-accent-emerald stroke-[3]" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Starting Weight Baseline Source */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                {t('startingBaselineLabel')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBaselineOption('beginner_rpe')}
                  className={`p-3 rounded-2xl border text-left rtl:text-right transition-all ${
                    baselineOption === 'beginner_rpe'
                      ? 'bg-accent-emerald/15 border-accent-emerald text-white shadow-sm ring-1 ring-accent-emerald'
                      : 'bg-background-elevated border-border text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-white">{t('baselineRpeTitle')}</p>
                    {baselineOption === 'beginner_rpe' && <Check className="w-4 h-4 text-accent-emerald stroke-[3]" />}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                    {t('baselineRpeDesc')}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setBaselineOption('experienced')}
                  className={`p-3 rounded-2xl border text-left rtl:text-right transition-all ${
                    baselineOption === 'experienced'
                      ? 'bg-accent-cyan/15 border-accent-cyan text-white shadow-sm ring-1 ring-accent-cyan'
                      : 'bg-background-elevated border-border text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-white">{t('baselineExpTitle')}</p>
                    {baselineOption === 'experienced' && <Check className="w-4 h-4 text-accent-cyan stroke-[3]" />}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                    {t('baselineExpDesc')}
                  </p>
                </button>
              </div>
            </div>

            {/* Start Day Option (Today vs Tomorrow) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                {t('startDayLabel')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStartDayOption('today')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                    startDayOption === 'today'
                      ? 'bg-emerald-500/20 border-accent-emerald text-accent-emerald shadow-sm'
                      : 'bg-background-elevated border-border text-slate-400'
                  }`}
                >
                  {t('startTodayTitle')}
                </button>

                <button
                  type="button"
                  onClick={() => setStartDayOption('tomorrow')}
                  className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                    startDayOption === 'tomorrow'
                      ? 'bg-cyan-500/20 border-accent-cyan text-accent-cyan shadow-sm'
                      : 'bg-background-elevated border-border text-slate-400'
                  }`}
                >
                  {t('startTomorrowTitle')}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-5 rounded-2xl bg-background-elevated text-slate-300 text-xs font-bold border border-border"
              >
                {t('backBtn')}
              </button>
              
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleFinishAndGenerate}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-accent-emerald via-emerald-400 to-accent-cyan hover:from-emerald-400 hover:to-accent-cyan text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-lg transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>{language === 'ar' ? 'جارٍ هندسة جدولك التدريبي...' : 'Calibrating Periodization Plan...'}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-black" />
                    <span>{t('generateFreePlanBtn')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Security & Guarantee Tag */}
      <div className="mt-4 flex items-center gap-2 text-slate-500 text-xs">
        <ShieldCheck className="w-4 h-4 text-accent-emerald" />
        <span>{t('saudiBadge')} • {t('tagline')}</span>
      </div>

    </div>
  );
};
