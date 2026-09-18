const fs = require('fs');
const tail = fs.readFileSync('temp_tail.ts', 'utf-8');

const head = `import { Exercise, MuscleGroup, Equipment, MovementPattern, ExerciseTrackingType } from '../types';
import externalData from './exercises.json';

// In-memory cache for custom exercises added during runtime
export const DYNAMIC_EXERCISES_MAP = new Map<string, Exercise>();

// Load from localStorage if available
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('azmk_custom_exercises');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        parsed.forEach(ex => {
          DYNAMIC_EXERCISES_MAP.set(ex.id, ex);
        });
      }
    }
  } catch (e) {
    // Ignore storage errors
  }
}
`;

const inferPart = tail; 

const mapper = `
const mapExternalToExercise = (ext: any): Exercise => {
  // Use the robust inference for movement pattern and tracking type
  const { movementPattern, trackingType, muscleGroup: inferredMuscle, equipment: inferredEq } = inferExerciseAttributes(ext.name);

  // Try to use external data directly if available
  let finalMuscleGroup: MuscleGroup = inferredMuscle;
  if (ext.primaryMuscles && ext.primaryMuscles.length > 0) {
    const extM = ext.primaryMuscles[0].toLowerCase();
    if (extM === 'abdominals') finalMuscleGroup = 'Core';
    else if (extM === 'hamstrings') finalMuscleGroup = 'Hamstrings';
    else if (extM === 'quadriceps') finalMuscleGroup = 'Quads';
    else if (extM === 'chest') finalMuscleGroup = 'Chest';
    else if (extM === 'middle back' || extM === 'lower back' || extM === 'lats' || extM === 'traps') finalMuscleGroup = 'Back';
    else if (extM === 'triceps') finalMuscleGroup = 'Triceps';
    else if (extM === 'biceps') finalMuscleGroup = 'Biceps';
    else if (extM === 'calves') finalMuscleGroup = 'Calves';
    else if (extM === 'glutes') finalMuscleGroup = 'Glutes';
    else if (extM === 'shoulders') finalMuscleGroup = 'Shoulders';
  }

  let finalEquipment: Equipment = inferredEq;
  if (ext.equipment) {
    const extEq = ext.equipment.toLowerCase();
    if (extEq === 'body only') finalEquipment = 'Bodyweight';
    else if (extEq === 'machine') finalEquipment = 'Machine';
    else if (extEq === 'kettlebells') finalEquipment = 'Kettlebell';
    else if (extEq === 'dumbbell') finalEquipment = 'Dumbbell';
    else if (extEq === 'cable') finalEquipment = 'Cable';
    else if (extEq === 'barbell' || extEq === 'e-z curl bar') finalEquipment = 'Barbell';
    else if (extEq === 'bands') finalEquipment = 'Bands';
  }

  let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';
  if (ext.level === 'beginner') difficulty = 'Beginner';
  else if (ext.level === 'expert') difficulty = 'Advanced';

  const instructions = ext.instructions && Array.isArray(ext.instructions) 
    ? ext.instructions.join(' ') 
    : \`Perform \${ext.name} with controlled form, steady cadence, and progressive overload.\`;

  return {
    id: ext.id,
    name: ext.name,
    muscleGroup: finalMuscleGroup,
    secondaryMuscles: [],
    equipment: finalEquipment,
    movementPattern,
    difficulty,
    instructions,
    defaultSets: 3,
    defaultReps: 10,
    alternatives: [],
    youtubeQuery: \`\${ext.name} proper form\`,
    trackingType,
    thumbnail: ext.images && ext.images.length > 0 ? \`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/\${ext.images[0]}\` : undefined
  };
};

export const MOCK_EXERCISES: Exercise[] = (externalData as any[]).map(mapExternalToExercise);

export const getAlternativeExercises = (exerciseId: string): Exercise[] => {
  const current = getExerciseById(exerciseId);
  if (!current) return [];

  const directAlts = (current.alternatives || [])
    .map(altId => getExerciseById(altId))
    .filter((ex): ex is Exercise => ex !== undefined);

  if (directAlts.length >= 3) return directAlts;

  const fallback = MOCK_EXERCISES.filter(ex =>
    ex.id !== exerciseId &&
    (ex.muscleGroup === current.muscleGroup || ex.movementPattern === current.movementPattern) &&
    !(current.alternatives || []).includes(ex.id)
  );

  return [...directAlts, ...fallback].slice(0, 5);
};
`;

// Extract findOrCreateExercise, getExerciseById, getAllExercises from tail and insert before mapper
const tailParts = tail.split('export const getAlternativeExercises');
const partBeforeAlternatives = tailParts[0];

fs.writeFileSync('src/data/mockExercises.ts', head + '\n\n' + partBeforeAlternatives + '\n\n' + mapper);
