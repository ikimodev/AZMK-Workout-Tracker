import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Play, 
  Save, 
  CheckCircle2, 
  ArrowRight, 
  Dumbbell, 
  Calendar,
  Plus,
  Trash2,
  Edit3,
  Layers,
  FileText,
  Check
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { 
  parseWorkoutTextWithGemini, 
  parseSingleDayText,
  ParsedMultiDaySplit,
  matchExerciseId
} from '../../services/geminiService';
import { Program, WorkoutExercise } from '../../types';

interface AIWorkoutImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkoutStarted: () => void;
}

interface SplitDayDraft {
  dayName: string;
  rawExercisesText: string;
}

const DEFAULT_SPLIT_SAMPLES: Record<number, SplitDayDraft[]> = {
  2: [
    {
      dayName: 'Day 1 - Upper Body (الجزء العلوي)',
      rawExercisesText: `Barbell Bench Press 4x8 80kg\nBarbell Row 4x8 70kg\nOverhead Barbell Press 3x10 45kg\nLat Pulldown 3x10 60kg\nBarbell Bicep Curl 3x12 30kg\nTricep Rope Pushdown 3x12 25kg`
    },
    {
      dayName: 'Day 2 - Lower Body (الجزء السفلي)',
      rawExercisesText: `Barbell Back Squat 4x8 100kg\nRomanian Deadlift 3x8 80kg\nLeg Press 3x10 160kg\nLying Leg Curls 3x12 40kg\nStanding Calf Raises 4x15 50kg`
    }
  ],
  3: [
    {
      dayName: 'Day 1 - Push (صدر وتراي وأكتاف)',
      rawExercisesText: `Barbell Bench Press 4x8 80kg\nIncline Dumbbell Press 3x10 30kg\nDumbbell Lateral Raises 3x15 12kg\nTricep Rope Pushdown 3x12 25kg`
    },
    {
      dayName: 'Day 2 - Pull (ظهر وباي)',
      rawExercisesText: `Barbell Deadlift 4x5 120kg\nLat Pulldown 3x10 60kg\nBarbell Row 3x8 70kg\nBarbell Bicep Curl 3x10 30kg`
    },
    {
      dayName: 'Day 3 - Legs (أرجل وبطات)',
      rawExercisesText: `Barbell Back Squat 4x6 100kg\nRomanian Deadlift 3x8 80kg\nLeg Press 3x10 160kg\nLying Leg Curls 3x12 40kg`
    }
  ],
  4: [
    {
      dayName: 'Day 1 - Upper Power (علوي قوة)',
      rawExercisesText: `Barbell Bench Press 4x5 85kg\nBarbell Row 4x6 75kg\nOverhead Barbell Press 3x6 50kg\nPull Ups 3x8 0kg`
    },
    {
      dayName: 'Day 2 - Lower Power (سفلي قوة)',
      rawExercisesText: `Barbell Back Squat 4x5 110kg\nRomanian Deadlift 3x6 90kg\nLeg Press 3x8 180kg\nStanding Calf Raises 4x12 60kg`
    },
    {
      dayName: 'Day 3 - Upper Hypertrophy (علوي ضخامة)',
      rawExercisesText: `Incline Dumbbell Press 3x10 32kg\nLat Pulldown 3x10 65kg\nDumbbell Lateral Raises 4x12 14kg\nBarbell Bicep Curl 3x12 30kg\nTricep Rope Pushdown 3x12 25kg`
    },
    {
      dayName: 'Day 4 - Lower Hypertrophy (سفلي ضخامة)',
      rawExercisesText: `Barbell Back Squat 3x10 90kg\nLeg Press 3x12 150kg\nLying Leg Curls 3x12 45kg\nLeg Extensions 3x12 50kg`
    }
  ],
  5: [
    {
      dayName: 'Day 1 - Chest (صدر)',
      rawExercisesText: `Barbell Bench Press 4x8 80kg\nIncline Dumbbell Press 3x10 30kg\nDumbbell Chest Fly 3x12 16kg\nDips 3x10 0kg`
    },
    {
      dayName: 'Day 2 - Back (ظهر)',
      rawExercisesText: `Barbell Deadlift 4x5 120kg\nLat Pulldown 3x10 60kg\nBarbell Row 3x8 70kg\nSeated Cable Row 3x12 55kg`
    },
    {
      dayName: 'Day 3 - Shoulders & Traps (أكتاف وترابيس)',
      rawExercisesText: `Overhead Barbell Press 4x8 50kg\nDumbbell Lateral Raises 4x15 12kg\nFace Pulls 3x15 25kg\nDumbbell Shrugs 3x12 30kg`
    },
    {
      dayName: 'Day 4 - Legs (أرجل)',
      rawExercisesText: `Barbell Back Squat 4x8 100kg\nLeg Press 3x10 160kg\nRomanian Deadlift 3x8 80kg\nLying Leg Curls 3x12 40kg`
    },
    {
      dayName: 'Day 5 - Arms (ذراعين باي وتراي)',
      rawExercisesText: `Barbell Bicep Curl 3x10 30kg\nIncline Dumbbell Curl 3x12 14kg\nClose Grip Bench Press 3x8 60kg\nTricep Rope Pushdown 3x12 25kg`
    }
  ],
  6: [
    {
      dayName: 'Day 1 - Push 1 (صدر وتراي)',
      rawExercisesText: `Barbell Bench Press 4x8 80kg\nIncline Dumbbell Press 3x10 30kg\nDumbbell Lateral Raises 3x15 12kg\nTricep Rope Pushdown 3x12 25kg`
    },
    {
      dayName: 'Day 2 - Pull 1 (ظهر وباي)',
      rawExercisesText: `Barbell Deadlift 4x5 120kg\nLat Pulldown 3x10 60kg\nBarbell Row 3x8 70kg\nBarbell Bicep Curl 3x10 30kg`
    },
    {
      dayName: 'Day 3 - Legs 1 (سكوات)',
      rawExercisesText: `Barbell Back Squat 4x6 100kg\nLeg Press 3x10 160kg\nRomanian Deadlift 3x8 80kg\nLying Leg Curls 3x12 40kg`
    },
    {
      dayName: 'Day 4 - Push 2 (أكتاف وصدر علوي)',
      rawExercisesText: `Overhead Barbell Press 4x8 50kg\nIncline Barbell Press 3x8 65kg\nDumbbell Lateral Raises 4x12 14kg\nTricep Rope Pushdown 3x12 25kg`
    },
    {
      dayName: 'Day 5 - Pull 2 (سحب وعرض ظهر)',
      rawExercisesText: `Pull Ups 4x8 0kg\nSeated Cable Row 3x10 60kg\nLat Pulldown 3x12 55kg\nIncline Dumbbell Curl 3x12 14kg`
    },
    {
      dayName: 'Day 6 - Legs 2 (ديدلفت ورومانيان)',
      rawExercisesText: `Romanian Deadlift 4x8 85kg\nLeg Extensions 3x15 50kg\nLying Leg Curls 3x12 45kg\nStanding Calf Raises 4x15 50kg`
    }
  ]
};

export const AIWorkoutImportModal: React.FC<AIWorkoutImportModalProps> = ({ 
  isOpen, 
  onClose, 
  onWorkoutStarted 
}) => {
  const { user, updateUserProfile, startWorkout, saveGeneratedProgram, language, t } = useWorkout();
  const [startDayPref, setStartDayPref] = useState<'today' | 'tomorrow'>('today');

  // Input Mode: 'split_builder' (by individual days) or 'raw_full_text' (single block)
  const [inputMode, setInputMode] = useState<'split_builder' | 'raw_full_text'>('split_builder');

  // Multi-day split builder state
  const [daysCount, setDaysCount] = useState<number>(3);
  const [splitDays, setSplitDays] = useState<SplitDayDraft[]>(DEFAULT_SPLIT_SAMPLES[3]);
  const [activeTabDay, setActiveTabDay] = useState<number>(0);

  // Single raw full text state
  const [fullRawText, setFullRawText] = useState<string>(
`Day 1: Push (صدر وتراي)
Barbell Bench Press 4x8 80kg
Incline Dumbbell Press 3x10 30kg
Dumbbell Lateral Raises 3x15 12kg
Tricep Rope Pushdown 3x12 25kg

Day 2: Pull (ظهر وباي)
Barbell Deadlift 4x5 120kg
Lat Pulldown 3x10 60kg
Barbell Row 3x8 70kg
Barbell Bicep Curl 3x10 30kg

Day 3: Legs (أرجل)
Barbell Back Squat 4x6 100kg
Romanian Deadlift 3x8 80kg
Leg Press 3x10 160kg
Lying Leg Curls 3x12 40kg`
  );

  const [isParsing, setIsParsing] = useState(false);
  const [parsedSplit, setParsedSplit] = useState<ParsedMultiDaySplit | null>(null);
  const [activePreviewDayIndex, setActivePreviewDayIndex] = useState(0);

  if (!isOpen) return null;

  // Handle changing day count in split builder
  const handleSetDaysCount = (count: number) => {
    setDaysCount(count);
    const sample = DEFAULT_SPLIT_SAMPLES[count] || DEFAULT_SPLIT_SAMPLES[3];
    // Preserve existing days or pad
    const updated: SplitDayDraft[] = Array.from({ length: count }).map((_, idx) => {
      if (splitDays[idx]) return splitDays[idx];
      return sample[idx] || {
        dayName: `Day ${idx + 1} - Workout`,
        rawExercisesText: `Barbell Bench Press 3x8 60kg\nLat Pulldown 3x10 50kg\nBarbell Back Squat 3x8 80kg`
      };
    });
    setSplitDays(updated);
    if (activeTabDay >= count) setActiveTabDay(0);
  };

  // Update specific day's title (which is NEVER an exercise)
  const handleUpdateDayName = (index: number, name: string) => {
    setSplitDays(prev => prev.map((d, i) => i === index ? { ...d, dayName: name } : d));
  };

  // Update specific day's exercises text
  const handleUpdateDayExercises = (index: number, text: string) => {
    setSplitDays(prev => prev.map((d, i) => i === index ? { ...d, rawExercisesText: text } : d));
  };

  // Parse Multi-Day Builder Split
  const handleParseSplitBuilder = async () => {
    setIsParsing(true);
    try {
      const parsedDays = splitDays.map((d, dIdx) => {
        const exercises = parseSingleDayText(d.rawExercisesText);
        return {
          dayName: d.dayName.trim() || `Day ${dIdx + 1}`,
          dayNumber: dIdx + 1,
          exercises: exercises.length > 0 ? exercises : [
            {
              exerciseName: 'Barbell Bench Press',
              matchedExerciseId: 'barbell_bench_press',
              targetSets: 4,
              targetReps: '8',
              suggestedWeightKg: 60,
              restSeconds: 90
            }
          ]
        };
      });

      const res: ParsedMultiDaySplit = {
        isMultiDaySplit: parsedDays.length > 1,
        programName: language === 'ar' ? `جدول مخصص (${parsedDays.length} أيام)` : `Custom ${parsedDays.length}-Day AI Split`,
        days: parsedDays
      };

      setParsedSplit(res);
      setActivePreviewDayIndex(0);
    } catch (err) {
      console.error('Parse error:', err);
    } finally {
      setIsParsing(false);
    }
  };

  // Parse Full Raw Text with Gemini AI
  const handleParseFullText = async () => {
    if (!fullRawText.trim()) return;
    setIsParsing(true);
    try {
      const res = await parseWorkoutTextWithGemini(fullRawText);
      setParsedSplit(res);
      setActivePreviewDayIndex(0);

      // Also populate the builder splitDays from the AI parsed response!
      if (res && res.days.length > 0) {
        setDaysCount(res.days.length);
        setSplitDays(res.days.map(d => ({
          dayName: d.dayName,
          rawExercisesText: d.exercises.map(e => `${e.exerciseName} ${e.targetSets}x${e.targetReps} ${e.suggestedWeightKg}kg`).join('\n')
        })));
      }
    } catch (err) {
      console.error('Parse error:', err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleStartDayWorkout = (dayIdx: number) => {
    if (!parsedSplit) return;
    const targetDay = parsedSplit.days[dayIdx];
    if (!targetDay) return;

    const workoutExercises: WorkoutExercise[] = targetDay.exercises.map((item, idx) => {
      const numSets = item.targetSets || 3;
      const parsedRep = parseInt(item.targetReps, 10) || 8;
      const weight = item.suggestedWeightKg || 50;

      return {
        id: `we_imp_${Date.now()}_${idx}`,
        exerciseId: item.matchedExerciseId,
        order: idx + 1,
        restTimerSeconds: item.restSeconds || 90,
        sets: Array.from({ length: numSets }).map((_, sIdx) => ({
          id: `s_imp_${Date.now()}_${idx}_${sIdx}`,
          setNumber: sIdx + 1,
          weight: weight,
          reps: parsedRep,
          isCompleted: false,
          previousWeight: Math.max(0, weight - 2.5),
          previousReps: parsedRep,
          targetWeight: weight,
          targetRepsMin: Math.max(1, parsedRep - 2),
          targetRepsMax: parsedRep
        }))
      };
    });

    startWorkout(targetDay.dayName, workoutExercises);
    onWorkoutStarted();
    onClose();
  };

  const handleSaveAsFullProgram = () => {
    if (!parsedSplit) return;

    const programWorkouts = parsedSplit.days.map((d, dIdx) => ({
      id: `pw_imp_${Date.now()}_${dIdx}`,
      name: d.dayName,
      dayNumber: d.dayNumber,
      order: dIdx + 1,
      targetDurationMinutes: 60,
      exercises: d.exercises.map(e => ({
        exerciseId: e.matchedExerciseId,
        targetSets: e.targetSets,
        targetReps: e.targetReps,
        restSeconds: e.restSeconds,
        notes: e.notes
      }))
    }));

    const weeks = Array.from({ length: 4 }).map((_, wIdx) => ({
      weekNumber: wIdx + 1,
      title: wIdx === 3 ? 'Week 4: Deload & Active Recovery' : `Week ${wIdx + 1}: Progressive Overload`,
      isDeload: wIdx === 3,
      workouts: programWorkouts
    }));

    const newProg: Program = {
      id: `prog_ai_import_${Date.now()}`,
      name: parsedSplit.programName || (language === 'ar' ? 'جدول مخصص مستورد بالذكاء الاصطناعي' : 'Imported AI Split Routine'),
      description: language === 'ar' 
        ? `جدول تدريبي لـ 4 أسابيع تم تحليله وتوزيعه على ${parsedSplit.days.length} أيام أسبوعياً بالذكاء الاصطناعي.`
        : `4-Week protocol parsed & distributed across ${parsedSplit.days.length} days with periodized progression.`,
      goal: user.primaryGoal,
      experience: user.experience,
      durationWeeks: 4,
      daysPerWeek: parsedSplit.days.length,
      isCustom: true,
      weeks: weeks
    };

    saveGeneratedProgram(newProg);
    updateUserProfile({
      startDayOption: startDayPref,
      programStartDate: new Date().toISOString().split('T')[0]
    });
    alert(language === 'ar' 
      ? `تم حفظ وتفعيل جدول الـ ${parsedSplit.days.length} أيام بنجاح! يبدأ الجدول (${startDayPref === 'today' ? 'اليوم' : 'غداً'}).` 
      : `Split Program successfully saved and activated! Starting (${startDayPref}).`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in pb-safe pt-safe">
      <div className="bg-background-card border border-accent-cyan/40 rounded-3xl max-w-2xl w-full p-5 sm:p-7 relative shadow-2xl animate-slide-up max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-white p-2 rounded-full bg-background-elevated"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pr-8 rtl:pr-0 rtl:pl-8">
          <div className="w-10 h-10 rounded-2xl bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan shadow-glow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-accent-cyan">
                GEMINI 3.6 FLASH • AI SPLIT ARCHITECT
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {language === 'ar' ? 'استيراد وتقسيم جدول التمارين' : 'AI Multi-Day Split & Workout Importer'}
            </h2>
          </div>
        </div>

        {!parsedSplit ? (
          <div className="space-y-4">
            
            {/* Mode Switcher: By Days vs Raw Text */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-background-elevated rounded-2xl border border-border">
              <button
                type="button"
                onClick={() => setInputMode('split_builder')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  inputMode === 'split_builder'
                    ? 'bg-accent-cyan text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'تقسيم حسب الأيام (موصى به)' : 'Day-by-Day Split (Recommended)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMode('raw_full_text')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  inputMode === 'raw_full_text'
                    ? 'bg-accent-cyan text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'لصق نص كامل دفعة واحدة' : 'Paste Full Raw Text'}</span>
              </button>
            </div>

            {/* MODE 1: DAY-BY-DAY SPLIT BUILDER (2, 3, 4, 5, 6 Days) */}
            {inputMode === 'split_builder' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Number of Days Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 font-mono">
                    {language === 'ar' ? 'كم عدد أيام تمرينك في الأسبوع؟' : 'How many training days per week?'}
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[2, 3, 4, 5, 6].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleSetDaysCount(num)}
                        className={`py-2.5 rounded-xl border text-xs font-bold font-mono transition-all ${
                          daysCount === num
                            ? 'bg-accent-cyan text-black border-accent-cyan font-extrabold shadow-sm'
                            : 'bg-background-elevated border-border text-slate-300 hover:border-slate-600'
                        }`}
                      >
                        {num} {language === 'ar' ? 'أيام' : 'Days'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Day Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {splitDays.map((d, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveTabDay(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                        activeTabDay === idx
                          ? 'bg-accent-indigo text-white border-accent-indigo shadow-glow-indigo'
                          : 'bg-background-elevated text-slate-300 border-border hover:border-slate-600'
                      }`}
                    >
                      {d.dayName.split(':')[0].split('-')[0] || `Day ${idx + 1}`}
                    </button>
                  ))}
                </div>

                {/* Active Day Title & Exercises Inputs */}
                {splitDays[activeTabDay] && (
                  <div className="p-4 rounded-2xl bg-background-elevated border border-border space-y-3.5">
                    
                    {/* Day Title (Clearly NOT an exercise) */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-accent-cyan font-mono flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'عنوان هذا اليوم (لا يُعتبر تمرين):' : 'Day Title (Not counted as exercise):'}</span>
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {language === 'ar' ? `اليوم ${activeTabDay + 1} من ${splitDays.length}` : `Day ${activeTabDay + 1} of ${splitDays.length}`}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={splitDays[activeTabDay].dayName}
                        onChange={e => handleUpdateDayName(activeTabDay, e.target.value)}
                        placeholder="e.g. Day 1 - Push (صدر وتراي وأكتاف)"
                        className="w-full px-3.5 py-2.5 bg-background-card border border-border rounded-xl text-white text-xs font-bold focus:outline-none focus:border-accent-cyan"
                      />
                    </div>

                    {/* Exercises Text Box for THIS Day Only */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                        {language === 'ar' ? `تمارين (${splitDays[activeTabDay].dayName}):` : `Exercises for (${splitDays[activeTabDay].dayName}):`}
                      </label>
                      <textarea
                        rows={6}
                        value={splitDays[activeTabDay].rawExercisesText}
                        onChange={e => handleUpdateDayExercises(activeTabDay, e.target.value)}
                        placeholder={`Barbell Bench Press 4x8 80kg\nIncline Dumbbell Press 3x10 30kg\nDumbbell Lateral Raises 3x15 12kg`}
                        className="w-full p-3 bg-background-card border border-border rounded-xl text-white font-mono text-xs focus:outline-none focus:border-accent-cyan leading-relaxed"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        {language === 'ar' 
                          ? 'اكتب كل تمرين في سطر مع الجولات والعدات والوزن (مثل: بنش برس بار 4x8 80kg).'
                          : 'Write each exercise on a new line with sets, reps and weight (e.g. Bench Press 4x8 80kg).'}
                      </p>
                    </div>

                  </div>
                )}

                <button
                  onClick={handleParseSplitBuilder}
                  disabled={isParsing}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-accent-cyan to-cyan-500 hover:from-cyan-400 hover:to-cyan-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isParsing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>{language === 'ar' ? 'جاري تجهيز وتوزيع الجدول...' : 'Processing Split...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{language === 'ar' ? `اعتماد وتفعيل جدول الـ ${splitDays.length} أيام 🚀` : `Synthesize & Review ${splitDays.length}-Day Split`}</span>
                    </>
                  )}
                </button>

              </div>
            )}

            {/* MODE 2: RAW FULL TEXT IMPORT WITH GEMINI AI */}
            {inputMode === 'raw_full_text' && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">
                    {language === 'ar' ? 'الصق نص جدولك كاملاً:' : 'Full Workout Text:'}
                  </label>
                  <textarea
                    rows={9}
                    value={fullRawText}
                    onChange={e => setFullRawText(e.target.value)}
                    placeholder="Day 1: Push ... Day 2: Pull ... Day 3: Legs ..."
                    className="w-full p-3.5 bg-background-elevated border border-border rounded-2xl text-white font-mono text-xs focus:outline-none focus:border-accent-cyan leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleParseFullText}
                  disabled={isParsing}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-accent-cyan to-cyan-500 hover:from-cyan-400 hover:to-cyan-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isParsing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>{language === 'ar' ? 'الذكاء الاصطناعي يحلل ويوزع الأيام...' : 'Gemini AI is parsing and distributing days...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{language === 'ar' ? 'تحليل وتوزيع الجدول بالذكاء الاصطناعي (Gemini 3.6) 🚀' : 'Analyze & Distribute with Gemini AI'}</span>
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        ) : (
          /* PARSED RESULT PREVIEW WITH DAY TABS */
          <div className="space-y-4 animate-fade-in">
            
            {/* Split Title & Badge */}
            <div className="p-3.5 rounded-2xl bg-background-elevated border border-accent-cyan/40 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-accent-cyan uppercase font-mono">
                    {parsedSplit.isMultiDaySplit 
                      ? (language === 'ar' ? `جدول مقسم (${parsedSplit.days.length} أيام منفصلة)` : `Multi-Day Split (${parsedSplit.days.length} Separate Days)`)
                      : (language === 'ar' ? 'جلسة تمرين واحدة' : 'Single Workout Session')}
                  </span>
                </div>
                <h3 className="font-extrabold text-white text-base mt-0.5">{parsedSplit.programName}</h3>
              </div>
              <button
                onClick={() => setParsedSplit(null)}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                {language === 'ar' ? 'تعديل المدخلات' : 'Edit Inputs'}
              </button>
            </div>

            {/* Day Selector Tabs if Multi-Day Split */}
            {parsedSplit.days.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {parsedSplit.days.map((d, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePreviewDayIndex(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      activePreviewDayIndex === idx
                        ? 'bg-accent-cyan text-black border-accent-cyan shadow-sm'
                        : 'bg-background-elevated text-slate-300 border-border hover:border-slate-600'
                    }`}
                  >
                    {d.dayName.split(':')[0].split('-')[0] || `Day ${idx + 1}`}
                  </button>
                ))}
              </div>
            )}

            {/* Active Day Exercises List */}
            {parsedSplit.days[activePreviewDayIndex] && (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold">
                  <span className="text-white font-bold">{parsedSplit.days[activePreviewDayIndex].dayName}</span>
                  <span>({parsedSplit.days[activePreviewDayIndex].exercises.length} {language === 'ar' ? 'تمارين' : 'exercises'})</span>
                </div>

                {parsedSplit.days[activePreviewDayIndex].exercises.map((ex, exIdx) => (
                  <div 
                    key={exIdx}
                    className="p-3 rounded-2xl bg-background-elevated/70 border border-border flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-accent-cyan/15 flex items-center justify-center text-accent-cyan font-bold text-xs">
                        {exIdx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-white">{ex.exerciseName}</p>
                        <p className="text-[11px] text-slate-400">
                          {ex.targetSets} {language === 'ar' ? 'جولات' : 'sets'} × {ex.targetReps} {language === 'ar' ? 'عدات' : 'reps'} @ {ex.suggestedWeightKg}kg
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-slate-400">
                      {ex.restSeconds}s rest
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Start Day Preference if Saving Full Split */}
            {parsedSplit.isMultiDaySplit && (
              <div className="p-3.5 rounded-2xl bg-background-elevated border border-border space-y-2">
                <label className="block text-xs font-bold text-slate-300 font-mono">
                  {language === 'ar' ? 'متى تريد بدء هذا الجدول؟' : 'When would you like to start this routine?'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStartDayPref('today')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      startDayPref === 'today'
                        ? 'bg-accent-emerald text-black border-accent-emerald shadow-sm'
                        : 'bg-background-card text-slate-300 border-border hover:border-slate-600'
                    }`}
                  >
                    {language === 'ar' ? '🟢 ابدأ اليوم (Day 1 اليوم)' : '🟢 Start Today'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStartDayPref('tomorrow')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      startDayPref === 'tomorrow'
                        ? 'bg-accent-cyan text-black border-accent-cyan shadow-sm'
                        : 'bg-background-card text-slate-300 border-border hover:border-slate-600'
                    }`}
                  >
                    {language === 'ar' ? '🔵 ابدأ غداً (اليوم راحة وتجهيز)' : '🔵 Start Tomorrow'}
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              {/* Start this specific day right now */}
              <button
                onClick={() => handleStartDayWorkout(activePreviewDayIndex)}
                className="flex-1 py-3 px-4 rounded-2xl bg-accent-emerald hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-sm transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>
                  {language === 'ar' 
                    ? `بدء تمرين (${parsedSplit.days[activePreviewDayIndex]?.dayName.split(':')[0].split('-')[0]}) الآن` 
                    : `Start ${parsedSplit.days[activePreviewDayIndex]?.dayName.split(':')[0]} Now`}
                </span>
              </button>

              {/* Save entire multi-day split as a 4-week program */}
              {parsedSplit.isMultiDaySplit && (
                <button
                  onClick={handleSaveAsFullProgram}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-accent-indigo to-indigo-600 hover:from-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-indigo transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {language === 'ar' 
                      ? `حفظ وتفعيل الجدول لـ 4 أسابيع (${parsedSplit.days.length} أيام)` 
                      : `Save Full ${parsedSplit.days.length}-Day Program`}
                  </span>
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
