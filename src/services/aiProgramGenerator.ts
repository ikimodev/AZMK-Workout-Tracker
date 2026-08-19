import { Program, ProgramWorkout, ProgramWeek, FitnessGoal } from '../types';

export interface ProgramGeneratorParams {
  goal: FitnessGoal;
  secondaryGoal?: FitnessGoal;
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  daysPerWeek: number;
  durationMinutes: number;
  equipment: 'Full Gym' | 'Home Gym (Dumbbells & Bench)' | 'Bodyweight Only';
  preferredSplit?: string;
  restrictions?: string;
}

export const generateAIProgram = (params: ProgramGeneratorParams): Program => {
  const { goal, secondaryGoal, experience, daysPerWeek, durationMinutes, equipment, restrictions } = params;

  const secondaryStr = secondaryGoal ? ` & ${secondaryGoal}` : '';
  let programName = `4-Week ${goal}${secondaryStr} Protocol (${daysPerWeek}d/wk)`;
  let description = `A high-performance 4-week periodized program engineered for ${goal.toLowerCase()}${secondaryGoal ? ` with secondary focus on ${secondaryGoal.toLowerCase()}` : ''} using ${equipment.toLowerCase()}. Includes 5–7 structured movements per workout optimized for ${daysPerWeek} training days/week (${durationMinutes} min/session).`;

  const workouts: ProgramWorkout[] = [];

  if (daysPerWeek === 2) {
    // 2-Day Split: Upper / Lower (6-7 exercises per day)
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
    // 3-Day Split: Full Body A / B / C (6 exercises per day)
    workouts.push(
      {
        id: 'gen_3d_w1',
        name: 'Day 1: Full Body A (Squat & Horizontal Push/Pull)',
        dayOfWeek: 'Monday',
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
        name: 'Day 2: Full Body B (Deadlift & Vertical Push/Pull)',
        dayOfWeek: 'Wednesday',
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
        name: 'Day 3: Full Body C (Hypertrophy & Posterior Chain)',
        dayOfWeek: 'Friday',
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
    // 4-Day Split: Upper / Lower / Upper / Lower (6-7 exercises per day)
    workouts.push(
      {
        id: 'gen_4d_w1',
        name: 'Day 1: Upper Power & Chest/Delts Focus',
        dayOfWeek: 'Monday',
        order: 1,
        exercises: [
          { exerciseId: 'barbell_bench_press', targetSets: 4, targetReps: '6-8', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'barbell_row', targetSets: 4, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'overhead_barbell_press', targetSets: 3, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'lat_pulldown', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'dumbbell_lateral_raise', targetSets: 4, targetReps: '15', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'tricep_rope_pushdown', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 }
        ]
      },
      {
        id: 'gen_4d_w2',
        name: 'Day 2: Lower Quad & Core Dominant',
        dayOfWeek: 'Tuesday',
        order: 2,
        exercises: [
          { exerciseId: 'barbell_back_squat', targetSets: 4, targetReps: '6', targetRpe: 8, restSeconds: 150 },
          { exerciseId: 'romanian_deadlift', targetSets: 3, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'leg_press', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'leg_extensions', targetSets: 3, targetReps: '12-15', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'standing_calf_raise', targetSets: 4, targetReps: '15', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'hanging_leg_raise', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 }
        ]
      },
      {
        id: 'gen_4d_w3',
        name: 'Day 3: Upper Hypertrophy & Arms Specialization',
        dayOfWeek: 'Thursday',
        order: 3,
        exercises: [
          { exerciseId: 'incline_dumbbell_press', targetSets: 4, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'seated_cable_row', targetSets: 4, targetReps: '10-12', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'cable_chest_fly', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'face_pulls', targetSets: 3, targetReps: '15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'dumbbell_lateral_raise', targetSets: 4, targetReps: '15', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'barbell_bicep_curl', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'overhead_cable_tricep_extension', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 }
        ]
      },
      {
        id: 'gen_4d_w4',
        name: 'Day 4: Lower Posterior Chain & Hamstrings Focus',
        dayOfWeek: 'Friday',
        order: 4,
        exercises: [
          { exerciseId: 'barbell_deadlift', targetSets: 3, targetReps: '5', targetRpe: 8.5, restSeconds: 180 },
          { exerciseId: 'hack_squat', targetSets: 3, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'seated_leg_curl', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'leg_extensions', targetSets: 3, targetReps: '12-15', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'standing_calf_raise', targetSets: 4, targetReps: '15', targetRpe: 9, restSeconds: 45 },
          { exerciseId: 'cable_woodchopper', targetSets: 3, targetReps: '12', targetRpe: 8, restSeconds: 45 }
        ]
      }
    );
  } else if (daysPerWeek === 5) {
    // 5-Day Split: Push / Pull / Legs / Upper / Lower (5-6 exercises per day)
    workouts.push(
      {
        id: 'gen_5d_w1',
        name: 'Day 1: Push Focus (Chest / Delts / Triceps)',
        dayOfWeek: 'Monday',
        order: 1,
        exercises: [
          { exerciseId: 'barbell_bench_press', targetSets: 4, targetReps: '6-8', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'incline_dumbbell_press', targetSets: 3, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'cable_chest_fly', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'dumbbell_lateral_raise', targetSets: 4, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'tricep_rope_pushdown', targetSets: 3, targetReps: '12', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'overhead_cable_tricep_extension', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 }
        ]
      },
      {
        id: 'gen_5d_w2',
        name: 'Day 2: Pull Focus (Back / Rear Delts / Biceps)',
        dayOfWeek: 'Tuesday',
        order: 2,
        exercises: [
          { exerciseId: 'barbell_row', targetSets: 4, targetReps: '8', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'lat_pulldown', targetSets: 3, targetReps: '10', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'seated_cable_row', targetSets: 3, targetReps: '10-12', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'face_pulls', targetSets: 3, targetReps: '15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'barbell_bicep_curl', targetSets: 3, targetReps: '10', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'dumbbell_incline_bicep_curl', targetSets: 3, targetReps: '12', targetRpe: 8.5, restSeconds: 60 }
        ]
      },
      {
        id: 'gen_5d_w3',
        name: 'Day 3: Legs (Quad Dominant & Calves)',
        dayOfWeek: 'Wednesday',
        order: 3,
        exercises: [
          { exerciseId: 'barbell_back_squat', targetSets: 4, targetReps: '6', targetRpe: 8, restSeconds: 150 },
          { exerciseId: 'leg_press', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'hack_squat', targetSets: 3, targetReps: '10', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'leg_extensions', targetSets: 3, targetReps: '12-15', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'standing_calf_raise', targetSets: 4, targetReps: '15', targetRpe: 9, restSeconds: 45 },
          { exerciseId: 'hanging_leg_raise', targetSets: 3, targetReps: '15', targetRpe: 8.5, restSeconds: 60 }
        ]
      },
      {
        id: 'gen_5d_w4',
        name: 'Day 4: Upper Hypertrophy & Delts',
        dayOfWeek: 'Friday',
        order: 4,
        exercises: [
          { exerciseId: 'overhead_barbell_press', targetSets: 3, targetReps: '8', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'incline_barbell_press', targetSets: 3, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'pull_ups', targetSets: 3, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'dumbbell_lateral_raise', targetSets: 4, targetReps: '15', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'cable_chest_fly', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'skull_crushers', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 60 }
        ]
      },
      {
        id: 'gen_5d_w5',
        name: 'Day 5: Lower Posterior Chain & Core',
        dayOfWeek: 'Saturday',
        order: 5,
        exercises: [
          { exerciseId: 'barbell_deadlift', targetSets: 3, targetReps: '5', targetRpe: 8.5, restSeconds: 150 },
          { exerciseId: 'romanian_deadlift', targetSets: 3, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'seated_leg_curl', targetSets: 3, targetReps: '12', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'leg_press', targetSets: 3, targetReps: '10', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'standing_calf_raise', targetSets: 4, targetReps: '15', targetRpe: 9, restSeconds: 45 },
          { exerciseId: 'cable_woodchopper', targetSets: 3, targetReps: '12', targetRpe: 8, restSeconds: 45 }
        ]
      }
    );
  } else {
    // 6-Day Split: Push / Pull / Legs × 2 (5-6 exercises per day)
    workouts.push(
      {
        id: 'gen_6d_w1',
        name: 'Day 1: Push A (Heavy Bench & Shoulders)',
        dayOfWeek: 'Monday',
        order: 1,
        exercises: [
          { exerciseId: 'barbell_bench_press', targetSets: 4, targetReps: '6-8', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'overhead_barbell_press', targetSets: 3, targetReps: '8', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'cable_chest_fly', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'dumbbell_lateral_raise', targetSets: 4, targetReps: '15', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'tricep_rope_pushdown', targetSets: 3, targetReps: '12', targetRpe: 8.5, restSeconds: 60 }
        ]
      },
      {
        id: 'gen_6d_w2',
        name: 'Day 2: Pull A (Heavy Row & Lats)',
        dayOfWeek: 'Tuesday',
        order: 2,
        exercises: [
          { exerciseId: 'barbell_row', targetSets: 4, targetReps: '6-8', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'lat_pulldown', targetSets: 4, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'seated_cable_row', targetSets: 3, targetReps: '10-12', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'face_pulls', targetSets: 3, targetReps: '15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'barbell_bicep_curl', targetSets: 3, targetReps: '10', targetRpe: 8.5, restSeconds: 60 }
        ]
      },
      {
        id: 'gen_6d_w3',
        name: 'Day 3: Legs A (Squat & Quad Focus)',
        dayOfWeek: 'Wednesday',
        order: 3,
        exercises: [
          { exerciseId: 'barbell_back_squat', targetSets: 4, targetReps: '6', targetRpe: 8, restSeconds: 150 },
          { exerciseId: 'leg_press', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'leg_extensions', targetSets: 3, targetReps: '12-15', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'seated_leg_curl', targetSets: 3, targetReps: '12', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'standing_calf_raise', targetSets: 4, targetReps: '15', targetRpe: 9, restSeconds: 45 }
        ]
      },
      {
        id: 'gen_6d_w4',
        name: 'Day 4: Push B (Incline & Lateral Delt Focus)',
        dayOfWeek: 'Thursday',
        order: 4,
        exercises: [
          { exerciseId: 'incline_dumbbell_press', targetSets: 4, targetReps: '8-10', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'machine_chest_press', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'cable_chest_fly', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'dumbbell_lateral_raise', targetSets: 4, targetReps: '15', targetRpe: 9, restSeconds: 60 },
          { exerciseId: 'overhead_cable_tricep_extension', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 }
        ]
      },
      {
        id: 'gen_6d_w5',
        name: 'Day 5: Pull B (Deadlift & Arms Specialization)',
        dayOfWeek: 'Friday',
        order: 5,
        exercises: [
          { exerciseId: 'barbell_deadlift', targetSets: 3, targetReps: '5', targetRpe: 8.5, restSeconds: 180 },
          { exerciseId: 'pull_ups', targetSets: 3, targetReps: '8-10', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'seated_cable_row', targetSets: 3, targetReps: '10-12', targetRpe: 8, restSeconds: 90 },
          { exerciseId: 'face_pulls', targetSets: 3, targetReps: '15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'dumbbell_incline_bicep_curl', targetSets: 3, targetReps: '10-12', targetRpe: 8.5, restSeconds: 60 }
        ]
      },
      {
        id: 'gen_6d_w6',
        name: 'Day 6: Legs B (Posterior Chain & Calves)',
        dayOfWeek: 'Saturday',
        order: 6,
        exercises: [
          { exerciseId: 'romanian_deadlift', targetSets: 4, targetReps: '8-10', targetRpe: 8, restSeconds: 120 },
          { exerciseId: 'hack_squat', targetSets: 3, targetReps: '10', targetRpe: 8.5, restSeconds: 90 },
          { exerciseId: 'seated_leg_curl', targetSets: 3, targetReps: '12-15', targetRpe: 8.5, restSeconds: 60 },
          { exerciseId: 'standing_calf_raise', targetSets: 4, targetReps: '15', targetRpe: 9, restSeconds: 45 },
          { exerciseId: 'hanging_leg_raise', targetSets: 3, targetReps: '15', targetRpe: 8.5, restSeconds: 60 }
        ]
      }
    );
  }

  // Generate exact 4-WEEK progressive periodization structure
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
