const fs = require("fs");
const path = "src/components/ai/AIWorkoutImportModal.tsx";
let code = fs.readFileSync(path, "utf8");

// Define placeholders
const placeholderSamplesReplacement = `
interface SplitDayDraft {
  isRest: boolean;
  dayName: string;
  rawExercisesText: string;
}

const PLACEHOLDER_SAMPLES_EN: Record<number, { dayName: string, text: string }[]> = {
  2: [
    { dayName: "Day 1 - Upper Body", text: "Barbell Bench Press 4x8 80kg\\nBarbell Row 4x8 70kg\\nOverhead Press 3x10 45kg" },
    { dayName: "Day 2 - Lower Body", text: "Barbell Back Squat 4x8 100kg\\nRomanian Deadlift 3x8 80kg\\nLeg Press 3x10 160kg" }
  ],
  3: [
    { dayName: "Day 1 - Push", text: "Barbell Bench Press 4x8 80kg\\nIncline Dumbbell Press 3x10 30kg\\nDumbbell Lateral Raises 3x15 12kg" },
    { dayName: "Day 2 - Pull", text: "Barbell Deadlift 4x5 120kg\\nLat Pulldown 3x10 60kg\\nBarbell Row 3x8 70kg" },
    { dayName: "Day 3 - Legs", text: "Barbell Back Squat 4x6 100kg\\nLeg Press 3x10 160kg\\nLying Leg Curls 3x12 40kg" }
  ],
  4: [
    { dayName: "Day 1 - Upper", text: "Barbell Bench Press 4x8 80kg\\nBarbell Row 4x8 70kg\\nOverhead Press 3x10 45kg" },
    { dayName: "Day 2 - Lower", text: "Barbell Back Squat 4x8 100kg\\nRomanian Deadlift 3x8 80kg\\nLeg Press 3x10 160kg" },
    { dayName: "Day 3 - Push", text: "Incline Dumbbell Press 3x10 30kg\\nDumbbell Lateral Raises 3x15 12kg\\nTricep Pushdown 3x12 25kg" },
    { dayName: "Day 4 - Pull & Legs", text: "Barbell Deadlift 4x5 120kg\\nLat Pulldown 3x10 60kg\\nLying Leg Curls 3x12 40kg" }
  ],
  5: [
    { dayName: "Day 1 - Chest", text: "Barbell Bench Press 4x8 80kg\\nIncline Dumbbell Press 3x10 30kg\\nDumbbell Chest Fly 3x12 16kg" },
    { dayName: "Day 2 - Back", text: "Barbell Deadlift 4x5 120kg\\nLat Pulldown 3x10 60kg\\nBarbell Row 3x8 70kg" },
    { dayName: "Day 3 - Shoulders", text: "Overhead Press 4x8 50kg\\nDumbbell Lateral Raises 4x15 12kg\\nFace Pulls 3x15 25kg" },
    { dayName: "Day 4 - Legs", text: "Barbell Back Squat 4x8 100kg\\nLeg Press 3x10 160kg\\nRomanian Deadlift 3x8 80kg" },
    { dayName: "Day 5 - Arms", text: "Barbell Bicep Curl 3x10 30kg\\nIncline Dumbbell Curl 3x12 14kg\\nTricep Pushdown 3x12 25kg" }
  ],
  6: [
    { dayName: "Day 1 - Push 1", text: "Barbell Bench Press 4x8 80kg\\nIncline Dumbbell Press 3x10 30kg\\nDumbbell Lateral Raises 3x15 12kg" },
    { dayName: "Day 2 - Pull 1", text: "Barbell Deadlift 4x5 120kg\\nLat Pulldown 3x10 60kg\\nBarbell Row 3x8 70kg" },
    { dayName: "Day 3 - Legs 1", text: "Barbell Back Squat 4x6 100kg\\nLeg Press 3x10 160kg\\nRomanian Deadlift 3x8 80kg" },
    { dayName: "Day 4 - Push 2", text: "Overhead Press 4x8 50kg\\nIncline Barbell Press 3x8 65kg\\nDumbbell Lateral Raises 4x12 14kg" },
    { dayName: "Day 5 - Pull 2", text: "Pull Ups 4x8 0kg\\nSeated Cable Row 3x10 60kg\\nLat Pulldown 3x12 55kg" },
    { dayName: "Day 6 - Legs 2", text: "Romanian Deadlift 4x8 85kg\\nLeg Extensions 3x15 50kg\\nLying Leg Curls 3x12 45kg" }
  ]
};

const PLACEHOLDER_SAMPLES_AR: Record<number, { dayName: string, text: string }[]> = {
  2: [
    { dayName: "Day 1 - Upper (الجزء العلوي)", text: "Barbell Bench Press 4x8 80kg\\nBarbell Row 4x8 70kg\\nOverhead Press 3x10 45kg" },
    { dayName: "Day 2 - Lower (الجزء السفلي)", text: "Barbell Back Squat 4x8 100kg\\nRomanian Deadlift 3x8 80kg\\nLeg Press 3x10 160kg" }
  ],
  3: [
    { dayName: "Day 1 - Push (صدر وتراي)", text: "Barbell Bench Press 4x8 80kg\\nIncline Dumbbell Press 3x10 30kg\\nDumbbell Lateral Raises 3x15 12kg" },
    { dayName: "Day 2 - Pull (ظهر وباي)", text: "Barbell Deadlift 4x5 120kg\\nLat Pulldown 3x10 60kg\\nBarbell Row 3x8 70kg" },
    { dayName: "Day 3 - Legs (أرجل)", text: "Barbell Back Squat 4x6 100kg\\nLeg Press 3x10 160kg\\nLying Leg Curls 3x12 40kg" }
  ],
  4: [
    { dayName: "Day 1 - Upper (علوي)", text: "Barbell Bench Press 4x8 80kg\\nBarbell Row 4x8 70kg\\nOverhead Press 3x10 45kg" },
    { dayName: "Day 2 - Lower (سفلي)", text: "Barbell Back Squat 4x8 100kg\\nRomanian Deadlift 3x8 80kg\\nLeg Press 3x10 160kg" },
    { dayName: "Day 3 - Push (دفع)", text: "Incline Dumbbell Press 3x10 30kg\\nDumbbell Lateral Raises 3x15 12kg\\nTricep Pushdown 3x12 25kg" },
    { dayName: "Day 4 - Pull & Legs", text: "Barbell Deadlift 4x5 120kg\\nLat Pulldown 3x10 60kg\\nLying Leg Curls 3x12 40kg" }
  ],
  5: [
    { dayName: "Day 1 - Chest (صدر)", text: "Barbell Bench Press 4x8 80kg\\nIncline Dumbbell Press 3x10 30kg\\nDumbbell Chest Fly 3x12 16kg" },
    { dayName: "Day 2 - Back (ظهر)", text: "Barbell Deadlift 4x5 120kg\\nLat Pulldown 3x10 60kg\\nBarbell Row 3x8 70kg" },
    { dayName: "Day 3 - Shoulders (أكتاف)", text: "Overhead Press 4x8 50kg\\nDumbbell Lateral Raises 4x15 12kg\\nFace Pulls 3x15 25kg" },
    { dayName: "Day 4 - Legs (أرجل)", text: "Barbell Back Squat 4x8 100kg\\nLeg Press 3x10 160kg\\nRomanian Deadlift 3x8 80kg" },
    { dayName: "Day 5 - Arms (أذرع)", text: "Barbell Bicep Curl 3x10 30kg\\nIncline Dumbbell Curl 3x12 14kg\\nTricep Pushdown 3x12 25kg" }
  ],
  6: [
    { dayName: "Day 1 - Push 1", text: "Barbell Bench Press 4x8 80kg\\nIncline Dumbbell Press 3x10 30kg\\nDumbbell Lateral Raises 3x15 12kg" },
    { dayName: "Day 2 - Pull 1", text: "Barbell Deadlift 4x5 120kg\\nLat Pulldown 3x10 60kg\\nBarbell Row 3x8 70kg" },
    { dayName: "Day 3 - Legs 1", text: "Barbell Back Squat 4x6 100kg\\nLeg Press 3x10 160kg\\nRomanian Deadlift 3x8 80kg" },
    { dayName: "Day 4 - Push 2", text: "Overhead Press 4x8 50kg\\nIncline Barbell Press 3x8 65kg\\nDumbbell Lateral Raises 4x12 14kg" },
    { dayName: "Day 5 - Pull 2", text: "Pull Ups 4x8 0kg\\nSeated Cable Row 3x10 60kg\\nLat Pulldown 3x12 55kg" },
    { dayName: "Day 6 - Legs 2", text: "Romanian Deadlift 4x8 85kg\\nLeg Extensions 3x15 50kg\\nLying Leg Curls 3x12 45kg" }
  ]
};

const generate7DaySplit = (activeDaysCount: number): SplitDayDraft[] => {
  const arr: SplitDayDraft[] = [];
  const isRestMap: Record<number, boolean[]> = {
    2: [false, true, true, false, true, true, true],
    3: [false, true, false, true, false, true, true],
    4: [false, false, true, false, false, true, true],
    5: [false, false, false, true, false, false, true],
    6: [false, false, false, false, false, false, true],
  };
  
  const pattern = isRestMap[activeDaysCount] || [false, false, false, false, false, false, false];
  
  for (let i = 0; i < 7; i++) {
    arr.push({
      isRest: pattern[i],
      dayName: "",
      rawExercisesText: ""
    });
  }
  return arr;
};
`;

code = code.replace(/interface SplitDayDraft \{[\s\S]*?\};\n\nexport const/m, placeholderSamplesReplacement.trim() + '\n\nexport const');

// Update state definitions
code = code.replace(
  "const [splitDays, setSplitDays] = useState<SplitDayDraft[]>(DEFAULT_SPLIT_SAMPLES[3]);",
  "const [splitDays, setSplitDays] = useState<SplitDayDraft[]>(generate7DaySplit(4));"
);
code = code.replace(
  "const [daysCount, setDaysCount] = useState<number>(3);",
  "const [daysCount, setDaysCount] = useState<number>(4);"
);

// Update handleSetDaysCount
const handleSetDaysCountReplacement = `
  const handleSetDaysCount = (count: number) => {
    setDaysCount(count);
    setSplitDays(generate7DaySplit(count));
    setActiveTabDay(0);
  };

  const handleToggleRestDay = (index: number) => {
    setSplitDays(prev => prev.map((d, i) => i === index ? { ...d, isRest: !d.isRest, dayName: '', rawExercisesText: '' } : d));
  };
`;
code = code.replace(/const handleSetDaysCount = \([\s\S]*?setActiveTabDay\(0\);\n  \};/, handleSetDaysCountReplacement.trim());

// Modify handleParseSplitBuilder
const handleParseSplitBuilderNew = `const handleParseSplitBuilder = async () => {
    setIsParsing(true);
    try {
      const activeDays = splitDays.filter(d => !d.isRest);
      if (activeDays.length === 0) return;

      const parsedDays = [];
      const placeholders = language === "ar" ? PLACEHOLDER_SAMPLES_AR[daysCount] || PLACEHOLDER_SAMPLES_AR[4] : PLACEHOLDER_SAMPLES_EN[daysCount] || PLACEHOLDER_SAMPLES_EN[4];

      for (let i = 0; i < activeDays.length; i++) {
        const textToParse = activeDays[i].rawExercisesText.trim() || placeholders[i]?.text || "";
        const nameToUse = activeDays[i].dayName.trim() || placeholders[i]?.dayName || \`Day \${i + 1}\`;
        
        const res = await parseSingleDayText(textToParse, i + 1, language, user);
        if (res && res.exercises.length > 0) {
          parsedDays.push({
            dayNumber: i + 1,
            dayName: nameToUse,
            exercises: res.exercises
          });
        }
      }

      if (parsedDays.length > 0) {
        setParsedSplit({
          isMultiDaySplit: true,
          days: parsedDays
        });
        setActivePreviewDayIndex(0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsParsing(false);
    }
  };`;

code = code.replace(/const handleParseSplitBuilder = async \(\) => \{[\s\S]*?setIsParsing\(false\);\n    \}\n  \};/, handleParseSplitBuilderNew);

// Update handleSaveAsFullProgram
const handleSaveAsFullProgramOrig = `saveGeneratedProgram(newProg);
    updateUserProfile({
      startDayOption: startDayPref,
      programStartDate: new Date().toISOString().split('T')[0]
    });`;
const handleSaveAsFullProgramNew = `saveGeneratedProgram(newProg);
    
    // Sync with Calendar by generating scheduledDays based on 7-day pattern
    const startDayOffset = new Date().getDay(); // 0 = Sunday, 1 = Monday
    let currentDayOfWeek = startDayOffset === 0 ? 7 : startDayOffset; 
    if (startDayPref === 'tomorrow') {
      currentDayOfWeek = currentDayOfWeek === 7 ? 1 : currentDayOfWeek + 1;
    }

    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const newScheduledDays: string[] = [];

    // splitDays contains exactly 7 days
    splitDays.forEach((d, idx) => {
       const dOfWeek = ((currentDayOfWeek - 1 + idx) % 7) + 1; // 1-7
       if (!d.isRest) {
          newScheduledDays.push(allDays[dOfWeek - 1]);
       }
    });

    updateUserProfile({
      startDayOption: startDayPref,
      programStartDate: new Date().toISOString().split('T')[0],
      scheduledDays: newScheduledDays
    });`;

code = code.replace(handleSaveAsFullProgramOrig, handleSaveAsFullProgramNew);

// UI Update
const uiMatch = code.match(/\{\/\* Active Day Title & Exercises Inputs \*\/\}([\s\S]*?)<\/\div>[\s\n]*\)\)}/);
if (uiMatch) {
  const uiNew = `{/* Active Day Title & Exercises Inputs */}
              {splitDays[activeTabDay] && (() => {
                const activeIndex = splitDays.slice(0, activeTabDay).filter(d => !d.isRest).length;
                const placeholders = language === "ar" ? PLACEHOLDER_SAMPLES_AR[daysCount] || PLACEHOLDER_SAMPLES_AR[4] : PLACEHOLDER_SAMPLES_EN[daysCount] || PLACEHOLDER_SAMPLES_EN[4];
                const dayPlaceholder = placeholders[activeIndex] || placeholders[0] || { dayName: 'Workout', text: 'Exercise 3x10 0kg' };

                return (
                <div className="p-4 rounded-2xl bg-background-elevated border border-border space-y-3.5 relative">
                  
                  {/* Rest Day Toggle */}
                  <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{language === "ar" ? "يوم راحة" : "Rest Day"}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleRestDay(activeTabDay)}
                      className={\`w-10 h-6 rounded-full transition-colors relative \${splitDays[activeTabDay].isRest ? 'bg-accent-emerald' : 'bg-slate-700'}\`}
                    >
                      <div className={\`w-4 h-4 rounded-full bg-white absolute top-1 transition-all \${splitDays[activeTabDay].isRest ? 'right-1 rtl:left-1 rtl:right-auto' : 'left-1 rtl:right-1 rtl:left-auto'}\`} />
                    </button>
                  </div>

                  {splitDays[activeTabDay].isRest ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center opacity-60">
                      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                        <Calendar className="w-8 h-8 text-slate-400" />
                      </div>
                      <h4 className="text-white font-bold text-lg mb-1">{language === "ar" ? "يوم راحة" : "Rest Day"}</h4>
                      <p className="text-slate-400 text-xs max-w-[200px]">{language === "ar" ? "لا توجد تمارين في هذا اليوم. العضلات تنمو وقت الراحة!" : "No exercises scheduled. Muscles grow when you rest!"}</p>
                    </div>
                  ) : (
                    <>
                      {/* Day Title */}
                      <div className="pr-24 rtl:pr-0 rtl:pl-24">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-accent-cyan font-mono flex items-center gap-1.5">
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{language === 'ar' ? 'عنوان اليوم (لا يعتبر تمرين):' : 'Day Title (Not an exercise):'}</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          value={splitDays[activeTabDay].dayName}
                          onChange={e => handleUpdateDayName(activeTabDay, e.target.value)}
                          placeholder={dayPlaceholder.dayName}
                          className="w-full px-3.5 py-2.5 bg-background-card border border-border rounded-xl text-white text-xs font-bold focus:outline-none focus:border-accent-cyan placeholder:text-slate-500/70"
                        />
                      </div>

                      {/* Exercises Text Box */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1 font-mono">
                          {language === 'ar' ? \`تمارين هذا اليوم:\` : \`Exercises for this day:\`}
                        </label>
                        <textarea
                          rows={6}
                          value={splitDays[activeTabDay].rawExercisesText}
                          onChange={e => handleUpdateDayExercises(activeTabDay, e.target.value)}
                          placeholder={dayPlaceholder.text}
                          className="w-full p-3 bg-background-card border border-border rounded-xl text-white font-mono text-xs focus:outline-none focus:border-accent-cyan leading-relaxed placeholder:text-slate-500/70"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">
                          {language === 'ar' 
                            ? 'اكتب كل تمرين في سطر جديد. (إذا تركتها فارغة، سيتم استخدام التمارين الموضحة في الخلفية تلقائياً)'
                            : 'Write each exercise on a new line. (If you leave it blank, the placeholder workout will be used automatically)'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
              })}`;
  code = code.replace(uiMatch[0], uiNew);
}

// Also update the Day Tabs
const dayTabsMatch = code.match(/<div className="flex items-center gap-1\.5 overflow-x-auto pb-1 no-scrollbar">[\s\S]*?<\/div>/);
if (dayTabsMatch) {
  const dayTabsNew = `<div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {splitDays.map((d, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveTabDay(idx)}
                      className={\`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 \${
                        activeTabDay === idx
                          ? 'bg-accent-indigo text-white border-accent-indigo shadow-glow-indigo'
                          : 'bg-background-elevated text-slate-300 border-border hover:border-slate-600'
                      } \${d.isRest ? 'opacity-60' : ''}\`}
                    >
                      {d.isRest && <Calendar className="w-3 h-3" />}
                      {d.dayName.split(':')[0].split('-')[0] || (language === 'ar' ? \`يوم \${idx + 1}\` : \`Day \${idx + 1}\`)}
                    </button>
                  ))}
                </div>`;
  code = code.replace(dayTabsMatch[0], dayTabsNew);
}

fs.writeFileSync(path, code, "utf8");
console.log("Patch successfully written");
