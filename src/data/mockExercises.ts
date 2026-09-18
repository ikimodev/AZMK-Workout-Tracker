import { Exercise, MuscleGroup, Equipment, MovementPattern, ExerciseTrackingType } from '../types';
import externalData from './exercises.json';
import stringSimilarity from 'string-similarity';

// In-memory cache for custom exercises added during runtime
export const DYNAMIC_EXERCISES_MAP = new Map<string, Exercise>();


export const inferExerciseAttributes = (name: string): {
  muscleGroup: MuscleGroup;
  equipment: Equipment;
  movementPattern: MovementPattern;
  trackingType: ExerciseTrackingType;
} => {
  const clean = name.toLowerCase();

  let muscleGroup: MuscleGroup = 'Full Body';
  let equipment: Equipment = 'Barbell';
  let movementPattern: MovementPattern = 'Horizontal Push';
  let trackingType: ExerciseTrackingType = 'weight_reps';

  // Tracking Type Inference
  if (clean.includes('plank')) trackingType = 'time_only';
  else if (clean.includes('bodyweight') || clean.includes('pull-up') || clean.includes('pull up') || clean.includes('pullup') || clean.includes('chin-up') || clean.includes('chin up') || clean.includes('chinup') || clean.includes('push-up') || clean.includes('push up') || clean.includes('pushup') || clean.includes('dip') || clean.includes('hanging') || clean.includes('ab wheel')) {
    if (!clean.includes('weighted')) {
      trackingType = 'reps_only';
    }
  }

  // Equipment inference
  if (clean.includes('dumbbell') || clean.includes('دامبل')) equipment = 'Dumbbell';
  else if (clean.includes('cable') || clean.includes('كيبل')) equipment = 'Cable';
  else if (clean.includes('machine') || clean.includes('جهاز') || clean.includes('مكينة')) equipment = 'Machine';
  else if (clean.includes('smith') || clean.includes('سميث')) equipment = 'Smith Machine';
  else if (clean.includes('bodyweight') || clean.includes('pull-up') || clean.includes('pull up') || clean.includes('pullup') || clean.includes('chin-up') || clean.includes('chin up') || clean.includes('chinup') || clean.includes('push-up') || clean.includes('push up') || clean.includes('pushup') || clean.includes('dip') || clean.includes('plank') || clean.includes('hanging') || clean.includes('leg raise') || clean.includes('knee raise') || clean.includes('عقلة') || clean.includes('متوازي') || clean.includes('ضغط') || clean.includes('وزن الجسم')) equipment = 'Bodyweight';
  else if (clean.includes('kettlebell') || clean.includes('كتل')) equipment = 'Kettlebell';
  else if (clean.includes('band') || clean.includes('مقاومة')) equipment = 'Bands';
  else if (clean.includes('barbell') || clean.includes('بار')) equipment = 'Barbell';

  // Muscle group and pattern inference
  if (clean.includes('chest') || clean.includes('bench') || clean.includes('pec') || clean.includes('صدر') || clean.includes('بنش')) {
    muscleGroup = 'Chest';
    movementPattern = 'Horizontal Push';
  } else if (clean.includes('squat') || clean.includes('leg press') || clean.includes('hack') || clean.includes('quad') || clean.includes('extension') || clean.includes('سكوات') || clean.includes('فخذ أمامي') || clean.includes('رجل')) {
    muscleGroup = 'Quads';
    movementPattern = 'Squat';
  } else if (clean.includes('deadlift') || clean.includes('rdl') || clean.includes('romanian') || clean.includes('hamstring') || clean.includes('leg curl') || clean.includes('فخذ خلفي') || clean.includes('ديدلفت')) {
    muscleGroup = 'Hamstrings';
    movementPattern = 'Hip Hinge';
  } else if (clean.includes('hip thrust') || clean.includes('glute') || clean.includes('مؤخرة') || clean.includes('هيب ثروست')) {
    muscleGroup = 'Glutes';
    movementPattern = 'Hip Hinge';
  } else if (clean.includes('row') || clean.includes('pulldown') || clean.includes('pull up') || clean.includes('pull-up') || clean.includes('pullup') || clean.includes('lat') || clean.includes('back') || clean.includes('سحب') || clean.includes('ظهر') || clean.includes('عقلة')) {
    muscleGroup = 'Back';
    movementPattern = clean.includes('row') ? 'Horizontal Pull' : 'Vertical Pull';
  } else if (clean.includes('shoulder') || clean.includes('overhead') || clean.includes('ohp') || clean.includes('lateral') || clean.includes('front raise') || clean.includes('rear delt') || clean.includes('face pull') || clean.includes('كتف') || clean.includes('أكتاف') || clean.includes('رفرفة') || clean.includes('فيس بول')) {
    muscleGroup = 'Shoulders';
    movementPattern = clean.includes('face pull') || clean.includes('rear') ? 'Horizontal Pull' : (clean.includes('lateral') ? 'Isolation Push' : 'Vertical Push');
  } else if (clean.includes('bicep') || clean.includes('curl') || clean.includes('hammer') || clean.includes('باي') || clean.includes('بايسبس')) {
    muscleGroup = 'Biceps';
    movementPattern = 'Isolation Pull';
  } else if (clean.includes('tricep') || clean.includes('pushdown') || clean.includes('skull crusher') || clean.includes('تراي') || clean.includes('ترايسبس')) {
    muscleGroup = 'Triceps';
    movementPattern = 'Isolation Push';
  } else if (clean.includes('calf') || clean.includes('calves') || clean.includes('بطات') || clean.includes('سمانة')) {
    muscleGroup = 'Calves';
    movementPattern = 'Isolation Push';
  } else if (clean.includes('abs') || clean.includes('core') || clean.includes('crunch') || clean.includes('plank') || clean.includes('بطن') || clean.includes('كور') || clean.includes('بلانك')) {
    muscleGroup = 'Core';
    movementPattern = 'Core / Anti-Extension';
  }

  return { muscleGroup, equipment, movementPattern, trackingType };
};

/**
 * Finds an existing exercise by fuzzy match or dynamically creates and registers a brand new custom exercise
 * This GUARANTEES that no exercise will ever be lost or forced to become Barbell Bench Press!
 */
export const findOrCreateExercise = (rawName: string): Exercise => {
  const clean = rawName.trim();
  if (!clean) {
    return MOCK_EXERCISES[0];
  }

  const cleanLower = clean.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF\s]/g, '');

  // 1. Direct match in built-in exercises
  let foundMock = MOCK_EXERCISES.find(ex => {
    const exLower = ex.name.toLowerCase();
    return exLower === cleanLower || exLower.replace(/[^a-z0-9\s]/g, '') === cleanLower;
  });

  if (!foundMock) {
    const names = MOCK_EXERCISES.map(ex => ex.name.toLowerCase());
    const match = stringSimilarity.findBestMatch(cleanLower, names);
    if (match.bestMatch.rating > 0.60) {
      foundMock = MOCK_EXERCISES[match.bestMatchIndex];
    }
  }

  if (foundMock) return foundMock;

  // 2. Direct match in dynamic custom exercises
  for (const ex of DYNAMIC_EXERCISES_MAP.values()) {
    if (ex.name.toLowerCase() === cleanLower || ex.id === cleanLower) {
      return ex;
    }
  }

  // 3. Generate a clean dynamic ID from user's exercise name
  const slug = cleanLower
    .replace(/\s+/g, '_')
    .slice(0, 40) || `custom_${Date.now()}`;
  const customId = `custom_${slug}`;

  // If already registered with this custom ID
  if (DYNAMIC_EXERCISES_MAP.has(customId)) {
    return DYNAMIC_EXERCISES_MAP.get(customId)!;
  }

  // Infer attributes
  const { muscleGroup, equipment, movementPattern, trackingType } = inferExerciseAttributes(clean);

  // Capitalize properly
  const formattedName = clean
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const newExercise: Exercise = {
    id: customId,
    name: formattedName,
    muscleGroup,
    secondaryMuscles: [],
    equipment,
    movementPattern,
    trackingType,
    difficulty: 'Intermediate',
    instructions: `Perform ${formattedName} with controlled form, steady cadence, and progressive overload.`,
    instructionsAr: `تمرين ${formattedName}: أدِّ الحركة بتحكم كامل مع المحافظة على التكنيك السليم وتطبيق الزيادة التدريجية.`,
    defaultSets: 3,
    defaultReps: 10,
    alternatives: [],
    youtubeQuery: `${formattedName} proper form`
  };

  // Register in memory map
  DYNAMIC_EXERCISES_MAP.set(customId, newExercise);

  // Persist to localStorage
  if (typeof window !== 'undefined') {
    try {
      const allCustom = Array.from(DYNAMIC_EXERCISES_MAP.values());
      localStorage.setItem('azmk_custom_exercises', JSON.stringify(allCustom));
    } catch (e) {
      // Storage error ignored
    }
  }

  return newExercise;
};

/**
 * Returns exercise by ID with zero undefined crashes and zero accidental Barbell Bench Press overrides
 */
export const getExerciseById = (id: string): Exercise => {
  if (!id) return MOCK_EXERCISES[0];

  let found = MOCK_EXERCISES.find(ex => ex.id === id);
  if (!found && DYNAMIC_EXERCISES_MAP.has(id)) {
    found = DYNAMIC_EXERCISES_MAP.get(id);
  }

  if (found) {
    // Always re-infer trackingType to automatically upgrade stale exercises from localStorage
    const inferred = inferExerciseAttributes(found.name);
    return { ...found, trackingType: inferred.trackingType };
  }

  // If ID has custom prefix or is an unformatted name, create/format it dynamically
  const cleanedName = id
    .replace(/^custom_/, '')
    .replace(/_/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return findOrCreateExercise(cleanedName);
};

export const getAllExercises = (): Exercise[] => {
  return [...MOCK_EXERCISES, ...Array.from(DYNAMIC_EXERCISES_MAP.values())];
};




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
    ? ext.instructions.join('\n') 
    : `Perform ${ext.name} with controlled form, steady cadence, and progressive overload.`;

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
    youtubeQuery: `${ext.name} proper form`,
    trackingType,
    images: ext.images && ext.images.length > 0 
      ? ext.images.map((img: string) => `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${img}`) 
      : undefined
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
          const cleanLower = ex.name.toLowerCase().replace(/[^a-z0-9\s]/g, '');
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
