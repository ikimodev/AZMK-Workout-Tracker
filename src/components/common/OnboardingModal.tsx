import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, Dumbbell, Target, Clock, Calendar, Zap, X } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { generateAIProgram } from '../../services/aiProgramGenerator';
import { FitnessGoal } from '../../types';
import { FITNESS_GOALS_DICT } from '../../i18n/fitnessDictionary';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProgramGenerated: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onProgramGenerated }) => {
  const { user, updateUserProfile, saveGeneratedProgram, language, t } = useWorkout();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(user.name);
  const [gender, setGender] = useState<'male' | 'female'>(user.gender || 'male');
  const [weight, setWeight] = useState<number | ''>(user.weight || 75);
  const [height, setHeight] = useState<number | ''>(user.height || 175);
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>(user.primaryGoal || 'Muscle Gain');
  const [secondaryGoal, setSecondaryGoal] = useState<FitnessGoal>(user.secondaryGoal || 'Strength');
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(user.experience);
  const [days, setDays] = useState(user.daysPerWeek);
  const [duration, setDuration] = useState(user.preferredDurationMinutes);
  const [equipment, setEquipment] = useState<'Full Gym' | 'Home Gym (Dumbbells & Bench)' | 'Bodyweight Only'>('Full Gym');
  const [startDayOption, setStartDayOption] = useState<'today' | 'tomorrow'>('today');

  if (!isOpen) return null;

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

  const goalKeys: FitnessGoal[] = [
    'Muscle Gain',
    'Strength',
    'Fat Loss',
    'General Fitness',
    'Endurance',
    'Mobility & Joint Health'
  ];

  const handleFinishAndGenerate = () => {
    updateUserProfile({
      name,
      gender,
      weight: typeof weight === 'number' ? weight : 75,
      height: typeof height === 'number' ? height : 175,
      primaryGoal,
      secondaryGoal,
      experience,
      daysPerWeek: days,
      preferredDurationMinutes: duration,
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
    onProgramGenerated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-background-card border border-accent-emerald/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-white p-2 rounded-full bg-background-elevated"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent-emerald to-emerald-400 flex items-center justify-center text-black font-black">
            <Zap className="w-6 h-6 fill-black" />
          </div>
          <div>
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-accent-emerald">
              {language === 'ar' ? 'معالج الإعداد الذكي' : 'AI ONBOARDING WIZARD'}
            </span>
            <h2 className="text-xl font-bold text-white">
              {language === 'ar' ? 'إعداد الخطة التدريبية المخصصة' : 'Personalize Your Protocol'}
            </h2>
          </div>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
          <div className="flex items-center gap-1.5">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step >= 1 ? 'bg-accent-emerald text-black' : 'bg-background-elevated text-slate-400'
            }`}>
              1
            </span>
            <span className="text-[11px] text-slate-300 font-semibold">{language === 'ar' ? 'البيانات' : 'Profile'}</span>
          </div>

          <div className="h-0.5 w-4 bg-border" />

          <div className="flex items-center gap-1.5">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step >= 2 ? 'bg-accent-emerald text-black' : 'bg-background-elevated text-slate-400'
            }`}>
              2
            </span>
            <span className="text-[11px] text-slate-300 font-semibold">{language === 'ar' ? 'الأهداف' : 'Goals'}</span>
          </div>

          <div className="h-0.5 w-4 bg-border" />

          <div className="flex items-center gap-1.5">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step >= 3 ? 'bg-accent-emerald text-black' : 'bg-background-elevated text-slate-400'
            }`}>
              3
            </span>
            <span className="text-[11px] text-slate-300 font-semibold">{language === 'ar' ? 'الجدول' : 'Schedule'}</span>
          </div>

          <div className="h-0.5 w-4 bg-border" />

          <div className="flex items-center gap-1.5">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              step >= 4 ? 'bg-accent-emerald text-black' : 'bg-background-elevated text-slate-400'
            }`}>
              4
            </span>
            <span className="text-[11px] text-slate-300 font-semibold">{language === 'ar' ? 'الأدوات' : 'Gear'}</span>
          </div>
        </div>

        {/* STEP 1: Personal Info (Name at top, Gender, Weight, Height) */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Athlete Name (at top) */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t('nameLabel')}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-background-elevated border border-border rounded-xl text-white text-xs font-medium focus:outline-none focus:border-accent-emerald"
                placeholder={t('namePlaceholder')}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t('genderLabel')}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    gender === 'male'
                      ? 'bg-accent-emerald/20 border-accent-emerald text-white'
                      : 'bg-background-elevated border-border text-slate-300'
                  }`}
                >
                  <span>👨</span>
                  <span>{t('male')}</span>
                  {gender === 'male' && <Check className="w-3.5 h-3.5 text-accent-emerald" />}
                </button>

                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    gender === 'female'
                      ? 'bg-accent-emerald/20 border-accent-emerald text-white'
                      : 'bg-background-elevated border-border text-slate-300'
                  }`}
                >
                  <span>👩</span>
                  <span>{t('female')}</span>
                  {gender === 'female' && <Check className="w-3.5 h-3.5 text-accent-emerald" />}
                </button>
              </div>
            </div>

            {/* Weight & Height */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t('weightLabel')}</label>
                <input
                  type="number"
                  min="30"
                  max="250"
                  value={weight}
                  onChange={e => setWeight(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2 bg-background-elevated border border-border rounded-xl text-white text-xs font-mono font-bold focus:outline-none focus:border-accent-emerald"
                  placeholder="75"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t('heightLabel')}</label>
                <input
                  type="number"
                  min="100"
                  max="230"
                  value={height}
                  onChange={e => setHeight(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2 bg-background-elevated border border-border rounded-xl text-white text-xs font-mono font-bold focus:outline-none focus:border-accent-emerald"
                  placeholder="175"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 py-3 rounded-xl bg-accent-emerald text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-glow-sm"
            >
              <span>{t('nextGoalsBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        )}

        {/* STEP 2: Goals */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Primary Goal */}
            <div>
              <label className="block text-xs font-semibold text-accent-emerald mb-1.5">{t('primaryGoalLabel')}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {goalKeys.slice(0, 4).map(key => {
                  const term = FITNESS_GOALS_DICT[key];
                  return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPrimaryGoal(key)}
                    className={`p-3 rounded-xl border text-left rtl:text-right transition-all ${
                      primaryGoal === key 
                        ? 'bg-accent-emerald/15 border-accent-emerald text-white' 
                        : 'bg-background-elevated border-border text-slate-300'
                    }`}
                  >
                    <p className="font-bold text-xs text-white">{language === 'ar' ? term.ar : term.en}</p>
                  </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary Goal */}
            <div>
              <label className="block text-xs font-semibold text-accent-cyan mb-1.5">{t('secondaryGoalLabel')}</label>
              <div className="grid grid-cols-2 gap-2">
                {goalKeys.map(key => {
                  const term = FITNESS_GOALS_DICT[key];
                  return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSecondaryGoal(key)}
                    className={`p-2.5 rounded-xl border text-left rtl:text-right transition-all ${
                      secondaryGoal === key 
                        ? 'bg-accent-cyan/15 border-accent-cyan text-white' 
                        : 'bg-background-elevated border-border text-slate-300'
                    }`}
                  >
                    <p className="font-bold text-xs text-white truncate">{language === 'ar' ? term.shortAr : term.shortEn}</p>
                  </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl bg-background-elevated text-slate-300 text-xs font-bold border border-border"
              >
                {t('backBtn')}
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 rounded-xl bg-accent-emerald text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-glow-sm"
              >
                <span>{t('nextScheduleBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Experience & Schedule */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">{language === 'ar' ? 'مستوى الخبرة' : 'Experience Level'}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Beginner', titleAr: 'مبتدئ', titleEn: 'Beginner' },
                  { id: 'Intermediate', titleAr: 'متوسط', titleEn: 'Intermediate' },
                  { id: 'Advanced', titleAr: 'متقدم', titleEn: 'Advanced' }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setExperience(lvl.id as any)}
                    className={`py-2 rounded-xl border text-xs font-bold text-center ${
                      experience === lvl.id
                        ? 'bg-accent-emerald text-black border-accent-emerald'
                        : 'bg-background-elevated border-border text-slate-300'
                    }`}
                  >
                    {language === 'ar' ? lvl.titleAr : lvl.titleEn}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">{language === 'ar' ? 'أيام التمرين أسبوعياً' : 'Days per Week'}</label>
              <div className="flex gap-2">
                {[2, 3, 4, 5, 6].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={`flex-1 py-2.5 rounded-xl border font-mono font-bold text-xs ${
                      days === d
                        ? 'bg-accent-emerald text-black border-accent-emerald'
                        : 'bg-background-elevated border-border text-slate-300'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">{language === 'ar' ? 'مدة الجلسة (بالدقائق)' : 'Target Duration (minutes)'}</label>
              <div className="flex gap-2">
                {[45, 60, 75, 90].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDuration(m)}
                    className={`flex-1 py-2 rounded-xl border font-mono font-bold text-xs ${
                      duration === m
                        ? 'bg-accent-cyan text-black border-accent-cyan'
                        : 'bg-background-elevated border-border text-slate-300'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-2.5 px-4 rounded-xl bg-background-elevated text-slate-300 text-xs font-bold border border-border"
              >
                {t('backBtn')}
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex-1 py-2.5 rounded-xl bg-accent-emerald text-black font-extrabold text-xs flex items-center justify-center gap-1.5"
              >
                <span>{t('nextEquipmentBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Equipment & Finish */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">{language === 'ar' ? 'الأدوات المتاحة' : 'Available Equipment'}</label>
              <div className="space-y-2">
                {equipmentOptions.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEquipment(item.id as any)}
                    className={`w-full p-3 rounded-xl border text-left rtl:text-right transition-all ${
                      equipment === item.id
                        ? 'bg-accent-emerald/15 border-accent-emerald text-white'
                        : 'bg-background-elevated border-border text-slate-300'
                    }`}
                  >
                    <p className="font-bold text-xs text-white">{item.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Day Preference: Today vs Tomorrow */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                {language === 'ar' ? 'متى تريد بدء جدولك التدريبي؟' : 'When would you like to start?'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStartDayOption('today')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    startDayOption === 'today'
                      ? 'bg-accent-emerald text-black border-accent-emerald font-extrabold shadow-sm'
                      : 'bg-background-elevated border-border text-slate-300'
                  }`}
                >
                  {language === 'ar' ? '🟢 ابدأ اليوم (اليوم Day 1)' : '🟢 Start Today'}
                </button>

                <button
                  type="button"
                  onClick={() => setStartDayOption('tomorrow')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    startDayOption === 'tomorrow'
                      ? 'bg-accent-cyan text-black border-accent-cyan font-extrabold shadow-sm'
                      : 'bg-background-elevated border-border text-slate-300'
                  }`}
                >
                  {language === 'ar' ? '🔵 ابدأ غداً (اليوم راحة)' : '🔵 Start Tomorrow'}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-accent-indigo/10 border border-accent-indigo/30 flex items-start gap-2.5 text-xs text-slate-300">
              <Sparkles className="w-4 h-4 text-accent-indigo shrink-0 mt-0.5" />
              <span>
                {language === 'ar'
                  ? `سيقوم الذكاء الاصطناعي بتوليد خطة تدريبية لـ 4 أسابيع بـ ${days} أيام أسبوعياً تبدأ (${startDayOption === 'today' ? 'اليوم' : 'غداً'}) مخصصة لهدفك (${primaryGoal} + ${secondaryGoal}).`
                  : `AI will generate an optimized 4-week protocol with ${days} training days per week starting (${startDayOption === 'today' ? 'today' : 'tomorrow'}) for ${primaryGoal} + ${secondaryGoal}.`}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-2.5 px-4 rounded-xl bg-background-elevated text-slate-300 text-xs font-bold border border-border"
              >
                {t('backBtn')}
              </button>
              <button
                type="button"
                onClick={handleFinishAndGenerate}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-accent-emerald to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-glow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 fill-black" />
                <span>{language === 'ar' ? 'توليد وتفعيل الخطة 🚀' : 'Generate & Activate Plan'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
