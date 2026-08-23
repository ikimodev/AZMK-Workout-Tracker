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
  const { updateUserProfile, saveGeneratedProgram, user, language, t } = useWorkout();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(user.name === 'Kareem Al-Otaibi' ? '' : user.name);
  const [gender, setGender] = useState<'male' | 'female'>(user.gender || 'male');
  const [weight, setWeight] = useState<number | ''>(user.weight || 75);
  const [height, setHeight] = useState<number | ''>(user.height || 175);
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>('Muscle Gain');
  const [secondaryGoal, setSecondaryGoal] = useState<FitnessGoal>('Strength');
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [days, setDays] = useState(4);
  const [duration, setDuration] = useState(60);
  const [equipment, setEquipment] = useState<'Full Gym' | 'Home Gym (Dumbbells & Bench)' | 'Bodyweight Only'>('Full Gym');
  const [startDayOption, setStartDayOption] = useState<'today' | 'tomorrow'>('today');
  const [baselineOption, setBaselineOption] = useState<'experienced' | 'beginner_rpe'>('beginner_rpe');
  const [preferredSplit, setPreferredSplit] = useState<string>('AI Recommended');
  const [isGenerating, setIsGenerating] = useState(false);

  const getSplitOptions = (d: number) => {
    if (d === 2) return ['Full Body', 'Upper / Lower'];
    if (d === 3) return ['PPL', 'Full Body'];
    if (d === 4) return ['Upper / Lower', 'PHUL (Powerlifter Recommended)'];
    if (d === 5) return ['Hybrid (Upper/Lower + PPL)', 'Bro Split'];
    if (d === 6) return ['PPL x2', 'Arnold Split'];
    return [];
  };

  React.useEffect(() => {
    // 1. If Beginner, they can't do 6 days
    if (experience === 'Beginner' && days === 6) {
      setDays(5);
    }
    
    // 2. Adjust duration if out of bounds based on days
    if (days === 2 && (duration === 45 || duration === 60)) {
      setDuration(75);
    } else if (days === 3 && duration === 45) {
      setDuration(60);
    } else if (days === 6 && duration === 90) {
      setDuration(75);
    }

    // 3. Adjust split
    if (experience === 'Beginner') {
      setPreferredSplit('AI Recommended');
    } else {
      const options = getSplitOptions(days);
      if (!options.includes(preferredSplit) && options.length > 0) {
        setPreferredSplit(options[0]);
      }
    }
  }, [days, duration, experience]);

  const goalKeys: FitnessGoal[] = [
    'General Fitness',
    'Muscle Gain',
    'Strength',
    'Fat Loss',
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
      title: 'Full Gym',
      desc: 'Access to machines, barbells, and full equipment'
    },
    {
      id: 'Home Gym (Dumbbells & Bench)',
      title: 'Home Gym',
      desc: 'Requires dumbbells and a bench'
    },
    {
      id: 'Bodyweight Only',
      title: 'Calisthenics',
      desc: 'Bodyweight only, pull-up bar optional'
    },
  ];

  const handleFinishAndGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 650));

    const finalName = name.trim() || t('athletePlaceholder');

    updateUserProfile({
      name: finalName,
      gender,
      weight: typeof weight === 'number' ? weight : 75,
      height: typeof height === 'number' ? height : 175,
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
      programStartDate: new Date().toISOString().split('T')[0],
      preferredSplit
    });

    const generated = generateAIProgram({
      goal: primaryGoal,
      secondaryGoal,
      experience,
      daysPerWeek: days,
      durationMinutes: duration,
      equipment,
      preferredSplit
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

      <div className="w-full max-w-xl bg-background-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald text-xs font-mono font-bold uppercase tracking-wider mb-2 shadow-glow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step {step} of 4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {step === 1 && t('stepPersonalTitle')}
            {step === 2 && t('step1Title')}
            {step === 3 && t('step2Title')}
            {step === 4 && t('step3Title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            {step === 1 && t('stepPersonalSubtitle')}
            {step === 2 && t('step1Subtitle')}
            {step === 3 && t('step2Subtitle')}
            {step === 4 && t('step3Subtitle')}
          </p>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-accent-emerald shadow-glow-sm' : 'bg-background-elevated'}`} />
          <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-accent-emerald shadow-glow-sm' : 'bg-background-elevated'}`} />
          <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-accent-emerald shadow-glow-sm' : 'bg-background-elevated'}`} />
          <div className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${step >= 4 ? 'bg-accent-emerald shadow-glow-sm' : 'bg-background-elevated'}`} />
        </div>

        {/* STEP 1: Personal Profile (Name, Gender, Weight, Height) */}
        {step === 1 && (
          <div className="space-y-4 relative z-10">
            {/* Athlete Name (at top) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  {t('nameLabel')}
                </label>
                <span className="text-[10px] text-slate-400">
                  Optional
                </span>
              </div>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                className="w-full px-4 py-3 bg-background-elevated border border-border rounded-2xl text-white text-sm focus:outline-none focus:border-accent-emerald transition-colors"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                {t('genderLabel')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-3 px-4 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                    gender === 'male'
                      ? 'bg-accent-emerald/20 border-accent-emerald text-white shadow-glow-sm ring-1 ring-accent-emerald'
                      : 'bg-background-elevated border-border text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span className="text-base">👨</span>
                  <span>{t('male')}</span>
                  {gender === 'male' && <Check className="w-4 h-4 text-accent-emerald stroke-[3]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-3 px-4 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                    gender === 'female'
                      ? 'bg-accent-emerald/20 border-accent-emerald text-white shadow-glow-sm ring-1 ring-accent-emerald'
                      : 'bg-background-elevated border-border text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span className="text-base">👩</span>
                  <span>{t('female')}</span>
                  {gender === 'female' && <Check className="w-4 h-4 text-accent-emerald stroke-[3]" />}
                </button>
              </div>
            </div>

            {/* Weight & Height */}
            <div className="grid grid-cols-2 gap-3">
              {/* Weight */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                  {t('weightLabel')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="30"
                    max="250"
                    value={weight}
                    onChange={e => setWeight(e.target.value ? Number(e.target.value) : '')}
                    placeholder="75"
                    className="w-full px-4 py-3 bg-background-elevated border border-border rounded-2xl text-white text-sm focus:outline-none focus:border-accent-emerald transition-colors font-mono font-bold"
                  />
                  <span className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                    kg
                  </span>
                </div>
              </div>

              {/* Height */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                  {t('heightLabel')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    max="230"
                    value={height}
                    onChange={e => setHeight(e.target.value ? Number(e.target.value) : '')}
                    placeholder="175"
                    className="w-full px-4 py-3 bg-background-elevated border border-border rounded-2xl text-white text-sm focus:outline-none focus:border-accent-emerald transition-colors font-mono font-bold"
                  />
                  <span className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                    cm
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!name.trim()) setName(language === 'ar' ? 'بطل' : 'Athlete');
                setStep(2);
              }}
              className="w-full mt-4 py-3.5 rounded-2xl bg-accent-emerald hover:bg-emerald-400 text-black font-black text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all active:scale-[0.98]"
            >
              <span>{t('nextGoalsBtn')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        )}

        {/* STEP 2: Goals (Primary + Secondary) */}
        {step === 2 && (
          <div className="space-y-4 relative z-10">
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
                  const displayTitle = key === 'General Fitness' ? 'I just want to start working out' : (language === 'ar' ? term.ar : term.en);
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
                        <p className="font-bold text-xs text-white">{displayTitle}</p>
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
                <span>{t('nextScheduleBtn')}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Experience & Schedule (Days & Duration) */}
        {step === 3 && (
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
                {[2, 3, 4, 5, 6].map(d => {
                  const isDisabled = experience === 'Beginner' && d === 6;
                  return (
                    <button
                      key={d}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => setDays(d)}
                      className={`flex-1 py-3 rounded-2xl border font-mono font-black text-sm transition-all active:scale-95 ${
                        days === d
                          ? 'bg-accent-emerald text-black border-accent-emerald shadow-glow-sm'
                          : isDisabled
                          ? 'opacity-30 bg-background-elevated border-border text-slate-500 cursor-not-allowed'
                          : 'bg-background-elevated border-border text-slate-300'
                      }`}
                    >
                      {formatUnitDisplay(d, 'days', language)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                {t('sessionDurationLabel')}: <span className="text-accent-cyan font-mono font-bold">{formatUnitDisplay(duration, 'minutes', language)}</span>
              </label>
              <div className="flex gap-2">
                {[45, 60, 75, 90].map(m => {
                  const isTooShortFor2 = days === 2 && (m === 45 || m === 60);
                  const isTooShortFor3 = days === 3 && m === 45;
                  const isTooLongFor6 = days === 6 && m === 90;
                  const isDisabled = isTooShortFor2 || isTooShortFor3 || isTooLongFor6;

                  return (
                    <button
                      key={m}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => setDuration(m)}
                      className={`flex-1 py-2.5 rounded-2xl border font-mono font-bold text-xs transition-all active:scale-95 ${
                        duration === m
                          ? 'bg-accent-cyan text-black border-accent-cyan'
                          : isDisabled
                          ? 'opacity-30 bg-background-elevated border-border text-slate-500 cursor-not-allowed'
                          : 'bg-background-elevated border-border text-slate-300'
                      }`}
                    >
                      {formatUnitDisplay(m, 'minutes', language)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Workout Split Selection (Hidden for Beginners) */}
            {experience !== 'Beginner' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                  Workout Split
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {getSplitOptions(days).map(split => (
                    <button
                      key={split}
                      type="button"
                      onClick={() => setPreferredSplit(split)}
                      className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                        preferredSplit === split
                          ? 'bg-accent-indigo/20 border-accent-indigo text-white shadow-sm'
                          : 'bg-background-elevated border-border text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {split}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                onClick={() => setStep(4)}
                className="flex-1 py-3.5 rounded-2xl bg-accent-emerald hover:bg-emerald-400 text-black font-black text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all active:scale-[0.98]"
              >
                <span>{t('nextEquipmentBtn')}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Available Equipment, Baseline Weights & 4-Week Routine Generation */}
        {step === 4 && (
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
                  className={`p-3 rounded-2xl border text-left rtl:text-right transition-all relative ${
                    baselineOption === 'beginner_rpe'
                      ? 'bg-accent-emerald/15 border-accent-emerald text-white shadow-sm ring-1 ring-accent-emerald'
                      : 'bg-background-elevated border-border text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {experience === 'Beginner' && (
                    <span className="absolute -top-2.5 right-3 bg-accent-emerald text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      Best for Beginners
                    </span>
                  )}
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

            <div className="mt-6 pt-4 border-t border-border/50">
              <h3 className="text-sm font-bold text-white mb-3">Plan Summary</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setStep(1)} className="p-2.5 rounded-xl bg-background-elevated border border-border text-left rtl:text-right hover:border-accent-emerald/50 transition-colors">
                  <span className="block text-[10px] text-slate-400 uppercase">Profile</span>
                  <span className="block text-xs font-bold text-white mt-0.5 truncate">{name || 'Athlete'} ({gender === 'male' ? 'ذكر' : 'أنثى'})</span>
                  <span className="block text-[10px] text-slate-400">{weight} kg • {height} cm</span>
                </button>
                <button onClick={() => setStep(2)} className="p-2.5 rounded-xl bg-background-elevated border border-border text-left rtl:text-right hover:border-accent-emerald/50 transition-colors">
                  <span className="block text-[10px] text-slate-400 uppercase">Goal</span>
                  <span className="block text-xs font-bold text-white mt-0.5 truncate">{primaryGoal}</span>
                </button>
                <button onClick={() => setStep(3)} className="p-2.5 rounded-xl bg-background-elevated border border-border text-left rtl:text-right hover:border-accent-emerald/50 transition-colors">
                  <span className="block text-[10px] text-slate-400 uppercase">Schedule & Split</span>
                  <span className="block text-xs font-bold text-white mt-0.5">{days} days, {duration} mins</span>
                  {experience !== 'Beginner' && (
                    <span className="block text-[10px] text-accent-indigo font-bold mt-1">{preferredSplit}</span>
                  )}
                </button>
                <button onClick={() => setStep(4)} className="p-2.5 rounded-xl bg-background-elevated border border-border text-left rtl:text-right hover:border-accent-emerald/50 transition-colors">
                  <span className="block text-[10px] text-slate-400 uppercase">Equipment</span>
                  <span className="block text-xs font-bold text-white mt-0.5 truncate">{equipment}</span>
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
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
                    <span>Calibrating Periodization Plan...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-black" />
                    <span>Generate Plan</span>
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
