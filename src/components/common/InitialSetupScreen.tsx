import React, { useState } from 'react';
import { Sparkles, ArrowRight, Zap, Dumbbell, ShieldCheck, Check, Globe, ArrowLeft } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { generateAIProgram } from '../../services/aiProgramGenerator';
import { FitnessGoal } from '../../types';

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
  const [isGenerating, setIsGenerating] = useState(false);

  const goalOptionsAr: { id: FitnessGoal; title: string; desc: string }[] = [
    { id: 'Muscle Gain', title: 'بناء العضلات والضخامة (Hypertrophy)', desc: 'زيادة الحجم والشكل العضلي الجذاب' },
    { id: 'Strength', title: 'القوة والباورلفتنج (Strength)', desc: 'رفع أوزان أعلى في التمارين المركبة' },
    { id: 'Fat Loss', title: 'حرق الدهون والتنشيف (Fat Loss)', desc: 'إبراز تفاصيل العضلات وكثافة تدريبية' },
    { id: 'General Fitness', title: 'لياقة وصحة عامة (General Fitness)', desc: 'تحسين النشاط والطاقة اليومية' },
    { id: 'Endurance', title: 'التحمل والأداء العالي (Endurance)', desc: 'زيادة سعة الرئة والتحمل البدني' },
    { id: 'Mobility & Joint Health', title: 'مرونة وصحة المفاصل (Mobility)', desc: 'حماية المفاصل وإطالة المدى الحركي' },
  ];

  const goalOptionsEn: { id: FitnessGoal; title: string; desc: string }[] = [
    { id: 'Muscle Gain', title: 'Muscle Gain (Hypertrophy)', desc: 'Maximize muscle size & aesthetics' },
    { id: 'Strength', title: 'Strength & Power', desc: 'Heavy compound loads & PR records' },
    { id: 'Fat Loss', title: 'Fat Loss & Conditioning', desc: 'Lean definition with high density' },
    { id: 'General Fitness', title: 'General Fitness', desc: 'Overall health, mobility & energy' },
    { id: 'Endurance', title: 'Endurance & Work Capacity', desc: 'High stamina & aerobic base' },
    { id: 'Mobility & Joint Health', title: 'Mobility & Joint Health', desc: 'Flexibility & longevity' },
  ];

  const goalOptions = language === 'ar' ? goalOptionsAr : goalOptionsEn;

  const equipmentOptionsAr = [
    { id: 'Full Gym', title: 'نادي تجاري متكامل (Full Gym)', desc: 'بارات، دامبلز، أجهزة كيبل، وآلات متكاملة' },
    { id: 'Home Gym (Dumbbells & Bench)', title: 'نادي منزلي (Home Gym)', desc: 'دامبلز قابلة للتعديل، بنش، وعقلة' },
    { id: 'Bodyweight Only', title: 'تمارين وزن الجسم (Calisthenics)', desc: 'بدون أوزان خارجية' },
  ];

  const equipmentOptionsEn = [
    { id: 'Full Gym', title: 'Full Commercial Gym', desc: 'Barbells, dumbbells, cables, machines' },
    { id: 'Home Gym (Dumbbells & Bench)', title: 'Home Gym (Dumbbells & Bench)', desc: 'Adjustable dumbbells, bench & pull-up bar' },
    { id: 'Bodyweight Only', title: 'Bodyweight & Calisthenics', desc: 'No weights or equipment needed' },
  ];

  const equipmentOptions = language === 'ar' ? equipmentOptionsAr : equipmentOptionsEn;

  const handleFinishAndGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 650));

    const finalName = name.trim() || (language === 'ar' ? 'بطل' : 'Athlete');

    updateUserProfile({
      name: finalName,
      email: `${finalName.toLowerCase().replace(/\s+/g, '')}@azmk.fit`,
      primaryGoal,
      secondaryGoal,
      experience,
      daysPerWeek: days,
      preferredDurationMinutes: duration,
      tier: 'free',
      streakDays: 1,
      hasCompletedOnboarding: true
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
    setIsGenerating(false);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center p-3 sm:p-6 animate-fade-in pb-safe pt-safe">
      <div className="max-w-xl w-full bg-background-card border border-border/80 rounded-3xl p-5 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-emerald/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-indigo/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Language Toggle on Onboarding */}
        <div className="flex justify-end relative z-20 mb-2">
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background-elevated hover:bg-background-hover border border-border text-xs font-bold text-slate-200 shadow-sm active:scale-95 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="font-mono">{language === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>

        {/* Brand Header: AZMK / عزمك */}
        <div className="text-center mb-6 relative z-10">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-accent-emerald to-emerald-400 flex items-center justify-center shadow-glow-md">
            <Zap className="w-8 h-8 text-black fill-black" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
              {language === 'ar' ? 'عزمك' : 'AZMK'}
            </h1>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent-emerald/15 border border-accent-emerald/40 text-accent-emerald text-xs font-black tracking-wider shadow-glow-sm">
              <Zap className="w-3 h-3 fill-accent-emerald" />
              <span>AI</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-semibold tracking-wide">
            {language === 'ar' ? 'تمرّن بهدف • Train with purpose' : 'Train with purpose'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'ar'
              ? 'اضبط ملفك الرياضي واحصل على خطتك التدريبية المجانية لـ 4 أسابيع بالذكاء الاصطناعي.'
              : 'Setup your profile & generate your free 4-week custom workout plan.'}
          </p>

          {/* Progress Bar */}
          <div className="flex items-center justify-center gap-2 mt-5 max-w-xs mx-auto">
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? 'bg-accent-emerald' : 'bg-background-elevated'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? 'bg-accent-emerald' : 'bg-background-elevated'}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 3 ? 'bg-accent-emerald' : 'bg-background-elevated'}`} />
          </div>
        </div>

        {/* STEP 1: Name & Goals (Primary & Secondary) */}
        {step === 1 && (
          <div className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                {language === 'ar' ? 'الاسم أو اللقب' : 'Your Full Name / Nickname'}
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: عبدالكريم أو بطل' : 'e.g. Kareem Al-Otaibi'}
                className="w-full px-4 py-3 bg-background-elevated border border-border rounded-2xl text-white font-semibold text-sm focus:outline-none focus:border-accent-emerald shadow-inner"
              />
            </div>

            {/* Primary Goal */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-accent-emerald uppercase font-mono tracking-wider">
                  {language === 'ar' ? '1. الهدف التدريبي الأساسي' : '1. Primary Fitness Goal'}
                </label>
                <span className="text-[10px] text-slate-400">{language === 'ar' ? 'التركيز الأول' : 'Main Focus'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {goalOptions.slice(0, 4).map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPrimaryGoal(item.id)}
                    className={`p-3 rounded-2xl border text-left rtl:text-right transition-all active:scale-[0.98] ${
                      primaryGoal === item.id
                        ? 'bg-accent-emerald/20 border-accent-emerald text-white shadow-glow-sm'
                        : 'bg-background-elevated border-border text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <p className="font-bold text-xs text-white">{item.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary Goal */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-accent-cyan uppercase font-mono tracking-wider">
                  {language === 'ar' ? '2. الهدف التدريبي الثانوي' : '2. Secondary Fitness Goal'}
                </label>
                <span className="text-[10px] text-slate-400">{language === 'ar' ? 'هدف مساند' : 'Supporting Objective'}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {goalOptions.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSecondaryGoal(item.id)}
                    className={`p-2.5 rounded-2xl border text-left rtl:text-right transition-all active:scale-[0.98] ${
                      secondaryGoal === item.id
                        ? 'bg-accent-cyan/20 border-accent-cyan text-white shadow-sm'
                        : 'bg-background-elevated border-border text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <p className="font-bold text-xs text-white truncate">{item.title.split('(')[0]}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                if (!name.trim()) setName(language === 'ar' ? 'بطل' : 'Athlete');
                setStep(2);
              }}
              className="w-full mt-4 py-3.5 rounded-2xl bg-accent-emerald hover:bg-emerald-400 text-black font-black text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all active:scale-[0.98]"
            >
              <span>{language === 'ar' ? 'التالي: جدول وأيام التمرين' : 'Next: Training Schedule'}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        )}

        {/* STEP 2: Experience & Schedule (Days & Duration) */}
        {step === 2 && (
          <div className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                {language === 'ar' ? 'مستوى الخبرة في التمرين' : 'Training Experience Level'}
              </label>
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
                    className={`py-2.5 rounded-2xl border text-xs font-bold text-center transition-all ${
                      experience === lvl.id
                        ? 'bg-accent-emerald text-black border-accent-emerald shadow-sm'
                        : 'bg-background-elevated border-border text-slate-300'
                    }`}
                  >
                    {language === 'ar' ? lvl.titleAr : lvl.titleEn}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                {language === 'ar' ? 'أيام التمرين أسبوعياً:' : 'Days Per Week:'} <span className="text-accent-emerald font-mono font-bold">{days} {language === 'ar' ? 'أيام' : 'Days'}</span>
                <span className="text-[11px] text-slate-400 font-normal ml-2 rtl:mr-2">
                  ({days === 2 ? (language === 'ar' ? 'يومان: علوي / سفلي' : 'Upper / Lower') : days === 3 ? (language === 'ar' ? '3 أيام: شامل للجسم A/B/C' : 'Full Body A/B/C') : days === 4 ? (language === 'ar' ? '4 أيام: علوي وسفلي متقدم' : '4-Day Split') : days === 5 ? (language === 'ar' ? '5 أيام: Push/Pull/Legs+Upper/Lower' : '5-Day PPL+Upper/Lower') : (language === 'ar' ? '6 أيام: PPL × 2' : '6-Day PPL×2')})
                </span>
              </label>
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
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                {language === 'ar' ? 'مدة الجلسة المفضلة:' : 'Session Duration:'} <span className="text-accent-cyan font-mono font-bold">{duration} {language === 'ar' ? 'دقيقة' : 'min'}</span>
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
                    {m}m
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
                {language === 'ar' ? 'رجوع' : 'Back'}
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 rounded-2xl bg-accent-emerald hover:bg-emerald-400 text-black font-black text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all active:scale-[0.98]"
              >
                <span>{language === 'ar' ? 'التالي: الأدوات المتاحة' : 'Next: Available Equipment'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Available Equipment & 4-Week Free Routine Generation */}
        {step === 3 && (
          <div className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                {language === 'ar' ? 'اختر الأدوات المتاحة لتمرينك' : 'Select Your Equipment Setup'}
              </label>
              <div className="space-y-2.5">
                {equipmentOptions.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEquipment(item.id as any)}
                    className={`w-full p-3.5 rounded-2xl border text-left rtl:text-right transition-all active:scale-[0.98] ${
                      equipment === item.id
                        ? 'bg-accent-emerald/15 border-accent-emerald text-white shadow-glow-sm'
                        : 'bg-background-elevated border-border text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <p className="font-bold text-sm text-white">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Confirmation Highlight Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-accent-indigo/20 to-accent-emerald/20 border border-accent-indigo/40 flex items-start gap-3">
              <Zap className="w-5 h-5 text-accent-emerald shrink-0 mt-0.5" />
              <div className="text-xs text-slate-200 leading-relaxed">
                <strong className="text-accent-emerald font-bold block mb-0.5">
                  {language === 'ar' ? 'خطة 4 أسابيع مجانية بالذكاء الاصطناعي:' : 'Free 4-Week Periodized Routine:'}
                </strong>
                {language === 'ar'
                  ? `سيقوم نظام عزمك الذكي بتجميع جدول مخصص لـ ${days} أيام أسبوعياً مع زيادة تدريجية للأوزان يركز على ${primaryGoal} مع تركيز مساند على ${secondaryGoal}.`
                  : `AZMK AI will assemble your personalized ${days}-day protocol optimized for ${primaryGoal} with secondary emphasis on ${secondaryGoal}.`}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3 px-5 rounded-2xl bg-background-elevated text-slate-300 text-xs font-bold border border-border"
              >
                {language === 'ar' ? 'رجوع' : 'Back'}
              </button>
              <button
                type="button"
                onClick={handleFinishAndGenerate}
                disabled={isGenerating}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-accent-emerald to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-sm flex items-center justify-center gap-2 shadow-glow-md transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>{language === 'ar' ? 'جاري توليد خطتك المجانية لـ 4 أسابيع...' : 'Building Your Free 4-Week Plan...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-black" />
                    <span>{language === 'ar' ? 'توليد الجدول المجاني لـ 4 أسابيع 🚀' : 'Generate Free 4-Week Routine'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
