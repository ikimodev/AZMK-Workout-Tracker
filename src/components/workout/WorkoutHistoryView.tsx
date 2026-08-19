import React, { useState } from 'react';
import { 
  Dumbbell, 
  Calendar, 
  Clock, 
  Weight, 
  Trophy, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Play
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { getExerciseById } from '../../data/mockExercises';

interface WorkoutHistoryViewProps {
  onNavigate: (tab: string) => void;
}

export const WorkoutHistoryView: React.FC<WorkoutHistoryViewProps> = ({ onNavigate }) => {
  const { history, startWorkout, startTodaysAutocompleteWorkout } = useWorkout();
  const [expandedId, setExpandedId] = useState<string | null>(history[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background-card border border-border rounded-3xl p-6 shadow-card">
        <div>
          <span className="text-xs uppercase font-mono font-bold tracking-wider text-accent-emerald">TRAINING LOGS</span>
          <h1 className="text-2xl font-black text-white mt-1">Workout History ({history.length} Sessions)</h1>
          <p className="text-xs text-slate-400 mt-1">Every rep, set, and volume milestone recorded in the database.</p>
        </div>

        <button
          onClick={startTodaysAutocompleteWorkout}
          className="px-5 py-3 rounded-2xl bg-accent-emerald hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-sm transition-all"
        >
          <Play className="w-4 h-4 fill-black" />
          <span>Start New Workout</span>
        </button>
      </div>

      {/* History Feed */}
      <div className="space-y-3.5">
        {history.map((session, idx) => {
          const isExpanded = expandedId === session.id;
          const dateFormatted = new Date(session.date).toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          });

          return (
            <div 
              key={session.id}
              className={`bg-background-card border rounded-3xl transition-all shadow-card overflow-hidden ${
                isExpanded ? 'border-accent-emerald/40' : 'border-border hover:border-slate-700'
              }`}
            >
              {/* Header Bar */}
              <div 
                onClick={() => toggleExpand(session.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-background-elevated border border-border flex items-center justify-center text-slate-300 font-mono font-bold text-xs">
                    #{history.length - idx}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{session.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                      <span>{dateFormatted}</span>
                      <span>•</span>
                      <span>{session.durationMinutes} min</span>
                      <span>•</span>
                      <span>{session.exercises.length} exercises</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium">Total Volume</p>
                    <p className="text-sm font-bold font-mono text-white">
                      {session.totalVolumeKg.toLocaleString()} kg
                    </p>
                  </div>

                  {session.prCount > 0 && (
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono flex items-center gap-1">
                      🔥 {session.prCount} PR
                    </span>
                  )}

                  <div className="text-slate-400 p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expandable Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-border/70 space-y-4 animate-slide-up bg-background-secondary/40">
                  
                  {/* AI Summary note if present */}
                  {session.aiSummary && (
                    <div className="p-3.5 rounded-2xl bg-accent-indigo/10 border border-accent-indigo/30 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-accent-indigo shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {session.aiSummary}
                      </p>
                    </div>
                  )}

                  {/* Exercises and sets in session */}
                  <div className="space-y-3">
                    {session.exercises.map((ex, exIdx) => {
                      const info = getExerciseById(ex.exerciseId);
                      return (
                        <div key={ex.id} className="p-3.5 rounded-2xl bg-background-elevated/70 border border-border/80">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-sm text-white">{info?.name || ex.exerciseId}</span>
                            <span className="text-xs text-slate-400">{ex.sets.length} sets</span>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {ex.sets.map((st, sIdx) => (
                              <div
                                key={st.id}
                                className={`px-2.5 py-1 rounded-xl font-mono text-xs font-semibold flex items-center gap-1 border ${
                                  st.isPR 
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                                    : 'bg-background-card text-slate-300 border-border'
                                }`}
                              >
                                <span>Set {sIdx + 1}:</span>
                                <strong>{st.weight}kg × {st.reps}</strong>
                                {st.rpe && <span className="text-accent-indigo text-[10px]">@ {st.rpe}</span>}
                                {st.isPR && <span className="text-[10px]">🔥</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Repeat workout button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        // Start workout with this template
                        const template = session.exercises.map((e, i) => ({
                          ...e,
                          id: `we_repeat_${Date.now()}_${i}`,
                          sets: e.sets.map((s, si) => ({
                            ...s,
                            id: `s_repeat_${Date.now()}_${i}_${si}`,
                            isCompleted: false
                          }))
                        }));
                        startWorkout(session.name, template);
                        onNavigate('active_workout');
                      }}
                      className="px-4 py-2 rounded-xl bg-background-elevated hover:bg-background-hover text-accent-emerald text-xs font-bold border border-border transition-all"
                    >
                      Repeat This Workout
                    </button>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
