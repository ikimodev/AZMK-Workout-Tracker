import { getExerciseById, findOrCreateExercise } from '../data/mockExercises';
import { matchExerciseId } from './geminiService';
import { WorkoutExercise } from '../types';

export interface ParsedWorkoutResult {
  workoutName: string;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    targetSets: number;
    targetReps: number;
    suggestedWeight: number;
    rawText: string;
  }[];
  confidence: number;
}

/**
 * Natural language parser converting typed workouts into structured objects
 */
export const parseNaturalLanguageWorkout = (input: string): ParsedWorkoutResult => {
  const lines = input.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  let workoutName = 'Custom AI Workout';
  const exerciseLines: string[] = [];

  // Check if first line is a title (e.g. "I do push day:" or "Push Day:")
  if (lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.includes(':') || firstLine.toLowerCase().includes('day') || firstLine.toLowerCase().includes('routine') || firstLine.toLowerCase().includes('يوم')) {
      workoutName = firstLine.replace(/^(i do|my routine is|workout:|اليوم الأول:|اليوم الثاني:)\s*/i, '').replace(':', '').trim();
      exerciseLines.push(...lines.slice(1));
    } else {
      exerciseLines.push(...lines);
    }
  }

  const parsedExercises = exerciseLines.map(line => {
    let sets = 3;
    let reps = 10;
    let weight = 0;
    let hasExplicitWeight = false;

    const setRepPattern = /(\d+)\s*(?:sets?|x|\*|×|جولات?|مجموعات?)\s*(?:of\s*|×\s*)?(\d+(?:\s*[\-–—~to]\s*\d+)?\s*(?:s|sec|ثانية)?)/i;
    const match1 = line.match(setRepPattern);

    if (match1) {
      sets = parseInt(match1[1], 10);
      reps = parseInt(match1[2], 10) || 10;
    } else {
      const matchRepsOnly = /(\d+)\s*(?:reps?|عدات?)/i;
      const mReps = line.match(matchRepsOnly);
      if (mReps) reps = parseInt(mReps[1], 10);
      
      const matchSetsOnly = /(\d+)\s*(?:sets?|جولات?)/i;
      const mSets = line.match(matchSetsOnly);
      if (mSets) sets = parseInt(mSets[1], 10);
    }

    const weightMatch = line.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?|كيلو|كجم|lbs?|باوند)/i);
    if (weightMatch) {
      weight = parseFloat(weightMatch[1]) || 0;
      hasExplicitWeight = true;
    }

    // Extract clean exercise name
    const cleanedLine = line
      .replace(setRepPattern, '')
      .replace(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?|كيلو|كجم|lbs?|باوند)/gi, '')
      .replace(/[@#\*]/g, ' ')
      .replace(/^[\-–—•\.\d\)]+\s*/, '')
      .replace(/[\-–—]+\s*$/, '')
      .replace(/\s+/g, ' ')
      .trim();

    const matchedId = matchExerciseId(cleanedLine || line);
    const exerciseObj = getExerciseById(matchedId);

    // Calculate suggested weight if not specified
    let suggestedWeight = weight;
    if (!hasExplicitWeight) {
      if (exerciseObj.equipment === 'Bodyweight') suggestedWeight = 0;
      else if (exerciseObj.id === 'barbell_bench_press') suggestedWeight = 60;
      else if (exerciseObj.id === 'smith_bench_press') suggestedWeight = 50;
      else if (exerciseObj.id === 'incline_dumbbell_press') suggestedWeight = 24;
      else if (exerciseObj.id === 'dumbbell_lateral_raise') suggestedWeight = 10;
      else if (exerciseObj.id === 'tricep_rope_pushdown') suggestedWeight = 22.5;
      else if (exerciseObj.id === 'barbell_back_squat') suggestedWeight = 80;
      else if (exerciseObj.id === 'barbell_deadlift') suggestedWeight = 100;
      else if (exerciseObj.id === 'lat_pulldown') suggestedWeight = 50;
      else if (exerciseObj.equipment === 'Barbell') suggestedWeight = 40;
      else if (exerciseObj.equipment === 'Dumbbell') suggestedWeight = 16;
      else if (exerciseObj.equipment === 'Cable') suggestedWeight = 25;
      else if (exerciseObj.equipment === 'Machine') suggestedWeight = 45;
      else suggestedWeight = 20;
    }

    return {
      exerciseId: exerciseObj.id,
      exerciseName: exerciseObj.name,
      targetSets: sets,
      targetReps: reps,
      suggestedWeight,
      rawText: line
    };
  });

  return {
    workoutName: workoutName || 'Custom AI Workout',
    exercises: parsedExercises.length > 0 ? parsedExercises : [
      {
        exerciseId: 'barbell_bench_press',
        exerciseName: 'Barbell Bench Press',
        targetSets: 4,
        targetReps: 8,
        suggestedWeight: 60,
        rawText: 'bench press 4x8'
      }
    ],
    confidence: 0.98
  };
};

/**
 * Converts parsed result into actionable WorkoutExercise array for the live logger
 */
export const buildWorkoutFromParsed = (parsed: ParsedWorkoutResult): WorkoutExercise[] => {
  return parsed.exercises.map((item, idx) => ({
    id: `live_ex_${Date.now()}_${idx}`,
    exerciseId: item.exerciseId,
    order: idx + 1,
    restTimerSeconds: 90,
    sets: Array.from({ length: item.targetSets }).map((_, sIdx) => ({
      id: `live_set_${Date.now()}_${idx}_${sIdx}`,
      setNumber: sIdx + 1,
      weight: item.suggestedWeight,
      reps: item.targetReps,
      isCompleted: false,
      previousWeight: Math.max(0, item.suggestedWeight - 2.5),
      previousReps: item.targetReps,
      targetWeight: item.suggestedWeight,
      targetRepsMin: Math.max(1, item.targetReps - 2),
      targetRepsMax: item.targetReps
    }))
  }));
};
