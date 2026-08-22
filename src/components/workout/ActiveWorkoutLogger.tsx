import React, { useState } from 'react';
import { 
  Plus, 
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
  X
} from 'lucide-react';
import { YoutubeIcon } from '../common/YoutubeIcon';
import { useWorkout } from '../../context/WorkoutContext';
import { getExerciseById, getAllExercises } from '../../data/mockExercises';
import { getExerciseSummary, getNextSetRecommendation } from '../../services/progressiveOverload';
import { getExerciseDisplayName, getMuscleGroupDisplayName } from '../../i18n/fitnessDictionary';
import { ExerciseReplaceModal } from './ExerciseReplaceModal';

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
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [replacingExerciseIndex, setReplacingExerciseIndex] = useState<number | null>(null);
  const [replacingExerciseId, setReplacingExerciseId] = useState<string | null>(null);
  const [addExerciseModalOpen, setAddExerciseModalOpen] = useState(false);
  const [searchExQuery, setSearchExQuery] = useState('');
  const [activeRpeSelector, setActiveRpeSelector] = useState<{ exIdx: number; setIdx: number } | null>(null);

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

  return (
    <div className="space-y-6 pb-20 animate-fade-in max-w-4xl mx-auto">
      
      {/* Top Header & Sticky Action Bar */}
      <div className="bg-background-card border border-border rounded-3xl p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-[65px] z-30 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-emerald animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent-emerald">{t('liveLoggingMode')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">{activeWorkout.name}</h1>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Timer Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background-elevated border border-border text-white font-mono font-bold text-sm">
            <Clock className="w-4 h-4 text-accent-emerald" />
            <span>{formatTimer(workoutDuration)}</span>
          </div>

          {/* Discard Workout */}
          <button
            onClick={() => {
              if (confirm(t('discardConfirm'))) {
                cancelActiveWorkout();
                onNavigate('dashboard');
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-background-elevated hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 text-xs font-bold border border-border transition-all"
          >
            {t('discard')}
          </button>

          {/* Finish Workout CTA */}
          <button
            onClick={() => {
              const res = finishActiveWorkout();
              if (res) {
                // finished! Context will hold lastCompletedSession which triggers modal
              }
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-accent-emerald to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow-sm transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{t('finishWorkout')}</span>
          </button>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-6">
        {activeWorkout.exercises.map((workoutEx, exIdx) => {
          const exerciseInfo = getExerciseById(workoutEx.exerciseId);
          const exSummary = getExerciseSummary(workoutEx.exerciseId, history);
          const completedSets = workoutEx.sets.filter(s => s.isCompleted);
          const nextSetRec = getNextSetRecommendation(completedSets, exerciseInfo?.defaultReps || 8);

          return (
            <div 
              key={workoutEx.id}
              className="bg-background-card border border-border/90 rounded-3xl p-5 shadow-card space-y-4 hover:border-slate-700 transition-all"
            >
              
              {/* Exercise Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-background-elevated border border-border text-accent-emerald font-mono font-black text-xs flex items-center justify-center">
                    {exIdx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base sm:text-lg text-white font-mono">
                        {getExerciseDisplayName(workoutEx.exerciseId, language)}
                      </h3>
                      {exerciseInfo?.muscleGroup && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-background-elevated border border-border text-slate-300">
                          {getMuscleGroupDisplayName(exerciseInfo.muscleGroup, language)}
                        </span>
                      )}
                    </div>

                    {/* Previous vs Target Benchmark Line */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mt-1">
                      {exSummary.lastWeight > 0 ? (
                        <>
                          <span className="text-slate-400">
                            {t('last')}: <strong className="text-slate-200 font-mono">{exSummary.lastWeight}kg × {exSummary.lastReps}</strong>
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">
                            {t('best')}: <strong className="text-slate-200 font-mono">{exSummary.allTimeBestWeight}kg × {exSummary.allTimeBestReps}</strong>
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-accent-emerald flex items-center gap-1 font-bold font-mono" title="Suggested from last session (+2.5kg progressive overload)">
                            {t('target')}: {exSummary.targetWeight}kg × {exSummary.targetRepsMin}–{exSummary.targetRepsMax}
                            <span className="text-[10px] bg-accent-emerald/10 px-1 py-0.2 rounded">↑ +{exSummary.improvementPercentage}%</span>
                          </span>
                        </>
                      ) : (
                        <span className="text-accent-cyan flex items-center gap-1 font-bold font-mono text-[11px]">
                          {t('starterTargetRpe')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Exercise Action Tools */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  {/* Tutorial Search */}
                  {exerciseInfo?.youtubeQuery && (
                    <button
                      onClick={() => openYoutubeTutorial(exerciseInfo.youtubeQuery)}
                      title="Watch Tutorial Form on YouTube"
                      className="p-2 rounded-xl bg-background-elevated hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-border transition-all flex items-center gap-1 text-xs font-semibold"
                    >
                      <YoutubeIcon className="w-4 h-4 text-rose-500" />
                      <span className="hidden md:inline">{t('form')}</span>
                    </button>
                  )}

                  {/* Replace Exercise */}
                  <button
                    onClick={() => openReplaceModal(exIdx, workoutEx.exerciseId)}
                    title="Replace Exercise"
                    className="p-2 rounded-xl bg-background-elevated hover:bg-background-hover text-slate-300 border border-border transition-all flex items-center gap-1 text-xs font-semibold"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-accent-cyan" />
                    <span className="hidden md:inline">{t('swap')}</span>
                  </button>

                  {/* Reorder Up/Down */}
                  {exIdx > 0 && (
                    <button
                      onClick={() => reorderExercisesInActiveWorkout(exIdx, exIdx - 1)}
                      className="p-2 rounded-xl bg-background-elevated hover:bg-background-hover text-slate-400 hover:text-white border border-border"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {exIdx < activeWorkout.exercises.length - 1 && (
                    <button
                      onClick={() => reorderExercisesInActiveWorkout(exIdx, exIdx + 1)}
                      className="p-2 rounded-xl bg-background-elevated hover:bg-background-hover text-slate-400 hover:text-white border border-border"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Delete Exercise */}
                  <button
                    onClick={() => removeExerciseFromActiveWorkout(exIdx)}
                    className="p-2 rounded-xl bg-background-elevated hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-border"
                    title="Remove Exercise"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Sets Table */}
              <div className="p-4 sm:p-5 space-y-2.5">
                
                {/* Sets Header */}
                <div className="grid grid-cols-12 gap-2 text-center text-[11px] font-mono uppercase font-bold text-slate-400 px-2 pb-1 border-b border-border/60">
                  <div className="col-span-1">{t('setCol')}</div>
                  <div className="col-span-3">{t('previousCol')}</div>
                  <div className="col-span-3">{t('weightKgCol')}</div>
                  <div className="col-span-2">{t('repsCol')}</div>
                  <div className="col-span-2">{t('rpeCol')}</div>
                  <div className="col-span-1">{t('doneCol')}</div>
                </div>

                {/* Set Rows */}
                {workoutEx.sets.map((set, setIdx) => {
                  return (
                    <div 
                      key={set.id}
                      className={`grid grid-cols-12 gap-2 p-2 rounded-2xl items-center transition-all ${
                        set.isCompleted 
                          ? 'bg-emerald-950/20 border border-accent-emerald/30' 
                          : 'bg-background-elevated/60 border border-border/60 hover:bg-background-elevated'
                      }`}
                    >
                      {/* Set Number */}
                      <div className="col-span-1 flex items-center justify-center font-mono font-bold text-xs text-slate-300">
                        {set.setNumber}
                      </div>

                      {/* Previous Performance */}
                      <div className="col-span-3 text-center text-xs font-mono text-slate-400">
                        {set.previousWeight ? `${set.previousWeight} × ${set.previousReps}` : '—'}
                      </div>

                      {/* Weight Input (kg) with quick +/- buttons */}
                      <div className="col-span-3 flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => updateSet(exIdx, setIdx, { weight: Math.max(0, (set.weight || 0) - 2.5) })}
                          className="w-5 h-6 rounded bg-background-card hover:bg-background-elevated border border-border text-[10px] text-slate-400 font-bold"
                          title="-2.5kg"
                        >
                          -
                        </button>
                        <div className="relative w-full max-w-[65px]">
                          <input
                            type="number"
                            step="0.5"
                            inputMode="decimal"
                            value={set.weight || ''}
                            onChange={(e) => updateSet(exIdx, setIdx, { weight: parseFloat(e.target.value) || 0 })}
                            className={`w-full py-1.5 px-1 rounded-xl text-center font-mono font-bold text-sm bg-background-card border transition-all focus:outline-none focus:ring-1 focus:ring-accent-emerald ${
                              set.isCompleted ? 'border-accent-emerald/40 text-accent-emerald' : 'border-border text-white'
                            }`}
                            placeholder="0"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => updateSet(exIdx, setIdx, { weight: (set.weight || 0) + 2.5 })}
                          className="w-5 h-6 rounded bg-background-card hover:bg-background-elevated border border-border text-[10px] text-slate-400 font-bold"
                          title="+2.5kg"
                        >
                          +
                        </button>
                      </div>

                      {/* Reps Input */}
                      <div className="col-span-2 flex items-center justify-center">
                        <div className="relative w-full max-w-[70px]">
                          <input
                            type="number"
                            inputMode="numeric"
                            value={set.reps || ''}
                            onChange={(e) => updateSet(exIdx, setIdx, { reps: parseInt(e.target.value, 10) || 0 })}
                            className={`w-full py-1.5 px-2 rounded-xl text-center font-mono font-bold text-sm bg-background-card border transition-all focus:outline-none focus:ring-1 focus:ring-accent-emerald ${
                              set.isCompleted ? 'border-accent-emerald/40 text-accent-emerald' : 'border-border text-white'
                            }`}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      {/* Optional RPE Selector (Speed-First: Click to pick or keep default) */}
                      <div className="col-span-2 flex items-center justify-center relative">
                        <button
                          type="button"
                          onClick={() => {
                            if (activeRpeSelector?.exIdx === exIdx && activeRpeSelector?.setIdx === setIdx) {
                              setActiveRpeSelector(null);
                            } else {
                              setActiveRpeSelector({ exIdx, setIdx });
                            }
                          }}
                          className={`w-full py-1.5 px-1 rounded-xl text-center font-mono text-xs font-semibold border transition-all ${
                            set.rpe 
                              ? 'bg-accent-indigo/20 text-accent-indigo border-accent-indigo/40' 
                              : 'bg-background-card text-slate-400 border-border hover:border-slate-500'
                          }`}
                        >
                          {set.rpe ? `@ ${set.rpe}` : 'RPE'}
                        </button>

                        {/* RPE Popup Menu */}
                        {activeRpeSelector?.exIdx === exIdx && activeRpeSelector?.setIdx === setIdx && (
                          <div className="absolute top-10 z-50 bg-background-secondary border border-border p-2 rounded-2xl shadow-2xl flex flex-wrap gap-1 w-44 animate-slide-up">
                            {[6, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(val => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => {
                                  updateSet(exIdx, setIdx, { rpe: val });
                                  setActiveRpeSelector(null);
                                }}
                                className={`px-2 py-1 text-xs font-mono font-bold rounded-lg ${
                                  set.rpe === val ? 'bg-accent-indigo text-white' : 'bg-background-elevated text-slate-300 hover:bg-background-hover'
                                }`}
                              >
                                {val}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                updateSet(exIdx, setIdx, { rpe: undefined });
                                setActiveRpeSelector(null);
                              }}
                              className="w-full text-center text-[10px] text-slate-400 hover:text-white pt-1"
                            >
                              Clear RPE
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Complete Checkmark Button with Haptic Vibration */}
                      <div className="col-span-1 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                              navigator.vibrate(35);
                            }
                            toggleSetCompleted(exIdx, setIdx);
                          }}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                            set.isCompleted
                              ? 'bg-accent-emerald text-black shadow-glow-sm active:scale-90'
                              : 'bg-background-card hover:bg-background-hover text-slate-400 border border-border active:scale-95'
                          }`}
                        >
                          <Check className={`w-4 h-4 ${set.isCompleted ? 'stroke-[3]' : ''}`} />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* SMART NEXT SET RECOMMENDATION BANNER */}
              {completedSets.length > 0 && (
                <div className="p-3 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                    <span className="text-slate-300 font-medium">
                      {t('nextSetGuidance')}: <strong className="text-white font-mono">{nextSetRec.recommendedWeight}kg × {nextSetRec.recommendedReps}</strong> ({nextSetRec.note})
                    </span>
                  </div>
                </div>
              )}

              {/* Set Management Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => addSetToExercise(exIdx)}
                  className="px-3.5 py-2 rounded-xl bg-background-elevated hover:bg-background-hover text-accent-emerald text-xs font-bold border border-border flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('addSet')}</span>
                </button>

                {workoutEx.sets.length > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => duplicateSet(exIdx, workoutEx.sets.length - 1)}
                      className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-background-elevated text-xs transition-all flex items-center gap-1"
                      title="Duplicate last set"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t('duplicate')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteSet(exIdx, workoutEx.sets.length - 1)}
                      className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-background-elevated text-xs transition-all flex items-center gap-1"
                      title="Delete last set"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t('delete')}</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
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
        exerciseIndex={replacingExerciseIndex}
        currentExerciseId={replacingExerciseId}
        onClose={() => setReplaceModalOpen(false)}
        onSelectAlternative={replaceExerciseInActiveWorkout}
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
                    addExerciseToActiveWorkout(ex.id);
                    setAddExerciseModalOpen(false);
                    setSearchExQuery('');
                  }}
                  className="p-3 rounded-2xl bg-background-elevated hover:bg-background-hover border border-border hover:border-accent-emerald/40 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div>
                    <p className="font-bold text-sm text-white">{ex.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{ex.muscleGroup} • {ex.equipment}</p>
                  </div>
                  <span className="text-xs font-bold text-accent-emerald bg-accent-emerald/10 px-2.5 py-1 rounded-xl">
                    + Add
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
