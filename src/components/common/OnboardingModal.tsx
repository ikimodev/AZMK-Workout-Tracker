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
  const { user, updateUserProfile, saveGeneratedProgram } = useWorkout();

  const [step, setStep] = useState(1);
  const [name, setName] = useState(user.name);
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>(user.primaryGoal || 'Muscle Gain');
  const [secondaryGoal, setSecondaryGoal] = useState<FitnessGoal>(user.secondaryGoal || 'Strength');
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(user.experience);
  const [days, setDays] = useState(user.daysPerWeek);
  const [duration, setDuration] = useState(user.preferredDurationMinutes);
  const [equipment, setEquipment] = useState<'Full Gym' | 'Home Gym (Dumbbells & Bench)' | 'Bodyweight Only'>('Full Gym');

  if (!isOpen) return null;

  const goalOptions: { id: FitnessGoal; title: string; desc: string }[] = [
    { id: 'Muscle Gain', title: 'Muscle Gain (Hypertrophy)', desc: 'Maximize muscle size & aesthetics' },
    { id: 'Strength', title: 'Strength & Power', desc: 'Heavy compounds & PR records' },
    { id: 'Fat Loss', title: 'Fat Loss & Leanness', desc: 'Caloric burn with high intensity' },
    { id: 'General Fitness', title: 'General Fitness', desc: 'Overall health & longevity' },
    { id: 'Endurance', title: 'Endurance & Work Capacity', desc: 'Stamina & high rep density' },
    { id: 'Mobility & Joint Health', title: 'Mobility & Joint Health', desc: 'Flexibility & injury resilience' },
  ];

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
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-background-elevated"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-accent-emerald' : 'bg-background-elevated'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-accent-emerald' : 'bg-background-elevated'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-accent-emerald' : 'bg-background-elevated'}`} />
        </div>

        {/* STEP 1: Name & Goals (Primary & Secondary) */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase font-extrabold text-accent-emerald tracking-wider">Step 1 of 3</span>
              <h2 className="text-2xl font-black text-white mt-1">What are your fitness goals?</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-background-elevated border border-border rounded-xl text-white font-medium focus:outline-none focus:border-accent-emerald"
                placeholder="e.g. Kareem"
              />
            </div>

            {/* Primary Goal */}
            <div>
              <label className="block text-xs font-semibold text-accent-emerald mb-1.5 uppercase font-mono">
                1. Primary Fitness Goal (Main Priority)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {goalOptions.slice(0, 4).map(item => (
                  <button
                    key={item.id}
                    onClick={() => setPrimaryGoal(item.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
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
            <div className="pt-1">
              <label className="block text-xs font-semibold text-accent-cyan mb-1.5 uppercase font-mono">
                2. Secondary Fitness Goal (Supporting Focus)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {goalOptions.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSecondaryGoal(item.id)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      secondaryGoal === item.id
                        ? 'bg-accent-cyan/20 border-accent-cyan text-white shadow-sm'
                        : 'bg-background-elevated border-border text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <p className="font-bold text-xs text-white">{item.title}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 py-3 rounded-xl bg-accent-emerald hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all"
            >
              <span>Continue to Schedule</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Experience & Schedule */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase font-extrabold text-accent-emerald tracking-wider">Step 2 of 3</span>
              <h2 className="text-2xl font-black text-white mt-1">Experience & Schedule</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Training Experience</label>
              <div className="grid grid-cols-3 gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setExperience(lvl as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      experience === lvl
                        ? 'bg-accent-emerald text-black border-accent-emerald'
                        : 'bg-background-elevated border-border text-slate-300'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Workouts per Week: <span className="text-accent-emerald font-mono font-bold">{days} Days ({days === 2 ? 'Upper/Lower' : days === 3 ? 'Full Body' : days === 4 ? 'Upper/Lower Split' : days === 5 ? 'PPL + Upper/Lower' : 'PPL × 2'})</span>
              </label>
              <div className="flex gap-2">
                {[2, 3, 4, 5, 6].map(d => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    className={`flex-1 py-2.5 rounded-xl border font-mono font-bold text-sm transition-all ${
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
              <label className="block text-xs font-semibold text-slate-400 mb-2">
                Session Duration: <span className="text-accent-emerald font-mono font-bold">{duration} min</span>
              </label>
              <div className="flex gap-2">
                {[45, 60, 75, 90].map(m => (
                  <button
                    key={m}
                    onClick={() => setDuration(m)}
                    className={`flex-1 py-2 rounded-xl border font-mono font-semibold text-xs transition-all ${
                      duration === m
                        ? 'bg-accent-indigo text-white border-accent-indigo'
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
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-xl bg-background-elevated text-slate-300 text-sm font-semibold border border-border"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-xl bg-accent-emerald hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Equipment & 4-Week Program Generation */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase font-extrabold text-accent-emerald tracking-wider">Step 3 of 3</span>
              <h2 className="text-2xl font-black text-white mt-1">Available Equipment</h2>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'Full Gym', title: 'Full Commercial Gym', desc: 'Barbells, dumbbells, cables, machines' },
                { id: 'Home Gym (Dumbbells & Bench)', title: 'Home Gym (Dumbbells & Bench)', desc: 'Adjustable dumbbells, bench & pull-up bar' },
                { id: 'Bodyweight Only', title: 'Bodyweight & Calisthenics', desc: 'No equipment needed' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setEquipment(item.id as any)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
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

            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-accent-indigo/20 to-accent-emerald/20 border border-accent-indigo/40 flex items-center gap-3 mt-4">
              <Zap className="w-6 h-6 text-accent-emerald shrink-0" />
              <div className="text-xs text-slate-200">
                <strong className="text-accent-emerald font-bold">4-Week Program Architecture:</strong>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Generates an exact <strong>4-week</strong> periodized routine with progressive overload targets for <strong>{days} days/week</strong> ({primaryGoal} + {secondaryGoal}).
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-4 rounded-xl bg-background-elevated text-slate-300 text-sm font-semibold border border-border"
              >
                Back
              </button>
              <button
                onClick={handleFinishAndGenerate}
                className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-accent-emerald to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-sm flex items-center justify-center gap-2 shadow-glow-md transition-all"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                <span>Generate My 4-Week Program</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
