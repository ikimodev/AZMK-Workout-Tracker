import React, { useState } from 'react';
import { Sparkles, X, Play, Save, CheckCircle2, ArrowRight, Dumbbell } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { parseNaturalLanguageWorkout, buildWorkoutFromParsed, ParsedWorkoutResult } from '../../services/aiWorkoutParser';

interface AIWorkoutImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkoutStarted: () => void;
}

export const AIWorkoutImportModal: React.FC<AIWorkoutImportModalProps> = ({ 
  isOpen, 
  onClose, 
  onWorkoutStarted 
}) => {
  const { startWorkout } = useWorkout();

  const [rawText, setRawText] = useState(
`Push Day:
bench press 4 sets of 8
incline dumbbell press 3x10
lateral raises 3x15
tricep pushdown 3x12`
  );

  const [parsedResult, setParsedResult] = useState<ParsedWorkoutResult | null>(null);

  if (!isOpen) return null;

  const handleParse = () => {
    const res = parseNaturalLanguageWorkout(rawText);
    setParsedResult(res);
  };

  const handleStartWorkout = () => {
    if (!parsedResult) return;
    const workoutExercises = buildWorkoutFromParsed(parsedResult);
    startWorkout(parsedResult.workoutName, workoutExercises);
    onWorkoutStarted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-background-card border border-accent-cyan/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-background-elevated"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan shadow-glow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-accent-cyan">AI NATURAL LANGUAGE PARSER</span>
            <h2 className="text-xl font-bold text-white">Import Text Workout</h2>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Type or paste your workout routine in free-form text. PULSE AI will convert it into structured exercises, calculate recommended starting weights, and set up your tracker.
        </p>

        {!parsedResult ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">Raw Workout Text:</label>
              <textarea
                rows={6}
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="e.g. Chest day: bench press 4x8, incline dumbbell 3x10..."
                className="w-full p-4 bg-background-elevated border border-border rounded-2xl text-white font-mono text-xs focus:outline-none focus:border-accent-cyan leading-relaxed"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setRawText(
`Legs & Core Routine:
barbell back squat 4 sets 6 reps
romanian deadlift 3x8
leg extensions 3x12
standing calf raise 4x15`
                )}
                className="text-[11px] font-semibold text-slate-400 hover:text-accent-cyan underline"
              >
                Try Leg Routine Sample
              </button>
            </div>

            <button
              onClick={handleParse}
              className="w-full py-3.5 rounded-2xl bg-accent-cyan hover:bg-cyan-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Convert to Structured Workout</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            
            <div className="p-4 rounded-2xl bg-background-elevated border border-accent-cyan/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-accent-cyan uppercase">STRUCTURED PREVIEW</span>
                <span className="text-xs font-bold text-emerald-400 bg-accent-emerald/10 px-2 py-0.5 rounded-full">
                  ✓ {parsedResult.confidence * 100}% Confidence Match
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-3">{parsedResult.workoutName}</h3>

              <div className="space-y-2">
                {parsedResult.exercises.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-background-card border border-border flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{item.exerciseName}</p>
                      <p className="text-[11px] text-slate-400">Parsed: "{item.rawText}"</p>
                    </div>
                    <div className="text-right font-mono font-bold">
                      <span className="text-accent-emerald">{item.targetSets} sets</span> × <span className="text-white">{item.targetReps} reps</span>
                      <p className="text-[10px] text-slate-400 font-normal">Target: ~{item.suggestedWeight} kg</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setParsedResult(null)}
                className="py-3 px-4 rounded-xl bg-background-elevated hover:bg-background-hover text-slate-300 text-xs font-bold border border-border transition-all"
              >
                Edit Text
              </button>
              
              <button
                onClick={handleStartWorkout}
                className="flex-1 py-3.5 rounded-xl bg-accent-emerald hover:bg-emerald-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Start Structured Workout Now</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
