import React, { useState } from 'react';
import { 
  Play, 
  Check, 
  Trash2, 
  Copy, 
  RefreshCw, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Clock, 
  Weight, 
  Trophy, 
  AlertCircle,
  HelpCircle,
  MoreVertical,
  Flame,
  Dumbbell,
  Plus,
  X,
  MoreHorizontal,
  FileText,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { YoutubeIcon } from '../common/YoutubeIcon';
import { ExerciseThumbnail } from './ExerciseThumbnail';
import { SetTimer } from './SetTimer';
import { useWorkout } from '../../context/WorkoutContext';
import { getExerciseById, getAllExercises } from '../../data/mockExercises';
import { getExerciseSummary, getNextSetRecommendation } from '../../services/progressiveOverload';
import { getExerciseDisplayName, getMuscleGroupDisplayName } from '../../i18n/fitnessDictionary';
import { ExerciseReplaceModal } from './ExerciseReplaceModal';
import ExerciseInfoModal from './ExerciseInfoModal';
import { ActiveExerciseCard } from './ActiveExerciseCard';
import { WeightEditModal } from './WeightEditModal';

interface ActiveWorkoutLoggerProps {
  onNavigate: (tab: string) => void;
}

export const ActiveWorkoutLogger: React.FC<ActiveWorkoutLoggerProps> = ({ onNavigate }) => {
  const { 
    activeWorkout, 
    workoutDuration, 
    history,
    addSetToExercise, 
    updateSet, 
    updateExercise, updateWorkoutDate,
    deleteSet, 
    duplicateSet, 
    toggleSetCompleted, 
    addExerciseToActiveWorkout, 
    replaceExerciseInActiveWorkout, 
    removeExerciseFromActiveWorkout, 
    reorderExercisesInActiveWorkout,
    finishActiveWorkout, 
    cancelActiveWorkout,
    language,
    t
  } = useWorkout();

  // State for modals
  const [expandedExerciseIndex, setExpandedExerciseIndex] = useState<number>(0);
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [replacingExerciseIndex, setReplacingExerciseIndex] = useState<number | null>(null);
  const [replacingExerciseId, setReplacingExerciseId] = useState<string | null>(null);
  const [addExerciseModalOpen, setAddExerciseModalOpen] = useState(false);
  const [showBenchmarkFor, setShowBenchmarkFor] = useState<Record<string, boolean>>({});
  const [showNotesFor, setShowNotesFor] = useState<Record<string, boolean>>({});
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);

  const toggleBenchmark = (exerciseId: string) => {
    setShowBenchmarkFor(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const toggleNotes = (exerciseId: string) => {
    setShowNotesFor(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const [searchExQuery, setSearchExQuery] = useState('');
  const [activeRpeSelector, setActiveRpeSelector] = useState<{ exIdx: number; setIdx: number } | null>(null);
  
  // State for Weight Modal
  const [activeWeightEditor, setActiveWeightEditor] = useState<{ exIdx: number; setIdx: number; initialWeight: number } | null>(null);

  // Exercise Info Modal State
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoExerciseName, setInfoExerciseName] = useState('');
  const [infoExerciseEquipment, setInfoExerciseEquipment] = useState('');
  const [infoExerciseMuscle, setInfoExerciseMuscle] = useState('');

  if (!activeWorkout) {
    return (
      <div className="p-8 text-center bg-background-card rounded-3xl border border-border">
        <Dumbbell className="w-12 h-12 text-slate-500 mx-auto mb-3 animate-pulse" />
        <h2 className="text-xl font-bold text-white mb-2">{t('noActiveWorkout')}</h2>
        <p className="text-sm text-slate-400 mb-6" dir="auto">{t('noActiveWorkoutDesc')}</p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-6 py-3 rounded-2xl bg-accent-emerald text-black font-extrabold text-sm shadow-glow-sm"
        >
          {t('goToDashboard')}
        </button>
      </div>
    );
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const openReplaceModal = (index: number, exerciseId: string) => {
    setReplacingExerciseIndex(index);
    setReplacingExerciseId(exerciseId);
    setReplaceModalOpen(true);
  };

  const openYoutubeTutorial = (query: string) => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  // Filtered exercise library for "Add Exercise" modal
  const filteredExercisesToAdd = getAllExercises().filter(ex => 
    ex.name.toLowerCase().includes(searchExQuery.toLowerCase()) ||
    ex.muscleGroup.toLowerCase().includes(searchExQuery.toLowerCase())
  );

  const openInfoModal = (name: string, equipment?: string, muscle?: string) => {
    setInfoExerciseName(name);
    setInfoExerciseEquipment(equipment || '');
    setInfoExerciseMuscle(muscle || '');
    setInfoModalOpen(true);
  };

  const handleSaveWeight = (exIdx: number, setIdx: number, newWeight: number) => {
    if (!activeWorkout) return;
    const exercise = activeWorkout.exercises[exIdx];
    if (!exercise) return;
    
    const targetSet = exercise.sets[setIdx];
    const oldWeight = targetSet.weight || 0;

    // Update the specific set
    updateSet(exIdx, setIdx, { weight: newWeight });

    // Auto-propagate logic: If this is the FIRST set, update subsequent uncompleted sets 
    // IF their current weight matches the old weight of the first set (meaning user hasn't diverged them).
    if (setIdx === 0) {
      exercise.sets.forEach((set, idx) => {
        if (idx > 0 && !set.isCompleted) {
          // If the subsequent set has the exact same weight as the first set's old weight,
          // it means they are linked in the user's mind (or default). Update it!
          if ((set.weight || 0) === oldWeight) {
            updateSet(exIdx, idx, { weight: newWeight });
          }
        }
      });
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in max-w-4xl mx-auto">
      
      {/* Top Header & Sticky Action Bar - Highly compact for mobile */}
      <div className="bg-background-card/85 border border-border rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 sticky top-2 sm:top-6 z-40 backdrop-blur-xl">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {!activeWorkout.isManualLog ? (
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent-emerald animate-ping" />
              ) : (
                <Calendar className="w-3 h-3 text-accent-indigo" />
              )}
              <span className={`text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider leading-none ${activeWorkout.isManualLog ? 'text-accent-indigo' : 'text-accent-emerald'}`}>
                {activeWorkout.isManualLog ? 'MANUAL LOG' : t('liveLoggingMode')}
              </span>
            </div>
            <h1 className="text-base sm:text-2xl font-black text-white mt-1 line-clamp-1">{activeWorkout.name}</h1>
          </div>
          
          {/* Mobile Timer or Date Picker */}
          {activeWorkout.isManualLog ? (
            <input 
              type="date"
              value={activeWorkout.date.split('T')[0]}
              onChange={(e) => updateWorkoutDate(new Date(e.target.value).toISOString())}
              className="sm:hidden bg-background-elevated border border-border text-white text-xs px-2 py-1 rounded-lg"
            />
          ) : (
            <div className="sm:hidden flex items-center gap-1 px-2 py-1 rounded-lg bg-background-elevated border border-border text-white font-mono font-bold text-[11px]">
              <Clock className="w-3 h-3 text-accent-emerald" />
              <span>{formatTimer(workoutDuration)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {/* Desktop Timer or Date Picker */}
          {activeWorkout.isManualLog ? (
            <input 
              type="date"
              value={activeWorkout.date.split('T')[0]}
              onChange={(e) => updateWorkoutDate(new Date(e.target.value).toISOString())}
              className="hidden sm:block bg-background-elevated border border-border text-white text-sm px-3 py-1.5 rounded-xl"
            />
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background-elevated border border-border text-white font-mono font-bold text-sm">
              <Clock className="w-4 h-4 text-accent-emerald" />
              <span>{formatTimer(workoutDuration)}</span>
            </div>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Discard Workout */}
            <button
              onClick={() => {
                if (confirm(t('discardConfirm'))) {
                  cancelActiveWorkout();
                  onNavigate('dashboard');
                }
              }}
              className="flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-xl bg-background-elevated hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 text-[11px] sm:text-xs font-bold border border-border transition-all flex items-center justify-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t('discard')}</span>
            </button>

            {/* Finish Workout CTA */}
            <button
              onClick={() => {
                const res = finishActiveWorkout();
                if (res) {
                  // finished! Context will hold lastCompletedSession which triggers modal
                }
              }}
              className="flex-[2] sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-accent-emerald to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-glow-sm transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{activeWorkout.isManualLog ? 'Save Manual Log' : t('finishWorkout')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-6">
        {activeWorkout.exercises.map((workoutEx, exIdx) => {
          const exerciseInfo = getExerciseById(workoutEx.exerciseId);
          const exSummary = getExerciseSummary(workoutEx.exerciseId, history);
          const completedSets = workoutEx.sets.filter(s => s.isCompleted);
          const nextSetRec = getNextSetRecommendation(completedSets, exerciseInfo?.defaultReps || 8);
          const isTimeOnly = exerciseInfo?.trackingType === 'time_only';
          const isRepsOnly = exerciseInfo?.trackingType === 'reps_only';

          console.log(`[DEBUG] Exercise: ${workoutEx.exerciseId}, Info:`, exerciseInfo, `isTimeOnly: ${isTimeOnly}, isRepsOnly: ${isRepsOnly}`);

          return (
            <ActiveExerciseCard 
              key={workoutEx.id} 
              workoutEx={workoutEx} 
              exIdx={exIdx} 
              isExpanded={expandedExerciseIndex === exIdx} 
              onToggleExpand={() => setExpandedExerciseIndex(expandedExerciseIndex === exIdx ? -1 : exIdx)} 
              openInfoModal={openInfoModal} 
              setActiveWeightEditor={setActiveWeightEditor} 
            />
          );
        })}
      </div>

      {/* Add New Exercise to Workout Button */}
      <div className="pt-2">
        <button
          onClick={() => setAddExerciseModalOpen(true)}
          className="w-full py-4 rounded-3xl bg-background-card hover:bg-background-elevated border-2 border-dashed border-border hover:border-slate-500 text-slate-300 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-card"
        >
          <Plus className="w-5 h-5 text-accent-emerald" />
          <span>{t('addAnotherExercise')}</span>
        </button>
      </div>

      {/* MODAL: Replace Exercise */}
      <ExerciseReplaceModal
        isOpen={replaceModalOpen}
        onClose={() => {
          setReplaceModalOpen(false);
          setReplacingExerciseIndex(null);
          setReplacingExerciseId(null);
        }}
        currentExerciseId={replacingExerciseId}
        exerciseIndex={replacingExerciseIndex}
        onSelectAlternative={replaceExerciseInActiveWorkout}
      />

      <WeightEditModal
        isOpen={activeWeightEditor !== null}
        initialWeight={activeWeightEditor?.initialWeight || 0}
        exerciseIndex={activeWeightEditor?.exIdx ?? 0}
        setIndex={activeWeightEditor?.setIdx ?? 0}
        onClose={() => setActiveWeightEditor(null)}
        onSave={handleSaveWeight}
      />

      {/* Learn Exercise Info Modal */}
      <ExerciseInfoModal 
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        exerciseName={infoExerciseName}
        fallbackEquipment={infoExerciseEquipment}
        fallbackTargetMuscle={infoExerciseMuscle}
      />

      {/* MODAL: Add Exercise from Library */}
      {addExerciseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-background-card border border-border rounded-3xl max-w-lg w-full p-6 relative shadow-2xl animate-slide-up">
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-accent-emerald/20 border border-accent-emerald/40 flex items-center justify-center text-accent-emerald">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-accent-emerald">{t('exerciseDirectory')}</span>
                  <h3 className="text-lg font-bold text-white">{t('addAnotherExercise')}</h3>
                </div>
              </div>
              <button
                onClick={() => setAddExerciseModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-full bg-background-elevated"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchExQuery}
              onChange={e => setSearchExQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-background-elevated border border-border rounded-2xl text-white font-medium mb-4 focus:outline-none focus:border-accent-emerald"
            />

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {filteredExercisesToAdd.map(ex => (
                <div
                  key={ex.id}
                  onClick={() => {
                    setInfoExerciseName(ex.name);
                    setInfoExerciseEquipment(ex.equipment);
                    setInfoExerciseMuscle(ex.muscleGroup);
                    setInfoModalOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-background-elevated hover:bg-background-hover border border-border hover:border-accent-emerald/40 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex-shrink-0">
                      <ExerciseThumbnail exerciseName={ex.name} images={ex.images} equipment={ex.equipment} className="w-full h-full" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">{ex.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{ex.muscleGroup} • {ex.equipment}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addExerciseToActiveWorkout(ex.id);
                      setAddExerciseModalOpen(false);
                      setSearchExQuery('');
                    }}
                    className="text-xs font-bold text-accent-emerald bg-accent-emerald/10 hover:bg-accent-emerald/20 px-3 py-1.5 rounded-xl transition-colors shrink-0 ml-2"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
