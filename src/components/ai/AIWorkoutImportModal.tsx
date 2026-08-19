import React, { useState } from 'react';
import { Sparkles, X, Play, Save, CheckCircle2, ArrowRight, Dumbbell, Calendar, Key, Info } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { 
  parseWorkoutTextWithGemini, 
  ParsedMultiDaySplit, 
  getGeminiApiKey, 
  setGeminiApiKey 
} from '../../services/geminiService';
import { Program, WorkoutExercise } from '../../types';

interface AIWorkoutImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkoutStarted: () => void;
}

export const AIWorkoutImportModal: React.FC<AIWorkoutImportModalProps> = ({ 
  isOpen, 
  onClose, 
  onWorkoutStarted 
}) => {
  const { user, startWorkout, saveGeneratedProgram, language, t } = useWorkout();

  const [rawText, setRawText] = useState(
`Day 1: Push
Barbell Bench Press 4x8 80kg
Incline Dumbbell Press 3x10 30kg
Dumbbell Lateral Raises 3x15 12kg
Tricep Rope Pushdown 3x12 25kg

Day 2: Pull
Barbell Deadlift 4x5 120kg
Lat Pulldown 3x10 60kg
Barbell Row 3x8 70kg
Barbell Bicep Curl 3x10 30kg

Day 3: Legs
Barbell Back Squat 4x6 100kg
Romanian Deadlift 3x8 80kg
Leg Press 3x10 160kg
Lying Leg Curls 3x12 40kg`
  );

  const [isParsing, setIsParsing] = useState(false);
  const [parsedSplit, setParsedSplit] = useState<ParsedMultiDaySplit | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getGeminiApiKey());

  if (!isOpen) return null;

  const handleParse = async () => {
    if (!rawText.trim()) return;
    setIsParsing(true);
    try {
      const res = await parseWorkoutTextWithGemini(rawText);
      setParsedSplit(res);
      setActiveDayIndex(0);
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
    alert(language === 'ar' ? 'تم حفظ وتفعيل الجدول بنجاح في خططك التدريبية!' : 'Split Program successfully saved and activated!');
    onClose();
  };

  const handleSaveApiKey = () => {
    setGeminiApiKey(apiKeyInput);
    setShowKeyInput(false);
    alert(language === 'ar' ? 'تم حفظ مفتاح Gemini API بنجاح!' : 'Gemini API Key saved successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in pb-safe pt-safe">
      <div className="bg-background-card border border-accent-cyan/40 rounded-3xl max-w-2xl w-full p-5 sm:p-7 relative shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-white p-2 rounded-full bg-background-elevated"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between mb-4 pr-8 rtl:pr-0 rtl:pl-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan shadow-glow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-accent-cyan">
                  GEMINI 1.5 FLASH • REAL AI
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {language === 'ar' ? 'استيراد وتحليل جدول التمارين الذكي' : 'AI Split & Workout Importer'}
              </h2>
            </div>
          </div>

          {/* Gemini API Key config button */}
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-background-elevated hover:bg-background-hover border border-border text-[11px] font-bold text-slate-300 transition-all"
            title="Configure Google Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-accent-cyan" />
            <span>{getGeminiApiKey() ? (language === 'ar' ? 'مفتاح AI مفعل ✅' : 'AI Key Active ✅') : (language === 'ar' ? 'إدخال مفتاح AI' : 'API Key')}</span>
          </button>
        </div>

        {/* API Key Drawer */}
        {showKeyInput && (
          <div className="mb-4 p-4 rounded-2xl bg-background-elevated border border-accent-cyan/40 space-y-3 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Key className="w-4 h-4 text-accent-cyan" />
                <span>{language === 'ar' ? 'مفتاح Google Gemini API' : 'Google Gemini API Key'}</span>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-accent-cyan underline hover:text-cyan-300"
              >
                {language === 'ar' ? 'احصل على مفتاح مجاني من Google ↗' : 'Get free key from Google AI Studio ↗'}
              </a>
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 px-3 py-2 bg-background-card border border-border rounded-xl text-white font-mono text-xs focus:outline-none focus:border-accent-cyan"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 bg-accent-cyan hover:bg-cyan-400 text-black font-bold text-xs rounded-xl"
              >
                {language === 'ar' ? 'حفظ' : 'Save'}
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          {language === 'ar'
            ? 'اكتب أو الصق تمارينك بالعامية أو بأي لغة (سواء يوم واحد أو جدول كامل لعدة أيام). سيقوم الذكاء الاصطناعي بتوزيع كل يوم في جدوله الخاص بدقة تامة وبدون تكديس التمارين!'
            : 'Paste your workout (single day or full multi-day split). Real Gemini AI will parse, organize each day separately into proper split slots, and set up your tracker.'}
        </p>

        {!parsedSplit ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 font-mono">
                {language === 'ar' ? 'نص التمارين أو الجدول:' : 'Workout / Split Text:'}
              </label>
              <textarea
                rows={9}
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="Day 1: Push ... Day 2: Pull ... Day 3: Legs ..."
                className="w-full p-3.5 bg-background-elevated border border-border rounded-2xl text-white font-mono text-xs focus:outline-none focus:border-accent-cyan leading-relaxed"
              />
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => setRawText(
`Day 1: Push (صدر وتراي)
بنش برس بار 4 جولات 80 كيلو 8 عدات
تجميع دمبلز مائل 3x10 28kg
رفرفة اكتاف جانبي 3x15 12kg
ترايسبس حبل كيبل 3x12 25kg

Day 2: Pull (ظهر وباي)
ديدلفت 4x5 120kg
سحب ظهر علوي Lat Pulldown 3x10 65kg
سحب بار للظهر 3x8 70kg
بايسبس دمبلز تبادل 3x10 16kg

Day 3: Legs (أرجل)
سكوات بار حر 4x8 100kg
رومانيان ديدلفت RDL 3x8 80kg
دفع ارجل Leg Press 3x10 160kg
سمانة واقف 4x15 50kg`
                )}
                className="text-[11px] font-semibold text-accent-cyan hover:underline"
              >
                {language === 'ar' ? '📋 تجربة نموذج جدول 3 أيام (عربي)' : '📋 Load 3-Day Split Sample'}
              </button>
            </div>

            <button
              onClick={handleParse}
              disabled={isParsing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-accent-cyan to-cyan-500 hover:from-cyan-400 hover:to-cyan-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isParsing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>{language === 'ar' ? 'الذكاء الاصطناعي يحلل الجدول ويوزع الأيام...' : 'Gemini AI is parsing days and exercises...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'ar' ? 'تحليل وتوزيع الجدول بالذكاء الاصطناعي 🚀' : 'Analyze & Distribute with Gemini AI'}</span>
                </>
              )}
            </button>
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
                {language === 'ar' ? 'تعديل النص' : 'Edit Text'}
              </button>
            </div>

            {/* Day Selector Tabs if Multi-Day Split */}
            {parsedSplit.days.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {parsedSplit.days.map((d, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveDayIndex(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                      activeDayIndex === idx
                        ? 'bg-accent-cyan text-black border-accent-cyan shadow-sm'
                        : 'bg-background-elevated text-slate-300 border-border hover:border-slate-600'
                    }`}
                  >
                    {d.dayName.split(':')[0] || `Day ${idx + 1}`}
                  </button>
                ))}
              </div>
            )}

            {/* Active Day Exercises List */}
            {parsedSplit.days[activeDayIndex] && (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold">
                  <span>{parsedSplit.days[activeDayIndex].dayName} ({parsedSplit.days[activeDayIndex].exercises.length} {language === 'ar' ? 'تمارين' : 'exercises'})</span>
                </div>

                {parsedSplit.days[activeDayIndex].exercises.map((ex, exIdx) => (
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

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              {/* Start this specific day right now */}
              <button
                onClick={() => handleStartDayWorkout(activeDayIndex)}
                className="flex-1 py-3 px-4 rounded-2xl bg-accent-emerald hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-sm transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>
                  {language === 'ar' 
                    ? `بدء تمرين (${parsedSplit.days[activeDayIndex]?.dayName.split(':')[0]}) الآن` 
                    : `Start ${parsedSplit.days[activeDayIndex]?.dayName.split(':')[0]} Now`}
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
                      ? `حفظ الجدول بالكامل لـ 4 أسابيع (${parsedSplit.days.length} أيام)` 
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
