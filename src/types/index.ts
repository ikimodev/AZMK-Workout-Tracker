export type MuscleGroup = 
  | 'Chest' 
  | 'Back' 
  | 'Shoulders' 
  | 'Traps'
  | 'Quads' 
  | 'Hamstrings' 
  | 'Glutes' 
  | 'Calves' 
  | 'Biceps' 
  | 'Triceps' 
  | 'Forearms' 
  | 'Core' 
  | 'Full Body';

export type Equipment = 
  // Base 
  | 'Barbell' | 'Dumbbell' | 'Cable' | 'Machine' | 'Bodyweight' | 'Smith Machine' | 'Kettlebell' | 'Bands' | 'Other'
  // Weights and Bars
  | 'Plate' | 'EZ Bar' | 'Landmine' | 'Trap Bar'
  // Benches and Racks
  | 'Pull Up Bar' | 'Squat Rack' | 'Flat Bench' | 'Adjustable Bench' | 'Dip Bar'
  // Machines
  | 'Single Cable Machine' | 'Dual Cable Machine' | 'Lat Pulldown Cable' | 'Leg Press Machine' | 'T-bar' | 'Stack Machines' | 'Plate Machines'
  // Cardio
  | 'Treadmill' | 'Rowing Machine' | 'Spinning' | 'Elliptical Trainer' | 'Stair Machine' | 'Air Bike'
  // Other
  | 'Suspension Band' | 'Resistance Band' | 'Battle Rope' | 'Rings' | 'Jump Rope' | 'Medicine Ball';

export type MovementPattern = 
  | 'Horizontal Push' 
  | 'Horizontal Pull' 
  | 'Vertical Push' 
  | 'Vertical Pull' 
  | 'Squat' 
  | 'Hip Hinge' 
  | 'Lunge / Single Leg' 
  | 'Isolation Push' 
  | 'Isolation Pull' 
  | 'Core / Anti-Extension';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type FitnessGoal = 'Muscle Gain' | 'Strength' | 'Fat Loss' | 'General Fitness' | 'Endurance' | 'Mobility & Joint Health';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  movementPattern: MovementPattern;
  difficulty: Difficulty;
  instructions: string;
  instructionsAr?: string;
  defaultSets: number;
  defaultReps: number;
  alternatives: string[]; // Exercise IDs
  youtubeQuery: string;
}

export interface LoggedSet {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe?: number; // Optional 6 to 10
  isCompleted: boolean;
  notes?: string;
  previousWeight?: number;
  previousReps?: number;
  targetWeight?: number;
  targetRepsMin?: number;
  targetRepsMax?: number;
  isPR?: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  order: number;
  sets: LoggedSet[];
  notes?: string;
  restTimerSeconds?: number;
}

export interface WorkoutSession {
  id: string;
  name: string;
  date: string; // ISO string
  startedAt: string;
  completedAt?: string;
  durationMinutes: number;
  exercises: WorkoutExercise[];
  totalVolumeKg: number;
  totalSets: number;
  totalReps: number;
  prCount: number;
  aiSummary?: string;
  isCompleted: boolean;
  programWorkoutId?: string;
}

export interface ProgramWorkout {
  id: string;
  name: string;
  dayOfWeek?: string; // 'Monday', 'Tuesday', etc.
  order: number;
  exercises: {
    exerciseId: string;
    targetSets: number;
    targetReps: string; // e.g. "8-10" or "12"
    targetRpe?: number;
    restSeconds: number;
  }[];
}

export interface ProgramWeek {
  weekNumber: number;
  title: string;
  workouts: ProgramWorkout[];
}

export interface Program {
  id: string;
  name: string;
  description: string;
  goal: FitnessGoal;
  secondaryGoal?: FitnessGoal;
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  daysPerWeek: number;
  weeks: ProgramWeek[];
  isCustom?: boolean;
}

export interface PRRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  type: 'weight' | 'reps' | 'volume';
  value: number; // kg or reps or total kg
  reps?: number;
  weight?: number;
  date: string;
  previousBest?: number;
  improvementPercentage?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  gender?: 'male' | 'female';
  birthday?: string;
  weight?: number; // kg
  height?: number; // cm
  experience: 'Beginner' | 'Intermediate' | 'Advanced';
  primaryGoal: FitnessGoal;
  secondaryGoal: FitnessGoal;
  daysPerWeek: number;
  preferredDurationMinutes: number;
  availableEquipment: Equipment[];
  tier: 'free' | 'premium';
  role?: 'user' | 'admin';
  isDemoUser?: boolean;
  startingBaselineOption?: 'experienced' | 'beginner_rpe';
  referralCode: string;
  streakDays: number;
  joinedDate: string;
  hasCompletedOnboarding?: boolean;
  aiQuestionsUsedToday?: number;
  startDayOption?: 'today' | 'tomorrow';
  programStartDate?: string;
  calendarCustomizations?: Record<string, { type: 'workout' | 'rest'; workoutIndex?: number; customName?: string }>;
  preferredSplit?: string;
}

export interface ReferralStats {
  code: string;
  clicks: number;
  signups: number;
  paidUsers: number;
  rewardMonthsEarned: number;
  history: {
    id: string;
    userName: string;
    date: string;
    status: 'Signed Up' | 'Subscribed Premium' | 'Active';
    reward: string;
  }[];
}

export interface ToolCallLog {
  id: string;
  toolName: string;
  arguments: Record<string, any>;
  resultSummary: string;
  timestamp: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  toolCalls?: ToolCallLog[];
  suggestedActions?: {
    label: string;
    actionType: 'start_workout' | 'replace_exercise' | 'view_analytics' | 'apply_progression';
    payload?: any;
  }[];
}

export interface NextWorkoutRecommendation {
  exerciseId: string;
  exerciseName: string;
  recommendedWeight: number;
  recommendedRepsMin: number;
  recommendedRepsMax: number;
  rationale: string;
  confidence: number;
  previousPerformance: string;
  deltaPercent: number;
}

export type ActivityType = 
  | 'Running' 
  | 'Walking / Zone 2' 
  | 'Cycling' 
  | 'Swimming' 
  | 'HIIT Cardio' 
  | 'Football' 
  | 'Padel' 
  | 'Basketball'
  | 'Yoga & Mobility' 
  | 'Custom Sport';

export interface LoggedActivity {
  id: string;
  name: string;
  type: ActivityType;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  caloriesBurned?: number;
  distanceKm?: number;
  heartRateAvg?: number;
  notes?: string;
}

export interface TodayScheduleState {
  isRestDay: boolean;
  dayName: string;
  dayNumber: number; // 1 (Mon) to 7 (Sun)
  workoutTemplate: ProgramWorkout | null;
  workoutIndex: number;
  totalWorkoutsInWeek: number;
  completedThisWeek: number;
  nextScheduledWorkoutDay?: string;
}
