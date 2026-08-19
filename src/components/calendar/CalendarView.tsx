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
  Zap
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { ActivityType, LoggedActivity } from '../../types';
import { getExerciseById } from '../../data/mockExercises';

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
    startTodaysAutocompleteWorkout,
    language, 
    t 
  } = useWorkout();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayActivities, setSelectedDayActivities] = useState<string | null>(null);
  
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
          // Auto estimate duration in minutes
          if (next % 60 === 0) {
            const mins = Math.floor(next / 60);
            setActDuration(mins);
            // Estimate calories (~7 kcal / min for moderate cardio)
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

    // Reset Form
    setActName('');
    setActDuration(30);
    setActCalories(200);
    setActDistance(undefined);
    setActNotes('');
    setStopwatchSeconds(0);
    setIsStopwatchRunning(false);
    setIsActivityModalOpen(false);
  };

  // Calendar Calculation Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon ...
  // Normalize so Monday = 0, Sunday = 6
  const normalizedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthNamesAr = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const currentMonthName = language === 'ar' ? monthNamesAr[month] : monthNamesEn[month];

  const weekDayHeadersEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekDayHeadersAr = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];
  const weekDayHeaders = language === 'ar' ? weekDayHeadersAr : weekDayHeadersEn;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Determine split workout days pattern
  const daysPerWeek = user.daysPerWeek || 4;
  // Scheduled workout day indices (1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun)
  let scheduledDayNumbers: number[] = [1, 2, 4, 5];
  if (daysPerWeek === 2) scheduledDayNumbers = [1, 4];
  else if (daysPerWeek === 3) scheduledDayNumbers = [1, 3, 5];
  else if (daysPerWeek === 4) scheduledDayNumbers = [1, 2, 4, 5];
  else if (daysPerWeek === 5) scheduledDayNumbers = [1, 2, 3, 5, 6];
  else if (daysPerWeek === 6) scheduledDayNumbers = [1, 2, 3, 4, 5, 6];

  const workoutsList = activeProgram.weeks[0]?.workouts || [];

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      
      {/* Calendar Header & Controls */}
      <div className="bg-background-card border border-border rounded-3xl p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-accent-emerald">
              {language === 'ar' ? 'الجدول والتقويم التفاعلي' : 'CALENDAR & ACTIVITY SCHEDULE'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {currentMonthName} {year}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('calendarSub')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Previous / Next Month Navigation */}
          <div className="flex items-center gap-1 bg-background-elevated p-1 rounded-2xl border border-border">
            <button
              onClick={prevMonth}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-background-hover transition-all"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-xs font-bold text-slate-300 hover:text-white rounded-xl hover:bg-background-hover transition-all"
            >
              {language === 'ar' ? 'اليوم' : 'Today'}
            </button>
            <button
              onClick={nextMonth}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-background-hover transition-all"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>

          {/* Log Custom Activity CTA */}
          <button
            onClick={() => {
              setActDate(new Date().toISOString().split('T')[0]);
              setIsActivityModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-accent-cyan to-cyan-500 hover:from-cyan-400 hover:to-cyan-500 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('logNewActivity')}</span>
          </button>
        </div>
      </div>

      {/* Legend Badges */}
      <div className="flex flex-wrap items-center gap-3 text-xs px-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-accent-emerald/20 border border-accent-emerald/50" />
          <span className="text-slate-300 font-medium">{language === 'ar' ? 'تمرين حديد مكتمل' : 'Completed Workout'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-accent-indigo/20 border border-accent-indigo/50" />
          <span className="text-slate-300 font-medium">{language === 'ar' ? 'تمرين مجدول' : 'Scheduled Lifting'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-accent-cyan/20 border border-accent-cyan/50" />
          <span className="text-slate-300 font-medium">{language === 'ar' ? 'كارديو / نشاط رياضي' : 'Cardio / Sport'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-background-elevated border border-border" />
          <span className="text-slate-400">{language === 'ar' ? 'يوم راحة' : 'Rest Day'}</span>
        </div>
      </div>

      {/* Monthly Calendar Grid */}
      <div className="bg-background-card border border-border rounded-3xl p-4 sm:p-6 shadow-card overflow-hidden">
        
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
            <div key={`empty_${idx}`} className="min-h-[90px] sm:min-h-[110px] rounded-2xl bg-background-elevated/20 border border-transparent" />
          ))}

          {/* Actual Month Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const cellDate = new Date(year, month, dayNum);
            const dayOfWeek = cellDate.getDay() === 0 ? 7 : cellDate.getDay(); // 1=Mon .. 7=Sun

            const isToday = new Date().toDateString() === cellDate.toDateString();
            
            // Check completed workouts on this day
            const dayWorkouts = history.filter(h => h.date && h.date.startsWith(dateStr));
            
            // Check logged cardio/activities on this day
            const dayActs = loggedActivities.filter(a => a.date === dateStr);

            // Is this day a planned lifting day or rest day?
            const isScheduledLifting = scheduledDayNumbers.includes(dayOfWeek);
            const scheduledWorkoutIndex = isScheduledLifting ? (scheduledDayNumbers.indexOf(dayOfWeek) % (workoutsList.length || 1)) : 0;
            const plannedWorkoutTemplate = isScheduledLifting ? workoutsList[scheduledWorkoutIndex] : null;

            return (
              <div
                key={dayNum}
                onClick={() => {
                  if (dayWorkouts.length > 0 || dayActs.length > 0) {
                    setSelectedDayActivities(selectedDayActivities === dateStr ? null : dateStr);
                  }
                }}
                className={`min-h-[75px] sm:min-h-[110px] p-1 sm:p-2 rounded-xl sm:rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                  isToday 
                    ? 'bg-background-elevated border-accent-emerald shadow-glow-sm' 
                    : 'bg-background-elevated/40 border-border/70 hover:border-slate-600'
                }`}
              >
                {/* Day Number Header */}
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[10px] sm:text-xs font-bold ${isToday ? 'text-accent-emerald' : 'text-slate-300'}`}>
                    {dayNum}
                  </span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent-emerald animate-ping" />
                  )}
                </div>

                {/* Day Content Badges */}
                <div className="space-y-0.5 sm:space-y-1 my-0.5 sm:my-1 flex-1 flex flex-col justify-center overflow-hidden">
                  
                  {/* Completed Lifting Sessions */}
                  {dayWorkouts.map(w => (
                    <div
                      key={w.id}
                      className="px-1 py-0.2 sm:py-0.5 rounded sm:rounded-lg bg-emerald-950/70 border border-accent-emerald/40 text-[8px] sm:text-[10px] font-semibold text-emerald-300 truncate flex items-center gap-0.5 sm:gap-1"
                    >
                      <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0 text-accent-emerald" />
                      <span className="truncate">{w.name.split(':')[0]}</span>
                    </div>
                  ))}

                  {/* Logged Custom Activities (Cardio / Sports) */}
                  {dayActs.map(a => (
                    <div
                      key={a.id}
                      className="px-1 py-0.2 sm:py-0.5 rounded sm:rounded-lg bg-cyan-950/70 border border-accent-cyan/40 text-[8px] sm:text-[10px] font-semibold text-cyan-300 truncate flex items-center gap-0.5 sm:gap-1"
                    >
                      <Zap className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0 text-accent-cyan" />
                      <span className="truncate">{a.name} ({a.durationMinutes}m)</span>
                    </div>
                  ))}

                  {/* Scheduled Future Workout if none completed yet */}
                  {dayWorkouts.length === 0 && dayActs.length === 0 && (
                    isScheduledLifting ? (
                      <div className="px-1 py-0.2 sm:py-0.5 rounded sm:rounded-lg bg-accent-indigo/10 border border-accent-indigo/30 text-[8px] sm:text-[10px] font-medium text-indigo-300 truncate">
                        {plannedWorkoutTemplate?.name.split(':')[0] || 'Lifting'}
                      </div>
                    ) : (
                      <div className="text-[8px] sm:text-[10px] text-slate-500 text-center py-0.5">
                        {language === 'ar' ? 'راحة 🧘' : 'Rest 🧘'}
                      </div>
                    )
                  )}

                </div>

                {/* Quick Add Button */}
                <div className="hidden sm:flex items-center justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActDate(dateStr);
                      setIsActivityModalOpen(true);
                    }}
                    className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-background-hover transition-colors"
                    title="Log cardio/sport on this day"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* DAY DETAIL DRAWER (When clicking on a date with activities) */}
      {selectedDayActivities && (
        <div className="bg-background-card border border-border rounded-3xl p-6 shadow-card space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white font-mono flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-accent-emerald" />
              <span>Activities on {selectedDayActivities}</span>
            </h3>
            <button
              onClick={() => setSelectedDayActivities(null)}
              className="text-slate-400 hover:text-white p-1.5 rounded-full bg-background-elevated"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Workouts */}
            {history.filter(h => h.date && h.date.startsWith(selectedDayActivities)).map(w => (
              <div key={w.id} className="p-4 rounded-2xl bg-background-elevated border border-accent-emerald/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-accent-emerald font-mono uppercase">Completed Workout</span>
                  <span className="text-xs text-slate-400 font-mono">{w.durationMinutes} min</span>
                </div>
                <h4 className="font-bold text-sm text-white">{w.name}</h4>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
                  <span>Volume: {w.totalVolumeKg.toLocaleString()}kg</span>
                  <span>PRs: {w.prCount}</span>
                </div>
              </div>
            ))}

            {/* Custom Activities */}
            {loggedActivities.filter(a => a.date === selectedDayActivities).map(a => (
              <div key={a.id} className="p-4 rounded-2xl bg-background-elevated border border-accent-cyan/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-accent-cyan font-mono uppercase">{a.type}</span>
                  <button
                    onClick={() => deleteLoggedActivity(a.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors"
                    title="Delete activity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="font-bold text-sm text-white">{a.name}</h4>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
                  <span>Duration: {a.durationMinutes} min</span>
                  {a.caloriesBurned && <span>Burned: {a.caloriesBurned} kcal</span>}
                  {a.distanceKm && <span>Dist: {a.distanceKm} km</span>}
                </div>
                {a.notes && <p className="text-xs text-slate-400 italic">"{a.notes}"</p>}
              </div>
            ))}
          </div>
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
