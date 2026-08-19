import { MOCK_EXERCISES } from '../data/mockExercises';
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
 * Fuzzy match user exercise text to available database exercises
 */
const findMatchingExercise = (text: string) => {
  const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  
  // 1. Direct name match
  const exact = MOCK_EXERCISES.find(ex => clean.includes(ex.name.toLowerCase()) || ex.name.toLowerCase().includes(clean));
  if (exact) return exact;

  // 2. Keyword mapping
  if (clean.includes('bench') && !clean.includes('incline') && !clean.includes('dumbbell')) {
    return MOCK_EXERCISES.find(e => e.id === 'barbell_bench_press');
  }
  if (clean.includes('incline') && clean.includes('dumbbell')) {
    return MOCK_EXERCISES.find(e => e.id === 'incline_dumbbell_press');
  }
  if (clean.includes('incline') && clean.includes('barbell')) {
    return MOCK_EXERCISES.find(e => e.id === 'incline_barbell_press');
  }
  if (clean.includes('lateral raise') || clean.includes('side raise')) {
    return MOCK_EXERCISES.find(e => e.id === 'dumbbell_lateral_raise');
  }
  if (clean.includes('tricep') || clean.includes('pushdown')) {
    return MOCK_EXERCISES.find(e => e.id === 'tricep_rope_pushdown');
  }
  if (clean.includes('squat')) {
    return MOCK_EXERCISES.find(e => e.id === 'barbell_back_squat');
  }
  if (clean.includes('deadlift')) {
    return MOCK_EXERCISES.find(e => e.id === 'barbell_deadlift');
  }
  if (clean.includes('lat pulldown') || clean.includes('pulldown')) {
    return MOCK_EXERCISES.find(e => e.id === 'lat_pulldown');
  }
  if (clean.includes('pull up') || clean.includes('pullups') || clean.includes('pull-up')) {
    return MOCK_EXERCISES.find(e => e.id === 'pull_ups');
  }
  if (clean.includes('row')) {
    return MOCK_EXERCISES.find(e => e.id === 'barbell_row');
  }
  if (clean.includes('curl') || clean.includes('bicep')) {
    return MOCK_EXERCISES.find(e => e.id === 'barbell_bicep_curl');
  }
  if (clean.includes('leg press')) {
    return MOCK_EXERCISES.find(e => e.id === 'leg_press');
  }
  if (clean.includes('rdl') || clean.includes('romanian')) {
    return MOCK_EXERCISES.find(e => e.id === 'romanian_deadlift');
  }
  if (clean.includes('overhead') || clean.includes('ohp') || clean.includes('shoulder press')) {
    return MOCK_EXERCISES.find(e => e.id === 'overhead_barbell_press');
  }

  // Fallback first exercise
  return MOCK_EXERCISES[0];
};

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
    if (firstLine.includes(':') || firstLine.toLowerCase().includes('day') || firstLine.toLowerCase().includes('routine')) {
      workoutName = firstLine.replace(/^(i do|my routine is|workout:)\s*/i, '').replace(':', '').trim();
      exerciseLines.push(...lines.slice(1));
    } else {
      exerciseLines.push(...lines);
    }
  }

  const parsedExercises = exerciseLines.map(line => {
    // Match patterns like:
    // "4 sets of 8"
    // "3x10" or "3 x 10" or "4*8"
    // "3 sets 12 reps"
    let sets = 3;
    let reps = 10;

    const setRepPattern1 = /(\d+)\s*(?:sets\s*(?:of)?\s*|x|\*)\s*(\d+)/i;
    const match1 = line.match(setRepPattern1);

    if (match1) {
      sets = parseInt(match1[1], 10);
      reps = parseInt(match1[2], 10);
    } else {
      const matchRepsOnly = /(\d+)\s*reps/i;
      const mReps = line.match(matchRepsOnly);
      if (mReps) reps = parseInt(mReps[1], 10);
      
      const matchSetsOnly = /(\d+)\s*sets/i;
      const mSets = line.match(matchSetsOnly);
      if (mSets) sets = parseInt(mSets[1], 10);
    }

    // Extract exercise name by removing set/rep digits
    const cleanedLine = line.replace(/(\d+)\s*(?:sets\s*(?:of)?\s*|x|\*)\s*(\d+)/i, '').replace(/(\d+)\s*(sets|reps)/gi, '').trim();
    const matchedEx = findMatchingExercise(cleanedLine || line) || MOCK_EXERCISES[0];

    // Estimate suggested starting weight based on equipment
    let suggestedWeight = 20;
    if (matchedEx.id === 'barbell_bench_press') suggestedWeight = 62.5;
    else if (matchedEx.id === 'incline_dumbbell_press') suggestedWeight = 26;
    else if (matchedEx.id === 'dumbbell_lateral_raise') suggestedWeight = 12;
    else if (matchedEx.id === 'tricep_rope_pushdown') suggestedWeight = 27.5;
    else if (matchedEx.id === 'barbell_back_squat') suggestedWeight = 105;
    else if (matchedEx.id === 'barbell_deadlift') suggestedWeight = 140;
    else if (matchedEx.id === 'lat_pulldown') suggestedWeight = 65;
    else if (matchedEx.equipment === 'Barbell') suggestedWeight = 50;
    else if (matchedEx.equipment === 'Dumbbell') suggestedWeight = 16;
    else if (matchedEx.equipment === 'Cable') suggestedWeight = 25;
    else if (matchedEx.equipment === 'Machine') suggestedWeight = 45;

    return {
      exerciseId: matchedEx.id,
      exerciseName: matchedEx.name,
      targetSets: sets,
      targetReps: reps,
      suggestedWeight,
      rawText: line
    };
  });

  return {
    workoutName: workoutName || 'AI Push / Pull Routine',
    exercises: parsedExercises.length > 0 ? parsedExercises : [
      {
        exerciseId: 'barbell_bench_press',
        exerciseName: 'Barbell Bench Press',
        targetSets: 4,
        targetReps: 8,
        suggestedWeight: 62.5,
        rawText: 'bench press 4x8'
      },
      {
        exerciseId: 'incline_dumbbell_press',
        exerciseName: 'Incline Dumbbell Press',
        targetSets: 3,
        targetReps: 10,
        suggestedWeight: 26,
        rawText: 'incline dumbbell press 3x10'
      }
    ],
    confidence: 0.96
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
      targetRepsMin: item.targetReps,
      targetRepsMax: item.targetReps + 2
    }))
  }));
};
