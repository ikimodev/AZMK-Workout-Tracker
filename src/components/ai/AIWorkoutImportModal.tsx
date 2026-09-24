import React, { useState } from "react";
import { 
  Sparkles, 
  X, 
  Play, 
  Save, 
  CheckCircle2, 
  ArrowRight, 
  Dumbbell, 
  Calendar,
  Edit3,
  Layers,
  FileText,
  Moon,
  ArrowLeft
} from "lucide-react";
import { useWorkout } from "../../context/WorkoutContext";
import { 
  parseSingleDayText,
  ParsedMultiDaySplit,
  parseWorkoutTextWithGemini
} from "../../services/geminiService";
import { Program } from "../../types";

interface AIWorkoutImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkoutStarted: () => void;
}

type WizardStep = "setup" | "input" | "review";

const PLACEHOLDER_SAMPLES_EN: Record<number, { dayName: string, text: string }[]> = {
  2: [
    { dayName: "Upper Body", text: "Barbell Bench Press 4x8 80kg\nBarbell Row 4x8 70kg\nOverhead Press 3x10 45kg" },
    { dayName: "Lower Body", text: "Barbell Back Squat 4x8 100kg\nRomanian Deadlift 3x8 80kg\nLeg Press 3x10 160kg" }
  ],
  3: [
    { dayName: "Push", text: "Barbell Bench Press 4x8 80kg\nIncline Dumbbell Press 3x10 30kg\nDumbbell Lateral Raises 3x15 12kg" },
    { dayName: "Pull", text: "Barbell Deadlift 4x5 120kg\nLat Pulldown 3x10 60kg\nBarbell Row 3x8 70kg" },
    { dayName: "Legs", text: "Barbell Back Squat 4x6 100kg\nLeg Press 3x10 160kg\nLying Leg Curls 3x12 40kg" }
  ],
  4: [
    { dayName: "Upper", text: "Barbell Bench Press 4x8 80kg\nBarbell Row 4x8 70kg\nOverhead Press 3x10 45kg" },
    { dayName: "Lower", text: "Barbell Back Squat 4x8 100kg\nRomanian Deadlift 3x8 80kg\nLeg Press 3x10 160kg" },
    { dayName: "Push", text: "Incline Dumbbell Press 3x10 30kg\nDumbbell Lateral Raises 3x15 12kg\nTricep Pushdown 3x12 25kg" },
    { dayName: "Pull & Legs", text: "Barbell Deadlift 4x5 120kg\nLat Pulldown 3x10 60kg\nLying Leg Curls 3x12 40kg" }
  ],
  5: [
    { dayName: "Chest", text: "Barbell Bench Press 4x8 80kg\nIncline Dumbbell Press 3x10 30kg\nDumbbell Chest Fly 3x12 16kg" },
    { dayName: "Back", text: "Barbell Deadlift 4x5 120kg\nLat Pulldown 3x10 60kg\nBarbell Row 3x8 70kg" },
    { dayName: "Shoulders", text: "Overhead Press 4x8 50kg\nDumbbell Lateral Raises 4x15 12kg\nFace Pulls 3x15 25kg" },
    { dayName: "Legs", text: "Barbell Back Squat 4x8 100kg\nLeg Press 3x10 160kg\nRomanian Deadlift 3x8 80kg" },
    { dayName: "Arms", text: "Barbell Bicep Curl 3x10 30kg\nIncline Dumbbell Curl 3x12 14kg\nTricep Pushdown 3x12 25kg" }
  ],
  6: [
    { dayName: "Push 1", text: "Barbell Bench Press 4x8 80kg\nIncline Dumbbell Press 3x10 30kg\nDumbbell Lateral Raises 3x15 12kg" },
    { dayName: "Pull 1", text: "Barbell Deadlift 4x5 120kg\nLat Pulldown 3x10 60kg\nBarbell Row 3x8 70kg" },
    { dayName: "Legs 1", text: "Barbell Back Squat 4x6 100kg\nLeg Press 3x10 160kg\nRomanian Deadlift 3x8 80kg" },
    { dayName: "Push 2", text: "Overhead Press 4x8 50kg\nIncline Barbell Press 3x8 65kg\nDumbbell Lateral Raises 4x12 14kg" },
    { dayName: "Pull 2", text: "Pull Ups 4x8 0kg\nSeated Cable Row 3x10 60kg\nLat Pulldown 3x12 55kg" },
    { dayName: "Legs 2", text: "Romanian Deadlift 4x8 85kg\nLeg Extensions 3x15 50kg\nLying Leg Curls 3x12 45kg" }
  ]
};

const PLACEHOLDER_SAMPLES_AR: Record<number, { dayName: string, text: string }[]> = {
  2: [
    { dayName: "علوي", text: "Barbell Bench Press 4x8 80kg\nBarbell Row 4x8 70kg\nOverhead Press 3x10 45kg" },
    { dayName: "سفلي", text: "Barbell Back Squat 4x8 100kg\nRomanian Deadlift 3x8 80kg\nLeg Press 3x10 160kg" }
  ],
  3: [
    { dayName: "صدر وتراي", text: "Barbell Bench Press 4x8 80kg\nIncline Dumbbell Press 3x10 30kg\nDumbbell Lateral Raises 3x15 12kg" },
    { dayName: "ظهر وباي", text: "Barbell Deadlift 4x5 120kg\nLat Pulldown 3x10 60kg\nBarbell Row 3x8 70kg" },
    { dayName: "أرجل", text: "Barbell Back Squat 4x6 100kg\nLeg Press 3x10 160kg\nLying Leg Curls 3x12 40kg" }
  ],
  4: [
    { dayName: "علوي", text: "Barbell Bench Press 4x8 80kg\nBarbell Row 4x8 70kg\nOverhead Press 3x10 45kg" },
    { dayName: "سفلي", text: "Barbell Back Squat 4x8 100kg\nRomanian Deadlift 3x8 80kg\nLeg Press 3x10 160kg" },
    { dayName: "دفع", text: "Incline Dumbbell Press 3x10 30kg\nDumbbell Lateral Raises 3x15 12kg\nTricep Pushdown 3x12 25kg" },
    { dayName: "سحب وأرجل", text: "Barbell Deadlift 4x5 120kg\nLat Pulldown 3x10 60kg\nLying Leg Curls 3x12 40kg" }
  ],
  5: [
    { dayName: "صدر", text: "Barbell Bench Press 4x8 80kg\nIncline Dumbbell Press 3x10 30kg\nDumbbell Chest Fly 3x12 16kg" },
    { dayName: "ظهر", text: "Barbell Deadlift 4x5 120kg\nLat Pulldown 3x10 60kg\nBarbell Row 3x8 70kg" },
    { dayName: "أكتاف", text: "Overhead Press 4x8 50kg\nDumbbell Lateral Raises 4x15 12kg\nFace Pulls 3x15 25kg" },
    { dayName: "أرجل", text: "Barbell Back Squat 4x8 100kg\nLeg Press 3x10 160kg\nRomanian Deadlift 3x8 80kg" },
    { dayName: "أذرع", text: "Barbell Bicep Curl 3x10 30kg\nIncline Dumbbell Curl 3x12 14kg\nTricep Pushdown 3x12 25kg" }
  ],
  6: [
    { dayName: "دفع 1", text: "Barbell Bench Press 4x8 80kg\nIncline Dumbbell Press 3x10 30kg\nDumbbell Lateral Raises 3x15 12kg" },
    { dayName: "سحب 1", text: "Barbell Deadlift 4x5 120kg\nLat Pulldown 3x10 60kg\nBarbell Row 3x8 70kg" },
    { dayName: "أرجل 1", text: "Barbell Back Squat 4x6 100kg\nLeg Press 3x10 160kg\nRomanian Deadlift 3x8 80kg" },
    { dayName: "دفع 2", text: "Overhead Press 4x8 50kg\nIncline Barbell Press 3x8 65kg\nDumbbell Lateral Raises 4x12 14kg" },
    { dayName: "سحب 2", text: "Pull Ups 4x8 0kg\nSeated Cable Row 3x10 60kg\nLat Pulldown 3x12 55kg" },
    { dayName: "أرجل 2", text: "Romanian Deadlift 4x8 85kg\nLeg Extensions 3x15 50kg\nLying Leg Curls 3x12 45kg" }
  ]
};

const DEFAULT_REST_MAP: Record<number, boolean[]> = {
  2: [false, true, true, false, true, true, true],
  3: [false, true, false, true, false, true, true],
  4: [false, false, true, false, false, true, true],
  5: [false, false, false, true, false, false, true],
  6: [false, false, false, false, false, false, true],
};

export const AIWorkoutImportModal: React.FC<AIWorkoutImportModalProps> = ({ isOpen, onClose, onWorkoutStarted }) => {
  const { user, updateUserProfile, saveGeneratedProgram, language } = useWorkout();
  
  // Wizard state
  const [step, setStep] = useState<WizardStep>("setup");
  const [inputMode, setInputMode] = useState<"split_builder" | "raw_full_text">("split_builder");
  const [daysCount, setDaysCount] = useState<number>(4);
  const [activeTabDay, setActiveTabDay] = useState<number>(0);
  
  // Data state
  const [workoutDrafts, setWorkoutDrafts] = useState<{dayName: string, text: string}[]>(
    Array.from({length: 4}).map(() => ({ dayName: "", text: "" }))
  );
  const [fullRawText, setFullRawText] = useState("");
  const [restPattern, setRestPattern] = useState<boolean[]>(DEFAULT_REST_MAP[4]);
  const [startDayPref, setStartDayPref] = useState<"today" | "tomorrow">("today");
  
  const [isParsing, setIsParsing] = useState(false);
  const [parsedSplit, setParsedSplit] = useState<ParsedMultiDaySplit | null>(null);
  const [activePreviewDayIndex, setActivePreviewDayIndex] = useState(0);

  if (!isOpen) return null;

  const handleNextToInput = () => {
    setWorkoutDrafts(Array.from({length: daysCount}).map(() => ({ dayName: "", text: "" })));
    setRestPattern(DEFAULT_REST_MAP[daysCount]);
    setActiveTabDay(0);
    setStep("input");
  };

  const handleParseSplitBuilder = async () => {
    setIsParsing(true);
    try {
      const parsedDays = [];
      const placeholders = language === "ar" ? PLACEHOLDER_SAMPLES_AR[daysCount] : PLACEHOLDER_SAMPLES_EN[daysCount];

      for (let i = 0; i < workoutDrafts.length; i++) {
        const textToParse = workoutDrafts[i].text.trim() || placeholders[i]?.text || "";
        const nameToUse = workoutDrafts[i].dayName.trim() || placeholders[i]?.dayName || (language === "ar" ? `تمرين ${i+1}` : `Workout ${i + 1}`);
        
        const res = await parseSingleDayText(textToParse);
        if (res && res.length > 0) {
          parsedDays.push({
            dayNumber: i + 1,
            dayName: nameToUse,
            exercises: res
          });
        }
      }

      if (parsedDays.length > 0) {
        setParsedSplit({
          isMultiDaySplit: true,
          programName: "Imported Split",
          days: parsedDays
        });
        setStep("review");
        setActivePreviewDayIndex(0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsParsing(false);
    }
  };

  const handleParseFullText = async () => {
    if (!fullRawText.trim()) return;
    setIsParsing(true);
    try {
      const res = await parseWorkoutTextWithGemini(fullRawText, language, user);
      if (res && res.days && res.days.length > 0) {
        setParsedSplit(res);
        setDaysCount(res.days.length);
        setRestPattern(DEFAULT_REST_MAP[res.days.length] || DEFAULT_REST_MAP[4]);
        setStep("review");
        setActivePreviewDayIndex(0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsParsing(false);
    }
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
    
    // Sync with Calendar by generating scheduledDays based on 7-day pattern
    const startDayOffset = new Date().getDay(); // 0 = Sunday, 1 = Monday
    let currentDayOfWeek = startDayOffset === 0 ? 7 : startDayOffset; 
    if (startDayPref === "tomorrow") {
      currentDayOfWeek = currentDayOfWeek === 7 ? 1 : currentDayOfWeek + 1;
    }

    const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const newScheduledDays: string[] = [];

    restPattern.forEach((isRest, idx) => {
       const dOfWeek = ((currentDayOfWeek - 1 + idx) % 7) + 1; // 1-7
       if (!isRest) {
          newScheduledDays.push(allDays[dOfWeek - 1]);
       }
    });

    updateUserProfile({
      startDayOption: startDayPref,
      programStartDate: new Date().toISOString().split("T")[0],
      scheduledDays: newScheduledDays
    });

    alert(language === "ar" ? "تم حفظ الجدول بنجاح وتزامن مع تقويمك!" : "Program saved and synced with calendar!");
    onClose();
  };

  const activeWorkoutsCount = restPattern.filter(r => !r).length;
  const isScheduleValid = activeWorkoutsCount === daysCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in pb-safe pt-safe">
      <div className="bg-background-card border border-accent-cyan/40 rounded-3xl max-w-2xl w-full p-5 sm:p-7 relative shadow-2xl animate-slide-up max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-white p-2 rounded-full bg-background-elevated">
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pr-8 rtl:pr-0 rtl:pl-8">
          <div className="w-10 h-10 rounded-2xl bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan shadow-glow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {language === "ar" ? "تصميم جدول بالذكاء الاصطناعي" : "AI Workout Importer"}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span className={step === "setup" ? "text-accent-cyan font-bold" : ""}>{language === "ar" ? "1. الإعداد" : "1. Setup"}</span>
              <ArrowRight className="w-3 h-3" />
              <span className={step === "input" ? "text-accent-cyan font-bold" : ""}>{language === "ar" ? "2. التمارين" : "2. Exercises"}</span>
              <ArrowRight className="w-3 h-3" />
              <span className={step === "review" ? "text-accent-cyan font-bold" : ""}>{language === "ar" ? "3. المراجعة والجدولة" : "3. Review"}</span>
            </div>
          </div>
        </div>

        {/* STEP 1: SETUP */}
        {step === "setup" && (
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-2 gap-2 p-1 bg-background-elevated rounded-2xl border border-border">
              <button
                type="button"
                onClick={() => setInputMode("split_builder")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${inputMode === "split_builder" ? "bg-accent-cyan text-black shadow-sm" : "text-slate-400 hover:text-white"}`}
              >
                <Layers className="w-4 h-4" />
                <span>{language === "ar" ? "نظام الأيام (مستحسن)" : "Day-by-Day (Recommended)"}</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode("raw_full_text")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${inputMode === "raw_full_text" ? "bg-accent-cyan text-black shadow-sm" : "text-slate-400 hover:text-white"}`}
              >
                <FileText className="w-4 h-4" />
                <span>{language === "ar" ? "لصق نص كامل" : "Paste Full Text"}</span>
              </button>
            </div>

            {inputMode === "split_builder" ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">
                    {language === "ar" ? "كم يوم تمرين في الأسبوع؟" : "How many training days per week?"}
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[2, 3, 4, 5, 6].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setDaysCount(num)}
                        className={`py-3 rounded-xl border text-sm font-bold font-mono transition-all ${daysCount === num ? "bg-accent-cyan text-black border-accent-cyan shadow-sm" : "bg-background-elevated border-border text-slate-300 hover:border-slate-600"}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleNextToInput}
                  className="w-full py-3.5 px-4 rounded-2xl bg-accent-cyan hover:bg-cyan-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all"
                >
                  <span>{language === "ar" ? "التالي: إدخال التمارين" : "Next: Enter Exercises"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  rows={8}
                  value={fullRawText}
                  onChange={(e) => setFullRawText(e.target.value)}
                  placeholder={language === "ar" ? "الصق جدولك كامل هنا..." : "Paste your full workout text here..."}
                  className="w-full p-4 bg-background-elevated border border-border rounded-xl text-white font-mono text-sm focus:outline-none focus:border-accent-cyan"
                />
                <button
                  onClick={handleParseFullText}
                  disabled={!fullRawText.trim() || isParsing}
                  className={`w-full py-3.5 px-4 rounded-2xl ${!fullRawText.trim() || isParsing ? "bg-slate-700 text-slate-400" : "bg-accent-cyan hover:bg-cyan-400 text-black shadow-glow-sm"} font-extrabold text-sm flex items-center justify-center gap-2 transition-all`}
                >
                  {isParsing ? <Sparkles className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  <span>{language === "ar" ? (isParsing ? "جاري التحليل..." : "التالي: المراجعة") : (isParsing ? "Parsing..." : "Next: Review")}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: INPUT EXERCISES (Only for split_builder) */}
        {step === "input" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {workoutDrafts.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTabDay(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${activeTabDay === idx ? "bg-accent-indigo text-white border-accent-indigo shadow-glow-indigo" : "bg-background-elevated text-slate-300 border-border hover:border-slate-600"}`}
                >
                  {language === "ar" ? `يوم تمرين ${idx + 1}` : `Workout ${idx + 1}`}
                </button>
              ))}
            </div>

            {workoutDrafts[activeTabDay] && (() => {
              const placeholders = language === "ar" ? PLACEHOLDER_SAMPLES_AR[daysCount] : PLACEHOLDER_SAMPLES_EN[daysCount];
              const dayPlaceholder = placeholders[activeTabDay] || placeholders[0] || { dayName: "Workout", text: "" };
              
              return (
                <div className="p-4 rounded-2xl bg-background-elevated border border-border space-y-4">
                  <div>
                    <label className="text-xs font-bold text-accent-cyan mb-1.5 block">
                      {language === "ar" ? "عنوان يوم التمرين:" : "Workout Title:"}
                    </label>
                    <input
                      type="text"
                      value={workoutDrafts[activeTabDay].dayName}
                      onChange={e => {
                        const newDrafts = [...workoutDrafts];
                        newDrafts[activeTabDay].dayName = e.target.value;
                        setWorkoutDrafts(newDrafts);
                      }}
                      placeholder={dayPlaceholder.dayName}
                      className="w-full px-4 py-2.5 bg-background-card border border-border rounded-xl text-white text-xs font-bold focus:outline-none focus:border-accent-cyan placeholder:text-slate-500/70"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                      {language === "ar" ? "قائمة التمارين:" : "Exercises List:"}
                    </label>
                    <textarea
                      rows={6}
                      value={workoutDrafts[activeTabDay].text}
                      onChange={e => {
                        const newDrafts = [...workoutDrafts];
                        newDrafts[activeTabDay].text = e.target.value;
                        setWorkoutDrafts(newDrafts);
                      }}
                      placeholder={dayPlaceholder.text}
                      className="w-full p-4 bg-background-card border border-border rounded-xl text-white font-mono text-xs focus:outline-none focus:border-accent-cyan leading-relaxed placeholder:text-slate-500/70"
                    />
                    <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                      {language === "ar" 
                        ? "اكتب كل تمرين في سطر جديد. (إذا تركتها فارغة، سيتم استخدام التمارين الموضحة في الخلفية تلقائياً). الوزن سيتم تعيينه إلى 0 تلقائياً إن لم تذكره."
                        : "Write each exercise on a new line. (If left blank, placeholder workouts will be used)."}
                    </p>
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setStep("setup")}
                className="py-3 px-4 rounded-xl bg-background-elevated text-white text-xs font-bold flex items-center gap-2 transition-all hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleParseSplitBuilder}
                disabled={isParsing}
                className="flex-1 py-3 px-4 rounded-xl bg-accent-cyan hover:bg-cyan-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-sm transition-all disabled:bg-slate-700 disabled:text-slate-400"
              >
                {isParsing ? <Sparkles className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>{language === "ar" ? (isParsing ? "جاري التحليل..." : "التالي: المراجعة والجدولة") : (isParsing ? "Parsing..." : "Next: Review & Schedule")}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW AND SCHEDULE */}
        {step === "review" && parsedSplit && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Rest Days Planner */}
            <div className="p-4 bg-background-elevated border border-border rounded-2xl">
              <div className="flex items-center gap-2 text-accent-cyan mb-1">
                <Calendar className="w-5 h-5" />
                <h3 className="font-bold">{language === "ar" ? "جدولة أيام الراحة (7 أيام)" : "7-Day Rest Schedule"}</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                {language === "ar" 
                  ? `اضغط على أي يوم لتحويله إلى "راحة". لديك ${daysCount} أيام تمرين يجب توزيعها على الأسبوع.`
                  : `Tap a day to toggle Rest Day. You must allocate exactly ${daysCount} workouts.`}
              </p>

              <div className="grid grid-cols-1 gap-2">
                {restPattern.map((isRest, idx) => {
                  const workoutIndex = restPattern.slice(0, idx).filter(r => !r).length;
                  const workoutTitle = parsedSplit.days[workoutIndex]?.dayName || (language === "ar" ? `تمرين ${workoutIndex + 1}` : `Workout ${workoutIndex + 1}`);
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (idx === 0) {
                          alert(language === "ar" ? "اليوم الأول يجب أن يكون يوم تمرين لتبدأ بشكل صحيح!" : "Day 1 must be a workout day!");
                          return;
                        }
                        const newPattern = [...restPattern];
                        newPattern[idx] = !newPattern[idx];
                        setRestPattern(newPattern);
                      }}
                      className={`p-3 rounded-xl flex items-center justify-between border transition-all ${isRest ? "bg-slate-800/40 border-slate-700/50" : "bg-accent-indigo/10 border-accent-indigo/30"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${isRest ? "bg-slate-800 text-slate-500" : "bg-accent-indigo text-white"}`}>
                          {isRest ? <Moon className="w-4 h-4" /> : workoutIndex + 1}
                        </div>
                        <div className="text-left rtl:text-right">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {language === "ar" ? `اليوم ${idx + 1}` : `Day ${idx + 1}`}
                          </div>
                          <div className={`text-sm font-bold ${isRest ? "text-slate-500" : "text-white"}`}>
                            {isRest ? (language === "ar" ? "راحة" : "Rest") : workoutTitle}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`w-10 h-6 rounded-full transition-colors relative ${isRest ? "bg-accent-emerald" : "bg-slate-700"} ${idx === 0 ? "opacity-50" : ""}`}>
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${isRest ? "right-1 rtl:left-1 rtl:right-auto" : "left-1 rtl:right-1 rtl:left-auto"}`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {!isScheduleValid && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold text-center mt-3">
                  {language === "ar" 
                    ? `يجب تحديد ${daysCount} أيام تمرين! أنت حددت ${activeWorkoutsCount}.` 
                    : `You must assign ${daysCount} workout days! Currently: ${activeWorkoutsCount}.`}
                </div>
              )}
            </div>

            {/* Start Date Preference */}
            <div className="p-4 rounded-2xl bg-background-elevated border border-border space-y-3">
              <label className="block text-sm font-bold text-slate-300">
                {language === "ar" ? "متى ترغب بالبدء؟" : "When to start?"}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStartDayPref("today")}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-bold transition-all ${startDayPref === "today" ? "bg-accent-emerald text-black border-accent-emerald shadow-sm" : "bg-background-card text-slate-300 border-border hover:border-slate-600"}`}
                >
                  {language === "ar" ? "اليوم" : "Today"}
                </button>
                <button
                  type="button"
                  onClick={() => setStartDayPref("tomorrow")}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-bold transition-all ${startDayPref === "tomorrow" ? "bg-accent-emerald text-black border-accent-emerald shadow-sm" : "bg-background-card text-slate-300 border-border hover:border-slate-600"}`}
                >
                  {language === "ar" ? "غداً" : "Tomorrow"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setStep(inputMode === "split_builder" ? "input" : "setup")}
                className="py-3.5 px-4 rounded-xl bg-background-elevated text-white text-xs font-bold flex items-center gap-2 transition-all hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleSaveAsFullProgram}
                disabled={!isScheduleValid}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-accent-indigo to-indigo-600 hover:from-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-glow-indigo transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{language === "ar" ? "حفظ وتفعيل الجدول" : "Save & Activate"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
