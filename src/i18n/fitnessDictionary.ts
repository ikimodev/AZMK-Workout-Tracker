import { Language } from './translations';
import { MuscleGroup, Equipment, MovementPattern, FitnessGoal } from '../types';

export interface BilingualTerm {
  ar: string;
  en: string;
  shortAr?: string;
  shortEn?: string;
}

// ==========================================
// 1. FITNESS GOALS DICTIONARY
// ==========================================
export const FITNESS_GOALS_DICT: Record<FitnessGoal, BilingualTerm> = {
  'Muscle Gain': {
    ar: 'الضخامة وبناء العضلات (Hypertrophy)',
    en: 'Muscle Hypertrophy & Growth',
    shortAr: 'بناء العضلات',
    shortEn: 'Hypertrophy'
  },
  'Strength': {
    ar: 'القوة والباورلفتنج (Strength)',
    en: 'Raw Strength & Powerlifting',
    shortAr: 'القوة والباورلفتنج',
    shortEn: 'Strength'
  },
  'Fat Loss': {
    ar: 'حرق الدهون والتنشيف (Fat Loss)',
    en: 'Fat Loss & Body Recomposition',
    shortAr: 'حرق الدهون',
    shortEn: 'Fat Loss'
  },
  'General Fitness': {
    ar: 'اللياقة العامة والصحة (General Fitness)',
    en: 'General Fitness & Health',
    shortAr: 'اللياقة العامة',
    shortEn: 'General Fitness'
  },
  'Endurance': {
    ar: 'التحمل واللياقة القلبية (Endurance)',
    en: 'Cardiovascular Endurance & Stamina',
    shortAr: 'التحمل واللياقة',
    shortEn: 'Endurance'
  },
  'Mobility & Joint Health': {
    ar: 'المرونة وصحة المفاصل (Mobility)',
    en: 'Mobility & Joint Longevity',
    shortAr: 'المرونة والمفاصل',
    shortEn: 'Mobility'
  }
};

// ==========================================
// 2. MUSCLE GROUPS DICTIONARY
// ==========================================
export const MUSCLE_GROUPS_DICT: Record<MuscleGroup, BilingualTerm> = {
  'Chest': {
    ar: 'الصدر (Chest)',
    en: 'Chest (Pectorals)',
    shortAr: 'الصدر',
    shortEn: 'Chest'
  },
  'Back': {
    ar: 'الظهر (Back)',
    en: 'Back (Lats & Traps)',
    shortAr: 'الظهر',
    shortEn: 'Back'
  },
  'Shoulders': {
    ar: 'الأكتاف (Shoulders)',
    en: 'Shoulders (Deltoids)',
    shortAr: 'الأكتاف',
    shortEn: 'Shoulders'
  },
  'Quads': {
    ar: 'الأرجل الأمامية (Quads)',
    en: 'Quadriceps (Front Thighs)',
    shortAr: 'أرجل أمامية',
    shortEn: 'Quads'
  },
  'Hamstrings': {
    ar: 'الأرجل الخلفية (Hamstrings)',
    en: 'Hamstrings (Back Thighs)',
    shortAr: 'أرجل خلفية',
    shortEn: 'Hamstrings'
  },
  'Glutes': {
    ar: 'عضلات الأرداف (Glutes)',
    en: 'Glutes (Posterior)',
    shortAr: 'الأرداف',
    shortEn: 'Glutes'
  },
  'Calves': {
    ar: 'بطات الأرجل (Calves)',
    en: 'Calves (Gastrocnemius)',
    shortAr: 'البطات',
    shortEn: 'Calves'
  },
  'Biceps': {
    ar: 'البايسبس (Biceps)',
    en: 'Biceps (Arm Flexors)',
    shortAr: 'البايسبس',
    shortEn: 'Biceps'
  },
  'Triceps': {
    ar: 'الترايسبس (Triceps)',
    en: 'Triceps (Arm Extensors)',
    shortAr: 'الترايسبس',
    shortEn: 'Triceps'
  },
  'Forearms': {
    ar: 'السواعد (Forearms)',
    en: 'Forearms (Grip & Wrists)',
    shortAr: 'السواعد',
    shortEn: 'Forearms'
  },
  'Core': {
    ar: 'البطن والكور (Core)',
    en: 'Core (Abs & Obliques)',
    shortAr: 'البطن والكور',
    shortEn: 'Core'
  },
  'Traps': {
    ar: 'عضلات الترابيس (Traps)',
    en: 'Trapezius (Upper Back)',
    shortAr: 'الترابيس',
    shortEn: 'Traps'
  },
  'Full Body': {
    ar: 'كامل الجسم (Full Body)',
    en: 'Full Body (Compound)',
    shortAr: 'كامل الجسم',
    shortEn: 'Full Body'
  }
};

// ==========================================
// 3. EQUIPMENT DICTIONARY
// ==========================================
export const EQUIPMENT_DICT: Record<Equipment, BilingualTerm> = {
  'Barbell': {
    ar: 'باربل (Barbell)',
    en: 'Barbell',
    shortAr: 'باربل',
    shortEn: 'Barbell'
  },
  'Dumbbell': {
    ar: 'دامبلز (Dumbbell)',
    en: 'Dumbbell',
    shortAr: 'دامبلز',
    shortEn: 'Dumbbell'
  },
  'Cable': {
    ar: 'كيبل (Cable)',
    en: 'Cable Machine',
    shortAr: 'كيبل',
    shortEn: 'Cable'
  },
  'Machine': {
    ar: 'أجهزة وآلات (Machine)',
    en: 'Gym Machine',
    shortAr: 'أجهزة',
    shortEn: 'Machine'
  },
  'Bodyweight': {
    ar: 'وزن الجسم (Bodyweight)',
    en: 'Bodyweight',
    shortAr: 'وزن الجسم',
    shortEn: 'Bodyweight'
  },
  'Smith Machine': {
    ar: 'جهاز سميث (Smith Machine)',
    en: 'Smith Machine',
    shortAr: 'سميث',
    shortEn: 'Smith Machine'
  },
  'Kettlebell': {
    ar: 'كيتل بيل (Kettlebell)',
    en: 'Kettlebell',
    shortAr: 'كيتل بيل',
    shortEn: 'Kettlebell'
  },
  'Bands': {
    ar: 'حبال مقاومة (Bands)',
    en: 'Resistance Bands',
    shortAr: 'حبال مقاومة',
    shortEn: 'Bands'
  },
  'Other': {
    ar: 'أخرى (Other)',
    en: 'Other Gear',
    shortAr: 'أخرى',
    shortEn: 'Other'
  }
};

// ==========================================
// 4. MOVEMENT PATTERNS DICTIONARY
// ==========================================
export const MOVEMENT_PATTERNS_DICT: Record<MovementPattern, BilingualTerm> = {
  'Horizontal Push': {
    ar: 'دفع أفقي (Horizontal Push)',
    en: 'Horizontal Push',
    shortAr: 'دفع أفقي'
  },
  'Horizontal Pull': {
    ar: 'سحب أفقي (Horizontal Pull)',
    en: 'Horizontal Pull',
    shortAr: 'سحب أفقي'
  },
  'Vertical Push': {
    ar: 'دفع رأسي (Vertical Push)',
    en: 'Vertical Push',
    shortAr: 'دفع رأسي'
  },
  'Vertical Pull': {
    ar: 'سحب رأسي (Vertical Pull)',
    en: 'Vertical Pull',
    shortAr: 'سحب رأسي'
  },
  'Squat': {
    ar: 'سكوات وقرفصاء (Squat)',
    en: 'Squat & Knee Flexion',
    shortAr: 'سكوات'
  },
  'Hip Hinge': {
    ar: 'مفصل الورك وديدلفت (Hip Hinge)',
    en: 'Hip Hinge / Posterior Chain',
    shortAr: 'مفصل الورك'
  },
  'Lunge / Single Leg': {
    ar: 'طعن ورجل أحادية (Lunge)',
    en: 'Lunge / Unilateral Leg',
    shortAr: 'رجل أحادية'
  },
  'Isolation Push': {
    ar: 'عزل دفع (Isolation Push)',
    en: 'Isolation Push',
    shortAr: 'عزل دفع'
  },
  'Isolation Pull': {
    ar: 'عزل سحب (Isolation Pull)',
    en: 'Isolation Pull',
    shortAr: 'عزل سحب'
  },
  'Core / Anti-Extension': {
    ar: 'ثبات وقوة الكور (Core)',
    en: 'Core Stability & Anti-Extension',
    shortAr: 'ثبات الكور'
  }
};

// ==========================================
// 5. EXERCISES BILINGUAL DICTIONARY (Standard: Arabic First (English Second))
// ==========================================
export const EXERCISES_DICT: Record<string, BilingualTerm> = {
  // Chest
  'barbell_bench_press': {
    ar: 'تمرين ضغط البار على البنش (Barbell Bench Press)',
    en: 'Barbell Bench Press',
    shortAr: 'بنش برس بالبار'
  },
  'smith_bench_press': {
    ar: 'ضغط الصدر بجهاز سميث (Smith Machine Bench Press)',
    en: 'Smith Machine Bench Press',
    shortAr: 'بنش سميث'
  },
  'incline_dumbbell_press': {
    ar: 'ضغط الدامبلز للأعلى على مقعد مائل (Incline Dumbbell Press)',
    en: 'Incline Dumbbell Press',
    shortAr: 'إنكلاين دامبل برس'
  },
  'dumbbell_bench_press': {
    ar: 'ضغط الصدر بالدامبلز (Dumbbell Bench Press)',
    en: 'Dumbbell Bench Press',
    shortAr: 'بنش برس دامبلز'
  },
  'cable_chest_fly': {
    ar: 'تفتيح الصدر بالكيبل (Cable Chest Fly)',
    en: 'Cable Chest Fly',
    shortAr: 'تفتيح كيبل'
  },
  'incline_barbell_press': {
    ar: 'ضغط البار على مقعد مائل (Incline Barbell Press)',
    en: 'Incline Barbell Press',
    shortAr: 'إنكلاين باربل برس'
  },
  'incline_smith_press': {
    ar: 'ضغط مقعد مائل بجهاز سميث (Incline Smith Machine Press)',
    en: 'Incline Smith Machine Press',
    shortAr: 'إنكلاين سميث'
  },
  'machine_chest_press': {
    ar: 'ضغط الصدر بالجهاز (Machine Chest Press)',
    en: 'Machine Chest Press',
    shortAr: 'جهاز ضغط الصدر'
  },
  'push_ups': {
    ar: 'تمرين الضغط بوزن الجسم (Push-Ups)',
    en: 'Push-Ups',
    shortAr: 'تمرين الضغط'
  },
  'dips_chest': {
    ar: 'تمرين المتوازي للصدر (Chest Dips)',
    en: 'Chest Dips',
    shortAr: 'المتوازي'
  },
  'pec_deck_fly': {
    ar: 'تفتيح الصدر بجهاز الفراشة (Pec Deck Fly)',
    en: 'Pec Deck Machine Fly',
    shortAr: 'جهاز الفراشة'
  },

  // Back
  'barbell_bent_over_row': {
    ar: 'سحب البار للظهر منحنياً (Bent-Over Barbell Row)',
    en: 'Bent-Over Barbell Row',
    shortAr: 'سحب بار للظهر'
  },
  'lat_pulldown': {
    ar: 'سحب الكيبل للظهر عريض (Lat Pulldown)',
    en: 'Lat Pulldown (Cable)',
    shortAr: 'سحب علوي للظهر'
  },
  'seated_cable_row': {
    ar: 'سحب الكيبل جالس للظهر (Seated Cable Row)',
    en: 'Seated Cable Row',
    shortAr: 'سحب كيبل أرضي'
  },
  'pull_ups': {
    ar: 'تمرين العقلة (Pull-Ups)',
    en: 'Pull-Ups',
    shortAr: 'العقلة'
  },
  't_bar_row': {
    ar: 'سحب التي بار للظهر (T-Bar Row)',
    en: 'T-Bar Row',
    shortAr: 'تي بار رو'
  },
  'chest_supported_row': {
    ar: 'سحب دامبلز مسنود على المقعد (Chest-Supported Row)',
    en: 'Chest-Supported Dumbbell Row',
    shortAr: 'سحب مسنود'
  },
  'one_arm_dumbbell_row': {
    ar: 'سحب دامبل فردي للظهر (Single-Arm Dumbbell Row)',
    en: 'Single-Arm Dumbbell Row',
    shortAr: 'سحب دامبل فردي'
  },
  'lat_pushdown_cable': {
    ar: 'سحب مستقيم بالكيبل (Straight-Arm Lat Pushdown)',
    en: 'Straight-Arm Cable Lat Pushdown',
    shortAr: 'ستريت آرم بوش داون'
  },

  // Legs (Quads, Glutes, Hamstrings, Calves)
  'barbell_back_squat': {
    ar: 'تمرين السكوات الخلفي بالبار (Barbell Back Squat)',
    en: 'Barbell Back Squat',
    shortAr: 'سكوات خلفي'
  },
  'leg_press': {
    ar: 'دفع الأرجل بالجهاز (Leg Press)',
    en: '45-Degree Leg Press',
    shortAr: 'دفع أرجل بالجهاز'
  },
  'romanian_deadlift': {
    ar: 'الديدلفت الروماني للأرجل الخلفية (Romanian Deadlift - RDL)',
    en: 'Romanian Deadlift (RDL)',
    shortAr: 'ديدلفت روماني'
  },
  'barbell_deadlift': {
    ar: 'تمرين الديدلفت التقليدي (Conventional Barbell Deadlift)',
    en: 'Conventional Barbell Deadlift',
    shortAr: 'ديدلفت تقليدي'
  },
  'leg_extension': {
    ar: 'تمديد الأرجل الأمامية بالجهاز (Leg Extension Machine)',
    en: 'Leg Extension Machine',
    shortAr: 'رفرفة أرجل أمامية'
  },
  'seated_leg_curl': {
    ar: 'ثني الأرجل الخلفية جالس (Seated Leg Curl)',
    en: 'Seated Leg Curl Machine',
    shortAr: 'ثني أرجل جالس'
  },
  'lying_leg_curl': {
    ar: 'ثني الأرجل الخلفية مستلقي (Lying Leg Curl)',
    en: 'Lying Leg Curl Machine',
    shortAr: 'ثني أرجل مستلقي'
  },
  'bulgarian_split_squat': {
    ar: 'السكوات البلغاري الفردي (Bulgarian Split Squat)',
    en: 'Bulgarian Split Squat',
    shortAr: 'سكوات بلغاري'
  },
  'hack_squat': {
    ar: 'سكوات الهاك بالجهاز (Hack Squat Machine)',
    en: 'Hack Squat Machine',
    shortAr: 'هاك سكوات'
  },
  'standing_calf_raise': {
    ar: 'رفع بطات الأرجل واقفاً (Standing Calf Raise)',
    en: 'Standing Calf Raise',
    shortAr: 'رفع بطات واقف'
  },
  'seated_calf_raise': {
    ar: 'رفع بطات الأرجل جالساً (Seated Calf Raise)',
    en: 'Seated Calf Raise',
    shortAr: 'رفع بطات جالس'
  },
  'hip_thrust': {
    ar: 'دفع الورك بالبار للأرداف (Barbell Hip Thrust)',
    en: 'Barbell Hip Thrust',
    shortAr: 'هيب ثرست'
  },

  // Shoulders
  'overhead_barbell_press': {
    ar: 'ضغط الأكتاف بالبار واقفاً (Overhead Barbell Press - OHP)',
    en: 'Overhead Barbell Press (OHP)',
    shortAr: 'أوفر هيد برس'
  },
  'seated_dumbbell_shoulder_press': {
    ar: 'ضغط الأكتاف بالدامبلز جالس (Seated Dumbbell Shoulder Press)',
    en: 'Seated Dumbbell Shoulder Press',
    shortAr: 'ضغط أكتاف بالدامبلز'
  },
  'dumbbell_lateral_raise': {
    ar: 'رفرفة جانبية للأكتاف بالدامبلز (Dumbbell Lateral Raise)',
    en: 'Dumbbell Lateral Raise',
    shortAr: 'رفرفة جانبية'
  },
  'cable_lateral_raise': {
    ar: 'رفرفة جانبية بالكيبل (Cable Lateral Raise)',
    en: 'Cable Lateral Raise',
    shortAr: 'رفرفة كيبل جانبي'
  },
  'face_pull': {
    ar: 'سحب الكيبل للوجه للأكتاف الخلفية (Cable Face Pull)',
    en: 'Cable Face Pull',
    shortAr: 'فيس بول'
  },
  'rear_delt_reverse_fly': {
    ar: 'تفتيح خلفي للأكتاف (Rear Delt Reverse Fly)',
    en: 'Rear Delt Reverse Fly',
    shortAr: 'رفرفة خلفية'
  },

  // Arms (Biceps & Triceps)
  'barbell_bicep_curl': {
    ar: 'ثني البايسبس بالبار (Barbell Bicep Curl)',
    en: 'Barbell Bicep Curl',
    shortAr: 'باي بالبار'
  },
  'incline_dumbbell_curl': {
    ar: 'ثني البايسبس بالدامبلز على مقعد مائل (Incline Dumbbell Curl)',
    en: 'Incline Dumbbell Curl',
    shortAr: 'إنكلاين باي دامبل'
  },
  'hammer_curl': {
    ar: 'ثني المطرقة بالدامبلز للباي والساعد (Dumbbell Hammer Curl)',
    en: 'Dumbbell Hammer Curl',
    shortAr: 'هامر كيرل'
  },
  'preacher_curl': {
    ar: 'ثني البايسبس على مقعد الواعظ (Preacher Curl)',
    en: 'Preacher Curl',
    shortAr: 'باي مقعد واعظ'
  },
  'cable_bicep_curl': {
    ar: 'ثني البايسبس بالكيبل (Cable Bicep Curl)',
    en: 'Cable Bicep Curl',
    shortAr: 'باي بالكيبل'
  },
  'tricep_rope_pushdown': {
    ar: 'دفع الترايسبس بالحبل بالكيبل (Tricep Rope Pushdown)',
    en: 'Tricep Rope Pushdown',
    shortAr: 'تراي حبل كيبل'
  },
  'skull_crushers': {
    ar: 'كسارة الجمجمة للترايسبس بالبار (Barbell Skull Crushers)',
    en: 'Barbell Skull Crushers',
    shortAr: 'سكال كراشر'
  },
  'overhead_cable_tricep_extension': {
    ar: 'مد الترايسبس بالكيبل فوق الرأس (Overhead Cable Tricep Extension)',
    en: 'Overhead Cable Tricep Extension',
    shortAr: 'تراي أوفر هيد كيبل'
  },
  'close_grip_bench_press': {
    ar: 'ضغط البنش بالقبضة الضيقة للتراي (Close-Grip Bench Press)',
    en: 'Close-Grip Bench Press',
    shortAr: 'بنش قبضة ضيقة'
  },

  // Core & Abs
  'hanging_leg_raise': {
    ar: 'رفع الأرجل معلقاً للبطن (Hanging Leg Raise)',
    en: 'Hanging Leg Raise',
    shortAr: 'رفع أرجل معلق'
  },
  'cable_woodchopper': {
    ar: 'تقطيع الخشب بالكيبل لعضلات الخصر (Cable Woodchopper)',
    en: 'Cable Woodchopper',
    shortAr: 'وود تشوبر كيبل'
  },
  'plank': {
    ar: 'تمرين البلانك للثبات (Plank Core Hold)',
    en: 'Plank Core Hold',
    shortAr: 'تمرين البلانك'
  },
  'cable_crunch': {
    ar: 'طحن البطن بالكيبل جالس (Kneeling Cable Crunch)',
    en: 'Kneeling Cable Crunch',
    shortAr: 'طحن بطن كيبل'
  }
};

// ==========================================
// 6. DAYS OF WEEK DICTIONARY
// ==========================================
export const DAYS_OF_WEEK_DICT: Record<string, BilingualTerm> = {
  'Sunday': { ar: 'الأحد (Sunday)', en: 'Sunday', shortAr: 'الأحد' },
  'Monday': { ar: 'الإثنين (Monday)', en: 'Monday', shortAr: 'الإثنين' },
  'Tuesday': { ar: 'الثلاثاء (Tuesday)', en: 'Tuesday', shortAr: 'الثلاثاء' },
  'Wednesday': { ar: 'الأربعاء (Wednesday)', en: 'Wednesday', shortAr: 'الأربعاء' },
  'Thursday': { ar: 'الخميس (Thursday)', en: 'Thursday', shortAr: 'الخميس' },
  'Friday': { ar: 'الجمعة (Friday)', en: 'Friday', shortAr: 'الجمعة' },
  'Saturday': { ar: 'السبت (Saturday)', en: 'Saturday', shortAr: 'السبت' },
  'Day 1': { ar: 'اليوم 1 (Day 1)', en: 'Day 1', shortAr: 'اليوم 1' },
  'Day 2': { ar: 'اليوم 2 (Day 2)', en: 'Day 2', shortAr: 'اليوم 2' },
  'Day 3': { ar: 'اليوم 3 (Day 3)', en: 'Day 3', shortAr: 'اليوم 3' },
  'Day 4': { ar: 'اليوم 4 (Day 4)', en: 'Day 4', shortAr: 'اليوم 4' },
  'Day 5': { ar: 'اليوم 5 (Day 5)', en: 'Day 5', shortAr: 'اليوم 5' },
  'Day 6': { ar: 'اليوم 6 (Day 6)', en: 'Day 6', shortAr: 'اليوم 6' },
  'Day 7': { ar: 'اليوم 7 (Day 7)', en: 'Day 7', shortAr: 'اليوم 7' }
};

// ==========================================
// 7. HELPER FUNCTIONS (Single Source of Truth)
// ==========================================

/**
 * Returns formatted exercise display name with standardized "Arabic First (English Second)" pattern
 */
export function getExerciseDisplayName(exerciseIdOrName: string, language: Language = 'ar'): string {
  if (!exerciseIdOrName) return '';

  // Direct ID lookup
  if (EXERCISES_DICT[exerciseIdOrName]) {
    return language === 'ar' ? EXERCISES_DICT[exerciseIdOrName].ar : EXERCISES_DICT[exerciseIdOrName].en;
  }

  // Name normalization lookup (slugified or lowercase)
  const normalizedKey = exerciseIdOrName.toLowerCase().replace(/[\s-]+/g, '_');
  if (EXERCISES_DICT[normalizedKey]) {
    return language === 'ar' ? EXERCISES_DICT[normalizedKey].ar : EXERCISES_DICT[normalizedKey].en;
  }

  // Check if raw name matches any exercise English name
  for (const [key, term] of Object.entries(EXERCISES_DICT)) {
    if (term.en.toLowerCase() === exerciseIdOrName.toLowerCase() || term.ar.includes(exerciseIdOrName)) {
      return language === 'ar' ? term.ar : term.en;
    }
  }

  // Fallback: If no match found, format cleanly
  return exerciseIdOrName;
}

/**
 * Returns standardized muscle group name
 */
export function getMuscleGroupDisplayName(muscle: string, language: Language = 'ar'): string {
  const term = MUSCLE_GROUPS_DICT[muscle as MuscleGroup];
  if (term) {
    return language === 'ar' ? term.ar : term.en;
  }
  return muscle;
}

/**
 * Returns standardized equipment name
 */
export function getEquipmentDisplayName(equipment: string, language: Language = 'ar'): string {
  const term = EQUIPMENT_DICT[equipment as Equipment];
  if (term) {
    return language === 'ar' ? term.ar : term.en;
  }
  return equipment;
}

/**
 * Returns standardized fitness goal name
 */
export function getFitnessGoalDisplayName(goal: string, language: Language = 'ar'): string {
  const term = FITNESS_GOALS_DICT[goal as FitnessGoal];
  if (term) {
    return language === 'ar' ? term.ar : term.en;
  }
  return goal;
}

/**
 * Returns standardized day name
 */
export function getDayDisplayName(dayStr: string, language: Language = 'ar'): string {
  const term = DAYS_OF_WEEK_DICT[dayStr];
  if (term) {
    return language === 'ar' ? term.ar : term.en;
  }
  return dayStr;
}

/**
 * Formats units cleanly in Arabic or English
 */
export function formatUnitDisplay(
  value: number | string,
  unitType: 'minutes' | 'days' | 'kg' | 'reps' | 'sets' | 'kcal' | 'km' | 'weeks' | 'hours',
  language: Language = 'ar'
): string {
  const valNum = typeof value === 'number' ? value : parseFloat(value) || 0;

  if (language === 'ar') {
    switch (unitType) {
      case 'minutes':
        return `${valNum} دقيقة`;
      case 'days':
        if (valNum === 1) return 'يوم واحد';
        if (valNum === 2) return 'يومان';
        if (valNum >= 3 && valNum <= 10) return `${valNum} أيام`;
        return `${valNum} يوماً`;
      case 'weeks':
        if (valNum === 1) return 'أسبوع واحد';
        if (valNum === 2) return 'أسبوعان';
        if (valNum >= 3 && valNum <= 10) return `${valNum} أسابيع`;
        return `${valNum} أسبوعاً`;
      case 'kg':
        return `${valNum} كجم`;
      case 'reps':
        if (valNum === 1) return 'عدة واحدة';
        if (valNum === 2) return 'عدتان';
        if (valNum >= 3 && valNum <= 10) return `${valNum} عدات`;
        return `${valNum} عدة`;
      case 'sets':
        if (valNum === 1) return 'جولة واحدة';
        if (valNum === 2) return 'جولتان';
        if (valNum >= 3 && valNum <= 10) return `${valNum} جولات`;
        return `${valNum} جولة`;
      case 'kcal':
        return `${valNum} سعرة حرارية`;
      case 'km':
        return `${valNum} كم`;
      case 'hours':
        if (valNum === 1) return 'ساعة واحدة';
        if (valNum === 2) return 'ساعتان';
        return `${valNum} ساعات`;
      default:
        return `${valNum}`;
    }
  } else {
    switch (unitType) {
      case 'minutes':
        return `${valNum} min`;
      case 'days':
        return `${valNum} ${valNum === 1 ? 'day' : 'days'}`;
      case 'weeks':
        return `${valNum} ${valNum === 1 ? 'week' : 'weeks'}`;
      case 'kg':
        return `${valNum} kg`;
      case 'reps':
        return `${valNum} ${valNum === 1 ? 'rep' : 'reps'}`;
      case 'sets':
        return `${valNum} ${valNum === 1 ? 'set' : 'sets'}`;
      case 'kcal':
        return `${valNum} kcal`;
      case 'km':
        return `${valNum} km`;
      case 'hours':
        return `${valNum} ${valNum === 1 ? 'hour' : 'hours'}`;
      default:
        return `${valNum}`;
    }
  }
}
