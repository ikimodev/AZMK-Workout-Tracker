import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, Zap, X } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { generateAIProgram } from '../../services/aiProgramGenerator';
import { FitnessGoal, MuscleGroup } from '../../types';
import { FITNESS_GOALS_DICT } from '../../i18n/fitnessDictionary';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProgramGenerated: () => void;
}

const MUSCLE_GROUPS: string[] = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];

const WEEK_DAYS = [
  { id: 'Sunday', labelAr: 'الأحد', labelEn: 'Sun' },
  { id: 'Monday', labelAr: 'الإثنين', labelEn: 'Mon' },
  { id: 'Tuesday', labelAr: 'الثلاثاء', labelEn: 'Tue' },
  { id: 'Wednesday', labelAr: 'الأربعاء', labelEn: 'Wed' },
  { id: 'Thursday', labelAr: 'الخميس', labelEn: 'Thu' },
  { id: 'Friday', labelAr: 'الجمعة', labelEn: 'Fri' },
  { id: 'Saturday', labelAr: 'السبت', labelEn: 'Sat' },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onProgramGenerated }) => {
  const { user, updateUserProfile, saveGeneratedProgram, language, t } = useWorkout();

  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Phase 1
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>(user.primaryGoal || 'Muscle Gain');
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(user.experience);

  // Phase 2
  const [trainingDays, setTrainingDays] = useState<string[]>([]);
  const [duration, setDuration] = useState<number>(user.preferredDurationMinutes || 60);
  const [preferredSplit, setPreferredSplit] = useState<string>('AZMK_DECIDE');
  const [startDayOption, setStartDayOption] = useState<'today' | 'tomorrow'>('today');

  // Phase 3
  const [equipment, setEquipment] = useState<string>('Full Gym');
  const [weightMethod, setWeightMethod] = useState<string>('BEGINNER');

  // Phase 4
  const [priorityMuscles, setPriorityMuscles] = useState<string[]>([]);
  const [avoidedExercisesInput, setAvoidedExercisesInput] = useState('');
  const [avoidedExercises, setAvoidedExercises] = useState<string[]>([]);
  const [cardioPreference, setCardioPreference] = useState<string>('AZMK_DECIDE');

  if (!isOpen) return null;

  const goalKeys: FitnessGoal[] = ['Muscle Gain', 'Strength', 'Fat Loss', 'General Fitness', 'Endurance', 'Mobility & Joint Health'];

  const toggleDay = (dayId: string) => {
    setTrainingDays(prev => prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]);
  };

  const hasConsecutiveDays = () => {
    if (trainingDays.length < 4) return false;
    let consecutiveCount = 0;
    let maxConsecutive = 0;
    for (let i = 0; i < 14; i++) {
      const day = WEEK_DAYS[i % 7].id;
      if (trainingDays.includes(day)) {
        consecutiveCount++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
      } else {
        consecutiveCount = 0;
      }
    }
    return maxConsecutive >= 4;
  };

  const handleAddAvoided = () => {
    if (avoidedExercisesInput.trim() && !avoidedExercises.includes(avoidedExercisesInput.trim())) {
      setAvoidedExercises(prev => [...prev, avoidedExercisesInput.trim()]);
      setAvoidedExercisesInput('');
    }
  };

  const removeAvoided = (ex: string) => {
    setAvoidedExercises(prev => prev.filter(e => e !== ex));
  };

  const toggleMuscle = (m: string) => {
    if (priorityMuscles.includes(m)) {
      setPriorityMuscles(prev => prev.filter(x => x !== m));
    } else {
      if (priorityMuscles.length < 3) {
        setPriorityMuscles(prev => [...prev, m]);
      }
    }
  };

  const handleFinishAndGenerate = async () => {
    if (trainingDays.length === 0) {
      alert(language === 'ar' ? 'يرجى اختيار يوم تدريب واحد على الأقل.' : 'Please select at least one training day.');
      return;
    }

    setIsGenerating(true);
    
    try {
      const generated = await generateAIProgram({
        goal: primaryGoal,
        experience,
        daysPerWeek: trainingDays.length,
        trainingDays,
        durationMinutes: duration,
        equipment,
        preferredSplit: preferredSplit === 'AZMK_DECIDE' ? undefined : preferredSplit,
        priorityMuscles: priorityMuscles.length > 0 ? priorityMuscles as MuscleGroup[] : 'AZMK_DECIDE',
        avoidedExercises,
        cardioPreference: cardioPreference === 'AZMK_DECIDE' ? undefined : cardioPreference,
        weightSelectionMethod: weightMethod
      });

      updateUserProfile({
        primaryGoal,
        experience,
        daysPerWeek: trainingDays.length,
        preferredDurationMinutes: duration,
        startDayOption,
        preferredSplit: preferredSplit === 'AZMK_DECIDE' ? undefined : preferredSplit,
        programStartDate: new Date().toISOString().split('T')[0]
      });

      saveGeneratedProgram(generated);
      onProgramGenerated();
      onClose();
    } catch (e) {
      console.error(e);
      alert('Failed to generate program. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-background-card border border-accent-emerald/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        
        {!isGenerating && (
          <button onClick={onClose} className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-white p-2 rounded-full bg-background-elevated">
            <X className="w-4 h-4" />
          </button>
        )}

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
          {[1, 2, 3, 4].map((num) => (
            <React.Fragment key={num}>
              <div className="flex items-center gap-1.5 flex-col sm:flex-row">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= num ? 'bg-accent-emerald text-black' : 'bg-background-elevated text-slate-400'}`}>
                  {num}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-300 font-semibold hidden sm:block">
                  {num === 1 ? (language === 'ar' ? 'الأساس' : 'Foundation') : 
                   num === 2 ? (language === 'ar' ? 'الجدول' : 'Schedule') : 
                   num === 3 ? (language === 'ar' ? 'البيئة' : 'Environment') : 
                   (language === 'ar' ? 'التخصيص' : 'Custom')}
                </span>
              </div>
              {num < 4 && <div className="h-0.5 flex-1 mx-2 bg-border" />}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 1: Foundation */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">{t('primaryGoalLabel')}</label>
              <div className="grid grid-cols-2 gap-2">
                {goalKeys.map(key => {
                  const term = FITNESS_GOALS_DICT[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPrimaryGoal(key)}
                      className={`p-3 rounded-xl border text-left rtl:text-right transition-all ${primaryGoal === key ? 'bg-accent-emerald/15 border-accent-emerald text-white' : 'bg-background-elevated border-border text-slate-300'}`}
                    >
                      <p className="font-bold text-xs">{language === 'ar' ? term.ar : term.en}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">{language === 'ar' ? 'مستوى الخبرة' : 'Experience Level'}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Beginner', ar: 'مبتدئ', en: 'Beginner' },
                  { id: 'Intermediate', ar: 'متوسط', en: 'Intermediate' },
                  { id: 'Advanced', ar: 'متقدم', en: 'Advanced' }
                ].map(lvl => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setExperience(lvl.id as any)}
                    className={`py-2.5 rounded-xl border text-xs font-bold text-center ${experience === lvl.id ? 'bg-accent-emerald text-black border-accent-emerald' : 'bg-background-elevated border-border text-slate-300'}`}
                  >
                    {language === 'ar' ? lvl.ar : lvl.en}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setStep(2)} className="w-full mt-4 py-3.5 rounded-xl bg-accent-emerald text-black font-extrabold text-sm flex items-center justify-center gap-2">
              <span>{t('nextScheduleBtn')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        )}

        {/* STEP 2: Schedule */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {language === 'ar' ? 'اختر أيام التدريب (التي يمكنك الالتزام بها واقعياً)' : 'Select Training Days (Be realistic)'}
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {WEEK_DAYS.map(day => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => toggleDay(day.id)}
                    className={`py-2 rounded-lg border text-xs font-bold text-center transition-all ${trainingDays.includes(day.id) ? 'bg-accent-emerald text-black border-accent-emerald' : 'bg-background-elevated border-border text-slate-400'}`}
                  >
                    {language === 'ar' ? day.labelAr : day.labelEn}
                  </button>
                ))}
              </div>
              {hasConsecutiveDays() && (
                <div className="mt-2 text-[10px] text-amber-400 bg-amber-400/10 p-2 rounded-lg border border-amber-400/20">
                  ⚠️ {language === 'ar' ? 'اخترت عدة أيام متتالية. سيأخذ AZMK الاستشفاء وتوزيع العضلات بعين الاعتبار عند بناء البرنامج.' : 'You selected many consecutive days. AZMK will prioritize recovery and muscle distribution accordingly.'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">{language === 'ar' ? 'كم تقريباً عندك وقت للتمرين؟' : 'Target Duration (minutes)'}</label>
              <div className="flex gap-2">
                {[30, 45, 60, 75, 90].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDuration(m)}
                    className={`flex-1 py-2 rounded-xl border font-mono font-bold text-xs ${duration === m ? 'bg-accent-cyan text-black border-accent-cyan' : 'bg-background-elevated border-border text-slate-300'}`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">{language === 'ar' ? 'نظام التقسيم (Split)' : 'Preferred Split'}</label>
              <select 
                value={preferredSplit} 
                onChange={e => setPreferredSplit(e.target.value)}
                className="w-full bg-background-elevated border border-border rounded-xl px-3 py-2.5 text-xs text-white"
              >
                <option value="AZMK_DECIDE">{language === 'ar' ? 'ما أعرف، خل AZMK يختار المناسب لي' : 'Let AZMK Decide'}</option>
                <option value="Push Pull Legs">Push / Pull / Legs</option>
                <option value="Upper Lower">Upper / Lower</option>
                <option value="Full Body">Full Body</option>
                <option value="Arnold Split">Arnold Split</option>
                <option value="Bro Split">Bro Split</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 font-mono">
                {language === 'ar' ? 'متى تريد بدء جدولك التدريبي؟' : 'When would you like to start?'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setStartDayOption('today')} className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${startDayOption === 'today' ? 'bg-accent-emerald text-black border-accent-emerald shadow-sm' : 'bg-background-elevated border-border text-slate-300'}`}>
                  {language === 'ar' ? '🟢 ابدأ اليوم (اليوم Day 1)' : '🟢 Start Today'}
                </button>
                <button type="button" onClick={() => setStartDayOption('tomorrow')} className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${startDayOption === 'tomorrow' ? 'bg-accent-cyan text-black border-accent-cyan shadow-sm' : 'bg-background-elevated border-border text-slate-300'}`}>
                  {language === 'ar' ? '🔵 ابدأ غداً (اليوم راحة)' : '🔵 Start Tomorrow'}
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep(1)} className="py-2.5 px-4 rounded-xl bg-background-elevated text-slate-300 text-xs font-bold border border-border">{t('backBtn')}</button>
              <button onClick={() => setStep(3)} className="flex-1 py-2.5 rounded-xl bg-accent-emerald text-black font-extrabold text-sm flex items-center justify-center gap-2">
                <span>{t('nextEquipmentBtn')}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Environment */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">{language === 'ar' ? 'بيئة التدريب والمعدات المتاحة' : 'Training Environment'}</label>
              <div className="space-y-2">
                {[
                  { id: 'Full Gym', title: language === 'ar' ? 'نادي كامل' : 'Full Gym', desc: language === 'ar' ? 'أجهزة، بارات، دامبلز، كيابل.' : 'Machines, Barbells, Dumbbells, Cables.' },
                  { id: 'Home Gym (Dumbbells & Bench)', title: language === 'ar' ? 'نادي منزلي (دامبلز وبنش)' : 'Home Gym', desc: language === 'ar' ? 'أوزان حرة فقط.' : 'Free weights only.' },
                  { id: 'Calisthenics', title: language === 'ar' ? 'كاليسثينكس / بوزن الجسم' : 'Calisthenics', desc: language === 'ar' ? 'بوزن الجسم، عقلة، رينقز.' : 'Bodyweight, Pull-up bar, Rings.' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setEquipment(item.id)}
                    className={`w-full p-3 rounded-xl border text-left rtl:text-right transition-all ${equipment === item.id ? 'bg-accent-emerald/15 border-accent-emerald text-white' : 'bg-background-elevated border-border text-slate-300'}`}
                  >
                    <p className="font-bold text-xs">{item.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">{language === 'ar' ? 'كيف تريد تحديد الأوزان؟' : 'Weight Selection Method'}</label>
              <div className="space-y-2">
                {[
                  { id: 'BEGINNER', title: language === 'ar' ? '🟢 مبتدئ / ما أعرف أوزاني' : 'Beginner / Don\'t know', desc: language === 'ar' ? 'ابدأ بوزن مريح وAZMK سيتعلم مستواك تدريجياً.' : 'Start comfortable, AZMK will learn your level.' },
                  { id: 'PREVIOUS', title: language === 'ar' ? '📊 استخدام أوزاني السابقة' : 'Use previous weights', desc: language === 'ar' ? 'إذا كنت سجلت أوزانك سابقاً.' : 'Based on historical data.' },
                  { id: 'RPE', title: language === 'ar' ? '🔥 RPE (للمتقدمين)' : 'RPE (Advanced)', desc: language === 'ar' ? 'تحديد الشدة بناءً على الجهد المبذول.' : 'Determine intensity by rate of perceived exertion.' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setWeightMethod(item.id)}
                    className={`w-full p-2.5 rounded-xl border text-left rtl:text-right transition-all ${weightMethod === item.id ? 'bg-accent-cyan/15 border-accent-cyan text-white' : 'bg-background-elevated border-border text-slate-300'}`}
                  >
                    <p className="font-bold text-xs">{item.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setStep(2)} className="py-2.5 px-4 rounded-xl bg-background-elevated text-slate-300 text-xs font-bold border border-border">{t('backBtn')}</button>
              <button onClick={() => setStep(4)} className="flex-1 py-2.5 rounded-xl bg-accent-emerald text-black font-extrabold text-sm flex items-center justify-center gap-2">
                <span>{language === 'ar' ? 'التالي: التخصيص' : 'Next: Customization'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Customization */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {language === 'ar' ? 'هل هناك عضلات تريد إعطاءها أولوية؟ (اختر حتى 3)' : 'Priority Muscles (Max 3)'}
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPriorityMuscles([])}
                  className={`py-1.5 px-3 rounded-lg border text-[11px] font-bold ${priorityMuscles.length === 0 ? 'bg-accent-indigo text-white border-accent-indigo' : 'bg-background-elevated border-border text-slate-300'}`}
                >
                  {language === 'ar' ? 'لا، برنامج متوازن / خل AZMK يقرر' : 'Balanced / Let AZMK Decide'}
                </button>
                {MUSCLE_GROUPS.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMuscle(m)}
                    className={`py-1.5 px-3 rounded-lg border text-[11px] font-bold ${priorityMuscles.includes(m) ? 'bg-accent-emerald text-black border-accent-emerald' : 'bg-background-elevated border-border text-slate-300'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {language === 'ar' ? 'هل هناك تمارين لا تريد إضافتها؟' : 'Exercises to avoid'}
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={avoidedExercisesInput}
                  onChange={e => setAvoidedExercisesInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddAvoided()}
                  placeholder={language === 'ar' ? 'مثال: Barbell Squat' : 'e.g. Deadlift'}
                  className="flex-1 bg-background-elevated border border-border rounded-xl px-3 py-2 text-xs text-white focus:border-accent-emerald outline-none"
                />
                <button type="button" onClick={handleAddAvoided} className="px-3 rounded-xl bg-background-elevated border border-border text-slate-300 text-xs font-bold">+</button>
              </div>
              {avoidedExercises.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {avoidedExercises.map(ex => (
                    <span key={ex} className="flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-md text-[10px] font-bold">
                      {ex} <button onClick={() => removeAvoided(ex)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">{language === 'ar' ? 'هل تريد إضافة تمارين كارديو؟' : 'Cardio Preference'}</label>
              <select 
                value={cardioPreference} 
                onChange={e => setCardioPreference(e.target.value)}
                className="w-full bg-background-elevated border border-border rounded-xl px-3 py-2.5 text-xs text-white"
              >
                <option value="AZMK_DECIDE">{language === 'ar' ? 'خل AZMK يقرر بناءً على هدفي' : 'Let AZMK Decide'}</option>
                <option value="No Cardio">{language === 'ar' ? 'لا، بدون كارديو' : 'No Cardio'}</option>
                <option value="1-2 Sessions/week">{language === 'ar' ? '1-2 مرات أسبوعياً' : '1-2 Sessions/week'}</option>
                <option value="3+ Sessions/week">{language === 'ar' ? '3+ مرات أسبوعياً' : '3+ Sessions/week'}</option>
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <button disabled={isGenerating} onClick={() => setStep(3)} className="py-3 px-4 rounded-xl bg-background-elevated text-slate-300 text-xs font-bold border border-border">{t('backBtn')}</button>
              <button 
                onClick={handleFinishAndGenerate} 
                disabled={isGenerating}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-accent-emerald to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>{language === 'ar' ? 'جاري بناء الخطة بذكاء...' : 'Synthesizing Plan...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-black" />
                    <span>{language === 'ar' ? 'توليد وتفعيل الخطة 🚀' : 'Generate & Activate'}</span>
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
