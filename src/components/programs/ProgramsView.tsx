import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Copy, 
  Trash2, 
  Edit3, 
  Play, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Dumbbell,
  Check,
  Share2,
  Loader2,
  Download
} from 'lucide-react';
import { ProgramImportModal } from './ProgramImportModal';
import { useWorkout } from '../../context/WorkoutContext';
import { Program, ProgramWorkout, WorkoutExercise } from '../../types';
import { getExerciseById } from '../../data/mockExercises';
import { getExerciseDisplayName } from '../../i18n/fitnessDictionary';

interface ProgramsViewProps {
  onNavigate: (tab: string) => void;
  onOpenAIGenerator: () => void;
}

export const ProgramsView: React.FC<ProgramsViewProps> = ({ onNavigate, onOpenAIGenerator }) => {
  const { user, programs, startWorkout, language } = useWorkout();
  const [selectedProgramId, setSelectedProgramId] = useState<string>(programs[0]?.id || '');
  const [selectedWeekNum, setSelectedWeekNum] = useState<number>(1);
  const [editingWorkout, setEditingWorkout] = useState<ProgramWorkout | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const currentProgram = programs.find(p => p.id === selectedProgramId) || programs[0];
  const currentWeek = currentProgram?.weeks.find(w => w.weekNumber === selectedWeekNum) || currentProgram?.weeks[0];

  const handleShareProgram = async () => {
    if (!currentProgram) return;
    setIsSharing(true);
    try {
      const { supabase } = await import('../../services/supabase');
      // Generate a short ID
      const shortId = `AZMK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      const { error } = await supabase
        .from('shared_programs')
        .insert([
          {
            id: shortId,
            program_data: currentProgram,
          }
        ]);

      if (error) {
        console.error('Error sharing program:', error);
        alert(language === 'ar' ? 'حدث خطأ أثناء رفع الجدول.' : 'Failed to upload program.');
        setIsSharing(false);
        return;
      }

      await navigator.clipboard.writeText(shortId);
      alert(language === 'ar' ? `تم نسخ كود المشاركة (${shortId}) بنجاح!` : `Share code (${shortId}) copied to clipboard!`);
    } catch (err: any) {
      console.error(err);
      // Fallback for clipboard or detailed error message
      const errMsg = err?.message || String(err);
      alert((language === 'ar' ? 'حدث خطأ غير متوقع: ' : 'Unexpected error: ') + errMsg);
    }
    setIsSharing(false);
  };

  const handleStartProgramWorkout = (workout: ProgramWorkout) => {
    const workoutExercises: WorkoutExercise[] = workout.exercises.map((item, idx) => {
      const numSets = item.targetSets || 3;
      const parsedRep = parseInt(item.targetReps, 10) || 8;
      const exObj = getExerciseById(item.exerciseId);

      let initialWeight = 30;
      if (exObj.equipment === 'Bodyweight') initialWeight = 0;
      else if (exObj.id.includes('squat')) initialWeight = 80;
      else if (exObj.id.includes('deadlift')) initialWeight = 100;
      else if (exObj.id.includes('bench')) initialWeight = 60;
      else if (exObj.id.includes('press') && exObj.equipment === 'Machine') initialWeight = 60;
      else if (exObj.id.includes('press') && exObj.equipment === 'Barbell') initialWeight = 40;
      else if (exObj.id.includes('press') && exObj.equipment === 'Dumbbell') initialWeight = 20;
      else if (exObj.id.includes('curl') || exObj.id.includes('raise') || exObj.id.includes('fly')) initialWeight = 12;
      else if (exObj.equipment === 'Barbell') initialWeight = 40;
      else if (exObj.equipment === 'Dumbbell') initialWeight = 16;
      else if (exObj.equipment === 'Cable') initialWeight = 25;
      else if (exObj.equipment === 'Machine') initialWeight = 40;

      return {
        id: `we_prog_${Date.now()}_${idx}`,
        exerciseId: item.exerciseId,
        order: idx + 1,
        restTimerSeconds: item.restSeconds || 90,
        sets: Array.from({ length: numSets }).map((_, sIdx) => ({
          id: `set_prog_${Date.now()}_${idx}_${sIdx}`,
          setNumber: sIdx + 1,
          weight: initialWeight,
          reps: parsedRep,
          isCompleted: false,
          previousWeight: Math.max(0, initialWeight - 2.5),
          previousReps: parsedRep,
          targetWeight: initialWeight,
          targetRepsMin: Math.max(1, parsedRep - 2),
          targetRepsMax: parsedRep
        }))
      };
    });

    startWorkout(workout.name, workoutExercises);
    onNavigate('active_workout');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background-card border border-border rounded-3xl p-6 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-accent-indigo">
              {language === 'ar' ? 'الجداول والخطط التدريبية' : 'PERIODIZATION & ROUTINES'}
            </span>
            {currentProgram?.isCustom && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-indigo/20 text-accent-indigo">
                {language === 'ar' ? 'خطة ذكية مخصصة' : 'AI Custom Plan'}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-white mt-1">{currentProgram?.name}</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">{currentProgram?.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              startWorkout(language === 'ar' ? 'تمرين مخصص جديد' : 'Custom Manual Workout', [
                {
                  id: `we_man_${Date.now()}_0`,
                  exerciseId: 'barbell_bench_press',
                  order: 1,
                  restTimerSeconds: 90,
                  sets: [
                    { id: `s_man_${Date.now()}_1`, setNumber: 1, weight: 60, reps: 8, isCompleted: false, previousWeight: 60, previousReps: 8, targetWeight: 62.5, targetRepsMin: 8, targetRepsMax: 10 }
                  ]
                }
              ]);
              onNavigate('active_workout');
            }}
            className="px-4 py-3 rounded-2xl bg-accent-emerald/15 hover:bg-accent-emerald/25 border border-accent-emerald/40 text-accent-emerald font-extrabold text-xs flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">{language === 'ar' ? '+ إضافة تمرين' : '+ Add Workout'}</span>
          </button>

          <button
            onClick={handleShareProgram}
            disabled={isSharing}
            className="px-4 py-3 rounded-2xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-400 font-extrabold text-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{language === 'ar' ? 'نسخ الكود' : 'Copy Code'}</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-slate-500/15 hover:bg-slate-500/25 border border-slate-500/40 text-slate-300 font-extrabold text-xs flex items-center gap-2 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'ar' ? 'استيراد كود' : 'Import Code'}</span>
          </button>

          <button
            onClick={() => {
              if (user.tier === 'free') {
                onNavigate('premium');
              } else {
                onOpenAIGenerator();
              }
            }}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-accent-indigo to-indigo-600 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-indigo transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-accent-cyan" />
            <span>{language === 'ar' ? 'توليد خطة جديدة بالـ AI' : 'Generate New AI Plan'}</span>
            {user.tier === 'free' && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold ml-1">
                PRO
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Program Selector Tabs if multiple programs exist */}
      {programs.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {programs.map(prog => (
            <button
              key={prog.id}
              onClick={() => {
                setSelectedProgramId(prog.id);
                setSelectedWeekNum(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedProgramId === prog.id
                  ? 'bg-accent-emerald text-black border-accent-emerald'
                  : 'bg-background-card text-slate-300 border-border hover:border-slate-600'
              }`}
            >
              {prog.name}
            </button>
          ))}
        </div>
      )}

      {/* Week Selector Chips */}
      <div className="bg-background-card border border-border rounded-2xl p-3 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-400 pl-2 rtl:pl-0 rtl:pr-2 uppercase font-mono">
          {language === 'ar' ? 'الأسابيع:' : 'Weeks:'}
        </span>
        {currentProgram?.weeks.map(w => (
          <button
            key={w.weekNumber}
            onClick={() => setSelectedWeekNum(w.weekNumber)}
            className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all whitespace-nowrap ${
              selectedWeekNum === w.weekNumber
                ? 'bg-accent-emerald/20 text-accent-emerald border border-accent-emerald/40 shadow-glow-sm'
                : 'bg-background-elevated text-slate-400 hover:text-white border border-border'
            }`}
          >
            {language === 'ar' ? `الأسبوع ${w.weekNumber}` : `Week ${w.weekNumber}`}
          </button>
        ))}
      </div>

      {/* Workouts in Selected Week */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {language === 'ar' ? `تمارين الأسبوع ${selectedWeekNum}` : (currentWeek?.title || `Week ${selectedWeekNum}`)}
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {currentWeek?.workouts.length || 0} {language === 'ar' ? 'تمارين مجدولة' : 'Workouts Scheduled'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentWeek?.workouts.map((workout, wIdx) => (
            <div
              key={workout.id}
              className="bg-background-card border border-border hover:border-slate-700 rounded-3xl p-5 shadow-card space-y-4 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-accent-emerald bg-accent-emerald/10 px-2.5 py-0.5 rounded-lg">
                    {workout.dayOfWeek || (language === 'ar' ? `اليوم ${wIdx + 1}` : `Day ${wIdx + 1}`)}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {workout.exercises.length} {language === 'ar' ? 'تمارين' : 'exercises'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-3">{workout.name}</h3>

                {/* Exercises list in workout */}
                <div className="space-y-2">
                  {workout.exercises.map((item, idx) => {
                    const ex = getExerciseById(item.exerciseId);
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-background-elevated/70 border border-border/80 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-mono font-bold">{idx + 1}.</span>
                          <span className="font-semibold text-slate-200">{getExerciseDisplayName(item.exerciseId, language)}</span>
                        </div>
                        <div className="font-mono text-slate-400">
                          <strong className="text-accent-emerald">{item.targetSets}</strong> {language === 'ar' ? 'جولات' : 'sets'} × <strong className="text-white">{item.targetReps}</strong> {language === 'ar' ? 'عدة' : 'reps'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Start Workout Button */}
              <div className="pt-2 border-t border-border flex items-center gap-2">
                <button
                  onClick={() => handleStartProgramWorkout(workout)}
                  className="w-full py-2.5 rounded-xl bg-accent-emerald hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-sm transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>{language === 'ar' ? 'بدء هذا التمرين الآن 🚀' : 'Start This Workout'}</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      <ProgramImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onImported={() => setIsImportModalOpen(false)} 
      />
    </div>
  );
};
