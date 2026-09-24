import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, ChevronDown, ChevronUp, MoreHorizontal, Trash2 } from 'lucide-react';
import { WorkoutExercise } from '../../types';
import { ExerciseThumbnail } from './ExerciseThumbnail';
import { getExerciseById } from '../../data/mockExercises';
import { getExerciseDisplayName } from '../../i18n/fitnessDictionary';
import { useWorkout } from '../../context/WorkoutContext';

interface ActiveExerciseCardProps {
  workoutEx: WorkoutExercise;
  exIdx: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  openInfoModal: (name: string, equipment?: string, muscle?: string) => void;
  setActiveWeightEditor: (args: any) => void;
}

export const ActiveExerciseCard: React.FC<ActiveExerciseCardProps> = ({
  workoutEx,
  exIdx,
  isExpanded,
  onToggleExpand,
  openInfoModal,
  setActiveWeightEditor
}) => {
  const {
    updateSet,
    toggleSetCompleted,
    removeExerciseFromActiveWorkout,
    addSetToExercise,
    language
  } = useWorkout();

  const [showMenu, setShowMenu] = useState(false);

  const exerciseInfo = getExerciseById(workoutEx.exerciseId);
  const isTimeOnly = exerciseInfo?.trackingType === 'time_only';
  const isRepsOnly = exerciseInfo?.trackingType === 'reps_only';
  const displayName = getExerciseDisplayName(workoutEx.exerciseId, language);

  const completedSetsCount = workoutEx.sets.filter(s => s.isCompleted).length;
  const totalSets = workoutEx.sets.length;
  const isAllCompleted = completedSetsCount === totalSets && totalSets > 0;

  // Find the first uncompleted set
  const activeSetIdx = workoutEx.sets.findIndex(s => !s.isCompleted);
  const activeSet = activeSetIdx !== -1 ? workoutEx.sets[activeSetIdx] : null;

  return (
    <div className={`bg-background-card border rounded-3xl overflow-hidden transition-all duration-500 shadow-card ${
      isExpanded 
        ? 'border-accent-cyan shadow-[0_0_15px_rgba(34,211,238,0.1)] ring-1 ring-accent-cyan/20' 
        : isAllCompleted 
          ? 'border-green-500/30 opacity-70' 
          : 'border-border'
    }`}>
      
      {/* Header - Always visible, clicking toggles expand */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-12 h-12 flex-shrink-0" onClick={(e) => {
            e.stopPropagation();
            openInfoModal(displayName, exerciseInfo?.equipment, exerciseInfo?.muscleGroup);
          }}>
            <ExerciseThumbnail 
              exerciseName={displayName} 
              images={exerciseInfo?.images} 
              equipment={exerciseInfo?.equipment} 
              className="w-full h-full"
            />
          </div>
          <div>
            <h3 className={`font-bold text-base transition-colors ${isExpanded ? 'text-accent-cyan' : 'text-white'}`}>
              {displayName}
            </h3>
            <p className="text-xs font-mono font-semibold text-slate-400 mt-1">
              {isAllCompleted ? (
                <span className="text-green-400 flex items-center gap-1"><Check className="w-3 h-3"/> Done</span>
              ) : (
                <>{completedSetsCount} / {totalSets} Sets</>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Menu */}
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-2 text-slate-400 hover:text-white bg-background-elevated rounded-full"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50"
          >
            {showMenu && (
              <div className="px-4 py-3 bg-background-elevated flex items-center justify-end gap-3 border-b border-border/50">
                <button 
                  onClick={() => removeExerciseFromActiveWorkout(exIdx)}
                  className="flex items-center gap-2 text-xs font-bold text-red-400 bg-red-950/40 px-3 py-1.5 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" /> Remove Exercise
                </button>
              </div>
            )}

            <div className="p-4 space-y-4 bg-background-card">
              
              {/* Previously completed sets (Small Pills) */}
              {workoutEx.sets.map((set, idx) => {
                if (!set.isCompleted) return null;
                return (
                  <div key={set.id} className="flex items-center justify-between bg-green-950/20 border border-green-500/20 px-4 py-2.5 rounded-xl">
                    <span className="text-xs font-mono font-bold text-slate-400">Set {set.setNumber}</span>
                    <span className="text-sm font-bold text-green-400">
                      {isTimeOnly ? `${set.reps}s` : isRepsOnly ? `${set.reps} reps` : `${set.weight}kg × ${set.reps}`}
                    </span>
                    <button onClick={() => toggleSetCompleted(exIdx, idx)}>
                      <Check className="w-5 h-5 text-green-500 hover:text-green-400" />
                    </button>
                  </div>
                );
              })}

              {/* ⭐ Smart Next Set ⭐ */}
              {activeSet && (
                <div className="bg-background-elevated border border-accent-cyan/30 rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(34,211,238,0.05)] relative overflow-hidden my-4">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-cyan/0 via-accent-cyan to-accent-cyan/0 opacity-50" />
                  
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-accent-cyan mb-3">
                    Next: Set {activeSet.setNumber}
                  </p>
                  
                  {/* Big Target Display */}
                  <div className="flex items-center justify-center gap-4 mb-6">
                    {!isTimeOnly && !isRepsOnly && (
                      <button 
                        onClick={() => setActiveWeightEditor({ exIdx, setIdx: activeSetIdx, initialWeight: activeSet.weight || 0 })}
                        className="text-5xl font-black text-white hover:text-accent-cyan transition-colors"
                      >
                        {activeSet.weight || 0} <span className="text-xl text-slate-400">kg</span>
                      </button>
                    )}
                    
                    {!isTimeOnly && !isRepsOnly && <span className="text-3xl text-slate-500">×</span>}

                    <div className="flex flex-col items-center">
                      <input 
                        type="number" 
                        value={activeSet.reps || ''}
                        onChange={(e) => updateSet(exIdx, activeSetIdx, { reps: parseInt(e.target.value) || 0 })}
                        className="w-24 bg-transparent text-5xl font-black text-white text-center focus:outline-none focus:text-accent-emerald"
                        placeholder="0"
                      />
                      <span className="text-xs text-slate-400 font-mono mt-1">
                        {isTimeOnly ? 'SECONDS' : 'REPS'}
                      </span>
                    </div>
                  </div>

                  {/* Previous context */}
                  <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-400 mb-6">
                    {(activeSet.previousWeight || activeSet.previousReps) && (
                      <div className="bg-background-card px-3 py-1.5 rounded-lg border border-border">
                        Last: {isTimeOnly ? `${activeSet.previousReps}s` : isRepsOnly ? `${activeSet.previousReps} reps` : `${activeSet.previousWeight}kg × ${activeSet.previousReps}`}
                      </div>
                    )}
                  </div>

                  {/* Log Button */}
                  <button
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
                      toggleSetCompleted(exIdx, activeSetIdx);
                    }}
                    className="w-full py-4 rounded-xl bg-accent-cyan text-black font-black text-lg uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-cyan-400 transition-colors shadow-glow-sm"
                  >
                    <Check className="w-6 h-6 stroke-[3]" /> Log Set
                  </button>
                </div>
              )}

              {/* Upcoming Sets (Small text) */}
              {workoutEx.sets.map((set, idx) => {
                if (set.isCompleted || idx === activeSetIdx) return null;
                return (
                  <div key={set.id} className="flex items-center justify-between px-4 py-2 opacity-50">
                    <span className="text-xs font-mono text-slate-500">Set {set.setNumber}</span>
                    <span className="text-xs text-slate-500 font-mono">
                      Target: {isTimeOnly ? `${set.reps}s` : isRepsOnly ? `${set.reps} reps` : `${set.weight}kg × ${set.reps}`}
                    </span>
                  </div>
                );
              })}

              {/* Add Set Button */}
              <button 
                onClick={() => addSetToExercise(exIdx)}
                className="w-full py-3 mt-2 rounded-xl bg-background-elevated border border-dashed border-slate-600 text-slate-400 text-xs font-bold uppercase tracking-wider hover:border-slate-400 hover:text-white transition-all"
              >
                + Add Set
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
