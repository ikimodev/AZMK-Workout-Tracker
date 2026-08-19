import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, Dumbbell, Target, Clock, Calendar, Zap, X } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { generateAIProgram } from '../../services/aiProgramGenerator';
import { FitnessGoal } from '../../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProgramGenerated: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onProgramGenerated }) => {
  const { user, updateUserProfile, saveGeneratedProgram, language } = useWorkout();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(user.name);
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>(user.primaryGoal || 'Muscle Gain');
  const [secondaryGoal, setSecondaryGoal] = useState<FitnessGoal>(user.secondaryGoal || 'Strength');
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(user.experience);
  const [days, setDays] = useState(user.daysPerWeek);
  const [duration, setDuration] = useState(user.preferredDurationMinutes);
  const [equipment, setEquipment] = useState<'Full Gym' | 'Home Gym (Dumbbells & Bench)' | 'Bodyweight Only'>('Full Gym');

  if (!isOpen) return null;

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
    { id: 'Strength', title: 'Strength & Power', desc: 'Heavy compounds & PR records' },
    { id: 'Fat Loss', title: 'Fat Loss & Leanness', desc: 'Caloric burn with high intensity' },
    { id: 'General Fitness', title: 'General Fitness', desc: 'Overall health & longevity' },
    { id: 'Endurance', title: 'Endurance & Work Capacity', desc: 'Stamina & high rep density' },
    { id: 'Mobility & Joint Health', title: 'Mobility & Joint Health', desc: 'Flexibility & injury resilience' },
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

  const handleFinishAndGenerate = () => {
    updateUserProfile({
      name,
      primaryGoal,
      secondaryGoal,
      experience,
      daysPerWeek: days,
      preferredDurationMinutes: duration
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
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-accent-emerald text-black' : 'bg-background-elevated text-slate-400'
            }`}>
              1
            </span>
            <span className="text-xs text-slate-300 font-semibold">{language === 'ar' ? 'الأهداف' : 'Goals'}</span>
          </div>

          <div className="h-0.5 w-8 bg-border" />

          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-accent-emerald text-black' : 'bg-background-elevated text-slate-400'
            }`}>
              2
            </span>
            <span className="text-xs text-slate-300 font-semibold">{language === 'ar' ? 'الجدول' : 'Schedule'}</span>
          </div>

          <div className="h-0.5 w-8 bg-border" />

          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              step >= 3 ? 'bg-accent-emerald text-black' : 'bg-background-elevated text-slate-400'
            }`}>
              3
            </span>
            <span className="text-xs text-slate-300 font-semibold">{language === 'ar' ? 'الأدوات' : 'Equipment'}</span>
          </div>
        </div>

        {/* STEP 1: Name & Goals */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">{language === 'ar' ? 'اسم اللاعب' : 'Athlete Name'}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-background-elevated border border-border rounded-xl text-white text-xs font-medium focus:outline-none focus:border-accent-emerald"
                placeholder={language === 'ar' ? 'اسمك أو لقبك' : 'Your name or nickname'}
              />
            </div>

            {/* Primary Goal */}
            <div>
              <label className="block text-xs font-semibold text-accent-emerald mb-1.5">{language === 'ar' ? '1. الهدف الأساسي' : '1. Primary Goal'}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {goalOptions.slice(0, 4).map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPrimaryGoal(item.id)}
                    className={`p-3 rounded-xl border text-left rtl:text-right transition-all ${
                      primaryGoal === item.id 
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

            {/* Secondary Goal */}
            <div>
              <label className="block text-xs font-semibold text-accent-cyan mb-1.5">{language === 'ar' ? '2. الهدف الثانوي' : '2. Secondary Goal'}</label>
              <div className="grid grid-cols-2 gap-2">
                {goalOptions.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSecondaryGoal(item.id)}
                    className={`p-2.5 rounded-xl border text-left rtl:text-right transition-all ${
                      secondaryGoal === item.id 
                        ? 'bg-accent-cyan/15 border-accent-cyan text-white' 
                        : 'bg-background-elevated border-border text-slate-300'
                    }`}
                  >
                    <p className="font-bold text-xs text-white truncate">{item.title.split('(')[0]}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 py-3 rounded-xl bg-accent-emerald text-black font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-glow-sm"
            >
              <span>{language === 'ar' ? 'متابعة: الجدول الأسبوعي' : 'Next: Schedule Preferences'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        )}

        {/* STEP 2: Experience & Schedule */}
        {step === 2 && (
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
                onClick={() => setStep(1)}
                className="py-2.5 px-4 rounded-xl bg-background-elevated text-slate-300 text-xs font-bold border border-border"
              >
                {language === 'ar' ? 'رجوع' : 'Back'}
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-2.5 rounded-xl bg-accent-emerald text-black font-extrabold text-xs flex items-center justify-center gap-1.5"
              >
                <span>{language === 'ar' ? 'متابعة: الأدوات' : 'Next: Equipment'}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Equipment & Finish */}
        {step === 3 && (
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

            <div className="p-3 rounded-xl bg-accent-indigo/10 border border-accent-indigo/30 flex items-start gap-2.5 text-xs text-slate-300">
              <Sparkles className="w-4 h-4 text-accent-indigo shrink-0 mt-0.5" />
              <span>
                {language === 'ar'
                  ? `سيقوم الذكاء الاصطناعي بتوليد خطة تدريبية لـ 4 أسابيع بـ ${days} أيام أسبوعياً مخصصة لهدفك (${primaryGoal} + ${secondaryGoal}).`
                  : `AI will generate an optimized 4-week protocol with ${days} training days per week for ${primaryGoal} + ${secondaryGoal}.`}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-2.5 px-4 rounded-xl bg-background-elevated text-slate-300 text-xs font-bold border border-border"
              >
                {language === 'ar' ? 'رجوع' : 'Back'}
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
