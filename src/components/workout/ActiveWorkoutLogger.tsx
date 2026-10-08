import React, { useState, useEffect } from 'react';
import { 
  Play, Check, Trash2, Copy, RefreshCw, ArrowUp, ArrowDown, Sparkles, Clock, Weight, Trophy, AlertCircle, HelpCircle, MoreVertical, Flame, Dumbbell, Plus, X, MoreHorizontal, FileText, Calendar, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkout } from '../../context/WorkoutContext';
import { getExerciseById, getAllExercises } from '../../data/mockExercises';
import { ExerciseReplaceModal } from './ExerciseReplaceModal';
import ExerciseInfoModal from './ExerciseInfoModal';
import { ActiveExerciseCard } from './ActiveExerciseCard';
import { WeightEditModal } from './WeightEditModal';

interface ActiveWorkoutLoggerProps {
  onNavigate: (tab: string) => void;
}

export const ActiveWorkoutLogger: React.FC<ActiveWorkoutLoggerProps> = ({ onNavigate }) => {
  const { 
    activeWorkout, workoutDuration, history, addSetToExercise, updateSet, updateExercise, updateWorkoutDate, deleteSet, duplicateSet, toggleSetCompleted, addExerciseToActiveWorkout, replaceExerciseInActiveWorkout, removeExerciseFromActiveWorkout, reorderExercisesInActiveWorkout, finishActiveWorkout, cancelActiveWorkout, language, t, isRestTimerActive
  } = useWorkout();

  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [replacingExerciseIndex, setReplacingExerciseIndex] = useState<number | null>(null);
  const [replacingExerciseId, setReplacingExerciseId] = useState<string | null>(null);
  const [addExerciseModalOpen, setAddExerciseModalOpen] = useState(false);
  const [showNotesFor, setShowNotesFor] = useState<Record<string, boolean>>({});
  const [activeMenuExIdx, setActiveMenuExIdx] = useState<number | null>(null);
  const [searchExQuery, setSearchExQuery] = useState('');
  const [activeWeightEditor, setActiveWeightEditor] = useState<{ exIdx: number; setIdx: number; initialWeight: number } | null>(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoExerciseName, setInfoExerciseName] = useState('');
  const [infoExerciseEquipment, setInfoExerciseEquipment] = useState('');
  const [infoExerciseMuscle, setInfoExerciseMuscle] = useState('');
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!activeWorkout) return;
    const currentWorkoutEx = activeWorkout.exercises[activeExerciseIndex];
    if (!currentWorkoutEx) return;
    
    const totalSets = currentWorkoutEx.sets.length;
    const completedSetsCount = currentWorkoutEx.sets.filter(s => s.isCompleted).length;
    const isCompleted = totalSets > 0 && completedSetsCount === totalSets;

    if (isCompleted && !completedExercises[currentWorkoutEx.exerciseId]) {
      setCompletedExercises(prev => ({ ...prev, [currentWorkoutEx.exerciseId]: true }));
      if (activeExerciseIndex < activeWorkout.exercises.length - 1) {
        const timer = setTimeout(() => {
          setActiveExerciseIndex(i => i + 1);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [activeWorkout, activeExerciseIndex, completedExercises]);

  if (!activeWorkout) {
    return (
      <div className="p-8 text-center bg-background-card rounded-3xl border border-border">
        <Dumbbell className="w-12 h-12 text-slate-500 mx-auto mb-3 animate-pulse" />
        <h2 className="text-xl font-bold text-white mb-2">{t('noActiveWorkout')}</h2>
        <p className="text-sm text-slate-400 mb-6" dir="auto">{t('noActiveWorkoutDesc')}</p>
        <button onClick={() => onNavigate('dashboard')} className="px-6 py-3 rounded-2xl bg-accent-emerald text-black font-extrabold text-sm shadow-glow-sm">{t('goToDashboard')}</button>
      </div>
    );
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredExercisesToAdd = getAllExercises().filter(ex => 
    ex.name.toLowerCase().includes(searchExQuery.toLowerCase()) ||
    ex.muscleGroup.toLowerCase().includes(searchExQuery.toLowerCase())
  );

  const openInfoModal = (name: string, equipment?: string, muscle?: string) => {
    setInfoExerciseName(name); setInfoExerciseEquipment(equipment || ''); setInfoExerciseMuscle(muscle || ''); setInfoModalOpen(true);
  };

  const handleSaveWeight = (exIdx: number, setIdx: number, newWeight: number) => {
    if (!activeWorkout) return;
    const exercise = activeWorkout.exercises[exIdx];
    if (!exercise) return;
    const oldWeight = exercise.sets[setIdx].weight || 0;
    updateSet(exIdx, setIdx, { weight: newWeight });
    if (setIdx === 0) {
      exercise.sets.forEach((set, idx) => {
        if (idx > 0 && !set.isCompleted && (set.weight || 0) === oldWeight) {
          updateSet(exIdx, idx, { weight: newWeight });
        }
      });
    }
  };

  const goToNextExercise = () => {
    if (activeExerciseIndex < activeWorkout.exercises.length - 1) setActiveExerciseIndex(i => i + 1);
  };
  const goToPrevExercise = () => {
    if (activeExerciseIndex > 0) setActiveExerciseIndex(i => i - 1);
  };

  if (activeExerciseIndex >= activeWorkout.exercises.length && activeWorkout.exercises.length > 0) {
    setActiveExerciseIndex(activeWorkout.exercises.length - 1);
  }

  const currentWorkoutEx = activeWorkout.exercises[activeExerciseIndex];

  return (
    <div className={`space-y-4 pb-[80px] animate-fade-in max-w-xl mx-auto ${isRestTimerActive ? 'pb-[160px]' : ''}`}>
      <div className="bg-background-card/85 border border-border rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 sticky top-2 sm:top-6 z-40 backdrop-blur-xl">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {!activeWorkout.isManualLog ? <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent-emerald animate-ping" /> : <Calendar className="w-3 h-3 text-accent-indigo" />}
              <span className={`text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider leading-none ${activeWorkout.isManualLog ? 'text-accent-indigo' : 'text-accent-emerald'}`}>
                {activeWorkout.isManualLog ? 'MANUAL LOG' : t('liveLoggingMode')}
              </span>
            </div>
            <h1 className="text-base sm:text-2xl font-black text-white mt-1 line-clamp-1">{activeWorkout.name}</h1>
          </div>
          {!activeWorkout.isManualLog && (
            <div className="sm:hidden flex items-center gap-1 px-2 py-1 rounded-lg bg-background-elevated border border-border text-white font-mono font-bold text-[11px]">
              <Clock className="w-3 h-3 text-accent-emerald" />
              <span>{formatTimer(workoutDuration)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button onClick={() => { if (confirm(t('discardConfirm'))) { cancelActiveWorkout(); onNavigate('dashboard'); } }} className="flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-xl bg-background-elevated hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 text-[11px] sm:text-xs font-bold border border-border transition-all flex items-center justify-center gap-1">
              <X className="w-3.5 h-3.5" /><span>{t('discard')}</span>
            </button>
            <button onClick={() => { finishActiveWorkout(); }} className="flex-[2] sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-accent-emerald to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-glow-sm transition-all">
              <Check className="w-4 h-4 stroke-[3]" /><span>{activeWorkout.isManualLog ? 'Save Manual Log' : t('finishWorkout')}</span>
            </button>
          </div>
        </div>
      </div>

      {currentWorkoutEx ? (
        <ActiveExerciseCard 
          workoutEx={currentWorkoutEx} 
          exIdx={activeExerciseIndex} 
          openInfoModal={openInfoModal} 
          setActiveWeightEditor={setActiveWeightEditor}
          onReplace={() => { setReplacingExerciseId(currentWorkoutEx.exerciseId); setReplacingExerciseIndex(activeExerciseIndex); setReplaceModalOpen(true); }}
          onToggleNotes={() => {}}
          showNotes={false}
          onOpenYoutube={(q) => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, '_blank')}
          onOpenMenu={() => setActiveMenuExIdx(activeExerciseIndex)}
        />
      ) : (
        <div className="p-8 text-center text-slate-400">No exercises left.</div>
      )}

      {/* Exercise Navigation Bar */}
      <div className="flex items-center justify-between px-2 pt-2">
        <button 
          onClick={goToPrevExercise}
          disabled={activeExerciseIndex === 0}
          className="px-4 py-3 bg-background-card rounded-2xl flex items-center justify-center border border-border disabled:opacity-30 active:scale-95 transition-all w-[100px]"
        >
          <ChevronLeft className="w-5 h-5 text-slate-300" />
        </button>
        <div className="flex-1 flex justify-center text-sm font-bold font-mono text-slate-400">
          {activeWorkout.exercises.length > 0 ? `${activeExerciseIndex + 1} / ${activeWorkout.exercises.length}` : '0 / 0'}
        </div>
        <button 
          onClick={goToNextExercise}
          disabled={activeExerciseIndex === activeWorkout.exercises.length - 1}
          className="px-4 py-3 bg-background-card rounded-2xl flex items-center justify-center border border-border disabled:opacity-30 active:scale-95 transition-all w-[100px]"
        >
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      <div className="pt-2 pb-6">
        <button onClick={() => setAddExerciseModalOpen(true)} className="w-full py-4 rounded-3xl bg-background-card hover:bg-background-elevated border border-dashed border-border hover:border-slate-500 text-slate-400 font-bold text-sm flex items-center justify-center gap-2 transition-all">
          <Plus className="w-4 h-4 text-accent-emerald" /><span>Add Another Exercise</span>
        </button>
      </div>

      {/* MODALS */}
      <ExerciseReplaceModal isOpen={replaceModalOpen} onClose={() => { setReplaceModalOpen(false); setReplacingExerciseIndex(null); setReplacingExerciseId(null); }} currentExerciseId={replacingExerciseId} exerciseIndex={replacingExerciseIndex} onSelectAlternative={replaceExerciseInActiveWorkout} />
      <WeightEditModal isOpen={activeWeightEditor !== null} initialWeight={activeWeightEditor?.initialWeight || 0} exerciseIndex={activeWeightEditor?.exIdx ?? 0} setIndex={activeWeightEditor?.setIdx ?? 0} onClose={() => setActiveWeightEditor(null)} onSave={handleSaveWeight} />
      <ExerciseInfoModal isOpen={infoModalOpen} onClose={() => setInfoModalOpen(false)} exerciseName={infoExerciseName} fallbackEquipment={infoExerciseEquipment} fallbackTargetMuscle={infoExerciseMuscle} />
      
      {/* Global Exercise Menu Bottom Sheet */}
      <AnimatePresence>
        {activeMenuExIdx !== null && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setActiveMenuExIdx(null)}>
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-background-card w-full max-w-lg rounded-t-3xl border-t border-border shadow-2xl overflow-hidden relative pb-safe"
            >
              <div className="flex justify-center p-3"><div className="w-12 h-1.5 bg-border rounded-full" /></div>
              
              <div className="px-6 pb-6 pt-2 space-y-2">
                <button 
                  onClick={() => { setReplacingExerciseId(activeWorkout.exercises[activeMenuExIdx].exerciseId); setReplacingExerciseIndex(activeMenuExIdx); setActiveMenuExIdx(null); setReplaceModalOpen(true); }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-background-elevated transition-colors group"
                >
                  <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan group-hover:scale-110 transition-transform"><RefreshCw className="w-5 h-5" /></div><span className="font-bold text-white text-lg">Replace Exercise</span></div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </button>
                
                <button 
                  onClick={() => { 
                    if (activeMenuExIdx > 0) {
                      reorderExercisesInActiveWorkout(activeMenuExIdx, activeMenuExIdx - 1);
                      setActiveExerciseIndex(activeMenuExIdx - 1);
                    }
                    setActiveMenuExIdx(null);
                  }}
                  disabled={activeMenuExIdx === 0}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-background-elevated transition-colors group disabled:opacity-50"
                >
                  <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform"><ArrowUp className="w-5 h-5" /></div><span className="font-bold text-white text-lg">Move Up</span></div>
                </button>

                <button 
                  onClick={() => { 
                    if (activeMenuExIdx < activeWorkout.exercises.length - 1) {
                      reorderExercisesInActiveWorkout(activeMenuExIdx, activeMenuExIdx + 1);
                      setActiveExerciseIndex(activeMenuExIdx + 1);
                    }
                    setActiveMenuExIdx(null);
                  }}
                  disabled={activeMenuExIdx === activeWorkout.exercises.length - 1}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-background-elevated transition-colors group disabled:opacity-50"
                >
                  <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform"><ArrowDown className="w-5 h-5" /></div><span className="font-bold text-white text-lg">Move Down</span></div>
                </button>
                
                <button 
                  onClick={() => { 
                    if (confirm('Are you sure you want to remove this exercise?')) { 
                      removeExerciseFromActiveWorkout(activeMenuExIdx); 
                    } 
                    setActiveMenuExIdx(null); 
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-rose-500/10 transition-colors group"
                >
                  <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform"><Trash2 className="w-5 h-5" /></div><span className="font-bold text-rose-500 text-lg">Remove Exercise</span></div>
                </button>
                
                <button onClick={() => setActiveMenuExIdx(null)} className="w-full py-4 mt-2 rounded-xl bg-background-elevated text-slate-300 font-bold text-lg hover:text-white hover:bg-slate-700 transition-colors">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {addExerciseModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-background-card border border-border rounded-3xl max-w-lg w-full p-6 relative shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Add Exercise</h3>
              <button onClick={() => setAddExerciseModalOpen(false)} className="text-slate-400 p-1.5"><X className="w-4 h-4" /></button>
            </div>
            <input type="text" placeholder="Search..." value={searchExQuery} onChange={e => setSearchExQuery(e.target.value)} className="w-full px-4 py-2.5 bg-background-elevated border border-border rounded-2xl text-white mb-4" />
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {filteredExercisesToAdd.map(ex => (
                <div key={ex.id} className="p-3 rounded-2xl bg-background-elevated border border-border flex justify-between">
                  <div><p className="font-bold text-sm text-white">{ex.name}</p></div>
                  <button onClick={() => { addExerciseToActiveWorkout(ex.id); setAddExerciseModalOpen(false); setSearchExQuery(''); }} className="text-xs font-bold text-accent-emerald">+ Add</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
