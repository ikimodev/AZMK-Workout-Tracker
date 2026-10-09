import React, { useState, useEffect } from "react";
import {
  Sparkles, X, Save, CheckCircle2,
  Calendar, Edit3, Clipboard, HelpCircle, Dumbbell, Search
} from "lucide-react";
import { useWorkout } from "../../context/WorkoutContext";
import { parseWorkoutTextWithGemini, ParsedMultiDaySplit } from "../../services/geminiService";
import { Program } from "../../types";
import { getExerciseById, getAllExercises } from "../../data/mockExercises";

interface AIWorkoutImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkoutStarted: () => void;
}

type WizardStep = "input" | "review";

const DEFAULT_REST_MAP: Record<number, boolean[]> = {
  1: [false, true, true, true, true, true, true],
  2: [false, true, true, false, true, true, true],
  3: [false, true, false, true, false, true, true],
  4: [false, false, true, false, false, true, true],
  5: [false, false, false, true, false, false, true],
  6: [false, false, false, false, false, false, true],
  7: [false, false, false, false, false, false, false],
};

const SAMPLE_WORKOUT = `Day 1 - Push
Bench Press 4x8
Incline DB Press 3x10
Lateral Raises 3x15
Tricep Pushdowns 3x12

Day 2 - Pull
Barbell Rows 4x8
Lat Pulldown 3x10
Face Pulls 3x15
Bicep Curls 3x12

Day 3 - Legs
Barbell Squat 4x8
Leg Press 3x10
Lying Leg Curls 3x12
Calf Raises 4x15`;

export const AIWorkoutImportModal: React.FC<AIWorkoutImportModalProps> = ({ isOpen, onClose, onWorkoutStarted }) => {
  const { user, updateUserProfile, saveGeneratedProgram, language } = useWorkout();

  const [step, setStep] = useState<WizardStep>("input");
  const [fullRawText, setFullRawText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [parsedSplit, setParsedSplit] = useState<ParsedMultiDaySplit | null>(null);
  const [daysCount, setDaysCount] = useState<number>(3);
  const [restPattern, setRestPattern] = useState<boolean[]>(DEFAULT_REST_MAP[3]);
  const [startDayPref, setStartDayPref] = useState<"today" | "tomorrow">("today");

  const [swapState, setSwapState] = useState<{ dIdx: number; eIdx: number; searchQuery: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep("input");
      setFullRawText("");
      setParsedSplit(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setFullRawText(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleParse = async () => {
    if (!fullRawText.trim()) return;
    setIsParsing(true);
    try {
      const res = await parseWorkoutTextWithGemini(fullRawText);
      if (res && res.days && res.days.length > 0) {
        setParsedSplit(res);
        setDaysCount(res.days.length);
        setRestPattern(DEFAULT_REST_MAP[res.days.length] || DEFAULT_REST_MAP[4]);
        setStep("review");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsParsing(false);
    }
  };

  const confirmExercise = (dIdx: number, eIdx: number) => {
    if (!parsedSplit) return;
    const newSplit = JSON.parse(JSON.stringify(parsedSplit));
    newSplit.days[dIdx].exercises[eIdx].ambiguous = false;
    setParsedSplit(newSplit);
  };

  const swapExercise = (exId: string) => {
    if (!parsedSplit || !swapState) return;
    const { dIdx, eIdx } = swapState;
    const newSplit = JSON.parse(JSON.stringify(parsedSplit));
    newSplit.days[dIdx].exercises[eIdx].matchedExerciseId = exId;
    newSplit.days[dIdx].exercises[eIdx].ambiguous = false;
    setParsedSplit(newSplit);
    setSwapState(null);
  };

  const toggleRest = (idx: number) => {
    const newPattern = [...restPattern];
    newPattern[idx] = !newPattern[idx];
    setRestPattern(newPattern);
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
        exerciseId: e.matchedExerciseId || "",
        targetSets: e.targetSets,
        targetReps: e.targetReps,
        restSeconds: e.restSeconds,
        notes: e.notes
      }))
    }));

    const weeks = Array.from({ length: 4 }).map((_, wIdx) => ({
      weekNumber: wIdx + 1,
      title: wIdx === 3 ? "Week 4: Deload" : `Week ${wIdx + 1}`,
      isDeload: wIdx === 3,
      workouts: programWorkouts
    }));

    const newProg: Program = {
      id: `prog_ai_import_${Date.now()}`,
      name: parsedSplit.programName || (language === "ar" ? "جدول مستورد" : "Imported Routine"),
      description: language === "ar" ? "جدول تم إنشاؤه عبر الذكاء الاصطناعي" : "AI Imported Routine",
      goal: user.primaryGoal,
      experience: user.experience,
      durationWeeks: 4,
      daysPerWeek: parsedSplit.days.length,
      isCustom: true,
      weeks: weeks
    };

    saveGeneratedProgram(newProg);

    const startDayOffset = new Date().getDay(); 
    let currentDayOfWeek = startDayOffset === 0 ? 7 : startDayOffset;
    if (startDayPref === "tomorrow") {
      currentDayOfWeek = currentDayOfWeek === 7 ? 1 : currentDayOfWeek + 1;
    }

    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const newScheduledDays: string[] = [];

    restPattern.forEach((isRest, idx) => {
      const dOfWeek = ((currentDayOfWeek - 1 + idx) % 7) + 1; 
      if (!isRest) {
        newScheduledDays.push(allDays[dOfWeek - 1]);
      }
    });

    updateUserProfile({
      startDayOption: startDayPref,
      programStartDate: new Date().toISOString().split("T")[0],
      scheduledDays: newScheduledDays
    });

    alert(language === "ar" ? "تم حفظ الجدول بنجاح!" : "Program saved successfully!");
    onClose();
  };

  const activeWorkoutsCount = restPattern.filter(r => !r).length;
  const isScheduleValid = parsedSplit && activeWorkoutsCount === parsedSplit.days.length;
  const hasAmbiguous = parsedSplit?.days.some(d => d.exercises.some(e => e.ambiguous || !e.matchedExerciseId)) || false;

  const allExs = getAllExercises();
  const searchResults = swapState?.searchQuery 
    ? allExs.filter(e => e.name.toLowerCase().includes(swapState.searchQuery.toLowerCase()) || (language === 'ar' && (e as any).nameAr?.includes(swapState.searchQuery)))
    : [];
    
  const candidatesForSwap = swapState && parsedSplit 
    ? parsedSplit.days[swapState.dIdx].exercises[swapState.eIdx].candidates?.slice(0, 5) || [] 
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-fade-in">
      {/* Top App Bar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10 pt-safe-top">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-white">
            {language === "ar" ? "الاستيراد الذكي" : "Smart Import"}
          </h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-full bg-background-elevated text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* STEP 1: INPUT */}
      {step === "input" && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              {language === "ar" 
                ? "انسخ جدولك التدريبي بالكامل من الملاحظات أو الواتساب، وسيقوم الذكاء الاصطناعي بتقسيمه وتصنيفه تلقائياً." 
                : "Paste your entire workout from notes or WhatsApp. AI will automatically split and categorize it."}
            </p>
            
            <div className="flex items-center gap-2">
              <button onClick={handlePaste} className="flex-1 py-3 rounded-xl bg-background-elevated border border-border text-xs font-bold text-white flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                <Clipboard className="w-4 h-4" />
                {language === "ar" ? "لصق من الحافظة" : "Paste Clipboard"}
              </button>
              <button onClick={() => setFullRawText(SAMPLE_WORKOUT)} className="flex-1 py-3 rounded-xl bg-accent-cyan/10 text-accent-cyan text-xs font-bold flex items-center justify-center gap-2 border border-accent-cyan/20 hover:bg-accent-cyan/20 transition-all">
                <Sparkles className="w-4 h-4" />
                {language === "ar" ? "تجربة جدول" : "Try Example"}
              </button>
            </div>
            
            <textarea
              value={fullRawText}
              onChange={e => setFullRawText(e.target.value)}
              placeholder={language === "ar" ? "Day 1: Upper\nBench Press 3x10\n..." : "Day 1: Upper\nBench Press 3x10\n..."}
              className="w-full h-[50vh] p-4 bg-background-card border border-border rounded-2xl text-white font-mono text-sm focus:outline-none focus:border-accent-cyan resize-none"
            />
          </div>

          <div className="p-4 border-t border-border bg-background/90 backdrop-blur-md pb-safe">
            <button 
              onClick={handleParse} 
              disabled={isParsing || !fullRawText.trim()} 
              className="w-full py-4 rounded-2xl bg-accent-cyan text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all disabled:opacity-50"
            >
              {isParsing ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>{language === "ar" ? (isParsing ? "جاري التحليل..." : "تحليل وجدولة التمارين") : (isParsing ? "Parsing..." : "Analyze & Schedule Workout")}</span>
            </button>
          </div>
        </>
      )}

      {/* STEP 2: REVIEW */}
      {step === "review" && parsedSplit && (
        <div className="flex-1 overflow-y-auto bg-background p-4 pb-40">
          
          <div className="space-y-6">
            {parsedSplit.days.map((day, dIdx) => (
               <div key={dIdx} className="space-y-3">
                 <h3 className="font-bold text-accent-cyan border-b border-border/50 pb-2 pl-2 rtl:pl-0 rtl:pr-2">{day.dayName}</h3>
                 <div className="space-y-2">
                   {day.exercises.map((ex, eIdx) => {
                     const isAmbiguous = ex.ambiguous;
                     const matchedEx = ex.matchedExerciseId ? getExerciseById(ex.matchedExerciseId) : null;
                     
                     return (
                       <div key={eIdx} className="p-3 bg-background-card border border-border rounded-xl">
                         <div className="flex justify-between items-start mb-2">
                           <div>
                             <div className="text-sm font-bold text-white flex items-center gap-1.5">
                               {isAmbiguous && <HelpCircle className="w-4 h-4 text-amber-500" />}
                               <span className={isAmbiguous ? "text-amber-500" : ""}>{ex.exerciseName}</span>
                             </div>
                             <div className="text-[11px] text-slate-400 mt-1">{ex.targetSets} {language === 'ar' ? 'مجموعات' : 'sets'} × {ex.targetReps} {language === 'ar' ? 'تكرارات' : 'reps'}</div>
                           </div>
                         </div>
                         
                         {/* Inline Resolution Chip */}
                         <div className="pt-2 mt-2 border-t border-border/50 flex items-center justify-between">
                           {isAmbiguous ? (
                             <div className="flex items-center gap-2 w-full">
                                {matchedEx ? (
                                  <div className="flex items-center justify-between w-full">
                                    <button onClick={() => confirmExercise(dIdx, eIdx)} className="flex-1 py-2 px-3 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all">
                                      <CheckCircle2 className="w-4 h-4" />
                                      {(language === 'ar' ? (matchedEx as any).nameAr || matchedEx.name : matchedEx.name)}
                                    </button>
                                    <button onClick={() => setSwapState({ dIdx, eIdx, searchQuery: '' })} className="ml-2 rtl:ml-0 rtl:mr-2 py-2 px-3 rounded-xl bg-background-elevated text-slate-400 hover:text-white border border-border text-xs font-bold">
                                      {language === "ar" ? "تغيير" : "Change"}
                                    </button>
                                  </div>
                                ) : (
                                  <button onClick={() => setSwapState({ dIdx, eIdx, searchQuery: '' })} className="w-full py-2 px-3 rounded-xl bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/30 flex items-center justify-center gap-1.5">
                                    <Search className="w-4 h-4" />
                                    {language === "ar" ? "اختر تمريناً يدوياً" : "Select Exercise Manually"}
                                  </button>
                                )}
                             </div>
                           ) : (
                             <div className="flex items-center justify-between w-full">
                               <div className="flex items-center gap-1.5 text-accent-cyan text-xs font-bold px-1">
                                 <CheckCircle2 className="w-4 h-4" />
                                 {matchedEx ? (language === 'ar' ? (matchedEx as any).nameAr || matchedEx.name : matchedEx.name) : ""}
                               </div>
                               <button onClick={() => setSwapState({ dIdx, eIdx, searchQuery: '' })} className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-background-elevated">
                                 <Edit3 className="w-3.5 h-3.5" />
                               </button>
                             </div>
                           )}
                         </div>
                       </div>
                     )
                   })}
                 </div>
               </div>
            ))}
          </div>
          
          {/* Horizontal Pill Matrix Schedule */}
          <div className="mt-8 bg-background-elevated p-4 rounded-2xl border border-border">
            <div className="flex items-center gap-2 mb-4 text-accent-cyan">
              <Calendar className="w-4 h-4" />
              <div className="text-sm font-bold">{language === "ar" ? "الجدولة الأسبوعية (7 أيام)" : "7-Day Weekly Schedule"}</div>
            </div>
            
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 snap-x">
              {restPattern.map((isRest, idx) => {
                const workoutIndex = restPattern.slice(0, idx).filter(r => !r).length;
                const dayTitle = parsedSplit.days[workoutIndex]?.dayName || (language === "ar" ? `تمرين ${workoutIndex+1}` : `Day ${workoutIndex+1}`);
                const dayLabelAr = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
                const dayLabelEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const dayLabel = language === "ar" ? dayLabelAr[idx] : dayLabelEn[idx];
                
                return (
                  <button 
                    key={idx}
                    onClick={() => toggleRest(idx)}
                    className={`snap-start min-w-[70px] h-[75px] flex flex-col items-center justify-center rounded-2xl border transition-all ${isRest ? "bg-slate-800/40 border-slate-700/50 text-slate-500" : "bg-accent-cyan/15 border-accent-cyan/40 text-accent-cyan"}`}
                  >
                    <div className="text-[10px] font-bold mb-1 opacity-70">{dayLabel}</div>
                    <div className="text-xs font-extrabold text-center px-1 line-clamp-2 leading-tight">
                      {isRest ? "💤" : dayTitle.substring(0, 10)}
                    </div>
                  </button>
                )
              })}
            </div>

            {!isScheduleValid && (
              <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-[10px] font-bold text-center">
                {language === "ar"
                  ? `يجب تحديد ${parsedSplit.days.length} أيام تمرين! أنت حددت ${activeWorkoutsCount}.`
                  : `You must assign ${parsedSplit.days.length} workout days! Currently: ${activeWorkoutsCount}.`}
              </div>
            )}
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => setStartDayPref("today")} className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${startDayPref === "today" ? "bg-white text-black border-white shadow-glow-sm" : "bg-background text-slate-400 border-border hover:border-slate-500"}`}>
                {language === "ar" ? "ابدأ اليوم" : "Start Today"}
              </button>
              <button onClick={() => setStartDayPref("tomorrow")} className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${startDayPref === "tomorrow" ? "bg-white text-black border-white shadow-glow-sm" : "bg-background text-slate-400 border-border hover:border-slate-500"}`}>
                {language === "ar" ? "ابدأ غداً" : "Start Tomorrow"}
              </button>
            </div>
          </div>
          
        </div>
      )}

      {/* Sticky Bottom CTA */}
      {step === "review" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-xl border-t border-border z-20 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          {hasAmbiguous && (
            <div className="text-amber-500 text-[11px] font-bold text-center mb-2 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {language === "ar" ? "يرجى تأكيد التمارين المعلقة (باللون الأصفر) للمتابعة" : "Please confirm amber exercises to continue"}
            </div>
          )}
          <button 
            onClick={handleSaveAsFullProgram} 
            disabled={hasAmbiguous || !isScheduleValid} 
            className="w-full py-4 rounded-2xl bg-accent-cyan text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all disabled:opacity-50 disabled:grayscale"
          >
            <Save className="w-5 h-5" />
            <span>{language === "ar" ? "حفظ وتفعيل الجدول" : "Save & Activate"}</span>
          </button>
        </div>
      )}

      {/* Swap Bottom Sheet */}
      {swapState && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fade-in">
           <div className="bg-background-elevated rounded-t-3xl h-[70vh] flex flex-col shadow-[0_-10px_50px_rgba(0,0,0,0.8)] animate-slide-up border-t border-border">
             <div className="p-4 border-b border-border flex items-center justify-between">
               <h3 className="font-bold text-white flex items-center gap-2">
                 <Dumbbell className="w-4 h-4 text-accent-cyan" />
                 {language === "ar" ? "اختر تمرين بديل" : "Choose Alternative"}
               </h3>
               <button onClick={() => setSwapState(null)} className="p-2 bg-background-card rounded-full text-slate-400 hover:text-white">
                 <X className="w-5 h-5"/>
               </button>
             </div>
             <div className="p-4 border-b border-border bg-background-card">
               <div className="relative">
                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                   autoFocus
                   type="text" 
                   value={swapState.searchQuery} 
                   onChange={e => setSwapState({...swapState, searchQuery: e.target.value})}
                   className="w-full pl-10 pr-4 py-3 bg-background-elevated border border-border rounded-xl text-sm font-bold text-white focus:outline-none focus:border-accent-cyan" 
                   placeholder={language === "ar" ? "ابحث عن تمرين..." : "Search exercise..."}
                 />
               </div>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
               {swapState.searchQuery ? (
                 searchResults.length > 0 ? (
                   searchResults.map(ex => (
                     <button key={ex.id} onClick={() => swapExercise(ex.id)} className="w-full p-3 text-left rtl:text-right rounded-xl border border-border bg-background-card hover:border-accent-cyan transition-all">
                       <div className="font-bold text-sm text-white">{language === 'ar' ? (ex as any).nameAr || ex.name : ex.name}</div>
                       <div className="text-[10px] text-slate-400 mt-1">{[ex.muscleGroup, ...(ex.secondaryMuscles || [])].join(', ')} • {ex.equipment}</div>
                     </button>
                   ))
                 ) : (
                   <div className="text-center p-8 text-slate-400 text-sm">{language === "ar" ? "لا توجد نتائج" : "No results"}</div>
                 )
               ) : (
                 <>
                   {candidatesForSwap.length > 0 && (
                     <div className="mb-4">
                       <div className="text-xs font-bold text-accent-cyan mb-2 px-1">{language === "ar" ? "اقتراحات الذكاء الاصطناعي" : "AI Suggestions"}</div>
                       <div className="space-y-2">
                         {candidatesForSwap.map(c => {
                           const ex = getExerciseById(c.exercise.id);
                           if (!ex) return null;
                           return (
                             <button key={ex.id} onClick={() => swapExercise(ex.id)} className="w-full p-3 text-left rtl:text-right rounded-xl border border-accent-cyan/30 bg-accent-cyan/5 hover:bg-accent-cyan/10 transition-all">
                               <div className="font-bold text-sm text-white">{language === 'ar' ? (ex as any).nameAr || ex.name : ex.name}</div>
                               <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                                 <span>{[ex.muscleGroup, ...(ex.secondaryMuscles || [])].join(', ')} • {ex.equipment}</span>
                                 <span className="text-accent-cyan">{language === 'ar' ? 'مطابقة ذكية مع المراجعة' : 'Smart Match (Review)'}</span>
                               </div>
                             </button>
                           )
                         })}
                       </div>
                     </div>
                   )}
                 </>
               )}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};
