const fs = require('fs');
const tail = fs.readFileSync('temp_tail.ts', 'utf-8');

const head = `import { Exercise, MuscleGroup, Equipment, MovementPattern, ExerciseTrackingType } from '../types';
import externalData from './exercises.json';
import stringSimilarity from 'string-similarity';

// In-memory cache for custom exercises added during runtime
export const DYNAMIC_EXERCISES_MAP = new Map<string, Exercise>();
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
    ? ext.instructions.join('\\n') 
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
    aliases: (() => {
      const a = [];
      const lower = ext.name.toLowerCase();
      if (lower.includes('iso-lateral')) a.push(lower.replace('iso-lateral', 'leverage'), lower.replace('iso-lateral', 'plate loaded'));
      if (lower.includes('leverage')) a.push(lower.replace('leverage', 'iso-lateral'));
      if (lower.includes('prone')) a.push(lower.replace('prone', 'lying'));
      if (lower.includes('lying')) a.push(lower.replace('lying', 'prone'));
      if (lower.includes('overhead press')) a.push(lower.replace('overhead press', 'shoulder press'));
      if (lower.includes('leverage incline row') || lower.includes('t-bar row')) a.push('chest supported row');
      if (lower.includes('chest-supported') || lower.includes('chest supported')) a.push('leverage incline row', 't-bar row');
      if (lower.includes('chin-up') || lower.includes('chin up')) a.push('underhand pull-up');
      if (lower.includes('romanian deadlift')) a.push('rdl');
      return a;
    })(),
    youtubeQuery: \`\${ext.name} proper form\`,
    trackingType,
    images: ext.images && ext.images.length > 0 
      ? ext.images.map((img: string) => \`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/\${img}\`) 
      : undefined
  };
};

export const MOCK_EXERCISES: Exercise[] = (externalData as any[]).map(mapExternalToExercise);
`;

// Extract findOrCreateExercise, getExerciseById, getAllExercises from tail and insert before mapper
const tailParts = tail.split('export const getAlternativeExercises');
const partBeforeAlternatives = tailParts[0];
const partAfterAlternatives = 'export const getAlternativeExercises' + tailParts[1];

const localStorageBlock = `
// Load from localStorage if available, filtering out legacy duplicates
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('azmk_custom_exercises');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const names = MOCK_EXERCISES.map(ex => ex.name.toLowerCase());
        parsed.forEach(ex => {
          // If the custom exercise maps to a built-in one, ignore it so we don't pollute the directory!
          const cleanLower = ex.name.toLowerCase().replace(/[^a-z0-9\\s]/g, '');
          const match = stringSimilarity.findBestMatch(cleanLower, names);
          if (match.bestMatch.rating > 0.60) {
            return;
          }
          DYNAMIC_EXERCISES_MAP.set(ex.id, ex);
        });
      }
    }
  } catch (e) {
    // Ignore storage errors
  }
}
`;

fs.writeFileSync('src/data/mockExercises.ts', head + '\n\n' + partBeforeAlternatives + '\n\n' + mapper + '\n\n' + localStorageBlock + '\n\n' + partAfterAlternatives);
