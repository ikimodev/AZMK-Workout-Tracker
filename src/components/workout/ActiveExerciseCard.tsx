import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, ChevronDown, ChevronUp, MoreHorizontal, Trash2, ArrowUp, ArrowDown, RefreshCw, StickyNote } from 'lucide-react';
import { WorkoutExercise } from '../../types';
import { ExerciseThumbnail } from './ExerciseThumbnail';
import { getExerciseById } from '../../data/mockExercises';
import { getExerciseDisplayName } from '../../i18n/fitnessDictionary';
import { useWorkout } from '../../context/WorkoutContext';
import { YoutubeIcon } from '../common/YoutubeIcon';

interface ActiveExerciseCardProps {
  workoutEx: WorkoutExercise;
  exIdx: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  openInfoModal: (name: string, equipment?: string, muscle?: string) => void;
  setActiveWeightEditor: (args: any) => void;
  isFirst: boolean;
  isLast: boolean;
  onReplace: () => void;
  onToggleNotes: () => void;
  showNotes: boolean;
  onOpenYoutube: (query: string) => void;
  onOpenMenu: () => void;
}

export const ActiveExerciseCard: React.FC<ActiveExerciseCardProps> = ({
  workoutEx,
  exIdx,
  isExpanded,
  onToggleExpand,
  openInfoModal,
  setActiveWeightEditor,
  isFirst,
  isLast,
  onReplace,
  onToggleNotes,
  showNotes,
  onOpenYoutube,
  onOpenMenu
}) => {
  const {
    updateSet,
    toggleSetCompleted,
    deleteSet,
    addSetToExercise,
    language
  } = useWorkout();

  const [localNotes, setLocalNotes] = useState(workoutEx.notes || '');

  const exerciseInfo = getExerciseById(workoutEx.exerciseId);
  const isTimeOnly = exerciseInfo?.trackingType === 'time_only';
  const isRepsOnly = exerciseInfo?.trackingType === 'reps_only';
  const displayName = getExerciseDisplayName(workoutEx.exerciseId, language);

  const completedSetsCount = workoutEx.sets.filter(s => s.isCompleted).length;
  const totalSets = workoutEx.sets.length;
  const isAllCompleted = completedSetsCount === totalSets && totalSets > 0;

  const activeSetIdx = workoutEx.sets.findIndex(s => !s.isCompleted);
  const activeSet = activeSetIdx !== -1 ? workoutEx.sets[activeSetIdx] : null;

  const handleDragEnd = (event: any, info: any, setIndex: number) => {
    if (info.offset.x < -100 || info.offset.x > 100) {
      deleteSet(exIdx, setIndex);
    }
  };

  const renderSetWithSwipe = (set: any, idx: number, children: React.ReactNode) => (
    <div key={set.id} className="relative overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-red-500/20 flex items-center justify-between px-6">
        <Trash2 className="w-5 h-5 text-red-500 opacity-50" />
        <Trash2 className="w-5 h-5 text-red-500 opacity-50" />
      </div>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(e, info) => handleDragEnd(e, info, idx)}
        whileDrag={{ scale: 0.98 }}
        className="relative bg-background-card"
      >
        {children}
      </motion.div>
    </div>
  );

  return (
    <div className={`bg-background-card border rounded-3xl transition-all duration-500 shadow-card ${
      isExpanded 
        ? 'border-accent-cyan shadow-[0_0_15px_rgba(34,211,238,0.1)] ring-1 ring-accent-cyan/20' 
        : isAllCompleted 
          ? 'border-green-500/30 opacity-70' 
          : 'border-border'
    }`}>
      
      {/* Header */}
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
              className="w-full h-full rounded-xl"
            />
          </div>
          <div>
            <h3 className={`font-bold text-base transition-colors ${isExpanded ? 'text-accent-cyan' : 'text-white'}`}>
              {displayName}
            </h3>
            <p className="text-xs font-mono font-semibold text-slate-400 mt-1 flex items-center gap-2">
              {isAllCompleted ? (
                <span className="text-green-400 flex items-center gap-1"><Check className="w-3 h-3"/> Done</span>
              ) : (
                <>{completedSetsCount} / {totalSets} Sets</>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Tools */}
          {isExpanded && (
             <div className="flex items-center gap-1 mr-2" onClick={e => e.stopPropagation()}>
               <button 
                 onClick={() => onOpenYoutube(displayName)}
                 className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-background-elevated rounded-full"
               >
                 <YoutubeIcon className="w-4 h-4" />
               </button>
               <button 
                 onClick={onToggleNotes}
                 className={`p-2 transition-colors bg-background-elevated rounded-full ${showNotes ? 'text-accent-cyan' : 'text-slate-400 hover:text-white'}`}
               >
                 <StickyNote className="w-4 h-4" />
               </button>
             </div>
          )}

          {/* Quick Menu */}
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); onOpenMenu(); }}
              className="p-2 rounded-full transition-colors text-slate-400 hover:text-white bg-background-elevated active:scale-95"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50 flex flex-col"
          >
            <div className="p-4 space-y-4 bg-background-card rounded-b-3xl">
              
              {/* Notes Section */}
              <AnimatePresence>
                {showNotes && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <textarea 
                      value={localNotes}
                      onChange={(e) => setLocalNotes(e.target.value)}
                      placeholder="Add specific notes, e.g. seat at 5, lean forward..."
                      className="w-full bg-background-elevated border border-border rounded-xl p-3 text-sm text-slate-300 focus:outline-none focus:border-accent-cyan resize-none h-20"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Previously completed sets (Small Pills) */}
              {workoutEx.sets.map((set, idx) => {
                if (!set.isCompleted) return null;
                return renderSetWithSwipe(set, idx, 
                  <div className="flex items-center justify-between bg-green-950/20 border border-green-500/20 px-4 py-2.5 rounded-xl">
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
              {activeSet && renderSetWithSwipe(activeSet, activeSetIdx, (
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
              ))}

              {/* Upcoming Sets (Small text) */}
              {workoutEx.sets.map((set, idx) => {
                if (set.isCompleted || idx === activeSetIdx) return null;
                return renderSetWithSwipe(set, idx, 
                  <div className="flex items-center justify-between px-4 py-2 opacity-50 bg-background-card rounded-xl border border-border/50">
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
