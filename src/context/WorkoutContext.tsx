import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Exercise, 
  WorkoutSession, 
  WorkoutExercise, 
  LoggedSet, 
  Program, 
  PRRecord, 
  UserProfile, 
  ReferralStats, 
  AIChatMessage,
  NextWorkoutRecommendation,
  LoggedActivity,
  TodayScheduleState
} from '../types';
import { MOCK_EXERCISES, getExerciseById, getAllExercises } from '../data/mockExercises';
import { 
  MOCK_USER_PROFILE, 
  MOCK_REFERRAL_STATS, 
  MOCK_PRS, 
  MOCK_PROGRAM, 
  generateHistoricalWorkouts 
} from '../data/mockUserData';
import { getExerciseSummary } from '../services/progressiveOverload';
import { queryAICoach } from '../services/aiCoachEngine';
import { askCoachAzzamRealAI } from '../services/geminiService';
import confetti from 'canvas-confetti';
import { TRANSLATIONS, Language } from '../i18n/translations';

interface WorkoutContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  user: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  exercises: Exercise[];
  history: WorkoutSession[];
  programs: Program[];
  activeProgram: Program;
  prs: PRRecord[];
  referralStats: ReferralStats;
  
  // Active Workout
  activeWorkout: WorkoutSession | null;
  workoutDuration: number;
  startWorkout: (name?: string, templateExercises?: WorkoutExercise[]) => void;
  startTodaysAutocompleteWorkout: () => void;
  cancelActiveWorkout: () => void;
  finishActiveWorkout: () => WorkoutSession | null;
  lastCompletedSession: WorkoutSession | null;
  clearLastCompletedSession: () => void;

  // Set & Exercise Management in Active Workout
  addSetToExercise: (exerciseIndex: number) => void;
  updateSet: (exerciseIndex: number, setIndex: number, fields: Partial<LoggedSet>) => void;
  deleteSet: (exerciseIndex: number, setIndex: number) => void;
  duplicateSet: (exerciseIndex: number, setIndex: number) => void;
  toggleSetCompleted: (exerciseIndex: number, setIndex: number) => void;
  addExerciseToActiveWorkout: (exerciseId: string) => void;
  replaceExerciseInActiveWorkout: (exerciseIndex: number, newExerciseId: string) => void;
  removeExerciseFromActiveWorkout: (exerciseIndex: number) => void;
  reorderExercisesInActiveWorkout: (startIndex: number, endIndex: number) => void;

  // Rest Timer
  restTimerRemaining: number;
  restTimerTotal: number;
  isRestTimerActive: boolean;
  startRestTimer: (seconds: number) => void;
  pauseRestTimer: () => void;
  resumeRestTimer: () => void;
  stopRestTimer: () => void;
  adjustRestTimer: (deltaSeconds: number) => void;

  // AI & Chat
  aiMessages: AIChatMessage[];
  isAILoading: boolean;
  sendChatMessage: (text: string) => Promise<void>;
  saveImportedWorkout: (name: string, exercises: WorkoutExercise[]) => void;
  saveGeneratedProgram: (program: Program) => void;

  // Referrals & Subscriptions
  generateNewReferralCode: (code?: string) => void;
  toggleSubscriptionTier: () => void;

  // PR Celebration Modal
  celebrationPR: PRRecord | null;
  dismissCelebrationPR: () => void;
  resetAllDemoData: () => void;
  loadPrepopulatedDemoAccount: () => void;

  // Activities & Calendar
  loggedActivities: LoggedActivity[];
  addLoggedActivity: (activity: Omit<LoggedActivity, 'id'>) => void;
  deleteLoggedActivity: (id: string) => void;
  setCalendarDayCustomization: (dateStr: string, customization: { type: 'workout' | 'rest'; workoutIndex?: number; customName?: string } | null) => void;
  getTodaysScheduleState: () => TodayScheduleState;

  // Helpers
  getRecommendationForExercise: (exerciseId: string) => NextWorkoutRecommendation;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Web Audio API Beep Generator
const playTimerBeep = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch A5
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // Silently ignore audio block
  }
};

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('pulse_lang');
    if (saved === 'en' || saved === 'ar') return saved;
    
    // Auto-detect device / browser system language automatically!
    if (typeof navigator !== 'undefined') {
      const browserLang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
      if (browserLang.startsWith('ar')) {
        return 'ar';
      }
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pulse_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let str = (dict as any)[key] || (TRANSLATIONS.en as any)[key] || key;
    if (params) {
      Object.entries(params).forEach(([pKey, pVal]) => {
        str = str.replace(`{${pKey}}`, String(pVal));
      });
    }
    return str;
  };

  // State initialization with localStorage fallback
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('pulse_user');
    return saved ? JSON.parse(saved) : MOCK_USER_PROFILE;
  });

  const [exercises] = useState<Exercise[]>(() => getAllExercises());

  const [history, setHistory] = useState<WorkoutSession[]>(() => {
    const saved = localStorage.getItem('pulse_history');
    return saved ? JSON.parse(saved) : generateHistoricalWorkouts();
  });

  const [programs, setPrograms] = useState<Program[]>(() => {
    const saved = localStorage.getItem('pulse_programs');
    return saved ? JSON.parse(saved) : [MOCK_PROGRAM];
  });

  const activeProgram = programs[0] || MOCK_PROGRAM;

  const [prs, setPrs] = useState<PRRecord[]>(() => {
    const saved = localStorage.getItem('pulse_prs');
    return saved ? JSON.parse(saved) : MOCK_PRS;
  });

  const [referralStats, setReferralStats] = useState<ReferralStats>(() => {
    const saved = localStorage.getItem('pulse_referral');
    return saved ? JSON.parse(saved) : MOCK_REFERRAL_STATS;
  });

  // Active Live Workout State
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(() => {
    const saved = localStorage.getItem('pulse_active_workout');
    return saved ? JSON.parse(saved) : null;
  });

  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [lastCompletedSession, setLastCompletedSession] = useState<WorkoutSession | null>(null);
  const [celebrationPR, setCelebrationPR] = useState<PRRecord | null>(null);

  // Rest Timer State
  const [restTimerRemaining, setRestTimerRemaining] = useState(0);
  const [restTimerTotal, setRestTimerTotal] = useState(90);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);

  // AI Chat State
  const [aiMessages, setAiMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome_ai_msg',
      sender: 'assistant',
      text: `👋 Hey Kareem! I'm your **PULSE AI Coach**.

I have direct access to your 22 completed sessions, 1RM progression curves, and RPE history.

Try asking me:
- *"Why has my bench stopped improving?"*
- *"What should I do next workout?"*
- *"Which muscle groups am I training the most?"*
- *"Am I progressing?"*`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [isAILoading, setIsAILoading] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('pulse_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('pulse_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('pulse_programs', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem('pulse_prs', JSON.stringify(prs));
  }, [prs]);

  useEffect(() => {
    localStorage.setItem('pulse_referral', JSON.stringify(referralStats));
  }, [referralStats]);

  useEffect(() => {
    if (activeWorkout) {
      localStorage.setItem('pulse_active_workout', JSON.stringify(activeWorkout));
    } else {
      localStorage.removeItem('pulse_active_workout');
    }
  }, [activeWorkout]);

  // Workout live timer ticker
  useEffect(() => {
    let interval: any;
    if (activeWorkout) {
      interval = setInterval(() => {
        const start = new Date(activeWorkout.startedAt).getTime();
        const now = Date.now();
        setWorkoutDuration(Math.floor((now - start) / 1000));
      }, 1000);
    } else {
      setWorkoutDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeWorkout]);

  // Rest timer ticker
  useEffect(() => {
    let interval: any;
    if (isRestTimerActive && restTimerRemaining > 0) {
      interval = setInterval(() => {
        setRestTimerRemaining(prev => {
          if (prev <= 1) {
            setIsRestTimerActive(false);
            playTimerBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRestTimerActive, restTimerRemaining]);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const getRecommendationForExercise = (exerciseId: string): NextWorkoutRecommendation => {
    const summary = getExerciseSummary(exerciseId, history);
    return summary.recommendation;
  };

  /**
   * Starts a brand new live workout session
   */
  const startWorkout = (name = 'Live Workout', templateExercises?: WorkoutExercise[]) => {
    const defaultExs: WorkoutExercise[] = templateExercises || [
      {
        id: `we_${Date.now()}_0`,
        exerciseId: 'barbell_bench_press',
        order: 1,
        restTimerSeconds: 90,
        sets: [
          { id: `s_${Date.now()}_1`, setNumber: 1, weight: 62.5, reps: 8, isCompleted: false, previousWeight: 60, previousReps: 8, targetWeight: 65, targetRepsMin: 6, targetRepsMax: 8 },
          { id: `s_${Date.now()}_2`, setNumber: 2, weight: 62.5, reps: 8, isCompleted: false, previousWeight: 60, previousReps: 8, targetWeight: 65, targetRepsMin: 6, targetRepsMax: 8 },
          { id: `s_${Date.now()}_3`, setNumber: 3, weight: 62.5, reps: 8, isCompleted: false, previousWeight: 60, previousReps: 8, targetWeight: 65, targetRepsMin: 6, targetRepsMax: 8 }
        ]
      }
    ];

    const session: WorkoutSession = {
      id: `live_session_${Date.now()}`,
      name,
      date: new Date().toISOString(),
      startedAt: new Date().toISOString(),
      durationMinutes: 0,
      exercises: defaultExs,
      totalVolumeKg: 0,
      totalSets: defaultExs.reduce((sum, e) => sum + e.sets.length, 0),
      totalReps: 0,
      prCount: 0,
      isCompleted: false
    };

    setActiveWorkout(session);
  };

  const [loggedActivities, setLoggedActivities] = useState<LoggedActivity[]>(() => {
    const saved = localStorage.getItem('pulse_activities');
    return saved ? JSON.parse(saved) : [
      {
        id: 'act_demo_1',
        name: 'Zone 2 Recovery Jog & Walk',
        type: 'Walking / Zone 2',
        date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        durationMinutes: 35,
        caloriesBurned: 240,
        distanceKm: 4.2,
        notes: 'Low intensity recovery on rest day'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('pulse_activities', JSON.stringify(loggedActivities));
  }, [loggedActivities]);

  const addLoggedActivity = (actData: Omit<LoggedActivity, 'id'>) => {
    const newAct: LoggedActivity = {
      ...actData,
      id: `act_${Date.now()}`
    };
    setLoggedActivities(prev => [newAct, ...prev]);
  };

  const deleteLoggedActivity = (id: string) => {
    setLoggedActivities(prev => prev.filter(a => a.id !== id));
  };

  const setCalendarDayCustomization = (
    dateStr: string, 
    customization: { type: 'workout' | 'rest'; workoutIndex?: number; customName?: string } | null
  ) => {
    setUser(prev => {
      const updated = { ...(prev.calendarCustomizations || {}) };
      if (!customization) {
        delete updated[dateStr];
      } else {
        updated[dateStr] = customization;
      }
      const newUser = { ...prev, calendarCustomizations: updated };
      localStorage.setItem('pulse_user', JSON.stringify(newUser));
      return newUser;
    });
  };

  /**
   * Intelligent Schedule State:
   * Determines if today is a scheduled Lifting Day or Rest Day,
   * respects user's startDayOption (Today vs Tomorrow) and custom calendar overrides.
   */
  const getTodaysScheduleState = (): TodayScheduleState => {
    const today = new Date();
    // Monday = 1, Sunday = 7
    const dayOfWeekNumber = today.getDay() === 0 ? 7 : today.getDay();
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const currentDayName = dayNames[dayOfWeekNumber - 1];

    const weekWorkouts = activeProgram.weeks[0]?.workouts || [];
    const daysCount = user.daysPerWeek || 4;

    // Check if user already did a workout today
    const todayStr = today.toISOString().split('T')[0];
    const completedToday = history.some(h => h.date && h.date.startsWith(todayStr));

    // Calculate which workout is next in the progression cycle (Day 1 -> Day 2 -> Day 3 -> Day 4...)
    const completedCount = history.length;
    const nextWorkoutIndex = weekWorkouts.length > 0 ? (completedCount % weekWorkouts.length) : 0;
    const nextWorkoutTemplate = weekWorkouts[nextWorkoutIndex] || null;

    let scheduledWorkoutDays: number[] = [1, 2, 4, 5];
    if (daysCount === 2) scheduledWorkoutDays = [1, 4];
    else if (daysCount === 3) scheduledWorkoutDays = [1, 3, 5];
    else if (daysCount === 4) scheduledWorkoutDays = [1, 2, 4, 5];
    else if (daysCount === 5) scheduledWorkoutDays = [1, 2, 3, 5, 6];
    else if (daysCount === 6) scheduledWorkoutDays = [1, 2, 3, 4, 5, 6];

    // Check manual day override or tomorrow start
    const customForToday = user.calendarCustomizations?.[todayStr];
    let isRestDayToday = false;

    if (customForToday) {
      isRestDayToday = customForToday.type === 'rest';
    } else if (user.startDayOption === 'tomorrow' && user.programStartDate === todayStr && completedCount === 0) {
      isRestDayToday = true;
    } else {
      isRestDayToday = !scheduledWorkoutDays.includes(dayOfWeekNumber) || completedToday;
    }

    return {
      isRestDay: isRestDayToday,
      dayName: currentDayName,
      dayNumber: dayOfWeekNumber,
      workoutTemplate: nextWorkoutTemplate,
      workoutIndex: nextWorkoutIndex,
      totalWorkoutsInWeek: weekWorkouts.length,
      completedThisWeek: weekWorkouts.length > 0 ? (completedCount % weekWorkouts.length) : 0,
      nextScheduledWorkoutDay: isRestDayToday ? (completedToday ? 'Tomorrow' : 'Next Scheduled Day') : 'Today'
    };
  };

  /**
   * Workout Autocomplete: Automatically pre-fills the NEXT scheduled day's workout
   * (Day 1 -> Day 2 -> Day 3 -> Day 4) with progressive targets
   */
  const startTodaysAutocompleteWorkout = () => {
    const sched = getTodaysScheduleState();
    const workoutTemplate = sched.workoutTemplate || activeProgram.weeks[0]?.workouts[0];
    if (!workoutTemplate) return;

    const workoutExercises: WorkoutExercise[] = workoutTemplate.exercises.map((item: any, idx: number) => {
      const summary = getExerciseSummary(item.exerciseId, history);
      const numSets = item.targetSets || 3;
      const targetRepsMin = summary.targetRepsMin || 8;
      const targetRepsMax = summary.targetRepsMax || 10;
      const targetWeight = summary.targetWeight || 50;

      return {
        id: `we_auto_${Date.now()}_${idx}`,
        exerciseId: item.exerciseId,
        order: idx + 1,
        restTimerSeconds: item.restSeconds || 90,
        sets: Array.from({ length: numSets }).map((_, sIdx) => ({
          id: `set_auto_${Date.now()}_${idx}_${sIdx}`,
          setNumber: sIdx + 1,
          weight: targetWeight,
          reps: targetRepsMin,
          isCompleted: false,
          previousWeight: summary.lastWeight || targetWeight,
          previousReps: summary.lastReps || targetRepsMin,
          targetWeight: targetWeight,
          targetRepsMin: targetRepsMin,
          targetRepsMax: targetRepsMax
        }))
      };
    });

    startWorkout(workoutTemplate.name, workoutExercises);
  };

  const cancelActiveWorkout = () => {
    setActiveWorkout(null);
    setIsRestTimerActive(false);
  };

  const addSetToExercise = (exerciseIndex: number) => {
    if (!activeWorkout) return;
    const targetEx = activeWorkout.exercises[exerciseIndex];
    if (!targetEx) return;

    const lastSet = targetEx.sets[targetEx.sets.length - 1];
    const prevWeight = lastSet ? lastSet.weight : 50;
    const prevReps = lastSet ? lastSet.reps : 8;

    const newSet: LoggedSet = {
      id: `set_${Date.now()}_${targetEx.sets.length + 1}`,
      setNumber: targetEx.sets.length + 1,
      weight: prevWeight,
      reps: prevReps,
      isCompleted: false,
      previousWeight: lastSet?.previousWeight || prevWeight,
      previousReps: lastSet?.previousReps || prevReps,
      targetWeight: prevWeight,
      targetRepsMin: prevReps - 2,
      targetRepsMax: prevReps
    };

    const updatedExercises = [...activeWorkout.exercises];
    updatedExercises[exerciseIndex] = {
      ...targetEx,
      sets: [...targetEx.sets, newSet]
    };

    setActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });
  };

  const updateSet = (exerciseIndex: number, setIndex: number, fields: Partial<LoggedSet>) => {
    if (!activeWorkout) return;
    const updatedExercises = [...activeWorkout.exercises];
    const exercise = updatedExercises[exerciseIndex];
    if (!exercise) return;

    const updatedSets = [...exercise.sets];
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      ...fields
    };

    updatedExercises[exerciseIndex] = {
      ...exercise,
      sets: updatedSets
    };

    setActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });
  };

  const deleteSet = (exerciseIndex: number, setIndex: number) => {
    if (!activeWorkout) return;
    const updatedExercises = [...activeWorkout.exercises];
    const exercise = updatedExercises[exerciseIndex];
    if (!exercise) return;

    const updatedSets = exercise.sets
      .filter((_, idx) => idx !== setIndex)
      .map((s, idx) => ({ ...s, setNumber: idx + 1 }));

    updatedExercises[exerciseIndex] = {
      ...exercise,
      sets: updatedSets
    };

    setActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });
  };

  const duplicateSet = (exerciseIndex: number, setIndex: number) => {
    if (!activeWorkout) return;
    const updatedExercises = [...activeWorkout.exercises];
    const exercise = updatedExercises[exerciseIndex];
    if (!exercise) return;

    const setTarget = exercise.sets[setIndex];
    if (!setTarget) return;

    const newSet: LoggedSet = {
      ...setTarget,
      id: `set_dup_${Date.now()}`,
      isCompleted: false
    };

    const updatedSets = [
      ...exercise.sets.slice(0, setIndex + 1),
      newSet,
      ...exercise.sets.slice(setIndex + 1)
    ].map((s, idx) => ({ ...s, setNumber: idx + 1 }));

    updatedExercises[exerciseIndex] = {
      ...exercise,
      sets: updatedSets
    };

    setActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });
  };

  const toggleSetCompleted = (exerciseIndex: number, setIndex: number) => {
    if (!activeWorkout) return;
    const exercise = activeWorkout.exercises[exerciseIndex];
    if (!exercise) return;

    const targetSet = exercise.sets[setIndex];
    const newStatus = !targetSet.isCompleted;

    // Check for PR
    let isNewPR = false;
    if (newStatus && targetSet.weight > 0) {
      const summary = getExerciseSummary(exercise.exerciseId, history);
      if (targetSet.weight > summary.allTimeBestWeight) {
        isNewPR = true;
        const newPrRecord: PRRecord = {
          id: `pr_${Date.now()}`,
          exerciseId: exercise.exerciseId,
          exerciseName: getExerciseById(exercise.exerciseId)?.name || exercise.exerciseId,
          type: 'weight',
          value: targetSet.weight,
          weight: targetSet.weight,
          reps: targetSet.reps,
          date: new Date().toISOString().split('T')[0],
          previousBest: summary.allTimeBestWeight,
          improvementPercentage: Math.round(((targetSet.weight - summary.allTimeBestWeight) / summary.allTimeBestWeight) * 1000) / 10
        };

        setCelebrationPR(newPrRecord);
        setPrs(prev => [newPrRecord, ...prev]);

        // Launch celebratory confetti
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore
        }
      }
    }

    updateSet(exerciseIndex, setIndex, {
      isCompleted: newStatus,
      isPR: isNewPR
    });

    // Automatically trigger rest timer when marked complete
    if (newStatus) {
      startRestTimer(exercise.restTimerSeconds || 90);
    }
  };

  const addExerciseToActiveWorkout = (exerciseId: string) => {
    if (!activeWorkout) return;
    const summary = getExerciseSummary(exerciseId, history);

    const newEx: WorkoutExercise = {
      id: `we_${Date.now()}_${activeWorkout.exercises.length}`,
      exerciseId,
      order: activeWorkout.exercises.length + 1,
      restTimerSeconds: 90,
      sets: [
        {
          id: `s_${Date.now()}_1`,
          setNumber: 1,
          weight: summary.targetWeight,
          reps: summary.targetRepsMin,
          isCompleted: false,
          previousWeight: summary.lastWeight,
          previousReps: summary.lastReps,
          targetWeight: summary.targetWeight,
          targetRepsMin: summary.targetRepsMin,
          targetRepsMax: summary.targetRepsMax
        }
      ]
    };

    setActiveWorkout({
      ...activeWorkout,
      exercises: [...activeWorkout.exercises, newEx]
    });
  };

  const replaceExerciseInActiveWorkout = (exerciseIndex: number, newExerciseId: string) => {
    if (!activeWorkout) return;
    const updatedExercises = [...activeWorkout.exercises];
    const currentEx = updatedExercises[exerciseIndex];
    if (!currentEx) return;

    const summary = getExerciseSummary(newExerciseId, history);
    updatedExercises[exerciseIndex] = {
      ...currentEx,
      exerciseId: newExerciseId,
      sets: currentEx.sets.map(s => ({
        ...s,
        weight: summary.targetWeight,
        reps: summary.targetRepsMin,
        previousWeight: summary.lastWeight,
        previousReps: summary.lastReps,
        isPR: false
      }))
    };

    setActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });
  };

  const removeExerciseFromActiveWorkout = (exerciseIndex: number) => {
    if (!activeWorkout) return;
    const updatedExercises = activeWorkout.exercises
      .filter((_, idx) => idx !== exerciseIndex)
      .map((ex, idx) => ({ ...ex, order: idx + 1 }));

    setActiveWorkout({
      ...activeWorkout,
      exercises: updatedExercises
    });
  };

  const reorderExercisesInActiveWorkout = (startIndex: number, endIndex: number) => {
    if (!activeWorkout) return;
    const list = [...activeWorkout.exercises];
    const [removed] = list.splice(startIndex, 1);
    list.splice(endIndex, 0, removed);

    setActiveWorkout({
      ...activeWorkout,
      exercises: list.map((ex, idx) => ({ ...ex, order: idx + 1 }))
    });
  };

  const startRestTimer = (seconds: number) => {
    setRestTimerTotal(seconds);
    setRestTimerRemaining(seconds);
    setIsRestTimerActive(true);
  };

  const pauseRestTimer = () => setIsRestTimerActive(false);
  const resumeRestTimer = () => setIsRestTimerActive(true);
  const stopRestTimer = () => {
    setIsRestTimerActive(false);
    setRestTimerRemaining(0);
  };
  const adjustRestTimer = (deltaSeconds: number) => {
    setRestTimerRemaining(prev => Math.max(0, prev + deltaSeconds));
  };

  /**
   * Finishes active workout and calculates metrics & AI summary
   */
  const finishActiveWorkout = (): WorkoutSession | null => {
    if (!activeWorkout) return null;

    let totalVolume = 0;
    let totalCompletedSets = 0;
    let totalReps = 0;
    let prsHit = 0;

    activeWorkout.exercises.forEach(ex => {
      ex.sets.forEach(st => {
        if (st.isCompleted) {
          totalCompletedSets += 1;
          totalReps += st.reps;
          totalVolume += st.weight * st.reps;
          if (st.isPR) prsHit += 1;
        }
      });
    });

    const durationMin = Math.max(1, Math.round(workoutDuration / 60));
    
    // Compare volume with previous matching session
    const prevSimilar = history.find(s => s.name === activeWorkout.name);
    let volDiffPercent = 5.2;
    if (prevSimilar && prevSimilar.totalVolumeKg > 0) {
      volDiffPercent = Math.round(((totalVolume - prevSimilar.totalVolumeKg) / prevSimilar.totalVolumeKg) * 1000) / 10;
    }

    const aiSummary = `Crushed it! You logged ${totalCompletedSets} sets with a total tonnage of ${totalVolume.toLocaleString()} kg (${volDiffPercent >= 0 ? `+${volDiffPercent}%` : `${volDiffPercent}%`} vs previous session). Progressive overload maintained!`;

    const completedSession: WorkoutSession = {
      ...activeWorkout,
      completedAt: new Date().toISOString(),
      durationMinutes: durationMin,
      totalVolumeKg: totalVolume,
      totalSets: totalCompletedSets,
      totalReps,
      prCount: prsHit,
      aiSummary,
      isCompleted: true
    };

    setHistory(prev => [completedSession, ...prev]);
    setLastCompletedSession(completedSession);
    setActiveWorkout(null);
    setIsRestTimerActive(false);

    // Increment streak
    setUser(prev => ({
      ...prev,
      streakDays: prev.streakDays + 1
    }));

    return completedSession;
  };

  const clearLastCompletedSession = () => setLastCompletedSession(null);
  const dismissCelebrationPR = () => setCelebrationPR(null);

  const sendChatMessage = async (text: string) => {
    const isFree = user.tier === 'free';
    const used = user.aiQuestionsUsedToday || 0;
    const limit = 5;

    const userMsg: AIChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setAiMessages(prev => [...prev, userMsg]);
    setIsAILoading(true);

    // Free limit check
    if (isFree && used >= limit) {
      setTimeout(() => {
        const limitReply: AIChatMessage = {
          id: `ai_limit_${Date.now()}`,
          sender: 'assistant',
          text: language === 'ar'
            ? `🔒 **وصلت للحد الأقصى اليومي في الباقة المجانية (5/5 أسئلة)**

يا ${user.name || 'بطل'}، لقد استنفدت عدد استشارات المدرب الذكي (عزام) المجانية لهذا اليوم (5 أسئلة).

⚡ **للترقية إلى استشارات غير محدودة وتحليل فوري بدون قيود:**
قم بالترقية إلى باقة **Pro** للاستمتاع بمدرب شخصي متواصل على مدار الساعة مع توليد خطط متقدمة!`
            : `🔒 **Daily Free Limit Reached (5/5 Questions)**

Hey ${user.name || 'Athlete'}, you have reached your daily quota of 5 AI Coach (Azzam) queries in the Free tier.

⚡ **Upgrade to Pro** for unlimited 24/7 AI coach consultations and advanced periodization cycles!`,
          timestamp: new Date().toISOString(),
          suggestedActions: [
            { label: language === 'ar' ? 'الترقية إلى Pro (غير محدود)' : 'Upgrade to Pro (Unlimited)', actionType: 'view_analytics', payload: {} }
          ]
        };
        setAiMessages(prev => [...prev, limitReply]);
        setIsAILoading(false);
      }, 400);
      return;
    }

    // Increment question count for free user
    if (isFree) {
      setUser(prev => ({ ...prev, aiQuestionsUsedToday: (prev.aiQuestionsUsedToday || 0) + 1 }));
    }

    try {
      let aiText = '';
      
      // Try Real Gemini AI LLM first with multi-turn conversation memory
      try {
        aiText = await askCoachAzzamRealAI(text, user, history, prs, aiMessages, language);
      } catch (llmErr) {
        // Fallback to local intelligent rule engine
        const fallbackReply = await queryAICoach(text, {
          history,
          prs,
          userName: user.name,
          userGoal: user.primaryGoal,
          experience: user.experience,
          isArabic: language === 'ar'
        });
        aiText = fallbackReply.text;
      }

      const aiReply: AIChatMessage = {
        id: `ai_reply_${Date.now()}`,
        sender: 'assistant',
        text: aiText,
        timestamp: new Date().toISOString()
      };

      setAiMessages(prev => [...prev, aiReply]);
    } catch (e) {
      setAiMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: language === 'ar' ? 'حدث خطأ أثناء معالجة البيانات، يرجى المحاولة مجدداً.' : 'I ran into an issue retrieving that data. Please try again.',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsAILoading(false);
    }
  };

  const saveImportedWorkout = (name: string, importedExercises: WorkoutExercise[]) => {
    startWorkout(name, importedExercises);
  };

  const saveGeneratedProgram = (newProgram: Program) => {
    setPrograms(prev => [newProgram, ...prev]);
  };

  const generateNewReferralCode = (customCode?: string) => {
    const newCode = customCode || `PRO${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    setReferralStats(prev => ({
      ...prev,
      code: newCode
    }));
    setUser(prev => ({ ...prev, referralCode: newCode }));
  };

  const toggleSubscriptionTier = () => {
    setUser(prev => ({
      ...prev,
      tier: prev.tier === 'premium' ? 'free' : 'premium'
    }));
  };

  const resetToCleanSlate = () => {
    localStorage.clear();
    const cleanUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: '',
      email: '',
      experience: 'Intermediate',
      primaryGoal: 'Muscle Gain',
      secondaryGoal: 'Strength',
      daysPerWeek: 4,
      preferredDurationMinutes: 60,
      availableEquipment: ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight'],
      tier: 'free',
      referralCode: `JOIN${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      streakDays: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      hasCompletedOnboarding: false
    };

    setUser(cleanUser);
    setHistory([]);
    setPrs([]);
    setPrograms([]);
    setActiveWorkout(null);
    setLastCompletedSession(null);
    setReferralStats({
      code: cleanUser.referralCode,
      clicks: 0,
      signups: 0,
      paidUsers: 0,
      rewardMonthsEarned: 0,
      history: []
    });
    setAiMessages([
      {
        id: 'welcome_ai_msg_clean',
        sender: 'assistant',
        text: `👋 Welcome to **PULSE AI**! I'm ready to track your progress and calculate your progressive overload targets. Start logging your sets to begin building analytics.`,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const loadPrepopulatedDemoAccount = () => {
    localStorage.clear();
    const demoUser = { ...MOCK_USER_PROFILE, hasCompletedOnboarding: true };
    setUser(demoUser);
    setHistory(generateHistoricalWorkouts());
    setPrs(MOCK_PRS);
    setPrograms([MOCK_PROGRAM]);
    setReferralStats(MOCK_REFERRAL_STATS);
    setActiveWorkout(null);
  };

  const resetAllDemoData = resetToCleanSlate;

  return (
    <WorkoutContext.Provider
      value={{
        user,
        updateUserProfile,
        exercises,
        history,
        programs,
        activeProgram: programs[0] || MOCK_PROGRAM,
        prs,
        referralStats,
        activeWorkout,
        workoutDuration,
        startWorkout,
        startTodaysAutocompleteWorkout,
        cancelActiveWorkout,
        finishActiveWorkout,
        lastCompletedSession,
        clearLastCompletedSession,
        addSetToExercise,
        updateSet,
        deleteSet,
        duplicateSet,
        toggleSetCompleted,
        addExerciseToActiveWorkout,
        replaceExerciseInActiveWorkout,
        removeExerciseFromActiveWorkout,
        reorderExercisesInActiveWorkout,
        restTimerRemaining,
        restTimerTotal,
        isRestTimerActive,
        startRestTimer,
        pauseRestTimer,
        resumeRestTimer,
        stopRestTimer,
        adjustRestTimer,
        aiMessages,
        isAILoading,
        sendChatMessage,
        saveImportedWorkout,
        saveGeneratedProgram,
        generateNewReferralCode,
        toggleSubscriptionTier,
        celebrationPR,
        dismissCelebrationPR,
        resetAllDemoData,
        loadPrepopulatedDemoAccount,
        getRecommendationForExercise,
        loggedActivities,
        addLoggedActivity,
        deleteLoggedActivity,
        setCalendarDayCustomization,
        getTodaysScheduleState,
        language,
        setLanguage,
        t
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
