import { Program, ProgramWorkout, ProgramWeek, FitnessGoal, MuscleGroup } from '../types';
import { callGeminiAPI, matchExerciseId } from './geminiService';

export interface ProgramGeneratorParams {
  goal: FitnessGoal;
  secondaryGoal?: FitnessGoal;
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  daysPerWeek: number;
  durationMinutes: number;
  equipment: string;
  preferredSplit?: string;
  priorityMuscles?: MuscleGroup[] | 'AZMK_DECIDE' | string[];
  avoidedExercises?: string[];
  cardioPreference?: string;
  weightSelectionMethod?: string;
  trainingDays?: string[];
  restrictions?: string; // Legacy / Custom notes
}

const fallbackLocalGenerator = (params: ProgramGeneratorParams): Program => {
  const { goal, secondaryGoal, experience, daysPerWeek, durationMinutes, equipment } = params;

  const secondaryStr = secondaryGoal ? ` & ${secondaryGoal}` : '';
  let programName = `4-Week ${goal}${secondaryStr} Protocol (${daysPerWeek}d/wk)`;
  let description = `A high-performance 4-week periodized program engineered for ${goal.toLowerCase()}${secondaryGoal ? ` with secondary focus on ${secondaryGoal.toLowerCase()}` : ''} using ${equipment.toLowerCase()}. Includes 5–7 structured movements per workout optimized for ${daysPerWeek} training days/week (${durationMinutes} min/session).`;

  const workouts: ProgramWorkout[] = [];

  if (daysPerWeek === 2) {
    workouts.push(
      {
        id: 'gen_2d_w1',
        name: 'Day 1: Upper Body Power & Hypertrophy',
        dayOfWeek: 'Monday',
        order: 1,
        exercises: [
          { exerciseId: 'barbell_bench_press', targetSets: 4, targetReps: '6-8', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'barbell_row', targetSets: 4, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'overhead_barbell_press', targetSets: 3, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'lat_pulldown', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'cable_chest_fly', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'dumbbell_lateral_raise', targetSets: 4, targetReps: '15', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'tricep_rope_pushdown', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 }
        ]
      },
      {
        id: 'gen_2d_w2',
        name: 'Day 2: Lower Body & Core Dominance',
        dayOfWeek: 'Thursday',
        order: 2,
        exercises: [
          { exerciseId: 'barbell_back_squat', targetSets: 4, targetReps: '6-8', targetRpe: 8, restSeconds: 150 },
          { exerciseId: 'romanian_deadlift', targetSets: 4, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'leg_press', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'seated_leg_curl', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'leg_extensions', targetSets: 3, targetReps: '12-15', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'standing_calf_raise', targetSets: 4, targetReps: '15', targetRpe: 9, restSeconds: 45 },
          { exerciseId: 'hanging_leg_raise', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 }
        ]
      }
    );
  } else if (daysPerWeek === 3) {
    workouts.push(
      {
        id: 'gen_3d_w1',
        name: 'Day 1: Full Body A',
        order: 1,
        exercises: [
          { exerciseId: 'barbell_back_squat', targetSets: 4, targetReps: '6-8', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'barbell_bench_press', targetSets: 4, targetReps: '6-8', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'barbell_row', targetSets: 4, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'leg_extensions', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'dumbbell_lateral_raise', targetSets: 4, targetReps: '15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'tricep_rope_pushdown', targetSets: 3, targetReps: '12', targetRpe: 8.5, restSeconds: 60 }
        ]
      },
      {
        id: 'gen_3d_w2',
        name: 'Day 2: Full Body B',
        order: 2,
        exercises: [
          { exerciseId: 'barbell_deadlift', targetSets: 3, targetReps: '5', targetRpe: 8.5, restSeconds: 150 },
          { exerciseId: 'overhead_barbell_press', targetSets: 4, targetReps: '6-8', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'lat_pulldown', targetSets: 4, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'leg_press', targetSets: 3, targetReps: '10-12', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'face_pulls', targetSets: 3, targetReps: '15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'barbell_bicep_curl', targetSets: 3, targetReps: '10', targetRpe: 8.5, restSeconds: 60 }
        ]
      },
      {
        id: 'gen_3d_w3',
        name: 'Day 3: Full Body C',
        order: 3,
        exercises: [
          { exerciseId: 'romanian_deadlift', targetSets: 4, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'incline_dumbbell_press', targetSets: 4, targetReps: '10-12', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'seated_cable_row', targetSets: 4, targetReps: '10-12', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'cable_chest_fly', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'seated_leg_curl', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'hanging_leg_raise', targetSets: 3, targetReps: '15', targetRpe: 8.5, restSeconds: 60 }
        ]
      }
    );
  } else if (daysPerWeek === 4) {
    workouts.push(
      {
        id: 'gen_4d_w1', name: 'Day 1: Upper Power', order: 1,
        exercises: [
          { exerciseId: 'barbell_bench_press', targetSets: 4, targetReps: '6-8', restSeconds: 120 },
          { exerciseId: 'barbell_row', targetSets: 4, targetReps: '8-10', restSeconds: 120 },
          { exerciseId: 'overhead_barbell_press', targetSets: 3, targetReps: '8-10', restSeconds: 90 },
          { exerciseId: 'lat_pulldown', targetSets: 3, targetReps: '10-12', restSeconds: 90 },
          { exerciseId: 'dumbbell_lateral_raise', targetSets: 4, targetReps: '15', restSeconds: 60 },
          { exerciseId: 'tricep_rope_pushdown', targetSets: 3, targetReps: '12-15', restSeconds: 60 }
        ]
      },
      {
        id: 'gen_4d_w2', name: 'Day 2: Lower Quad', order: 2,
        exercises: [
          { exerciseId: 'barbell_back_squat', targetSets: 4, targetReps: '6', restSeconds: 150 },
          { exerciseId: 'romanian_deadlift', targetSets: 3, targetReps: '8-10', restSeconds: 120 },
          { exerciseId: 'leg_press', targetSets: 3, targetReps: '10-12', restSeconds: 90 },
          { exerciseId: 'leg_extensions', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
          { exerciseId: 'standing_calf_raise', targetSets: 4, targetReps: '15', restSeconds: 60 },
          { exerciseId: 'hanging_leg_raise', targetSets: 3, targetReps: '12-15', restSeconds: 60 }
        ]
      },
      {
        id: 'gen_4d_w3', name: 'Day 3: Upper Hypertrophy', order: 3,
        exercises: [
          { exerciseId: 'incline_dumbbell_press', targetSets: 4, targetReps: '8-10', restSeconds: 90 },
          { exerciseId: 'seated_cable_row', targetSets: 4, targetReps: '10-12', restSeconds: 90 },
          { exerciseId: 'cable_chest_fly', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
          { exerciseId: 'face_pulls', targetSets: 3, targetReps: '15', restSeconds: 60 },
          { exerciseId: 'dumbbell_lateral_raise', targetSets: 4, targetReps: '15', restSeconds: 60 },
          { exerciseId: 'barbell_bicep_curl', targetSets: 3, targetReps: '10-12', restSeconds: 60 },
          { exerciseId: 'overhead_cable_tricep_extension', targetSets: 3, targetReps: '12-15', restSeconds: 60 }
        ]
      },
      {
        id: 'gen_4d_w4', name: 'Day 4: Lower Hamstrings', order: 4,
        exercises: [
          { exerciseId: 'barbell_deadlift', targetSets: 3, targetReps: '5', restSeconds: 180 },
          { exerciseId: 'hack_squat', targetSets: 3, targetReps: '8-10', restSeconds: 120 },
          { exerciseId: 'seated_leg_curl', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
          { exerciseId: 'leg_extensions', targetSets: 3, targetReps: '12-15', restSeconds: 60 },
          { exerciseId: 'standing_calf_raise', targetSets: 4, targetReps: '15', restSeconds: 45 },
          { exerciseId: 'cable_woodchopper', targetSets: 3, targetReps: '12', restSeconds: 45 }
        ]
      }
    );
  } else {
    // 5+ days default to a PPL style
    workouts.push(
      { id: 'gen_def_1', name: 'Push', order: 1, exercises: [{ exerciseId: 'barbell_bench_press', targetSets: 3, targetReps: '8-10', restSeconds: 90 }, { exerciseId: 'overhead_barbell_press', targetSets: 3, targetReps: '8-10', restSeconds: 90 }] },
      { id: 'gen_def_2', name: 'Pull', order: 2, exercises: [{ exerciseId: 'barbell_row', targetSets: 3, targetReps: '8-10', restSeconds: 90 }, { exerciseId: 'lat_pulldown', targetSets: 3, targetReps: '8-10', restSeconds: 90 }] },
      { id: 'gen_def_3', name: 'Legs', order: 3, exercises: [{ exerciseId: 'barbell_back_squat', targetSets: 3, targetReps: '8-10', restSeconds: 120 }, { exerciseId: 'romanian_deadlift', targetSets: 3, targetReps: '8-10', restSeconds: 90 }] }
    );
  }

  const weekTitles = [
    'Week 1 — Baseline & Acclimation (RPE 7.5–8)',
    'Week 2 — Progressive Volume (+1 Rep / Set)',
    'Week 3 — Peak Intensity & Progressive Overload (+2.5kg)',
    'Week 4 — PR Testing & Consolidation (Peak Week)'
  ];

  const weeks: ProgramWeek[] = Array.from({ length: 4 }).map((_, wIdx) => ({
    weekNumber: wIdx + 1,
    title: weekTitles[wIdx],
    workouts: JSON.parse(JSON.stringify(workouts))
  }));

  return {
    id: `prog_ai_${Date.now()}`,
    name: programName,
    description,
    goal,
    secondaryGoal,
    experience,
    durationWeeks: 4,
    daysPerWeek,
    weeks,
    isCustom: true
  };
};

export const generateAIProgram = async (params: ProgramGeneratorParams): Promise<Program> => {
  try {
    const { 
      goal, secondaryGoal, experience, daysPerWeek, durationMinutes, 
      equipment, preferredSplit, priorityMuscles, avoidedExercises, 
      cardioPreference, trainingDays, weightSelectionMethod, restrictions
    } = params;

    const daysStr = trainingDays && trainingDays.length > 0 ? trainingDays.join(', ') : `${daysPerWeek} days/week`;
    const avoidStr = avoidedExercises && avoidedExercises.length > 0 ? avoidedExercises.join(', ') : 'None';
    
    let priorityStr = 'None specified';
    if (priorityMuscles === 'AZMK_DECIDE') {
      priorityStr = 'Let AZMK decide optimal priorities';
    } else if (Array.isArray(priorityMuscles) && priorityMuscles.length > 0) {
      priorityStr = priorityMuscles.join(', ');
    }

    const systemInstruction = `You are "كابتن عزام" (Coach Azzam), an elite strength & conditioning AI architect for the AZMK app.
Your task is to generate a highly optimized, personalized 4-week workout program as a valid JSON object.

USER PROFILE & CONSTRAINTS:
- Primary Goal: ${goal}
- Secondary Goal: ${secondaryGoal || 'None'}
- Experience: ${experience}
- Training Days: ${daysStr}
- Target Duration per session: ${durationMinutes} minutes
- Available Equipment: ${equipment}
- Preferred Split: ${preferredSplit || 'Let AZMK Decide'}
- Priority Muscles: ${priorityStr}
- Avoided Exercises: ${avoidStr}
- Cardio Preference: ${cardioPreference || 'None'}
- Weight Selection Method: ${weightSelectionMethod || 'N/A'}
- Additional Restrictions: ${restrictions || 'None'}

CRITICAL RULES FOR AZMK PROGRAMMING:
1. VOLUME & DURATION LOGIC: 
   - A ${durationMinutes}-minute session must reflect realistic volume. If 30-45 mins, reduce the number of exercises (max 4-5) and sets. If 90 mins, you can do 6-8 exercises.
   - Beginner: Conservative volume (2-3 sets per exercise). Intermediate: Moderate (3-4 sets). Advanced: Higher volume.
2. PRIORITY MUSCLES: Give priority muscles slightly higher weekly volume and/or frequency, while keeping total volume recoverable and appropriate for the user's experience. Do NOT mindlessly spam sets.
3. AVOIDED EXERCISES: You MUST NOT include ANY exercise that resembles or is a variation of the avoided exercises (${avoidStr}).
4. EQUIPMENT & CALISTHENICS: If equipment says "Calisthenics", use bodyweight, pull-up bars, dips, rings etc. (NO barbells/dumbbells unless specified). If it says "Home Gym (Dumbbells)", do NOT use barbells or cables.
5. SPLIT SELECTION: If the split is "Let AZMK decide", infer the absolute best training split based on ${daysStr} and ${experience}.
6. REASONING: Provide a clear, encouraging "aiReasoning" object explaining IN ARABIC why you chose the specific split, how you distributed priority volume, and how you managed total volume.
7. PROGRESSION: Generate exactly 4 weeks of periodized progression (Week 1 Baseline, Week 2 Progressive Volume, Week 3 Peak Intensity, Week 4 Deload/Consolidation).

JSON OUTPUT SCHEMA STRICT FORMAT:
{
  "name": "String (e.g. 4-Week Hypertrophy Protocol)",
  "description": "String (Brief description)",
  "aiReasoning": {
    "split": "String (Arabic explanation)",
    "priority": "String (Arabic explanation)",
    "volume": "String (Arabic explanation)"
  },
  "weeks": [
    {
      "weekNumber": Number (1 to 4),
      "title": "String (Week Title)",
      "workouts": [
        {
          "name": "String (Workout Day Name, e.g. Day 1: Upper Body)",
          "dayOfWeek": "String (e.g. Monday, or Day 1 if unspecified)",
          "order": Number,
          "exercises": [
            {
              "exerciseName": "String (EXACT English name of the exercise, e.g. Barbell Bench Press)",
              "targetSets": Number,
              "targetReps": "String (e.g. 8-10)",
              "restSeconds": Number
            }
          ]
        }
      ]
    }
  ]
}

Only return the JSON. Do not include markdown formatting like \`\`\`json.`;

    const prompt = `Generate the 4-week program JSON for ${goal} focusing on ${priorityStr} using ${equipment}.`;
    const responseText = await callGeminiAPI(prompt, systemInstruction, true);
    
    // Clean up potential markdown blocks if Gemini still outputs them
    const jsonStr = responseText.replace(/^\s*```json/m, '').replace(/```\s*$/m, '').trim();
    const parsedData = JSON.parse(jsonStr);
    
    // VALIDATOR: Ensure avoided exercises didn't slip through
    if (avoidedExercises && avoidedExercises.length > 0) {
      const avoidedTokens = avoidedExercises.map(a => a.toLowerCase().trim());
      parsedData.weeks.forEach((week: any) => {
        week.workouts.forEach((workout: any) => {
          workout.exercises = workout.exercises.filter((ex: any) => {
            const exName = ex.exerciseName.toLowerCase();
            const isAvoided = avoidedTokens.some(token => exName.includes(token));
            if (isAvoided) {
               console.warn(`Post-Validation: Removed avoided exercise ${ex.exerciseName}`);
               return false; // Remove it
            }
            return true;
          });
        });
      });
    }

    const programId = `prog_ai_${Date.now()}`;
    const mappedWeeks = parsedData.weeks.map((week: any) => ({
      ...week,
      workouts: week.workouts.map((workout: any) => ({
        ...workout,
        id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        exercises: workout.exercises.map((ex: any) => {
           const matchedId = matchExerciseId(ex.exerciseName);
           return {
             ...ex,
             exerciseId: matchedId || ex.exerciseName
           };
        })
      }))
    }));

    return {
      id: programId,
      name: parsedData.name || `4-Week ${goal} Protocol`,
      description: parsedData.description || `Generated dynamically by AZMK AI`,
      goal,
      secondaryGoal,
      experience,
      durationWeeks: 4,
      daysPerWeek,
      weeks: mappedWeeks,
      isCustom: true,
      aiReasoning: parsedData.aiReasoning
    };

  } catch (error) {
    console.error('Failed to generate AI program from Gemini, falling back to local generator', error);
    return fallbackLocalGenerator(params);
  }
};
