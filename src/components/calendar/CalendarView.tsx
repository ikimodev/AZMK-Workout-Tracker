import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Flame, 
  Activity, 
  Clock, 
  Trophy, 
  Sparkles, 
  Heart, 
  Dumbbell,
  X,
  Footprints,
  Bike,
  Waves,
  Zap,
  Trash2,
  Edit3,
  Moon,
  Sun
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { ActivityType, LoggedActivity } from '../../types';

interface CalendarViewProps {
  onNavigate: (tab: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onNavigate }) => {
  const { 
    user, 
    history, 
    activeProgram, 
    loggedActivities, 
    addLoggedActivity, 
    deleteLoggedActivity,
    setCalendarDayCustomization,
    startWorkout,
    startTodaysAutocompleteWorkout,
    language, 
    t 
  } = useWorkout();

  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Selected Day for interactive editing
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(new Date().toISOString().split('T')[0]);
  
  // Activity Modal State
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [actName, setActName] = useState('');
  const [actType, setActType] = useState<ActivityType>('Walking / Zone 2');
  const [actDuration, setActDuration] = useState<number>(30);
  const [actCalories, setActCalories] = useState<number>(200);
  const [actDistance, setActDistance] = useState<number | undefined>(undefined);
  const [actNotes, setActNotes] = useState('');
  const [actDate, setActDate] = useState(new Date().toISOString().split('T')[0]);

  // Live Activity Stopwatch
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchSeconds(prev => {
          const next = prev + 1;
          if (next % 60 === 0) {
            const mins = Math.floor(next / 60);
            setActDuration(mins);
            setActCalories(mins * 7);
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  const formatStopwatch = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = actName.trim() || `${actType}`;
    
    addLoggedActivity({
      name: finalName,
      type: actType,
      date: actDate,
      durationMinutes: actDuration,
      caloriesBurned: actCalories,
      distanceKm: actDistance,
      notes: actNotes
    });

    setIsActivityModalOpen(false);
    setActName('');
    setActNotes('');
    setStopwatchSeconds(0);
    setIsStopwatchRunning(false);
  };

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun .. 6 = Sat
  const normalizedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // 0 = Mon .. 6 = Sun

  const monthNamesAr = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthTitle = language === 'ar' 
    ? `${monthNamesAr[month]} ${year}` 
    : `${monthNamesEn[month]} ${year}`;

  const weekDayHeaders = language === 'ar'
    ? ['إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت', 'أحد']
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(now.toISOString().split('T')[0]);
  };

  // User program templates & scheduled days
  const workoutsList = activeProgram.weeks[0]?.workouts || [];
  const daysCount = user.daysPerWeek || 4;
  let scheduledDayNumbers: number[] = [1, 2, 4, 5];
  if (daysCount === 2) scheduledDayNumbers = [1, 4];
  else if (daysCount === 3) scheduledDayNumbers = [1, 3, 5];
  else if (daysCount === 4) scheduledDayNumbers = [1, 2, 4, 5];
  else if (daysCount === 5) scheduledDayNumbers = [1, 2, 3, 5, 6];
  else if (daysCount === 6) scheduledDayNumbers = [1, 2, 3, 4, 5, 6];

  // Helper to determine day status
  const getDayInfo = (dateStr: string, cellDate: Date) => {
    const dayOfWeek = cellDate.getDay() === 0 ? 7 : cellDate.getDay();
    const dayWorkouts = history.filter(h => h.date && h.date.startsWith(dateStr));
    const dayActs = loggedActivities.filter(a => a.date === dateStr);
    
    // Check manual override
    const custom = user.calendarCustomizations?.[dateStr];
    
    let isWorkoutDay = false;
    let workoutName = '';
    let isRest = false;

    if (custom) {
      if (custom.type === 'rest') {
        isRest = true;
      } else {
        isWorkoutDay = true;
        workoutName = custom.customName || (custom.workoutIndex !== undefined && workoutsList[custom.workoutIndex]?.name) || 'Workout Day';
      }
    } else if (user.startDayOption === 'tomorrow' && user.programStartDate === dateStr && history.length === 0) {
      isRest = true;
    } else {
      const isDefaultScheduled = scheduledDayNumbers.includes(dayOfWeek);
      if (isDefaultScheduled) {
        isWorkoutDay = true;
        const sIndex = scheduledDayNumbers.indexOf(dayOfWeek) % (workoutsList.length || 1);
        workoutName = workoutsList[sIndex]?.name || 'Workout';
      } else {
        isRest = true;
      }
    }

    return {
      dayWorkouts,
      dayActs,
      isWorkoutDay,
      workoutName,
      isRest,
      isCustomized: !!custom
    };
  };

  // Selected Day Details
  const selectedInfo = selectedDateStr ? (() => {
    const [y, m, d] = selectedDateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return {
      dateObj,
      ...getDayInfo(selectedDateStr, dateObj)
    };
  })() : null;

  const handleStartDaySpecificWorkout = (workoutName: string) => {
    const matched = workoutsList.find(w => w.name === workoutName) || workoutsList[0];
    if (matched) {
      const workoutExercises = matched.exercises.map((item, idx) => ({
        id: `we_cal_${Date.now()}_${idx}`,
        exerciseId: item.exerciseId,
        order: idx + 1,
        restTimerSeconds: item.restSeconds || 90,
        sets: Array.from({ length: item.targetSets || 3 }).map((_, sIdx) => ({
          id: `s_cal_${Date.now()}_${idx}_${sIdx}`,
          setNumber: sIdx + 1,
          weight: 50,
          reps: parseInt(item.targetReps, 10) || 8,
          isCompleted: false,
          previousWeight: 47.5,
          previousReps: 8,
          targetWeight: 50,
          targetRepsMin: 8,
          targetRepsMax: 10
        }))
      }));

      startWorkout(matched.name, workoutExercises);
      onNavigate('active_workout');
    } else {
      startTodaysAutocompleteWorkout();
      onNavigate('active_workout');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fade-in">
      
      {/* Top Header & Month Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-accent-cyan font-bold">
              {language === 'ar' ? 'الجدول والتقويم التفاعلي' : 'INTERACTIVE SCHEDULE & CALENDAR'}
            </span>
            <div className="px-2 py-0.5 rounded-full bg-accent-emerald/15 text-accent-emerald text-[10px] font-bold">
              {user.daysPerWeek} {language === 'ar' ? 'أيام تمرين أسبوعياً' : 'Days/wk'}
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {monthTitle}
          </h1>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3.5 py-2 rounded-2xl bg-background-card hover:bg-background-elevated border border-border text-xs font-bold text-slate-200 transition-all active:scale-95"
          >
            {language === 'ar' ? 'اليوم' : 'Today'}
          </button>

          <div className="flex items-center bg-background-card border border-border rounded-2xl p-1">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-background-elevated transition-all"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-background-elevated transition-all"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          <button
            onClick={() => {
              setActDate(selectedDateStr || new Date().toISOString().split('T')[0]);
              setIsActivityModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-accent-cyan to-cyan-500 hover:from-cyan-400 hover:to-cyan-500 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{language === 'ar' ? 'تسجيل نشاط / كارديو' : 'Log Activity'}</span>
          </button>
        </div>
      </div>

      {/* Monthly Calendar Grid */}
      <div className="bg-background-card border border-border rounded-3xl p-4 sm:p-6 shadow-card overflow-hidden">
        
        {/* Status Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 px-3 py-2.5 mb-4 rounded-2xl bg-background-elevated/40 border border-border/60 text-xs font-semibold text-slate-300">
          <span className="text-slate-400 font-bold font-mono text-[10px] uppercase">
            {language === 'ar' ? 'دليل الألوان:' : 'LEGEND:'}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-emerald shadow-glow-sm" />
            <span className="text-xs">{language === 'ar' ? 'مكتمل' : 'Completed'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-indigo" />
            <span className="text-xs">{language === 'ar' ? 'مجدول' : 'Scheduled'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span className="text-xs">{language === 'ar' ? 'يوم راحة' : 'Rest Day'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan" />
            <span className="text-xs">{language === 'ar' ? 'نشاط / كارديو' : 'Activity'}</span>
          </div>
        </div>

        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center text-xs font-bold font-mono uppercase tracking-wider text-slate-400">
          {weekDayHeaders.map((dh, idx) => (
            <div key={idx} className="py-2">
              {dh}
            </div>
          ))}
        </div>

        {/* Day Grid Cells */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Empty prefix cells */}
          {Array.from({ length: normalizedFirstDay }).map((_, idx) => (
            <div key={`empty_${idx}`} className="min-h-[85px] sm:min-h-[110px] rounded-2xl bg-background-elevated/20 border border-transparent" />
          ))}

          {/* Actual Month Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const cellDate = new Date(year, month, dayNum);

            const isToday = new Date().toDateString() === cellDate.toDateString();
            const isSelected = selectedDateStr === dateStr;
            const dayInfo = getDayInfo(dateStr, cellDate);

            return (
              <div
                key={dayNum}
                onClick={() => setSelectedDateStr(dateStr)}
                className={`min-h-[80px] sm:min-h-[110px] p-1.5 sm:p-2.5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer active:scale-[0.98] ${
                  isSelected
                    ? 'bg-background-elevated border-accent-cyan ring-2 ring-accent-cyan/30 shadow-glow-sm'
                    : isToday 
                      ? 'bg-background-elevated/90 border-accent-emerald' 
                      : 'bg-background-elevated/40 border-border/70 hover:border-slate-600'
                }`}
              >
                {/* Day Number Header */}
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[11px] sm:text-xs font-bold ${isToday ? 'text-accent-emerald' : isSelected ? 'text-accent-cyan' : 'text-slate-300'}`}>
                    {dayNum}
                  </span>
                  <div className="flex items-center gap-1">
                    {dayInfo.isCustomized && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" title="Customized day" />
                    )}
                    {isToday && (
                      <span className="w-2 h-2 rounded-full bg-accent-emerald animate-ping" />
                    )}
                  </div>
                </div>

                {/* Day Content Badges */}
                <div className="space-y-1 my-1 flex-1 flex flex-col justify-center overflow-hidden">
                  
                  {/* Completed Lifting Sessions */}
                  {dayInfo.dayWorkouts.map(w => (
                    <div
                      key={w.id}
                      className="px-1.5 py-0.5 rounded-lg bg-emerald-950/80 border border-accent-emerald/40 text-[9px] sm:text-[10px] font-semibold text-emerald-300 truncate flex items-center gap-1"
                    >
                      <Check className="w-2.5 h-2.5 shrink-0 text-accent-emerald" />
                      <span className="truncate">{w.name.split(':')[0]}</span>
                    </div>
                  ))}

                  {/* Logged Custom Activities (Cardio / Sports) */}
                  {dayInfo.dayActs.map(a => (
                    <div
                      key={a.id}
                      className="px-1.5 py-0.5 rounded-lg bg-cyan-950/80 border border-accent-cyan/40 text-[9px] sm:text-[10px] font-semibold text-cyan-300 truncate flex items-center gap-1"
                    >
                      <Zap className="w-2.5 h-2.5 shrink-0 text-accent-cyan" />
                      <span className="truncate">{a.name}</span>
                    </div>
                  ))}

                  {/* Scheduled Future Workout if none completed yet */}
                  {dayInfo.dayWorkouts.length === 0 && dayInfo.dayActs.length === 0 && (
                    dayInfo.isWorkoutDay ? (
                      <div className="px-1.5 py-0.5 rounded-lg bg-accent-indigo/15 border border-accent-indigo/30 text-[9px] sm:text-[10px] font-semibold text-indigo-300 truncate flex items-center gap-1">
                        <Dumbbell className="w-2.5 h-2.5 text-accent-indigo shrink-0" />
                        <span className="truncate">{dayInfo.workoutName.split(':')[0]}</span>
                      </div>
                    ) : (
                      <div className="text-[9px] sm:text-[10px] text-slate-500 text-center py-0.5 font-medium">
                        {language === 'ar' ? 'راحة 🧘' : 'Rest 🧘'}
                      </div>
                    )
                  )}

                </div>

                {/* Day status indicator */}
                <div className="text-[9px] text-slate-400 font-mono text-right rtl:text-left">
                  {dayInfo.dayWorkouts.length > 0 ? (
                    <span className="text-accent-emerald font-bold">{dayInfo.dayWorkouts[0].totalVolumeKg.toLocaleString()}kg</span>
                  ) : dayInfo.dayActs.length > 0 ? (
                    <span className="text-accent-cyan font-bold">{dayInfo.dayActs[0].caloriesBurned} kcal</span>
                  ) : null}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* INTERACTIVE DAY EDITOR & DETAIL DRAWER */}
      {selectedInfo && selectedDateStr && (
        <div className="bg-background-card border border-accent-cyan/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 animate-slide-up">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-cyan/20 to-accent-indigo/20 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-accent-cyan uppercase">
                    {language === 'ar' ? 'تعديل وتفاصيل اليوم' : 'DAY DETAILS & SCHEDULE EDITOR'}
                  </span>
                  {selectedInfo.isCustomized && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                      {language === 'ar' ? 'مخصص يدوياً' : 'Manually Adjusted'}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mt-0.5 font-mono">
                  {selectedInfo.dateObj.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
              </div>
            </div>

            {/* Quick Actions for Selected Day */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActDate(selectedDateStr);
                  setIsActivityModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-background-elevated hover:bg-background-hover border border-border text-xs font-bold text-accent-cyan flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'إضافة كارديو لهذا اليوم' : 'Add Activity'}</span>
              </button>

              {selectedInfo.isCustomized && (
                <button
                  onClick={() => setCalendarDayCustomization(selectedDateStr, null)}
                  className="px-3.5 py-2 rounded-xl bg-background-elevated hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-border hover:border-rose-800 text-xs font-bold transition-all"
                  title="Reset to default schedule"
                >
                  {language === 'ar' ? 'استعادة الافتراضي' : 'Reset Default'}
                </button>
              )}
            </div>
          </div>

          {/* DAY STATUS EDITING SWITCHER */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              {language === 'ar' ? 'تحديد حالة هذا اليوم في الجدول:' : 'Set Day Status in Routine:'}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Workout Day */}
              <button
                type="button"
                onClick={() => {
                  setCalendarDayCustomization(selectedDateStr, {
                    type: 'workout',
                    workoutIndex: 0,
                    customName: workoutsList[0]?.name || 'Workout Day'
                  });
                }}
                className={`p-4 rounded-2xl border text-left rtl:text-right transition-all active:scale-[0.98] ${
                  selectedInfo.isWorkoutDay
                    ? 'bg-accent-indigo/20 border-accent-indigo shadow-glow-indigo text-white'
                    : 'bg-background-elevated border-border text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Dumbbell className="w-4 h-4 text-accent-indigo" />
                    <span>{language === 'ar' ? '🏋️‍♂️ يوم تمرين (Workout Day)' : '🏋️‍♂️ Workout Day'}</span>
                  </div>
                  {selectedInfo.isWorkoutDay && <Check className="w-4 h-4 text-accent-indigo stroke-[3]" />}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'ar' ? 'جدولة حصة تدريب وتمارين في هذا اليوم.' : 'Schedule a lifting workout for this date.'}
                </p>
              </button>

              {/* Option 2: Rest Day */}
              <button
                type="button"
                onClick={() => {
                  setCalendarDayCustomization(selectedDateStr, {
                    type: 'rest'
                  });
                }}
                className={`p-4 rounded-2xl border text-left rtl:text-right transition-all active:scale-[0.98] ${
                  selectedInfo.isRest
                    ? 'bg-accent-emerald/20 border-accent-emerald shadow-glow-sm text-white'
                    : 'bg-background-elevated border-border text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Moon className="w-4 h-4 text-accent-emerald" />
                    <span>{language === 'ar' ? '🧘 يوم راحة واستشفاء (Rest Day)' : '🧘 Rest & Recovery Day'}</span>
                  </div>
                  {selectedInfo.isRest && <Check className="w-4 h-4 text-accent-emerald stroke-[3]" />}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'ar' ? 'يوم مخصص للاستشفاء العضلي وشرب السوائل والنوم الكافي.' : 'Active recovery, hydration and muscle protein synthesis.'}
                </p>
              </button>
            </div>
          </div>

          {/* If it is a Workout Day: Select Workout Routine & Launch button */}
          {selectedInfo.isWorkoutDay && (
            <div className="p-4 rounded-2xl bg-background-elevated border border-border space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                    {language === 'ar' ? 'اختر التمرين المجدول لهذا اليوم:' : 'Select Scheduled Routine:'}
                  </label>
                  <select
                    value={selectedInfo.workoutName}
                    onChange={e => {
                      const wName = e.target.value;
                      const wIdx = workoutsList.findIndex(w => w.name === wName);
                      setCalendarDayCustomization(selectedDateStr, {
                        type: 'workout',
                        workoutIndex: wIdx >= 0 ? wIdx : 0,
                        customName: wName
                      });
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-background-card border border-border rounded-xl text-white text-xs font-bold focus:outline-none focus:border-accent-indigo"
                  >
                    {workoutsList.map((w, idx) => (
                      <option key={w.id || idx} value={w.name}>
                        {w.name} ({w.exercises?.length || 0} {language === 'ar' ? 'تمارين' : 'exercises'})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => handleStartDaySpecificWorkout(selectedInfo.workoutName)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-accent-emerald to-emerald-500 hover:from-emerald-400 text-black font-black text-xs uppercase flex items-center justify-center gap-2 shadow-glow-sm active:scale-95 transition-all"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>{language === 'ar' ? 'بدء تمرين هذا اليوم الآن 🚀' : 'Start This Workout Now'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Completed Workouts on this day (if any) */}
          {selectedInfo.dayWorkouts.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase font-mono">
                {language === 'ar' ? 'التمارين المسجلة في هذا اليوم:' : 'Completed Lifting Sessions:'}
              </h4>
              {selectedInfo.dayWorkouts.map(session => (
                <div 
                  key={session.id}
                  className="p-4 rounded-2xl bg-emerald-950/30 border border-accent-emerald/40 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-emerald/20 flex items-center justify-center text-accent-emerald font-bold">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">{session.name}</p>
                      <p className="text-xs text-slate-400">
                        {session.durationMinutes}m • {session.exercises?.length} {language === 'ar' ? 'تمارين' : 'exercises'} • {session.totalSets} {language === 'ar' ? 'جولات' : 'sets'} • {session.totalVolumeKg.toLocaleString()}kg
                      </p>
                    </div>
                  </div>

                  {session.prCount > 0 && (
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      <span>{session.prCount} PRs!</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Logged Activities on this day (if any) */}
          {selectedInfo.dayActs.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase font-mono">
                {language === 'ar' ? 'الأنشطة والكارديو المسجل:' : 'Logged Cardio & Sports:'}
              </h4>
              {selectedInfo.dayActs.map(act => (
                <div 
                  key={act.id}
                  className="p-4 rounded-2xl bg-cyan-950/30 border border-accent-cyan/40 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 flex items-center justify-center text-accent-cyan font-bold">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">{act.name}</p>
                      <p className="text-xs text-slate-400">
                        {act.durationMinutes}m • {act.caloriesBurned} kcal {act.distanceKm ? `• ${act.distanceKm} km` : ''}
                      </p>
                      {act.notes && <p className="text-[11px] text-slate-500 italic mt-0.5">{act.notes}</p>}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteLoggedActivity(act.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-all"
                    title="Delete activity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* LOG CUSTOM ACTIVITY / CARDIO MODAL */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-background-card border border-accent-cyan/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsActivityModalOpen(false)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-white p-2 rounded-full bg-background-elevated"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center text-accent-cyan">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono font-bold tracking-wider text-accent-cyan">
                  {language === 'ar' ? 'تسجيل نشاط رياضي' : 'ACTIVITY & CARDIO LOGGER'}
                </span>
                <h2 className="text-xl font-bold text-white">
                  {language === 'ar' ? 'إضافة نشاط / كارديو جديد' : 'Log Cardio / Sport Activity'}
                </h2>
              </div>
            </div>

            {/* Live Stopwatch Section */}
            <div className="p-4 rounded-2xl bg-background-elevated border border-border mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-mono font-bold block">{t('timerMode')}</span>
                <span className="text-2xl font-black font-mono text-white mt-0.5">{formatStopwatch(stopwatchSeconds)}</span>
              </div>

              <div className="flex items-center gap-2">
                {!isStopwatchRunning ? (
                  <button
                    type="button"
                    onClick={() => setIsStopwatchRunning(true)}
                    className="px-3.5 py-2 rounded-xl bg-accent-emerald text-black font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>{t('startTimer')}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsStopwatchRunning(false)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Pause className="w-3.5 h-3.5 fill-black" />
                    <span>{t('stopTimer')}</span>
                  </button>
                )}

                {stopwatchSeconds > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsStopwatchRunning(false);
                      setStopwatchSeconds(0);
                    }}
                    className="p-2 rounded-xl bg-background-card hover:bg-background-hover text-slate-400 border border-border"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveActivity} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t('activityType')}</label>
                <select
                  value={actType}
                  onChange={e => setActType(e.target.value as ActivityType)}
                  className="w-full px-4 py-2.5 bg-background-elevated border border-border rounded-xl text-white text-xs font-medium focus:outline-none focus:border-accent-cyan"
                >
                  <option value="Walking / Zone 2">Walking / Zone 2 (مشي سريع / زون 2)</option>
                  <option value="Running">Running (جري)</option>
                  <option value="Cycling">Cycling (دراجة هوائية / ثابتة)</option>
                  <option value="Swimming">Swimming (سباحة)</option>
                  <option value="HIIT Cardio">HIIT Cardio (تمارين حارقة)</option>
                  <option value="Padel">Padel (بادل)</option>
                  <option value="Football">Football (كرة قدم)</option>
                  <option value="Basketball">Basketball (كرة سلة)</option>
                  <option value="Yoga & Mobility">Yoga & Mobility (يوغا وإطالات)</option>
                  <option value="Custom Sport">Custom Sport (رياضة مخصصة)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t('activityName')}</label>
                <input
                  type="text"
                  value={actName}
                  onChange={e => setActName(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: مشي 5000 خطوة بعد التمرين أو مباراة بادل' : 'e.g. 5km Morning Run or Evening Padel Match'}
                  className="w-full px-4 py-2.5 bg-background-elevated border border-border rounded-xl text-white text-xs font-medium focus:outline-none focus:border-accent-cyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t('durationMin')}</label>
                  <input
                    type="number"
                    value={actDuration}
                    onChange={e => setActDuration(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-2.5 bg-background-elevated border border-border rounded-xl text-white text-xs font-medium focus:outline-none focus:border-accent-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t('caloriesKcal')}</label>
                  <input
                    type="number"
                    value={actCalories}
                    onChange={e => setActCalories(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-2.5 bg-background-elevated border border-border rounded-xl text-white text-xs font-medium focus:outline-none focus:border-accent-cyan"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">{t('distanceKm')}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={actDistance || ''}
                    onChange={e => setActDistance(parseFloat(e.target.value) || undefined)}
                    placeholder="e.g. 5.2"
                    className="w-full px-4 py-2.5 bg-background-elevated border border-border rounded-xl text-white text-xs font-medium focus:outline-none focus:border-accent-cyan"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">{language === 'ar' ? 'التاريخ' : 'Date'}</label>
                  <input
                    type="date"
                    value={actDate}
                    onChange={e => setActDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background-elevated border border-border rounded-xl text-white text-xs font-medium focus:outline-none focus:border-accent-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{language === 'ar' ? 'ملاحظات (اختياري)' : 'Notes (Optional)'}</label>
                <input
                  type="text"
                  value={actNotes}
                  onChange={e => setActNotes(e.target.value)}
                  placeholder={language === 'ar' ? 'مستوى الشدة، الشعور بالنشاط، إلخ' : 'Heart rate, pace, or feeling'}
                  className="w-full px-4 py-2 bg-background-elevated border border-border rounded-xl text-white text-xs font-medium focus:outline-none focus:border-accent-cyan"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-accent-cyan to-cyan-500 hover:from-cyan-400 hover:to-cyan-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{t('saveActivity')}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
