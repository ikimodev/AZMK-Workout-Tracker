import React, { useState } from 'react';
import { Sparkles, X, Check, Dumbbell, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { generateAIProgram } from '../../services/aiProgramGenerator';
import { FitnessGoal } from '../../types';

interface AIProgramGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProgramGenerated: () => void;
}

export const AIProgramGeneratorModal: React.FC<AIProgramGeneratorModalProps> = ({ 
  isOpen, 
  onClose, 
  onProgramGenerated 
}) => {
  const { saveGeneratedProgram, updateUserProfile, user, language } = useWorkout();

  const [goal, setGoal] = useState<FitnessGoal>(user.primaryGoal || 'Muscle Gain');
  const [secondaryGoal, setSecondaryGoal] = useState<FitnessGoal>(user.secondaryGoal || 'Strength');
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(user.experience || 'Intermediate');
  const [days, setDays] = useState(user.daysPerWeek || 4);
  const [duration, setDuration] = useState(user.preferredDurationMinutes || 60);
  const [equipment, setEquipment] = useState<'Full Gym' | 'Home Gym (Dumbbells & Bench)' | 'Bodyweight Only'>('Full Gym');
  const [startDayPref, setStartDayPref] = useState<'today' | 'tomorrow'>('today');
  const [restrictions, setRestrictions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const goalOptions: FitnessGoal[] = [
    'Muscle Gain',
    'Strength',
    'Fat Loss',
    'General Fitness',
    'Endurance',
    'Mobility & Joint Health'
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 600));

    const program = generateAIProgram({
      goal,
      secondaryGoal,
      experience,
      daysPerWeek: days,
      durationMinutes: duration,
      equipment,
      restrictions
    });

    saveGeneratedProgram(program);
    updateUserProfile({
      startDayOption: startDayPref,
      programStartDate: new Date().toISOString().split('T')[0]
    });
    setIsGenerating(false);
    onProgramGenerated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-background-card border border-accent-indigo/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-background-elevated"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-accent-indigo/20 border border-accent-indigo/40 flex items-center justify-center text-accent-indigo shadow-glow-indigo">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-accent-indigo">AI PERIODIZATION ARCHITECT</span>
            <h2 className="text-xl font-bold text-white">Generate 4-Week Program</h2>
          </div>
        </div>

        <div className="space-y-4">
          
          {/* Primary Goal Selector */}
          <div>
            <label className="block text-xs font-semibold text-accent-emerald mb-1.5 uppercase font-mono">
              1. Primary Fitness Goal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {goalOptions.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                    goal === g
                      ? 'bg-accent-emerald/20 border-accent-emerald text-white shadow-glow-sm'
                      : 'bg-background-elevated border-border text-slate-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Goal Selector */}
          <div>
            <label className="block text-xs font-semibold text-accent-cyan mb-1.5 uppercase font-mono">
              2. Secondary Fitness Goal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {goalOptions.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setSecondaryGoal(g)}
                  className={`p-2 rounded-xl border text-xs font-semibold text-left transition-all ${
                    secondaryGoal === g
                      ? 'bg-accent-cyan/20 border-accent-cyan text-white shadow-sm'
                      : 'bg-background-elevated border-border text-slate-300'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Days Per Week (2, 3, 4, 5, 6 days) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Workouts per Week: <span className="text-accent-emerald font-mono font-bold">{days} Days</span>
              <span className="text-[11px] text-slate-400 font-normal ml-2">
                ({days === 2 ? 'Upper / Lower' : days === 3 ? 'Full Body A/B/C' : days === 4 ? '4-Day Split' : days === 5 ? '5-Day PPL+Upper/Lower' : '6-Day PPL×2'})
              </span>
            </label>
            <div className="flex gap-2">
              {[2, 3, 4, 5, 6].map(d => (
                <button
                  key={d}
                  type="button"
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

          {/* Experience & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Experience Level</label>
              <div className="grid grid-cols-3 gap-1.5">
                {['Beginner', 'Intermediate', 'Advanced'].map(exp => (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => setExperience(exp as any)}
                    className={`py-2 rounded-xl border text-xs font-bold text-center transition-all ${
                      experience === exp
                        ? 'bg-accent-indigo text-white border-accent-indigo'
                        : 'bg-background-elevated border-border text-slate-300'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Workout Duration</label>
              <select
                value={duration}
                onChange={e => setDuration(parseInt(e.target.value, 10))}
                className="w-full py-2 px-3 bg-background-elevated border border-border rounded-xl text-white text-xs font-medium focus:outline-none focus:border-accent-indigo"
              >
                <option value={45}>45 Minutes (High Intensity)</option>
                <option value={60}>60 Minutes (Standard)</option>
                <option value={75}>75 Minutes (Hypertrophy)</option>
                <option value={90}>90 Minutes (High Volume)</option>
              </select>
            </div>
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Available Equipment</label>
            <select
              value={equipment}
              onChange={e => setEquipment(e.target.value as any)}
              className="w-full py-2.5 px-3 bg-background-elevated border border-border rounded-xl text-white text-xs font-medium focus:outline-none focus:border-accent-indigo"
            >
              <option value="Full Gym">Full Commercial Gym (Barbells, Cables, Dumbbells, Machines)</option>
              <option value="Home Gym (Dumbbells & Bench)">Home Gym (Adjustable Dumbbells, Bench & Pull-up Bar)</option>
              <option value="Bodyweight Only">Bodyweight / Calisthenics Only</option>
            </select>
          </div>

          {/* Restrictions / Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Custom Restrictions or Focus (Optional)
            </label>
            <input
              type="text"
              value={restrictions}
              onChange={e => setRestrictions(e.target.value)}
              placeholder="e.g. Focus on chest & back, avoid lower back strain"
              className="w-full px-4 py-2 bg-background-elevated border border-border rounded-xl text-white text-xs font-medium focus:outline-none focus:border-accent-indigo"
            />
          </div>

          {/* Start Day Preference: Today vs Tomorrow */}
          <div className="p-3.5 rounded-2xl bg-background-elevated border border-border space-y-2">
            <label className="block text-xs font-bold text-slate-300 font-mono">
              {language === 'ar' ? 'متى تريد بدء خطتك التدريبية؟' : 'When would you like to start your routine?'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStartDayPref('today')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  startDayPref === 'today'
                    ? 'bg-accent-emerald text-black border-accent-emerald shadow-sm font-extrabold'
                    : 'bg-background-card text-slate-300 border-border hover:border-slate-600'
                }`}
              >
                {language === 'ar' ? '🟢 ابدأ اليوم (Day 1 اليوم)' : '🟢 Start Today'}
              </button>

              <button
                type="button"
                onClick={() => setStartDayPref('tomorrow')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  startDayPref === 'tomorrow'
                    ? 'bg-accent-cyan text-black border-accent-cyan shadow-sm font-extrabold'
                    : 'bg-background-card text-slate-300 border-border hover:border-slate-600'
                }`}
              >
                {language === 'ar' ? '🔵 ابدأ غداً (اليوم راحة)' : '🔵 Start Tomorrow'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-accent-indigo to-indigo-600 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-indigo transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing 4-Week Periodized Plan...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Generate 4-Week Program ({days} Days/Week)</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
