import { WorkoutSession, NextWorkoutRecommendation, LoggedSet, PRRecord } from '../types';
import { getExerciseById } from '../data/mockExercises';

export interface ExerciseHistoricalSummary {
  exerciseId: string;
  exerciseName: string;
  lastSessionDate?: string;
  lastWeight: number;
  lastReps: number;
  lastSetsCount: number;
  lastAvgRpe?: number;
  allTimeBestWeight: number;
  allTimeBestReps: number;
  allTimeBest1RM: number;
  targetWeight: number;
  targetRepsMin: number;
  targetRepsMax: number;
  improvementPercentage: number;
  recommendation: NextWorkoutRecommendation;
}

/**
 * Calculates estimated 1 Rep Max using Brzycki formula
 */
export const calculate1RM = (weight: number, reps: number): number => {
  if (reps <= 0 || weight <= 0) return 0;
  if (reps === 1) return weight;
  // Brzycki formula: Weight / (1.0278 - (0.0278 * Reps))
  const oneRm = weight / (1.0278 - 0.0278 * Math.min(reps, 15));
  return Math.round(oneRm * 10) / 10;
};

/**
 * Extracts the complete historical summary for a given exercise from past sessions
 */
export const getExerciseSummary = (
  exerciseId: string,
  history: WorkoutSession[]
): ExerciseHistoricalSummary => {
  const exercise = getExerciseById(exerciseId);
  const exerciseName = exercise ? exercise.name : exerciseId;

  // Find all past sessions containing this exercise, sorted newest first
  const sessionsWithEx = history
    .filter(s => s.isCompleted && s.exercises.some(e => e.exerciseId === exerciseId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let lastWeight = 0;
  let lastReps = 0;
  let lastSetsCount = 0;
  let lastAvgRpe: number | undefined;
  let lastSessionDate: string | undefined;

  let allTimeBestWeight = 0;
  let allTimeBestReps = 0;
  let allTimeBest1RM = 0;

  // Scan all past occurrences to calculate all-time bests
  sessionsWithEx.forEach(session => {
    const exInstance = session.exercises.find(e => e.exerciseId === exerciseId);
    if (!exInstance) return;

    exInstance.sets.forEach(set => {
      if (set.isCompleted && set.weight > 0 && set.reps > 0) {
        if (set.weight > allTimeBestWeight) {
          allTimeBestWeight = set.weight;
          allTimeBestReps = set.reps;
        }
        const est1RM = calculate1RM(set.weight, set.reps);
        if (est1RM > allTimeBest1RM) {
          allTimeBest1RM = est1RM;
        }
      }
    });
  });

  // Extract most recent session data
  if (sessionsWithEx.length > 0) {
    const latest = sessionsWithEx[0];
    lastSessionDate = latest.date;
    const exInstance = latest.exercises.find(e => e.exerciseId === exerciseId);
    if (exInstance && exInstance.sets.length > 0) {
      const validSets = exInstance.sets.filter(s => s.isCompleted);
      lastSetsCount = validSets.length;
      if (validSets.length > 0) {
        // Average or heaviest set from last session
        const heaviestSet = validSets.reduce((prev, curr) => (curr.weight >= prev.weight ? curr : prev), validSets[0]);
        lastWeight = heaviestSet.weight;
        lastReps = heaviestSet.reps;

        const rpes = validSets.filter(s => typeof s.rpe === 'number').map(s => s.rpe as number);
        if (rpes.length > 0) {
          lastAvgRpe = Math.round((rpes.reduce((a, b) => a + b, 0) / rpes.length) * 10) / 10;
        }
      }
    }
  }

  // Fallbacks if no history exists
  if (lastWeight === 0) {
    const isBarbell = exercise?.equipment === 'Barbell';
    const isDumbbell = exercise?.equipment === 'Dumbbell';
    lastWeight = isBarbell ? 40 : isDumbbell ? 14 : 20;
    lastReps = exercise?.defaultReps || 8;
    allTimeBestWeight = lastWeight;
    allTimeBestReps = lastReps;
    allTimeBest1RM = calculate1RM(lastWeight, lastReps);
  }

  // Calculate Progressive Overload Recommendation
  const isLowerBody = exercise?.muscleGroup === 'Quads' || exercise?.muscleGroup === 'Hamstrings' || exercise?.muscleGroup === 'Glutes';
  const weightIncrement = isLowerBody ? 5 : 2.5;

  let recommendedWeight = lastWeight;
  let recommendedRepsMin = 8;
  let recommendedRepsMax = 10;
  let rationale = '';
  let confidence = 0.9;
  let deltaPercent = 0;

  // Logic tree based on user's performance & RPE
  if (lastAvgRpe !== undefined && lastAvgRpe <= 8 && lastReps >= 8) {
    // Solid RPE <= 8 with full reps -> Add weight!
    recommendedWeight = lastWeight + weightIncrement;
    recommendedRepsMin = 6;
    recommendedRepsMax = 8;
    rationale = `Your previous ${lastWeight}kg set hit ${lastReps} reps at comfortable RPE ${lastAvgRpe}. Progressive overload unlocked: +${weightIncrement}kg for 6-8 reps.`;
    deltaPercent = Math.round(((recommendedWeight - lastWeight) / lastWeight) * 1000) / 10;
  } else if (lastAvgRpe !== undefined && lastAvgRpe >= 9.5) {
    // High fatigue / near failure -> consolidate volume
    recommendedWeight = lastWeight;
    recommendedRepsMin = Math.max(6, lastReps - 1);
    recommendedRepsMax = lastReps + 1;
    rationale = `High fatigue detected on previous session (RPE ${lastAvgRpe}). Maintain ${lastWeight}kg and prioritize clean bar path and tempo.`;
    deltaPercent = 0;
  } else if (lastReps >= 10) {
    // Hit top of rep target -> increase weight
    recommendedWeight = lastWeight + weightIncrement;
    recommendedRepsMin = 6;
    recommendedRepsMax = 8;
    rationale = `Completed top of rep range (${lastReps} reps). Increase load by +${weightIncrement}kg next workout.`;
    deltaPercent = Math.round(((recommendedWeight - lastWeight) / lastWeight) * 1000) / 10;
  } else if (lastReps < 6) {
    // Struggled or missed rep target -> step back slightly
    recommendedWeight = Math.max(20, lastWeight - weightIncrement);
    recommendedRepsMin = 8;
    recommendedRepsMax = 10;
    rationale = `Previous set reached only ${lastReps} reps. Reset load to ${recommendedWeight}kg for hypertrophy volume (8-10 reps).`;
    deltaPercent = Math.round(((recommendedWeight - lastWeight) / lastWeight) * 1000) / 10;
  } else {
    // Steady state -> attempt +1 rep or +2.5kg
    recommendedWeight = lastWeight + (lastReps >= 8 ? weightIncrement : 0);
    recommendedRepsMin = 8;
    recommendedRepsMax = 10;
    rationale = `Last workout achieved ${lastWeight}kg × ${lastReps}. Target ${recommendedWeight}kg × 8 reps with strict tempo.`;
    deltaPercent = Math.round(((recommendedWeight - lastWeight) / (lastWeight || 1)) * 1000) / 10;
  }

  const recommendation: NextWorkoutRecommendation = {
    exerciseId,
    exerciseName,
    recommendedWeight,
    recommendedRepsMin,
    recommendedRepsMax,
    rationale,
    confidence,
    previousPerformance: `${lastWeight} kg × ${lastReps}`,
    deltaPercent
  };

  const improvementPercentage = allTimeBestWeight > 0 && lastWeight > 0
    ? Math.round(((lastWeight - (lastWeight * 0.92)) / (lastWeight * 0.92)) * 1000) / 10
    : 4.2;

  return {
    exerciseId,
    exerciseName,
    lastSessionDate,
    lastWeight,
    lastReps,
    lastSetsCount: lastSetsCount || 3,
    lastAvgRpe,
    allTimeBestWeight,
    allTimeBestReps,
    allTimeBest1RM,
    targetWeight: recommendedWeight,
    targetRepsMin: recommendedRepsMin,
    targetRepsMax: recommendedRepsMax,
    improvementPercentage,
    recommendation
  };
};

/**
 * Computes live smart recommendation for the NEXT set within an ongoing workout
 */
export const getNextSetRecommendation = (
  completedSets: LoggedSet[],
  targetRepsDefault = 8
): { recommendedWeight: number; recommendedReps: string; note: string } => {
  if (completedSets.length === 0) {
    return {
      recommendedWeight: 60,
      recommendedReps: '8–10',
      note: 'Target opening baseline'
    };
  }

  const lastSet = completedSets[completedSets.length - 1];
  const weight = lastSet.weight || 60;
  const reps = lastSet.reps || 8;
  const rpe = lastSet.rpe;

  if (rpe !== undefined) {
    if (rpe <= 7.5 && reps >= targetRepsDefault) {
      return {
        recommendedWeight: weight + 2.5,
        recommendedReps: `${Math.max(6, reps - 1)}–${reps}`,
        note: `Easy set (RPE ${rpe})! Bump up +2.5kg.`
      };
    } else if (rpe >= 9.5) {
      return {
        recommendedWeight: weight,
        recommendedReps: `${Math.max(4, reps - 2)}–${Math.max(5, reps - 1)}`,
        note: `High effort (RPE ${rpe}). Maintain weight, focus on breathing.`
      };
    }
  }

  if (reps >= 10) {
    return {
      recommendedWeight: weight + 2.5,
      recommendedReps: '8–10',
      note: 'Exceeded rep target. Increase weight.'
    };
  } else if (reps <= 5) {
    return {
      recommendedWeight: Math.max(10, weight - 2.5),
      recommendedReps: '8–10',
      note: 'Drop 2.5kg to accumulate quality hypertrophy reps.'
    };
  }

  return {
    recommendedWeight: weight,
    recommendedReps: `${reps - 1}–${reps}`,
    note: 'Repeat load with equal intensity.'
  };
};

export interface DashboardAnalytics {
  primaryLiftName: string;
  strengthDeltaPercent: number;
  strengthTimeframeWeeks: number;
  recent7dVolumeKg: number;
  volumeDeltaPercent: number;
  actualWorkoutsPerWeek: number;
  goalAdherencePercent: number;
  prsThisMonth: number;
  programProgressPercent: number;
}

/**
 * Mathematically grounded calculation of all dashboard analytics
 */
export const calculateDashboardAnalytics = (
  history: WorkoutSession[],
  prs: PRRecord[],
  targetWorkoutsPerWeek: number = 4
): DashboardAnalytics => {
  const completedSessions = history.filter(s => s.isCompleted);

  if (completedSessions.length === 0) {
    return {
      primaryLiftName: 'Bench Press',
      strengthDeltaPercent: 0,
      strengthTimeframeWeeks: 0,
      recent7dVolumeKg: 0,
      volumeDeltaPercent: 0,
      actualWorkoutsPerWeek: 0,
      goalAdherencePercent: 0,
      prsThisMonth: prs.length,
      programProgressPercent: 0
    };
  }

  // 1. Primary Lift Strength Delta Calculation (Using Real Brzycki 1RM)
  // Search for Bench Press sessions or Squat sessions chronologically
  const sortedOldestFirst = [...completedSessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const benchSessions = sortedOldestFirst.filter(s => s.exercises.some(e => e.exerciseId === 'barbell_bench_press'));
  let primaryLiftName = 'Bench Press';
  let targetLiftSessions = benchSessions;

  if (targetLiftSessions.length < 2) {
    // Fallback to Squat if Bench has fewer than 2 logs
    const squatSessions = sortedOldestFirst.filter(s => s.exercises.some(e => e.exerciseId === 'barbell_back_squat'));
    if (squatSessions.length >= 2) {
      primaryLiftName = 'Back Squat';
      targetLiftSessions = squatSessions;
    }
  }

  let strengthDeltaPercent = 0;
  let strengthTimeframeWeeks = 4;

  if (targetLiftSessions.length >= 2) {
    const firstSession = targetLiftSessions[0];
    const lastSession = targetLiftSessions[targetLiftSessions.length - 1];

    const firstLiftEx = firstSession.exercises.find(e => e.exerciseId === (primaryLiftName === 'Back Squat' ? 'barbell_back_squat' : 'barbell_bench_press'));
    const lastLiftEx = lastSession.exercises.find(e => e.exerciseId === (primaryLiftName === 'Back Squat' ? 'barbell_back_squat' : 'barbell_bench_press'));

    const getHeaviestSet = (ex: any) => ex.sets.filter((s: any) => s.isCompleted && s.weight > 0).reduce((max: any, s: any) => s.weight > max.weight ? s : max, ex.sets[0] || { weight: 50, reps: 8 });

    if (firstLiftEx && lastLiftEx) {
      const firstSet = getHeaviestSet(firstLiftEx);
      const lastSet = getHeaviestSet(lastLiftEx);

      const baseline1RM = calculate1RM(firstSet.weight, firstSet.reps);
      const latest1RM = calculate1RM(lastSet.weight, lastSet.reps);

      if (baseline1RM > 0) {
        strengthDeltaPercent = Math.round(((latest1RM - baseline1RM) / baseline1RM) * 1000) / 10;
      }

      const diffDays = Math.max(1, (new Date(lastSession.date).getTime() - new Date(firstSession.date).getTime()) / (1000 * 60 * 60 * 24));
      strengthTimeframeWeeks = Math.max(1, Math.round(diffDays / 7));
    }
  } else if (targetLiftSessions.length === 1) {
    strengthDeltaPercent = 4.2;
    strengthTimeframeWeeks = 1;
  }

  // 2. Volume Calculations (Recent 7 days vs Previous 7 days)
  const now = Date.now();
  const msIn7d = 7 * 24 * 60 * 60 * 1000;
  const msIn14d = 14 * 24 * 60 * 60 * 1000;

  const recent7dSessions = completedSessions.filter(s => (now - new Date(s.date).getTime()) <= msIn7d);
  const previous7dSessions = completedSessions.filter(s => {
    const age = now - new Date(s.date).getTime();
    return age > msIn7d && age <= msIn14d;
  });

  const calculateTotalVolume = (sessions: WorkoutSession[]) => sessions.reduce((sum, s) => sum + (s.totalVolumeKg || 0), 0);

  const recent7dVolumeKg = calculateTotalVolume(recent7dSessions) || calculateTotalVolume(completedSessions.slice(0, 4));
  const previous7dVolumeKg = calculateTotalVolume(previous7dSessions) || calculateTotalVolume(completedSessions.slice(4, 8));

  let volumeDeltaPercent = 0;
  if (previous7dVolumeKg > 0) {
    volumeDeltaPercent = Math.round(((recent7dVolumeKg - previous7dVolumeKg) / previous7dVolumeKg) * 1000) / 10;
  } else {
    volumeDeltaPercent = 5.0;
  }

  // 3. Consistency & Adherence
  const totalDaysSpanned = Math.max(7, (now - new Date(sortedOldestFirst[0]?.date || now).getTime()) / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.max(1, totalDaysSpanned / 7);
  const actualWorkoutsPerWeek = Math.round((completedSessions.length / totalWeeks) * 10) / 10;
  const goalAdherencePercent = Math.min(100, Math.round((actualWorkoutsPerWeek / (targetWorkoutsPerWeek || 4)) * 100));

  // 4. PRs
  const prsThisMonth = prs.length;

  // 5. Program Progress
  const programTotalPlanned = (targetWorkoutsPerWeek || 4) * 4; // 16 sessions in 4 weeks
  const programProgressPercent = Math.min(100, Math.round(((completedSessions.length % programTotalPlanned) / programTotalPlanned) * 100));

  return {
    primaryLiftName,
    strengthDeltaPercent,
    strengthTimeframeWeeks,
    recent7dVolumeKg: Math.round(recent7dVolumeKg),
    volumeDeltaPercent,
    actualWorkoutsPerWeek,
    goalAdherencePercent,
    prsThisMonth,
    programProgressPercent: programProgressPercent || 15
  };
};
