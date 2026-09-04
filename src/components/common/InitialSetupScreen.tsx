import React, { useState } from 'react';
import { ArrowLeft, Check, Dumbbell, Zap } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { generateAIProgram } from '../../services/aiProgramGenerator';
import { FitnessGoal, Equipment } from '../../types';
import { trackUserSession } from '../../services/analyticsService';
import { EquipmentImage } from './EquipmentImage';
import { ScrollPicker } from './ScrollPicker';
import { FITNESS_GOALS_DICT } from '../../i18n/fitnessDictionary';

const EQUIPMENT_CATEGORIES = [
  {
    title: 'Weights and Bars',
    items: ['Dumbbell', 'Barbell', 'Plate', 'Kettlebell', 'EZ Bar', 'Landmine', 'Trap Bar']
  },
  {
    title: 'Benches and Racks',
    items: ['Pull Up Bar', 'Squat Rack', 'Flat Bench', 'Adjustable Bench', 'Dip Bar']
  },
  {
    title: 'Machines',
    items: ['Single Cable Machine', 'Dual Cable Machine', 'Lat Pulldown Cable', 'Leg Press Machine', 'Smith Machine', 'T-bar', 'Stack Machines', 'Plate Machines']
  },
  {
    title: 'Cardio',
    items: ['Treadmill', 'Rowing Machine', 'Spinning', 'Elliptical Trainer', 'Stair Machine', 'Air Bike']
  },
  {
    title: 'Other',
    items: ['Suspension Band', 'Resistance Band', 'Battle Rope', 'Rings', 'Jump Rope', 'Medicine Ball', 'Other']
  }
];

const DEFAULT_FULL_GYM = EQUIPMENT_CATEGORIES.flatMap(c => c.items);
const DEFAULT_HOME_GYM = ['Dumbbell', 'Barbell', 'Plate', 'Kettlebell', 'Pull Up Bar', 'Squat Rack', 'Flat Bench', 'Adjustable Bench', 'Dip Bar', 'Resistance Band', 'Jump Rope'];
const DEFAULT_BODYWEIGHT = ['Pull Up Bar', 'Dip Bar', 'Suspension Band', 'Resistance Band', 'Rings', 'Jump Rope'];

const MUSCLE_GROUPS: string[] = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];

interface InitialSetupScreenProps {
  onComplete: () => void;
}

export const InitialSetupScreen: React.FC<InitialSetupScreenProps> = ({ onComplete }) => {
  const { updateUserProfile, saveGeneratedProgram, user } = useWorkout();

  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 13;

  // Form State
  const [name, setName] = useState(user.name === 'Kareem Al-Otaibi' ? '' : user.name);
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>('Muscle Gain');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [heightCm, setHeightCm] = useState<number>(175);
  const [heightInches, setHeightInches] = useState<number>(69);

  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [weightKg, setWeightKg] = useState<number>(75);
  const [weightLbs, setWeightLbs] = useState<number>(165);

  const [age, setAge] = useState<string>('');
  
  const [hasPlan, setHasPlan] = useState<boolean | null>(null);
  const [priorityMuscles, setPriorityMuscles] = useState<string[]>([]);
  const [duration, setDuration] = useState(60);
  const [days, setDays] = useState(4);
  const [equipmentPreset, setEquipmentPreset] = useState<'Full Gym' | 'Home Gym' | 'Bodyweight' | ''>('');
  const [detailedEquipment, setDetailedEquipment] = useState<string[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);

  const goalKeys: FitnessGoal[] = [
    'Muscle Gain',
    'Fat Loss',
    'Strength',
    'General Fitness',
    'Endurance',
    'Mobility & Joint Health'
  ];

  const handleNext = () => {
    if (step === 1 && !name.trim()) setName('Athlete');
    
    // Skip remaining steps if user already has a plan
    if (step === 8 && hasPlan === true) {
      handleFinish(true);
      return;
    }

    if (step < TOTAL_STEPS) {
      setStep(prev => prev + 1);
    } else {
      handleFinish(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleFinish = async (skipGeneration: boolean) => {
    setIsGenerating(true);
    
    let finalHeight = undefined;
    if (heightUnit === 'cm') {
      finalHeight = heightCm;
    } else if (heightUnit === 'ft') {
      finalHeight = Math.round(heightInches * 2.54);
    }

    let finalWeight = undefined;
    if (weightUnit === 'kg') {
      finalWeight = weightKg;
    } else {
      finalWeight = Math.round(weightLbs * 0.453592);
    }

    let finalEquipment = detailedEquipment;
    if (detailedEquipment.length === 0) {
      if (equipmentPreset === 'Full Gym') finalEquipment = DEFAULT_FULL_GYM;
      else if (equipmentPreset === 'Home Gym') finalEquipment = DEFAULT_HOME_GYM;
      else if (equipmentPreset === 'Bodyweight') finalEquipment = DEFAULT_BODYWEIGHT;
      else finalEquipment = DEFAULT_FULL_GYM; // fallback
    }

    const finalName = name.trim() || 'Athlete';

    updateUserProfile({
      name: finalName,
      gender: gender as any || undefined,
      age: age ? Number(age) : undefined,
      weight: finalWeight,
      height: finalHeight,
      experience,
      primaryGoal,
      secondaryGoal: 'Strength', // Fallback secondary
      daysPerWeek: days,
      preferredDurationMinutes: duration,
      availableEquipment: finalEquipment as Equipment[],
      tier: 'free',
      role: 'user',
      isDemoUser: false,
      startingBaselineOption: 'beginner_rpe',
      streakDays: 0,
      hasCompletedOnboarding: true,
      startDayOption: 'today',
      programStartDate: new Date().toISOString().split('T')[0],
      email: `${finalName.toLowerCase().replace(/\s+/g, '')}@azmk.fit`,
    });

    if (!skipGeneration) {
      try {
        const generated = await generateAIProgram({
          goal: primaryGoal,
          secondaryGoal: 'Strength',
          experience,
          daysPerWeek: days,
          durationMinutes: duration,
          equipment: equipmentPreset || 'Full Gym',
          priorityMuscles: priorityMuscles.length > 0 ? (priorityMuscles as any) : 'AZMK_DECIDE',
          avoidedExercises: []
        });
        saveGeneratedProgram(generated);
      } catch (err) {
        console.error("Failed to generate AI program:", err);
      }
    }

    trackUserSession(finalName);
    setIsGenerating(false);
    onComplete();
  };

  const toggleMuscle = (m: string) => {
    if (priorityMuscles.includes(m)) {
      setPriorityMuscles(prev => prev.filter(x => x !== m));
    } else if (priorityMuscles.length < 3) {
      setPriorityMuscles(prev => [...prev, m]);
    }
  };

  const progressPercentage = (step / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 flex flex-col font-sans selection:bg-accent-emerald selection:text-black">
      
      {/* Top Progress Bar Area */}
      <div className="pt-6 px-4 pb-2 sticky top-0 bg-[#0A0A0B] z-20">
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button onClick={handleBack} className="p-2 rounded-full hover:bg-white/5 active:scale-95 transition-all text-slate-300">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
            <div 
              className="h-full bg-accent-emerald transition-all duration-500 ease-out shadow-[0_0_10px_rgba(52,211,153,0.5)]" 
              style={{ width: `${progressPercentage}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col px-6 pt-8 pb-32 max-w-xl mx-auto w-full animate-fade-in">
        
        {step === 1 && (
          <div className="space-y-6 animate-slide-up">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-emerald to-emerald-600 flex items-center justify-center shadow-glow-sm">
                <span className="text-3xl">👋</span>
              </div>
              <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-tl-none border border-white/5">
                <p className="text-sm font-bold">What should we call you?</p>
              </div>
            </div>
            
            <h1 className="text-3xl font-black tracking-tight">What's your name?</h1>
            
            <div className="relative mt-8">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-lg font-bold placeholder:text-white/20 focus:outline-none focus:border-accent-emerald focus:bg-white/10 transition-all"
                autoFocus
              />
            </div>
            <p className="text-sm text-slate-400 mt-4">You can change your name later in your profile</p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-3xl font-black tracking-tight mb-2">Experience Level</h1>
            <p className="text-slate-400 mb-8">How long have you been training consistently?</p>
            
            <div className="space-y-3">
              {[
                { id: 'Beginner', title: 'Beginner', desc: '0 - 6 months of training' },
                { id: 'Intermediate', title: 'Intermediate', desc: '6 months - 3 years' },
                { id: 'Advanced', title: 'Advanced', desc: '3+ years of serious training' }
              ].map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => { setExperience(lvl.id as any); handleNext(); }}
                  className={`w-full p-5 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                    experience === lvl.id 
                      ? 'bg-accent-emerald/20 border-accent-emerald ring-1 ring-accent-emerald' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <h3 className={`text-lg font-bold ${experience === lvl.id ? 'text-accent-emerald' : 'text-white'}`}>{lvl.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{lvl.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-3xl font-black tracking-tight mb-2">Your Top Fitness Goal</h1>
            <p className="text-slate-400 mb-8">What are you primarily trying to achieve?</p>
            
            <div className="grid gap-3">
              {goalKeys.map(key => (
                <button
                  key={key}
                  onClick={() => { setPrimaryGoal(key); handleNext(); }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all active:scale-[0.98] flex items-center justify-between ${
                    primaryGoal === key 
                      ? 'bg-accent-emerald/20 border-accent-emerald ring-1 ring-accent-emerald' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className={`text-base font-bold ${primaryGoal === key ? 'text-accent-emerald' : 'text-white'}`}>
                    {FITNESS_GOALS_DICT[key].en}
                  </span>
                  {primaryGoal === key && <Check className="w-5 h-5 text-accent-emerald" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-3xl font-black tracking-tight mb-2">Gender</h1>
            <p className="text-slate-400 mb-8">This helps us calculate your caloric and strength baselines more accurately.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => { setGender('male'); handleNext(); }}
                className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all active:scale-95 ${
                  gender === 'male' ? 'bg-[#007AFF]/20 border-[#007AFF] ring-1 ring-[#007AFF]' : 'bg-white/5 border-white/10'
                }`}
              >
                <span className="text-4xl">👨</span>
                <span className="font-bold text-lg">Male</span>
              </button>
              <button
                onClick={() => { setGender('female'); handleNext(); }}
                className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all active:scale-95 ${
                  gender === 'female' ? 'bg-[#FF2D55]/20 border-[#FF2D55] ring-1 ring-[#FF2D55]' : 'bg-white/5 border-white/10'
                }`}
              >
                <span className="text-4xl">👩</span>
                <span className="font-bold text-lg">Female</span>
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-3xl font-black tracking-tight mb-8">Height</h1>
            
            <div className="flex bg-white/5 p-1 rounded-xl mb-8">
              <button 
                onClick={() => setHeightUnit('cm')} 
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${heightUnit === 'cm' ? 'bg-white/20 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                cm
              </button>
              <button 
                onClick={() => setHeightUnit('ft')} 
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${heightUnit === 'ft' ? 'bg-white/20 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                ft / in
              </button>
            </div>

            {heightUnit === 'cm' ? (
              <div className="flex items-center justify-between mt-8 relative bg-white/5 rounded-3xl border border-white/10 p-6 overflow-hidden">
                <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                  <div className="text-[80px] font-black tracking-tighter leading-none text-white">
                    {heightCm}<span className="text-2xl text-slate-400 font-bold ml-2">cm</span>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setHeightCm(prev => Math.max(90, prev - 1))}
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold flex items-center justify-center transition-all text-xl"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeightCm(prev => Math.min(230, prev + 1))}
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold flex items-center justify-center transition-all text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="w-24">
                  <ScrollPicker
                    min={90}
                    max={230}
                    value={heightCm}
                    onChange={setHeightCm}
                    orientation="vertical"
                    majorTickInterval={10}
                    mediumTickInterval={5}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-8 relative bg-white/5 rounded-3xl border border-white/10 p-6 overflow-hidden">
                <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                  <div className="text-[80px] font-black tracking-tighter leading-none text-white flex items-baseline">
                    {Math.floor(heightInches / 12)}<span className="text-4xl text-slate-400 ml-1 mr-3">'</span>
                    {heightInches % 12}<span className="text-4xl text-slate-400 ml-1">"</span>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setHeightInches(prev => Math.max(36, prev - 1))}
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold flex items-center justify-center transition-all text-xl"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeightInches(prev => Math.min(90, prev + 1))}
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold flex items-center justify-center transition-all text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="w-24">
                  <ScrollPicker
                    min={36}
                    max={90}
                    value={heightInches}
                    onChange={setHeightInches}
                    orientation="vertical"
                    majorTickInterval={12}
                    mediumTickInterval={6}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-3xl font-black tracking-tight mb-8">Weight</h1>
            
            <div className="flex bg-white/5 p-1 rounded-xl mb-8">
              <button 
                onClick={() => setWeightUnit('kg')} 
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${weightUnit === 'kg' ? 'bg-white/20 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                kg
              </button>
              <button 
                onClick={() => setWeightUnit('lbs')} 
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${weightUnit === 'lbs' ? 'bg-white/20 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                lbs
              </button>
            </div>

            {weightUnit === 'kg' ? (
              <div className="flex items-center justify-between mt-8 relative bg-white/5 rounded-3xl border border-white/10 p-6 overflow-hidden">
                <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                  <div className="text-[80px] font-black tracking-tighter leading-none text-white">
                    {weightKg}<span className="text-2xl text-slate-400 font-bold ml-2">kg</span>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setWeightKg(prev => Math.max(30, prev - 1))}
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold flex items-center justify-center transition-all text-xl"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeightKg(prev => Math.min(200, prev + 1))}
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold flex items-center justify-center transition-all text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="w-24">
                  <ScrollPicker
                    min={30}
                    max={200}
                    value={weightKg}
                    onChange={setWeightKg}
                    orientation="vertical"
                    majorTickInterval={10}
                    mediumTickInterval={5}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-8 relative bg-white/5 rounded-3xl border border-white/10 p-6 overflow-hidden">
                <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                  <div className="text-[80px] font-black tracking-tighter leading-none text-white">
                    {weightLbs}<span className="text-2xl text-slate-400 font-bold ml-2">lbs</span>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setWeightLbs(prev => Math.max(60, prev - 1))}
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold flex items-center justify-center transition-all text-xl"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setWeightLbs(prev => Math.min(400, prev + 1))}
                      className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold flex items-center justify-center transition-all text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="w-24">
                  <ScrollPicker
                    min={60}
                    max={400}
                    value={weightLbs}
                    onChange={setWeightLbs}
                    orientation="vertical"
                    majorTickInterval={10}
                    mediumTickInterval={5}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-3xl font-black tracking-tight mb-2">Age</h1>
            <p className="text-slate-400 mb-8">Used to personalize your progression.</p>
            
            <div className="relative">
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="e.g. 25"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-2xl font-bold focus:outline-none focus:border-accent-emerald transition-all"
                autoFocus
              />
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Years</span>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-3xl font-black tracking-tight mb-2">Do you have a workout plan?</h1>
            <p className="text-slate-400 mb-8">We can build a 4-week custom periodized program for you instantly.</p>
            
            <div className="space-y-4">
              <button
                onClick={() => { setHasPlan(true); }}
                className={`w-full p-5 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                  hasPlan === true ? 'bg-white/20 border-white' : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <h3 className="text-lg font-bold text-white">Yes, I have one</h3>
                <p className="text-sm text-slate-400 mt-1">Skip setup and go directly to the app.</p>
              </button>

              <button
                onClick={() => { setHasPlan(false); handleNext(); }}
                className={`w-full p-5 rounded-2xl border text-left transition-all active:scale-[0.98] flex items-center justify-between ${
                  hasPlan === false ? 'bg-accent-emerald/20 border-accent-emerald ring-1 ring-accent-emerald' : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div>
                  <h3 className="text-lg font-bold text-white">No, I want one (AI Program)</h3>
                  <p className="text-sm text-slate-400 mt-1">Answer a few more questions to get a tailored plan.</p>
                </div>
                <Zap className="w-6 h-6 text-accent-emerald flex-shrink-0" />
              </button>
            </div>
          </div>
        )}

        {step === 9 && (
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-3xl font-black tracking-tight mb-2">Priority Muscles</h1>
            <p className="text-slate-400 mb-8">Select up to 3 muscles you want to focus on growing.</p>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => { setPriorityMuscles([]); handleNext(); }}
                className={`py-3 px-5 rounded-xl border font-bold transition-all ${priorityMuscles.length === 0 ? 'bg-accent-emerald text-black border-accent-emerald' : 'bg-white/5 border-white/10 text-white'}`}
              >
                Balanced
              </button>
              {MUSCLE_GROUPS.map(m => (
                <button
                  key={m}
                  onClick={() => toggleMuscle(m)}
                  className={`py-3 px-5 rounded-xl border font-bold transition-all ${priorityMuscles.includes(m) ? 'bg-accent-emerald text-black border-accent-emerald shadow-glow-sm' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 10 && (
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-3xl font-black tracking-tight mb-2">Session Duration</h1>
            <p className="text-slate-400 mb-8">How much time do you have per workout?</p>
            
            <div className="grid gap-3">
              {[
                { val: 45, label: '45 Minutes', desc: 'Fast & Intense' },
                { val: 60, label: '60 Minutes', desc: 'Standard' },
                { val: 75, label: '75 Minutes', desc: 'Hypertrophy Focus' },
                { val: 90, label: '90 Minutes', desc: 'High Volume' }
              ].map(d => (
                <button
                  key={d.val}
                  onClick={() => { setDuration(d.val); handleNext(); }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                    duration === d.val 
                      ? 'bg-accent-emerald/20 border-accent-emerald ring-1 ring-accent-emerald' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <h3 className={`text-lg font-bold ${duration === d.val ? 'text-accent-emerald' : 'text-white'}`}>{d.label}</h3>
                  <p className="text-sm text-slate-400 mt-1">{d.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 11 && (
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-3xl font-black tracking-tight mb-2">Workout Days Per Week</h1>
            <p className="text-slate-400 mb-8">How many days can you commit to training?</p>
            
            <div className="grid gap-3">
              {[2, 3, 4, 5, 6].map(d => (
                <button
                  key={d}
                  onClick={() => { setDays(d); handleNext(); }}
                  className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all active:scale-[0.98] ${
                    days === d 
                      ? 'bg-accent-emerald/20 border-accent-emerald ring-1 ring-accent-emerald' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className={`text-lg font-bold ${days === d ? 'text-accent-emerald' : 'text-white'}`}>{d} Days</span>
                  {days === d && <Check className="w-5 h-5 text-accent-emerald" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 12 && (
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-3xl font-black tracking-tight mb-2">Equipment Selection</h1>
            <p className="text-slate-400 mb-6">Select your primary equipment availability.</p>
            
            <div className="space-y-3 mb-8">
              {[
                { id: 'Full Gym', title: 'Full Gym', desc: 'Barbells, cables, machines, dumbbells' },
                { id: 'Home Gym', title: 'Home Gym', desc: 'Dumbbells, bench, pull-up bar' },
                { id: 'Bodyweight', title: 'Calisthenics', desc: 'Bodyweight only' }
              ].map(eq => (
                <button
                  key={eq.id}
                  onClick={() => setEquipmentPreset(eq.id as any)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                    equipmentPreset === eq.id 
                      ? 'bg-accent-emerald/20 border-accent-emerald ring-1 ring-accent-emerald' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <h3 className={`text-lg font-bold ${equipmentPreset === eq.id ? 'text-accent-emerald' : 'text-white'}`}>{eq.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{eq.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 13 && (
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-3xl font-black tracking-tight mb-2">Personalize Equipment</h1>
            <p className="text-slate-400 mb-6">Select the exact equipment you have access to.</p>
            
            <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
              {EQUIPMENT_CATEGORIES.map(category => (
                <div key={category.title}>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{category.title}</h3>
                  <div className="space-y-2">
                    {category.items.map(item => {
                      const isChecked = detailedEquipment.includes(item) || 
                        (detailedEquipment.length === 0 && (
                          (equipmentPreset === 'Full Gym' && DEFAULT_FULL_GYM.includes(item)) ||
                          (equipmentPreset === 'Home Gym' && DEFAULT_HOME_GYM.includes(item)) ||
                          (equipmentPreset === 'Bodyweight' && DEFAULT_BODYWEIGHT.includes(item))
                        ));
                      
                      return (
                        <button
                          key={item}
                          onClick={() => {
                            if (detailedEquipment.length === 0) {
                              let base = equipmentPreset === 'Full Gym' ? DEFAULT_FULL_GYM : equipmentPreset === 'Home Gym' ? DEFAULT_HOME_GYM : DEFAULT_BODYWEIGHT;
                              if (isChecked) setDetailedEquipment(base.filter(e => e !== item));
                              else setDetailedEquipment([...base, item]);
                            } else {
                              if (isChecked) setDetailedEquipment(prev => prev.filter(e => e !== item));
                              else setDetailedEquipment(prev => [...prev, item]);
                            }
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <EquipmentImage name={item} className="w-10 h-10 shadow-md ring-1 ring-white/10" />
                            <span className="text-sm font-bold text-slate-200">{item}</span>
                          </div>
                          <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                            isChecked ? 'bg-accent-emerald border-accent-emerald' : 'border-slate-500'
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B] to-transparent z-20 pb-8">
        <div className="max-w-xl mx-auto flex gap-3">
          {(step === 1 || step === 4 || step === 5 || step === 6 || step === 7 || step === 9 || step === 12) && (
             <button
               onClick={handleNext}
               className="flex-1 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-lg transition-all active:scale-[0.98]"
             >
               Skip
             </button>
          )}

          {step === 13 ? (
            <button
              onClick={() => handleFinish(false)}
              disabled={isGenerating}
              className="flex-1 py-4 rounded-2xl bg-accent-emerald text-black font-black text-lg transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2 shadow-glow-sm"
            >
              {isGenerating ? (
                <span>Generating Program...</span>
              ) : (
                <>
                  <span>Create AI Program</span>
                  <Zap className="w-5 h-5 fill-black" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={step === 12 && !equipmentPreset}
              className="flex-[2] py-4 rounded-2xl bg-white text-black font-black text-lg transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
            >
              Next
            </button>

          )}
        </div>
      </div>
      
    </div>
  );
};
