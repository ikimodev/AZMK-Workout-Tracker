import React, { useState } from 'react';
import { Check, MoreHorizontal, Trash2, RefreshCw, FileText, Minus, Plus, Trophy } from 'lucide-react';
import { YoutubeIcon } from '../common/YoutubeIcon';
import { WorkoutExercise } from '../../types';
import { ExerciseThumbnail } from './ExerciseThumbnail';
import { getExerciseById } from '../../data/mockExercises';
import { useWorkout } from '../../context/WorkoutContext';

interface ActiveExerciseCardProps {
  workoutEx: WorkoutExercise;
  exIdx: number;
  openInfoModal: (name: string, equipment?: string, muscle?: string) => void;
  setActiveWeightEditor: (args: any) => void;
  onReplace: () => void;
  onToggleNotes: () => void;
  showNotes: boolean;
  onOpenYoutube: (query: string) => void;
  onOpenMenu: () => void;
}

export const ActiveExerciseCard: React.FC<ActiveExerciseCardProps> = ({
  workoutEx, exIdx, openInfoModal, setActiveWeightEditor, onReplace, onToggleNotes, showNotes, onOpenYoutube, onOpenMenu
}) => {
  const { updateSet, toggleSetCompleted, deleteSet, addSetToExercise, language, history } = useWorkout();
  const [localNotes, setLocalNotes] = useState(workoutEx.notes || '');

  const exerciseInfo = getExerciseById(workoutEx.exerciseId);
  const completedSetsCount = workoutEx.sets.filter(s => s.isCompleted).length;
  const totalSets = workoutEx.sets.length;
  const isAllCompleted = completedSetsCount === totalSets && totalSets > 0;
  
  const activeSetIdx = workoutEx.sets.findIndex(s => !s.isCompleted);
  const activeSet = activeSetIdx !== -1 ? workoutEx.sets[activeSetIdx] : null;
  
  const handleRepChange = (setIdx: number, currentReps: number, delta: number) => {
    updateSet(exIdx, setIdx, { reps: Math.max(0, currentReps + delta) });
  };
  const handleWeightChange = (setIdx: number, currentWeight: number, delta: number) => {
    updateSet(exIdx, setIdx, { weight: Math.max(0, currentWeight + delta) });
  };

  return (
    <div className={`bg-background-card border rounded-3xl transition-all duration-500 shadow-card ${isAllCompleted ? 'border-accent-emerald/30 ring-1 ring-accent-emerald/10' : 'border-accent-cyan shadow-[0_0_15px_rgba(34,211,238,0.1)] ring-1 ring-accent-cyan/20'}`}>
      {/* HEADER */}
      <div className="p-4 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-background-elevated border border-border" onClick={(e) => { e.stopPropagation(); openInfoModal(exerciseInfo?.name || '', exerciseInfo?.equipment, exerciseInfo?.muscleGroup); }}>
            <ExerciseThumbnail exerciseName={exerciseInfo?.name || ''} images={exerciseInfo?.images} equipment={exerciseInfo?.equipment} className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-extrabold text-white text-base sm:text-lg line-clamp-1">{exerciseInfo?.name || workoutEx.exerciseId}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${isAllCompleted ? 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20' : 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20'}`}>
                {completedSetsCount} / {totalSets} Sets
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={(e) => { e.stopPropagation(); onReplace(); }} className="p-2 text-slate-400 hover:text-white bg-background-elevated rounded-xl hidden sm:flex"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={(e) => { e.stopPropagation(); onOpenYoutube(exerciseInfo?.name || ''); }} className="p-2 text-slate-400 hover:text-white bg-background-elevated rounded-xl hidden sm:flex"><YoutubeIcon className="w-4 h-4 text-slate-400 hover:text-white" /></button>
          <button onClick={(e) => { e.stopPropagation(); onOpenMenu(); }} className="p-2 text-slate-400 hover:text-white bg-background-elevated rounded-xl"><MoreHorizontal className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {/* ACTIVE SET HERO CARD */}
        {activeSet && (
          <div className="bg-background-elevated rounded-[2rem] p-5 sm:p-6 flex flex-col items-center justify-center border border-accent-cyan/30 shadow-inner relative overflow-hidden">
            <div className="absolute top-4 left-5 flex items-center gap-2">
              <span className="text-[10px] font-black text-accent-cyan tracking-widest uppercase">Set {activeSetIdx + 1}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-6 mt-6 mb-8 w-full relative">
              
              {/* Left Column: Weight */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-[11px] text-slate-400 font-bold uppercase mb-2 tracking-widest">Weight</span>
                <div 
                  className="flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform w-full py-2" 
                  onClick={() => setActiveWeightEditor({ exIdx, setIdx: activeSetIdx, initialWeight: activeSet.weight || 0 })}
                >
                  <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tighter shrink-0" style={{ textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>{activeSet.weight || 0}</span>
                  <span className="text-xs sm:text-sm text-slate-500 font-bold mt-1">kg</span>
                </div>
              </div>

              {/* Center '×' Indicator (Absolute for perfect centering) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-600 text-2xl font-light mt-3 hidden sm:block">×</div>

              {/* Right Column: Reps */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-[11px] text-slate-400 font-bold uppercase mb-2 tracking-widest">Reps</span>
                <div className="flex items-center justify-center gap-1 sm:gap-2 w-full">
                  <button onClick={() => handleRepChange(activeSetIdx, activeSet.reps || 0, -1)} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background-card border border-border flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 active:scale-95 transition-all shadow-md shrink-0">
                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  
                  <div className="flex flex-col items-center justify-center min-w-[50px] sm:min-w-[60px]">
                    <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tighter shrink-0" style={{ textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>{activeSet.reps || 0}</span>
                  </div>

                  <button onClick={() => handleRepChange(activeSetIdx, activeSet.reps || 0, 1)} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-background-card border border-border flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 active:scale-95 transition-all shadow-md shrink-0">
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

            </div>

            {/* LOG SET BUTTON */}
            <button
              onClick={() => toggleSetCompleted(exIdx, activeSetIdx)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-emerald to-emerald-400 text-black font-black text-lg shadow-[0_0_20px_rgba(52,211,153,0.2)] hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              LOG SET
            </button>
          </div>
        )}

        {isAllCompleted && (
          <div className="bg-accent-emerald/5 rounded-2xl p-6 flex flex-col items-center justify-center border border-accent-emerald/20 text-center animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-accent-emerald/20 flex items-center justify-center mb-3">
              <Trophy className="w-6 h-6 text-accent-emerald" />
            </div>
            <h3 className="text-lg font-bold text-emerald-400 mb-1">Exercise Complete!</h3>
            <p className="text-xs text-emerald-500/70">All sets logged successfully.</p>
          </div>
        )}

        {/* COMPACT HISTORY */}
        <div className="bg-background-elevated/50 rounded-2xl p-4 border border-border/50">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">Session Log</div>
          <div className="space-y-1">
            {workoutEx.sets.map((set, idx) => {
              const isActive = idx === activeSetIdx;
              
              return (
                <div 
                  key={set.id}
                  onClick={() => setActiveWeightEditor({ exIdx, setIdx: idx, initialWeight: set.weight || 0 })}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-accent-cyan/10 border border-accent-cyan/20' : set.isCompleted ? 'hover:bg-accent-emerald/5' : 'hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-3">
                    {set.isCompleted ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : isActive ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse ml-1.5 mr-1" />
                    ) : (
                      <div className="w-4 h-4 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-slate-600">{idx + 1}</span>
                      </div>
                    )}
                    <span className={`text-sm font-medium ${isActive ? 'text-accent-cyan font-bold' : set.isCompleted ? 'text-emerald-500/70' : 'text-slate-400'}`}>
                      {set.isCompleted ? `Set ${idx + 1}` : `Set ${idx + 1}`}
                    </span>
                  </div>
                  
                  {isActive ? (
                    <span className="text-[11px] font-bold text-accent-cyan/70 tracking-widest uppercase">In Progress...</span>
                  ) : (
                    <div className={`font-mono text-sm ${set.isCompleted ? 'text-emerald-400/80' : 'text-slate-500'}`}>
                      {set.weight || 0} kg × {set.reps || 0}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <button onClick={() => addSetToExercise(exIdx)} className="w-full py-3 mt-3 rounded-xl border border-dashed border-border text-slate-400 hover:text-white hover:border-slate-500 hover:bg-background-elevated text-xs font-bold flex items-center justify-center gap-1.5 transition-all">
            <Plus className="w-4 h-4" /> Add Set
          </button>
        </div>
      </div>
    </div>
  );
};
