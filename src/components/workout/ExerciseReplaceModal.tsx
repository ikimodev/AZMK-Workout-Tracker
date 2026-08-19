import React from 'react';
import { X, RefreshCw, ChevronRight } from 'lucide-react';
import { Exercise } from '../../types';
import { getExerciseById, getAlternativeExercises } from '../../data/mockExercises';

interface ExerciseReplaceModalProps {
  currentExerciseId: string | null;
  exerciseIndex: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAlternative: (exerciseIndex: number, newExerciseId: string) => void;
}

export const ExerciseReplaceModal: React.FC<ExerciseReplaceModalProps> = ({
  currentExerciseId,
  exerciseIndex,
  isOpen,
  onClose,
  onSelectAlternative
}) => {
  if (!isOpen || !currentExerciseId || exerciseIndex === null) return null;

  const currentExercise = getExerciseById(currentExerciseId);
  const alternatives = getAlternativeExercises(currentExerciseId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-background-card border border-border rounded-3xl max-w-lg w-full p-6 relative shadow-2xl animate-slide-up">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-accent-cyan">EXERCISE REPLACEMENT</span>
              <h3 className="text-lg font-bold text-white">
                Replace {currentExercise?.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-full bg-background-elevated"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mb-4">
          Select a biomechanically equivalent exercise. Your set history and target progression will adjust automatically without rebuilding the workout.
        </p>

        {/* Alternatives list */}
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {alternatives.map((alt) => (
            <div
              key={alt.id}
              onClick={() => {
                onSelectAlternative(exerciseIndex, alt.id);
                onClose();
              }}
              className="p-3.5 rounded-2xl bg-background-elevated hover:bg-background-hover border border-border hover:border-accent-cyan/50 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-white group-hover:text-accent-cyan transition-colors">
                    {alt.name}
                  </p>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-background-card border border-border text-slate-300">
                    {alt.equipment}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {alt.instructions}
                </p>
              </div>

              <div className="flex items-center gap-2 text-slate-400 group-hover:text-accent-cyan transition-colors shrink-0 ml-3">
                <span className="text-xs font-semibold hidden sm:inline">Swap</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-background-elevated hover:bg-background-hover text-slate-300 text-xs font-bold border border-border transition-all"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
