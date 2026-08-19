import React from 'react';
import { Trophy, Sparkles, X, ArrowUpRight, Flame } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

export const PRCelebrationModal: React.FC = () => {
  const { celebrationPR, dismissCelebrationPR } = useWorkout();

  if (!celebrationPR) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-background-card border-2 border-accent-emerald/60 rounded-3xl max-w-sm w-full p-6 text-center relative shadow-2xl shadow-emerald-500/20 animate-slide-up">
        
        {/* Close Button */}
        <button
          onClick={dismissCelebrationPR}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-background-elevated"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Big Trophy Glow */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-glow-md">
          <Trophy className="w-10 h-10 text-black fill-black" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold uppercase tracking-widest mb-2">
          <Flame className="w-3.5 h-3.5 fill-amber-400" />
          <span>NEW PERSONAL RECORD!</span>
        </div>

        {/* Exercise Name */}
        <h3 className="text-xl font-bold text-white mb-1">
          {celebrationPR.exerciseName}
        </h3>

        {/* Numbers */}
        <div className="my-4 py-4 px-3 bg-background-elevated/70 rounded-2xl border border-border flex items-center justify-around">
          <div>
            <p className="text-[11px] text-slate-400 font-medium">New Record</p>
            <p className="text-2xl font-black font-mono text-accent-emerald">
              {celebrationPR.value} kg
            </p>
            {celebrationPR.reps && (
              <p className="text-xs text-slate-300 font-mono">× {celebrationPR.reps} reps</p>
            )}
          </div>

          <div className="h-10 w-px bg-border" />

          <div>
            <p className="text-[11px] text-slate-400 font-medium">Progression</p>
            <div className="flex items-center gap-1 text-emerald-400 font-bold font-mono text-lg">
              <ArrowUpRight className="w-5 h-5" />
              <span>+{celebrationPR.improvementPercentage}%</span>
            </div>
            <p className="text-[10px] text-slate-400">vs {celebrationPR.previousBest} kg</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
          AI progressive overload model will recalibrate your future set targets automatically.
        </p>

        <button
          onClick={dismissCelebrationPR}
          className="w-full py-3 rounded-xl bg-accent-emerald hover:bg-emerald-400 text-black font-extrabold text-sm shadow-glow-sm transition-all"
        >
          Keep Lifting 🔥
        </button>

      </div>
    </div>
  );
};
