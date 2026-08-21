import { UserProfile, WorkoutSession, PRRecord, Program, ReferralStats } from '../types';

export const MOCK_USER_PROFILE: UserProfile = {
  id: 'user_kareem_01',
  name: 'Kareem Al-Otaibi',
  email: 'kareem.fitness@example.com',
  experience: 'Intermediate',
  primaryGoal: 'Muscle Gain',
  secondaryGoal: 'Strength',
  daysPerWeek: 4,
  preferredDurationMinutes: 60,
  availableEquipment: ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight'],
  tier: 'premium',
  role: 'admin',
  isDemoUser: true,
  referralCode: 'KAREEM25',
  streakDays: 14,
  joinedDate: '2026-06-01'
};

export const MOCK_REFERRAL_STATS: ReferralStats = {
  code: 'KAREEM25',
  clicks: 27,
  signups: 11,
  paidUsers: 4,
  rewardMonthsEarned: 6, // 5+ referrals = 6 months free pro
  history: [
    { id: 'ref_1', userName: 'Fahad S.', date: '2026-08-16', status: 'Subscribed Premium', reward: '+1 Month Pro' },
    { id: 'ref_2', userName: 'Yazeed M.', date: '2026-08-14', status: 'Subscribed Premium', reward: '+1 Month Pro' },
    { id: 'ref_3', userName: 'Tariq A.', date: '2026-08-10', status: 'Subscribed Premium', reward: '+1 Month Pro' },
    { id: 'ref_4', userName: 'Omar K.', date: '2026-08-05', status: 'Subscribed Premium', reward: '+1 Month Pro' },
    { id: 'ref_5', userName: 'Sultan H.', date: '2026-08-01', status: 'Active', reward: 'Pending Tier 2' },
    { id: 'ref_6', userName: 'Majed B.', date: '2026-07-28', status: 'Signed Up', reward: 'Free Tier' },
    { id: 'ref_7', userName: 'Abdullah R.', date: '2026-07-22', status: 'Active', reward: 'Free Tier' },
  ]
};

export const MOCK_PRS: PRRecord[] = [
  {
    id: 'pr_1',
    exerciseId: 'barbell_bench_press',
    exerciseName: 'Barbell Bench Press',
    type: 'weight',
    value: 62.5,
    reps: 8,
    weight: 62.5,
    date: '2026-08-17',
    previousBest: 60.0,
    improvementPercentage: 4.17
  },
  {
    id: 'pr_2',
    exerciseId: 'barbell_back_squat',
    exerciseName: 'Barbell Back Squat',
    type: 'weight',
    value: 105.0,
    reps: 6,
    weight: 105.0,
    date: '2026-08-15',
    previousBest: 100.0,
    improvementPercentage: 5.0
  },
  {
    id: 'pr_3',
    exerciseId: 'barbell_deadlift',
    exerciseName: 'Conventional Barbell Deadlift',
    type: 'weight',
    value: 140.0,
    reps: 5,
    weight: 140.0,
    date: '2026-08-12',
    previousBest: 135.0,
    improvementPercentage: 3.7
  },
  {
    id: 'pr_4',
    exerciseId: 'pull_ups',
    exerciseName: 'Pull-Ups',
    type: 'reps',
    value: 15,
    reps: 15,
    weight: 0,
    date: '2026-08-10',
    previousBest: 12,
    improvementPercentage: 25.0
  },
  {
    id: 'pr_5',
    exerciseId: 'leg_press',
    exerciseName: 'Leg Press (45 Degree)',
    type: 'volume',
    value: 4200,
    weight: 210,
    reps: 20,
    date: '2026-08-08',
    previousBest: 3800,
    improvementPercentage: 10.5
  },
  {
    id: 'pr_6',
    exerciseId: 'overhead_barbell_press',
    exerciseName: 'Overhead Barbell Press (OHP)',
    type: 'weight',
    value: 47.5,
    reps: 6,
    weight: 47.5,
    date: '2026-08-03',
    previousBest: 45.0,
    improvementPercentage: 5.5
  },
  {
    id: 'pr_7',
    exerciseId: 'incline_dumbbell_press',
    exerciseName: 'Incline Dumbbell Press',
    type: 'weight',
    value: 26.0,
    reps: 10,
    weight: 26.0,
    date: '2026-07-29',
    previousBest: 24.0,
    improvementPercentage: 8.3
  }
];

export const MOCK_PROGRAM: Program = {
  id: 'program_hypertrophy_4day',
  name: '4-Day Hypertrophy & Progressive Overload',
  description: 'Evidence-based Upper/Lower split designed to maximize hypertrophy through double progression and tactical RPE management.',
  goal: 'Muscle Gain',
  experience: 'Intermediate',
  durationWeeks: 8,
  daysPerWeek: 4,
  weeks: [
    {
      weekNumber: 1,
      title: 'Week 1 — Foundation & Baseline RPE',
      workouts: [
        {
          id: 'w1_d1',
          name: 'Push Day (Chest / Delts / Triceps)',
          dayOfWeek: 'Monday',
          order: 1,
          exercises: [
            { exerciseId: 'barbell_bench_press', targetSets: 4, targetReps: '8', targetRpe: 7.5, restSeconds: 120 },
            { exerciseId: 'incline_dumbbell_press', targetSets: 3, targetReps: '10', targetRpe: 8, restSeconds: 90 },
            { exerciseId: 'dumbbell_lateral_raise', targetSets: 4, targetReps: '15', targetRpe: 8.5, restSeconds: 60 },
            { exerciseId: 'tricep_rope_pushdown', targetSets: 3, targetReps: '12', targetRpe: 8.5, restSeconds: 60 }
          ]
        },
        {
          id: 'w1_d2',
          name: 'Pull Day (Back / Rear Delts / Biceps)',
          dayOfWeek: 'Tuesday',
          order: 2,
          exercises: [
            { exerciseId: 'barbell_row', targetSets: 4, targetReps: '8', targetRpe: 8, restSeconds: 120 },
            { exerciseId: 'lat_pulldown', targetSets: 3, targetReps: '10', targetRpe: 8, restSeconds: 90 },
            { exerciseId: 'face_pulls', targetSets: 3, targetReps: '15', targetRpe: 8.5, restSeconds: 60 },
            { exerciseId: 'barbell_bicep_curl', targetSets: 3, targetReps: '10', targetRpe: 8.5, restSeconds: 60 }
          ]
        },
        {
          id: 'w1_d3',
          name: 'Legs & Core (Quads / Hamstrings / Calves)',
          dayOfWeek: 'Thursday',
          order: 3,
          exercises: [
            { exerciseId: 'barbell_back_squat', targetSets: 4, targetReps: '6', targetRpe: 8, restSeconds: 150 },
            { exerciseId: 'romanian_deadlift', targetSets: 3, targetReps: '8', targetRpe: 8, restSeconds: 120 },
            { exerciseId: 'leg_extensions', targetSets: 3, targetReps: '12', targetRpe: 8.5, restSeconds: 60 },
            { exerciseId: 'standing_calf_raise', targetSets: 4, targetReps: '15', targetRpe: 9, restSeconds: 45 }
          ]
        },
        {
          id: 'w1_d4',
          name: 'Upper Hypertrophy & Arms',
          dayOfWeek: 'Friday',
          order: 4,
          exercises: [
            { exerciseId: 'overhead_barbell_press', targetSets: 3, targetReps: '8', targetRpe: 8, restSeconds: 120 },
            { exerciseId: 'seated_cable_row', targetSets: 3, targetReps: '10', targetRpe: 8, restSeconds: 90 },
            { exerciseId: 'cable_chest_fly', targetSets: 3, targetReps: '12', targetRpe: 8.5, restSeconds: 60 },
            { exerciseId: 'dumbbell_incline_bicep_curl', targetSets: 3, targetReps: '10', targetRpe: 8.5, restSeconds: 60 },
            { exerciseId: 'overhead_cable_tricep_extension', targetSets: 3, targetReps: '12', targetRpe: 8.5, restSeconds: 60 }
          ]
        }
      ]
    }
  ]
};

// Generate 22 historical workout sessions spanning the last 8 weeks
export const generateHistoricalWorkouts = (): WorkoutSession[] => {
  const sessions: WorkoutSession[] = [];
  const baseDate = new Date('2026-08-19');

  const historyTemplates = [
    // Week 8 (Most recent)
    {
      daysAgo: 2,
      name: 'Push Day (Chest / Delts / Triceps)',
      duration: 54,
      exercises: [
        {
          id: 'barbell_bench_press',
          sets: [
            { weight: 62.5, reps: 8, rpe: 8, prevW: 60, prevR: 8, isPR: true },
            { weight: 62.5, reps: 8, rpe: 8, prevW: 60, prevR: 8 },
            { weight: 62.5, reps: 8, rpe: 8.5, prevW: 60, prevR: 8 },
            { weight: 62.5, reps: 7, rpe: 9, prevW: 60, prevR: 7 }
          ]
        },
        {
          id: 'incline_dumbbell_press',
          sets: [
            { weight: 26, reps: 10, rpe: 8, prevW: 24, prevR: 10 },
            { weight: 26, reps: 10, rpe: 8.5, prevW: 24, prevR: 10 },
            { weight: 26, reps: 9, rpe: 9, prevW: 24, prevR: 9 }
          ]
        },
        {
          id: 'dumbbell_lateral_raise',
          sets: [
            { weight: 12, reps: 15, rpe: 8.5, prevW: 10, prevR: 15 },
            { weight: 12, reps: 14, rpe: 9, prevW: 10, prevR: 14 },
            { weight: 12, reps: 13, rpe: 9.5, prevW: 10, prevR: 12 }
          ]
        },
        {
          id: 'tricep_rope_pushdown',
          sets: [
            { weight: 27.5, reps: 12, rpe: 8, prevW: 25, prevR: 12 },
            { weight: 27.5, reps: 12, rpe: 8.5, prevW: 25, prevR: 12 },
            { weight: 27.5, reps: 11, rpe: 9, prevW: 25, prevR: 11 }
          ]
        }
      ]
    },
    {
      daysAgo: 4,
      name: 'Legs & Core (Quads / Hamstrings)',
      duration: 62,
      exercises: [
        {
          id: 'barbell_back_squat',
          sets: [
            { weight: 105, reps: 6, rpe: 8, prevW: 100, prevR: 6, isPR: true },
            { weight: 105, reps: 6, rpe: 8.5, prevW: 100, prevR: 6 },
            { weight: 105, reps: 5, rpe: 9, prevW: 100, prevR: 5 },
            { weight: 100, reps: 6, rpe: 8.5, prevW: 95, prevR: 6 }
          ]
        },
        {
          id: 'romanian_deadlift',
          sets: [
            { weight: 90, reps: 8, rpe: 8, prevW: 85, prevR: 8 },
            { weight: 90, reps: 8, rpe: 8, prevW: 85, prevR: 8 },
            { weight: 90, reps: 8, rpe: 8.5, prevW: 85, prevR: 8 }
          ]
        },
        {
          id: 'leg_extensions',
          sets: [
            { weight: 55, reps: 12, rpe: 8.5, prevW: 50, prevR: 12 },
            { weight: 55, reps: 12, rpe: 9, prevW: 50, prevR: 12 },
            { weight: 55, reps: 10, rpe: 9.5, prevW: 50, prevR: 10 }
          ]
        }
      ]
    },
    {
      daysAgo: 6,
      name: 'Pull Day (Back / Biceps)',
      duration: 58,
      exercises: [
        {
          id: 'barbell_deadlift',
          sets: [
            { weight: 140, reps: 5, rpe: 8.5, prevW: 135, prevR: 5, isPR: true },
            { weight: 140, reps: 5, rpe: 9, prevW: 135, prevR: 5 },
            { weight: 130, reps: 5, rpe: 8, prevW: 125, prevR: 5 }
          ]
        },
        {
          id: 'lat_pulldown',
          sets: [
            { weight: 65, reps: 10, rpe: 8, prevW: 60, prevR: 10 },
            { weight: 65, reps: 10, rpe: 8.5, prevW: 60, prevR: 10 },
            { weight: 65, reps: 9, rpe: 9, prevW: 60, prevR: 9 }
          ]
        },
        {
          id: 'barbell_bicep_curl',
          sets: [
            { weight: 32.5, reps: 10, rpe: 8, prevW: 30, prevR: 10 },
            { weight: 32.5, reps: 9, rpe: 8.5, prevW: 30, prevR: 9 },
            { weight: 32.5, reps: 8, rpe: 9, prevW: 30, prevR: 8 }
          ]
        }
      ]
    },
    {
      daysAgo: 8,
      name: 'Upper Hypertrophy & Arms',
      duration: 50,
      exercises: [
        {
          id: 'overhead_barbell_press',
          sets: [
            { weight: 47.5, reps: 6, rpe: 8.5, prevW: 45, prevR: 6 },
            { weight: 47.5, reps: 6, rpe: 9, prevW: 45, prevR: 6 },
            { weight: 45, reps: 6, rpe: 8.5, prevW: 42.5, prevR: 6 }
          ]
        },
        {
          id: 'seated_cable_row',
          sets: [
            { weight: 60, reps: 10, rpe: 8, prevW: 55, prevR: 10 },
            { weight: 60, reps: 10, rpe: 8, prevW: 55, prevR: 10 },
            { weight: 60, reps: 10, rpe: 8.5, prevW: 55, prevR: 10 }
          ]
        }
      ]
    },
    // Week 7
    {
      daysAgo: 10,
      name: 'Push Day (Chest / Delts / Triceps)',
      duration: 56,
      exercises: [
        {
          id: 'barbell_bench_press',
          sets: [
            { weight: 62.5, reps: 8, rpe: 8, prevW: 60, prevR: 8 },
            { weight: 62.5, reps: 8, rpe: 8, prevW: 60, prevR: 8 },
            { weight: 62.5, reps: 7, rpe: 8.5, prevW: 60, prevR: 8 },
            { weight: 60, reps: 8, rpe: 8, prevW: 57.5, prevR: 8 }
          ]
        },
        {
          id: 'incline_dumbbell_press',
          sets: [
            { weight: 24, reps: 10, rpe: 8, prevW: 22, prevR: 10 },
            { weight: 24, reps: 10, rpe: 8, prevW: 22, prevR: 10 },
            { weight: 24, reps: 10, rpe: 8.5, prevW: 22, prevR: 9 }
          ]
        }
      ]
    },
    {
      daysAgo: 12,
      name: 'Legs & Core',
      duration: 60,
      exercises: [
        {
          id: 'barbell_back_squat',
          sets: [
            { weight: 100, reps: 6, rpe: 8, prevW: 95, prevR: 6 },
            { weight: 100, reps: 6, rpe: 8, prevW: 95, prevR: 6 },
            { weight: 100, reps: 6, rpe: 8.5, prevW: 95, prevR: 6 }
          ]
        }
      ]
    },
    {
      daysAgo: 14,
      name: 'Pull Day',
      duration: 55,
      exercises: [
        {
          id: 'barbell_row',
          sets: [
            { weight: 70, reps: 8, rpe: 8, prevW: 65, prevR: 8 },
            { weight: 70, reps: 8, rpe: 8, prevW: 65, prevR: 8 },
            { weight: 70, reps: 8, rpe: 8.5, prevW: 65, prevR: 8 }
          ]
        }
      ]
    },
    // Earlier weeks (Weeks 1 to 6)
    {
      daysAgo: 17,
      name: 'Push Day',
      duration: 52,
      exercises: [
        {
          id: 'barbell_bench_press',
          sets: [
            { weight: 60, reps: 8, rpe: 8, prevW: 57.5, prevR: 8 },
            { weight: 60, reps: 8, rpe: 8, prevW: 57.5, prevR: 8 },
            { weight: 60, reps: 8, rpe: 8.5, prevW: 57.5, prevR: 8 }
          ]
        }
      ]
    },
    {
      daysAgo: 21,
      name: 'Legs Day',
      duration: 64,
      exercises: [
        {
          id: 'leg_press',
          sets: [
            { weight: 210, reps: 20, rpe: 9, prevW: 190, prevR: 20, isPR: true },
            { weight: 210, reps: 18, rpe: 9.5, prevW: 190, prevR: 18 }
          ]
        }
      ]
    },
    {
      daysAgo: 24,
      name: 'Pull Day',
      duration: 57,
      exercises: [
        {
          id: 'pull_ups',
          sets: [
            { weight: 0, reps: 15, rpe: 9.5, prevW: 0, prevR: 12, isPR: true },
            { weight: 0, reps: 12, rpe: 9, prevW: 0, prevR: 10 },
            { weight: 0, reps: 10, rpe: 9, prevW: 0, prevR: 8 }
          ]
        }
      ]
    },
    {
      daysAgo: 28,
      name: 'Push Day',
      duration: 50,
      exercises: [
        {
          id: 'barbell_bench_press',
          sets: [
            { weight: 57.5, reps: 8, rpe: 7.5, prevW: 55, prevR: 8 },
            { weight: 57.5, reps: 8, rpe: 8, prevW: 55, prevR: 8 },
            { weight: 57.5, reps: 8, rpe: 8, prevW: 55, prevR: 8 }
          ]
        }
      ]
    },
    {
      daysAgo: 32,
      name: 'Legs Day',
      duration: 58,
      exercises: [
        {
          id: 'barbell_back_squat',
          sets: [
            { weight: 95, reps: 6, rpe: 8, prevW: 90, prevR: 6 },
            { weight: 95, reps: 6, rpe: 8, prevW: 90, prevR: 6 },
            { weight: 95, reps: 6, rpe: 8.5, prevW: 90, prevR: 6 }
          ]
        }
      ]
    },
    {
      daysAgo: 35,
      name: 'Pull Day',
      duration: 54,
      exercises: [
        {
          id: 'barbell_deadlift',
          sets: [
            { weight: 135, reps: 5, rpe: 8, prevW: 130, prevR: 5 },
            { weight: 135, reps: 5, rpe: 8.5, prevW: 130, prevR: 5 }
          ]
        }
      ]
    },
    {
      daysAgo: 39,
      name: 'Push Day',
      duration: 48,
      exercises: [
        {
          id: 'barbell_bench_press',
          sets: [
            { weight: 55, reps: 8, rpe: 7.5, prevW: 50, prevR: 8 },
            { weight: 55, reps: 8, rpe: 7.5, prevW: 50, prevR: 8 },
            { weight: 55, reps: 8, rpe: 8, prevW: 50, prevR: 8 }
          ]
        }
      ]
    },
    {
      daysAgo: 42,
      name: 'Legs Day',
      duration: 60,
      exercises: [
        {
          id: 'barbell_back_squat',
          sets: [
            { weight: 90, reps: 6, rpe: 7.5 },
            { weight: 90, reps: 6, rpe: 8 },
            { weight: 90, reps: 6, rpe: 8 }
          ]
        }
      ]
    },
    {
      daysAgo: 45,
      name: 'Upper Body',
      duration: 52,
      exercises: [
        {
          id: 'overhead_barbell_press',
          sets: [
            { weight: 42.5, reps: 6, rpe: 8 },
            { weight: 42.5, reps: 6, rpe: 8 }
          ]
        }
      ]
    },
    {
      daysAgo: 49,
      name: 'Push Day',
      duration: 45,
      exercises: [
        {
          id: 'barbell_bench_press',
          sets: [
            { weight: 52.5, reps: 8, rpe: 7.5 },
            { weight: 52.5, reps: 8, rpe: 8 },
            { weight: 52.5, reps: 8, rpe: 8 }
          ]
        }
      ]
    },
    {
      daysAgo: 52,
      name: 'Legs Day',
      duration: 55,
      exercises: [
        {
          id: 'barbell_back_squat',
          sets: [
            { weight: 85, reps: 6, rpe: 7.5 },
            { weight: 85, reps: 6, rpe: 8 }
          ]
        }
      ]
    },
    {
      daysAgo: 55,
      name: 'Pull Day',
      duration: 50,
      exercises: [
        {
          id: 'barbell_row',
          sets: [
            { weight: 60, reps: 8, rpe: 7.5 },
            { weight: 60, reps: 8, rpe: 8 }
          ]
        }
      ]
    },
    {
      daysAgo: 58,
      name: 'Initial Push Baseline',
      duration: 42,
      exercises: [
        {
          id: 'barbell_bench_press',
          sets: [
            { weight: 50, reps: 8, rpe: 7 },
            { weight: 50, reps: 8, rpe: 7.5 },
            { weight: 50, reps: 8, rpe: 8 }
          ]
        }
      ]
    }
  ];

  historyTemplates.forEach((item, idx) => {
    const sessionDate = new Date(baseDate);
    sessionDate.setDate(sessionDate.getDate() - item.daysAgo);
    const dateStr = sessionDate.toISOString();

    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;
    let prCount = 0;

    const workoutExercises = item.exercises.map((exItem, exIdx) => {
      const loggedSets = exItem.sets.map((s: any, sIdx) => {
        totalSets += 1;
        totalReps += s.reps;
        totalVolume += s.weight * s.reps;
        if (s.isPR) prCount += 1;

        return {
          id: `set_${idx}_${exIdx}_${sIdx}`,
          setNumber: sIdx + 1,
          weight: s.weight,
          reps: s.reps,
          rpe: s.rpe,
          isCompleted: true,
          previousWeight: s.prevW,
          previousReps: s.prevR,
          isPR: !!s.isPR
        };
      });

      return {
        id: `we_${idx}_${exIdx}`,
        exerciseId: exItem.id,
        order: exIdx + 1,
        sets: loggedSets,
        restTimerSeconds: 90
      };
    });

    sessions.push({
      id: `session_hist_${idx}`,
      name: item.name,
      date: dateStr,
      startedAt: new Date(sessionDate.getTime() - item.duration * 60000).toISOString(),
      completedAt: dateStr,
      durationMinutes: item.duration,
      exercises: workoutExercises,
      totalVolumeKg: totalVolume,
      totalSets: totalSets,
      totalReps: totalReps,
      prCount: prCount,
      aiSummary: idx === 0 
        ? 'Outstanding session! You hit 62.5kg × 8 on Bench Press at RPE 8.0. Progressive overload threshold achieved — recommend 65kg next week.' 
        : `Completed all ${totalSets} sets with solid form. Total workload: ${totalVolume.toLocaleString()} kg.`,
      isCompleted: true
    });
  });

  return sessions;
};
