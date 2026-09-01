import React, { useState } from 'react';
import { Sparkles, X, Zap, ArrowRight } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { generateAIProgram } from '../../services/aiProgramGenerator';
import { FitnessGoal, MuscleGroup } from '../../types';

interface AIProgramGeneratorModalProps {
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

export const AIProgramGeneratorModal: React.FC<AIProgramGeneratorModalProps> = ({ 
  isOpen, 
  onClose, 
  onProgramGenerated 
}) => {
  const { saveGeneratedProgram, updateUserProfile, user, language } = useWorkout();

  const [goal, setGoal] = useState<FitnessGoal>(user.primaryGoal || 'Muscle Gain');
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(user.experience || 'Intermediate');
  const [trainingDays, setTrainingDays] = useState<string[]>([]);
  const [duration, setDuration] = useState(user.preferredDurationMinutes || 60);
  const [equipment, setEquipment] = useState('Full Gym');
  const [preferredSplit, setPreferredSplit] = useState<string>('AZMK_DECIDE');
  const [weightMethod, setWeightMethod] = useState<string>('BEGINNER');
  const [priorityMuscles, setPriorityMuscles] = useState<string[]>([]);
  const [avoidedExercisesInput, setAvoidedExercisesInput] = useState('');
  const [avoidedExercises, setAvoidedExercises] = useState<string[]>([]);
  const [cardioPreference, setCardioPreference] = useState<string>('AZMK_DECIDE');
  const [startDayPref, setStartDayPref] = useState<'today' | 'tomorrow'>('today');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const goalOptions: FitnessGoal[] = [
    'Muscle Gain', 'Strength', 'Fat Loss', 'General Fitness', 'Endurance', 'Mobility & Joint Health'
  ];

  const toggleDay = (dayId: string) => {
    setTrainingDays(prev => prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]);
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

  const handleAddAvoided = () => {
    if (avoidedExercisesInput.trim() && !avoidedExercises.includes(avoidedExercisesInput.trim())) {
      setAvoidedExercises(prev => [...prev, avoidedExercisesInput.trim()]);
      setAvoidedExercisesInput('');
    }
  };

  const handleGenerate = async () => {
    if (trainingDays.length === 0) {
      alert(language === 'ar' ? 'يرجى اختيار يوم تدريب واحد على الأقل.' : 'Please select at least one training day.');
      return;
    }

    setIsGenerating(true);

    try {
      const program = await generateAIProgram({
        goal,
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

      saveGeneratedProgram(program);
      updateUserProfile({
        startDayOption: startDayPref,
        programStartDate: new Date().toISOString().split('T')[0]
      });
      onProgramGenerated();
      onClose();
    } catch (e) {
      console.error(e);
      alert('Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-background-card border border-accent-indigo/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        
        {!isGenerating && (
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-background-elevated z-10">
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-3 mb-6 sticky top-0 bg-background-card/90 backdrop-blur-sm py-2 z-0">
          <div className="w-11 h-11 rounded-2xl bg-accent-indigo/20 border border-accent-indigo/40 flex items-center justify-center text-accent-indigo shadow-glow-indigo">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-accent-indigo">AI PERIODIZATION ARCHITECT</span>
            <h2 className="text-xl font-bold text-white">Advanced Program Generation</h2>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* Goal & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Primary Goal</label>
              <select value={goal} onChange={e => setGoal(e.target.value as FitnessGoal)} className="w-full bg-background-elevated border border-border rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-accent-indigo">
                {goalOptions.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Experience Level</label>
              <select value={experience} onChange={e => setExperience(e.target.value as any)} className="w-full bg-background-elevated border border-border rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-accent-indigo">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Training Days</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {WEEK_DAYS.map(day => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleDay(day.id)}
                  className={`py-2 rounded-lg border text-xs font-bold text-center transition-all ${trainingDays.includes(day.id) ? 'bg-accent-indigo text-white border-accent-indigo' : 'bg-background-elevated border-border text-slate-400'}`}
                >
                  {language === 'ar' ? day.labelAr : day.labelEn}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Duration</label>
              <select value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full bg-background-elevated border border-border rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-accent-indigo">
                {[30, 45, 60, 75, 90].map(m => <option key={m} value={m}>{m} Minutes</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Split</label>
              <select value={preferredSplit} onChange={e => setPreferredSplit(e.target.value)} className="w-full bg-background-elevated border border-border rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-accent-indigo">
                <option value="AZMK_DECIDE">Let AZMK Decide</option>
                <option value="Push Pull Legs">Push / Pull / Legs</option>
                <option value="Upper Lower">Upper / Lower</option>
                <option value="Full Body">Full Body</option>
                <option value="Arnold Split">Arnold Split</option>
                <option value="Bro Split">Bro Split</option>
              </select>
            </div>
          </div>

          {/* Environment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Equipment</label>
              <select value={equipment} onChange={e => setEquipment(e.target.value)} className="w-full bg-background-elevated border border-border rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-accent-indigo">
                <option value="Full Gym">Full Gym</option>
                <option value="Home Gym (Dumbbells & Bench)">Home Gym</option>
                <option value="Calisthenics">Calisthenics (Bodyweight)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Weight Method</label>
              <select value={weightMethod} onChange={e => setWeightMethod(e.target.value)} className="w-full bg-background-elevated border border-border rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-accent-indigo">
                <option value="BEGINNER">Beginner (Auto-adjust)</option>
                <option value="PREVIOUS">Use Previous Data</option>
                <option value="RPE">RPE Based (Advanced)</option>
              </select>
            </div>
          </div>

          {/* Customization */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Priority Muscles (Max 3)</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPriorityMuscles([])}
                className={`py-1.5 px-3 rounded-lg border text-[11px] font-bold ${priorityMuscles.length === 0 ? 'bg-accent-indigo text-white border-accent-indigo' : 'bg-background-elevated border-border text-slate-300'}`}
              >
                Balanced
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
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Avoided Exercises</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={avoidedExercisesInput}
                onChange={e => setAvoidedExercisesInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddAvoided()}
                placeholder="e.g. Barbell Squat"
                className="flex-1 bg-background-elevated border border-border rounded-xl px-3 py-2 text-xs text-white focus:border-accent-indigo outline-none"
              />
              <button type="button" onClick={handleAddAvoided} className="px-3 rounded-xl bg-background-elevated border border-border text-slate-300 text-xs font-bold">+</button>
            </div>
            {avoidedExercises.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {avoidedExercises.map(ex => (
                  <span key={ex} className="flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-md text-[10px] font-bold">
                    {ex} <button onClick={() => setAvoidedExercises(prev => prev.filter(e => e !== ex))}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border mt-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-accent-indigo to-indigo-600 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-indigo transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Advanced Program...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Generate Program</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
