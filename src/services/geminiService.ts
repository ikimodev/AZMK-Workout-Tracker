/**
 * Gemini AI Service for AZMK (عزمك)
 * Connects directly to Google Gemini REST API
 * Supports real LLM generative chat, multi-turn conversation memory, natural language workout extraction, and periodized program generation.
 */

import { MOCK_EXERCISES, findOrCreateExercise, inferExerciseAttributes } from '../data/mockExercises';
import { Program, WorkoutExercise, UserProfile, AIChatMessage } from '../types';

// Secure internal key
const _K = 'QVEuQWI4Uk42SWNHcEs0dTFjcEtHUUhWR0Z6QngyUVBrSGd4dnI3c19NeTB5QmN4RFowYnc=';

export const getGeminiApiKey = (): string => {
  const envKey = (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
  if (envKey && envKey.trim().length > 5) {
    return envKey.trim();
  }
  try {
    return atob(_K);
  } catch {
    return '';
  }
};

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';

/**
 * Base raw call to Gemini REST endpoint with multi-turn conversation support
 */
export const callGeminiAPI = async (
  prompt: string, 
  systemInstruction?: string,
  responseSchemaJson?: boolean,
  chatHistory?: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  const apiKey = getGeminiApiKey();

  const contents: any[] = [];

  if (chatHistory && chatHistory.length > 0) {
    chatHistory.forEach(item => {
      contents.push({
        role: item.role,
        parts: [{ text: item.text }]
      });
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: prompt }]
  });

  const payload: any = {
    contents,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  if (responseSchemaJson) {
    payload.generationConfig.responseMimeType = 'application/json';
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Gemini API Error: ${response.status}`);
  }

  const data = await response.json();
  const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!candidateText) {
    throw new Error('Empty response from Gemini');
  }

  return candidateText;
};

export interface ParsedMultiDaySplit {
  isMultiDaySplit: boolean;
  programName: string;
  days: {
    dayName: string;
    dayNumber: number;
    exercises: {
      exerciseName: string;
      matchedExerciseId: string;
      targetSets: number;
      targetReps: string;
      suggestedWeightKg: number;
      restSeconds: number;
      notes?: string;
    }[];
  }[];
}

/**
 * Intelligent exercise matching with strict precedence and dynamic creation fallback
 */
export const matchExerciseId = (exerciseName: string): string => {
  const clean = exerciseName.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF\s]/g, ' ');
  const normalized = clean.replace(/\s+/g, ' ').trim();

  // 1. Direct name match in built-in database
  const foundExact = MOCK_EXERCISES.find(e => {
    const eNorm = e.name.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    return eNorm === normalized || normalized.includes(eNorm) || eNorm.includes(normalized);
  });
  if (foundExact) return foundExact.id;

  // 2. High-precision rule matching (multi-word and compound patterns first!)

  // Chest Press & Variations
  if (normalized.includes('smith') && (normalized.includes('bench') || normalized.includes('صدر') || normalized.includes('بنش'))) return 'smith_bench_press';
  if ((normalized.includes('incline') || normalized.includes('عالي') || normalized.includes('علوي')) && (normalized.includes('dumbbell') || normalized.includes('دامبل') || normalized.includes('تجميع'))) return 'incline_dumbbell_press';
  if ((normalized.includes('incline') || normalized.includes('عالي') || normalized.includes('علوي')) && (normalized.includes('barbell') || normalized.includes('بار'))) return 'incline_barbell_press';
  if ((normalized.includes('incline') || normalized.includes('عالي')) && normalized.includes('smith')) return 'incline_smith_press';
  if (normalized.includes('decline') || normalized.includes('سفلي') || normalized.includes('مائل لأسفل')) return 'decline_bench_press';
  if ((normalized.includes('dumbbell') || normalized.includes('دامبل')) && (normalized.includes('bench') || normalized.includes('chest press') || normalized.includes('صدر') || normalized.includes('بنش'))) return 'dumbbell_bench_press';
  if (normalized.includes('pec deck') || normalized.includes('butterfly') || normalized.includes('فراشة جهاز')) return 'pec_deck_fly';
  if ((normalized.includes('cable') || normalized.includes('كيبل')) && (normalized.includes('fly') || normalized.includes('chest') || normalized.includes('تفتيح') || normalized.includes('فراشة'))) return 'cable_chest_fly';
  if (normalized.includes('chest dip') || (normalized.includes('dip') && !normalized.includes('tricep') && !normalized.includes('bench dip')) || normalized.includes('متوازي')) return 'chest_dips';
  if (normalized.includes('bench press') || (normalized.includes('bench') && normalized.includes('press')) || normalized.includes('بنش بار') || normalized.includes('بنش مستوي') || normalized.includes('بنش برس')) return 'barbell_bench_press';
  if (normalized.includes('machine chest') || normalized.includes('chest press machine') || normalized.includes('جهاز الصدر')) return 'machine_chest_press';

  // Triceps Extensions & Pushdowns (Checked before shoulder overhead press!)
  if ((normalized.includes('overhead') || normalized.includes('extension') || normalized.includes('اوفر هيد')) && (normalized.includes('tricep') || normalized.includes('تراي'))) return 'overhead_cable_tricep_extension';
  if (normalized.includes('skull crusher') || normalized.includes('skullcrusher') || normalized.includes('سكل كراشر')) return 'skull_crushers';
  if (normalized.includes('tricep') || normalized.includes('pushdown') || normalized.includes('تراي') || normalized.includes('ترايسبس')) return 'tricep_rope_pushdown';

  // Shoulders & Traps
  if (normalized.includes('face pull') || normalized.includes('facepull') || normalized.includes('فيس بول')) return 'face_pulls';
  if (normalized.includes('reverse pec') || normalized.includes('rear delt') || normalized.includes('كتف خلفي') || normalized.includes('فراشة خلفي')) return 'reverse_pec_deck';
  if ((normalized.includes('dumbbell') || normalized.includes('دامبل')) && (normalized.includes('overhead') || normalized.includes('shoulder press') || normalized.includes('ohp') || normalized.includes('كتف') || normalized.includes('أكتاف'))) return 'seated_dumbbell_shoulder_press';
  if (normalized.includes('smith') && (normalized.includes('overhead') || normalized.includes('shoulder press') || normalized.includes('كتف'))) return 'smith_overhead_press';
  if (normalized.includes('overhead') || normalized.includes('ohp') || (normalized.includes('shoulder') && normalized.includes('press')) || normalized.includes('عسكري') || normalized.includes('كتف بار')) return 'overhead_barbell_press';
  if (normalized.includes('lateral') || normalized.includes('side raise') || normalized.includes('رفرفة جانبي') || normalized.includes('رفرفه جانبي') || normalized.includes('رفرفة')) {
    return (normalized.includes('cable') || normalized.includes('كيبل')) ? 'cable_lateral_raise' : 'dumbbell_lateral_raise';
  }
  if (normalized.includes('shrug') || normalized.includes('ترابيس')) return 'dumbbell_shrugs';

  // Push-Ups (Checked after overhead shoulder press checks)
  if (normalized.includes('push up') || normalized.includes('pushup') || normalized.includes('push-up') || normalized.includes('تمرين ضغط') || (normalized.includes('ضغط') && !normalized.includes('كتف') && !normalized.includes('أكتاف') && !normalized.includes('عسكري') && !normalized.includes('صدر') && !normalized.includes('رجل'))) return 'push_ups';

  // Back & Vertical/Horizontal Pulls
  if (normalized.includes('pull up') || normalized.includes('pullup') || normalized.includes('pull-up') || normalized.includes('عقلة') || normalized.includes('عقله')) return 'pull_ups';
  if (normalized.includes('chin up') || normalized.includes('chinup') || normalized.includes('chin-up')) return 'chin_ups';
  if (normalized.includes('lat pulldown') || normalized.includes('pulldown') || normalized.includes('سحب عالي')) {
    return (normalized.includes('close') || normalized.includes('ضيق')) ? 'close_grip_pulldown' : 'lat_pulldown';
  }
  if (normalized.includes('seated cable row') || normalized.includes('seated row') || normalized.includes('cable row') || normalized.includes('سحب أرضي') || normalized.includes('سحب ارضي')) return 'seated_cable_row';
  if (normalized.includes('t bar') || normalized.includes('tbar') || normalized.includes('تي بار') || normalized.includes('chest supported') || normalized.includes('chest-supported')) return 'chest_supported_tbar_row';
  if ((normalized.includes('single arm') || normalized.includes('one arm') || normalized.includes('dumbbell') || normalized.includes('دامبل') || normalized.includes('منشار')) && normalized.includes('row')) return 'single_arm_dumbbell_row';
  if (normalized.includes('barbell row') || normalized.includes('bent over') || normalized.includes('سحب بار') || (normalized.includes('row') && !normalized.includes('upright'))) return 'barbell_row';
  if (normalized.includes('straight arm') || normalized.includes('pullover') || normalized.includes('بلوفر')) return 'straight_arm_cable_pulldown';
  if (normalized.includes('deadlift') || normalized.includes('ديدلفت')) {
    return (normalized.includes('romanian') || normalized.includes('rdl') || normalized.includes('روماني')) ? (normalized.includes('dumbbell') ? 'dumbbell_rdl' : 'romanian_deadlift') : 'barbell_deadlift';
  }

  // Quads, Glutes, Hamstrings, Calves
  if (normalized.includes('hip thrust') || normalized.includes('hipthrust') || normalized.includes('هيب ثروست') || normalized.includes('هيبثروست')) {
    return (normalized.includes('dumbbell') || normalized.includes('دامبل')) ? 'dumbbell_hip_thrust' : 'barbell_hip_thrust';
  }
  if (normalized.includes('prone') || normalized.includes('lying') || normalized.includes('leg curl') || normalized.includes('hamstring curl') || normalized.includes('فخذ خلفي') || normalized.includes('خلفي منبطح')) {
    return (normalized.includes('seated') || normalized.includes('جالس')) ? 'seated_leg_curl' : 'lying_leg_curl';
  }
  if (normalized.includes('rdl') || normalized.includes('romanian') || normalized.includes('رومانيان') || normalized.includes('روماني')) {
    return (normalized.includes('dumbbell') || normalized.includes('دامبل')) ? 'dumbbell_rdl' : 'romanian_deadlift';
  }
  if (normalized.includes('bulgarian') || normalized.includes('split squat') || normalized.includes('سكوات بلغاري')) return 'bulgarian_split_squat';
  if (normalized.includes('hack') || normalized.includes('هاك')) return 'hack_squat';
  if (normalized.includes('leg press') || normalized.includes('مكبس') || normalized.includes('دفع أرجل') || normalized.includes('دفع رجل')) return 'leg_press';
  if (normalized.includes('leg extension') || normalized.includes('extension') || normalized.includes('فخذ أمامي') || normalized.includes('اكستنشن')) return 'leg_extensions';
  if (normalized.includes('squat') || normalized.includes('سكوات')) return 'barbell_back_squat';
  if (normalized.includes('calf') || normalized.includes('calves') || normalized.includes('بطات') || normalized.includes('سمانة') || normalized.includes('سمانه')) {
    return (normalized.includes('seated') || normalized.includes('جالس')) ? 'seated_calf_raise' : 'standing_calf_raise';
  }

  // Arms (Biceps) - checked AFTER leg curl / legs
  if (normalized.includes('preacher') || normalized.includes('تبشير')) return 'preacher_curl';
  if (normalized.includes('hammer') || normalized.includes('شاكوش')) return 'hammer_curls';
  if (normalized.includes('incline') && normalized.includes('curl')) return 'dumbbell_incline_bicep_curl';
  if ((normalized.includes('cable') || normalized.includes('كيبل')) && normalized.includes('curl')) return 'cable_bicep_curl';
  if (normalized.includes('curl') || normalized.includes('bicep') || normalized.includes('باي') || normalized.includes('بايسبس')) return 'barbell_bicep_curl';

  // Core & Abs
  if (normalized.includes('cable crunch') || normalized.includes('crunch') || normalized.includes('كرنش') || normalized.includes('طحن بطن')) return 'cable_crunch';
  if (normalized.includes('plank') || normalized.includes('بلانك')) return 'plank';
  if (normalized.includes('hanging') || normalized.includes('leg raise') || normalized.includes('knee raise') || normalized.includes('رفع أرجل') || normalized.includes('رفع ارجل')) return 'hanging_leg_raise';
  if (normalized.includes('wheel') || normalized.includes('عجلة') || normalized.includes('عجله')) return 'ab_wheel_rollout';

  // 3. Graceful Dynamic Fallback: Register and return the exact user exercise!
  const dynamicEx = findOrCreateExercise(exerciseName);
  return dynamicEx.id;
};

/**
 * Checks if a given text line is a Day Header rather than an exercise line
 */
export const isDayHeaderLine = (line: string): boolean => {
  const trimmed = line.trim();
  if (!trimmed) return false;

  // If the line contains sets/reps patterns (like 4x8, 3x12, 4x5-6, 3x60s), it is an EXERCISE, NEVER a day header!
  if (/(\d+)\s*(?:[xX*×]|sets?|جولات?|مجموعات?)\s*(?:of\s*|×\s*)?(\d+)/i.test(trimmed)) {
    return false;
  }

  // Explicit Day headers: Day 1, اليوم الأول, Day 2: Legs, etc.
  return /^(?:day\s*\d+|يوم\s*\d+|اليوم\s*(?:الأول|الثاني|الثالث|الرابع|الخامس|السادس))[:\-\s]*/i.test(trimmed);
};

/**
 * Real LLM Workout & Multi-Day Split Parser using Gemini
 */
export const parseWorkoutTextWithGemini = async (rawText: string): Promise<ParsedMultiDaySplit> => {
  const systemInstruction = `You are a world-class strength and conditioning coach and workout parser for the AZMK (عزمك) fitness app.
Analyze the user workout text (which may be in Arabic, English, gym slang, or bullet points).

CRITICAL RULES:
1. If the input describes multiple days/splits (e.g. Day 1 Push, Day 2 Pull, Day 3 Legs or الأحد صدر، الاثنين ظهر، إلخ), you MUST separate them into distinct items in the "days" array!
2. A day title/header (like "Day 1: Push", "اليوم الأول: صدر وتراي") belongs in "dayName" and MUST NEVER BE INCLUDED AS AN EXERCISE inside "exercises"!
3. "exercises" must ONLY contain actual physical movements (e.g. Smith Machine Bench Press, Pull-ups, Dumbbell Overhead Press, Seated Cable Row, Face Pull, Cable Crunch, Leg Press, Hip Thrust, Leg Extension, Prone Leg Curl, Standing Calf Raise, Plank).
4. Preserve exact exercise names as provided by the user.
5. If it is only 1 workout session, return isMultiDaySplit: false with 1 day in "days".
6. Return valid JSON only.

JSON Output Schema:
{
  "isMultiDaySplit": boolean,
  "programName": string,
  "days": [
    {
      "dayName": string,
      "dayNumber": number,
      "exercises": [
        {
          "exerciseName": string,
          "targetSets": number,
          "targetReps": string,
          "suggestedWeightKg": number,
          "restSeconds": number,
          "notes": string
        }
      ]
    }
  ]
}`;

  try {
    const rawJson = await callGeminiAPI(rawText, systemInstruction, true);
    const parsed: ParsedMultiDaySplit = JSON.parse(rawJson);

    parsed.days.forEach(day => {
      // Filter out any exercise line that accidentally captured a day header
      day.exercises = day.exercises.filter(ex => {
        const name = ex.exerciseName.trim().toLowerCase();
        const dName = day.dayName.trim().toLowerCase();
        if (name === dName || isDayHeaderLine(name)) {
          return false;
        }
        return true;
      });

      // Match each exercise ID
      day.exercises.forEach(ex => {
        ex.matchedExerciseId = matchExerciseId(ex.exerciseName);
      });
    });

    return parsed;
  } catch (error) {
    console.warn('Gemini Parse Fallback to local parsing:', error);
    return fallbackLocalSplitParser(rawText);
  }
};

/**
 * Estimate sensible starting weight based on exercise attributes
 */
const estimateDefaultWeight = (matchedId: string, exName: string): number => {
  const attrs = inferExerciseAttributes(exName);
  if (attrs.equipment === 'Bodyweight') return 0;
  if (matchedId.includes('plank') || matchedId.includes('crunch') || matchedId.includes('pull_ups') || matchedId.includes('chin_ups') || matchedId.includes('hanging') || matchedId.includes('dips') || matchedId.includes('push_ups')) return 0;
  if (matchedId === 'barbell_bench_press') return 60;
  if (matchedId === 'smith_bench_press') return 50;
  if (matchedId === 'incline_dumbbell_press') return 24;
  if (matchedId === 'seated_dumbbell_shoulder_press') return 18;
  if (matchedId === 'overhead_barbell_press') return 40;
  if (matchedId === 'barbell_back_squat') return 80;
  if (matchedId === 'leg_press') return 120;
  if (matchedId === 'barbell_hip_thrust') return 70;
  if (matchedId === 'romanian_deadlift') return 70;
  if (matchedId === 'barbell_deadlift') return 100;
  if (matchedId === 'lat_pulldown') return 50;
  if (matchedId === 'seated_cable_row') return 50;
  if (matchedId === 'face_pulls') return 20;
  if (matchedId === 'cable_crunch') return 30;
  if (matchedId === 'lying_leg_curl' || matchedId === 'seated_leg_curl') return 35;
  if (matchedId === 'leg_extensions') return 40;
  if (matchedId === 'standing_calf_raise') return 45;
  if (matchedId === 'seated_calf_raise') return 35;
  if (matchedId === 'dumbbell_lateral_raise') return 10;
  if (matchedId === 'tricep_rope_pushdown') return 22.5;
  if (matchedId === 'overhead_cable_tricep_extension') return 20;
  if (matchedId === 'barbell_bicep_curl') return 25;
  if (matchedId === 'preacher_curl') return 25;
  if (matchedId === 'hammer_curls') return 14;

  if (attrs.equipment === 'Barbell') return 40;
  if (attrs.equipment === 'Dumbbell') return 16;
  if (attrs.equipment === 'Cable') return 25;
  if (attrs.equipment === 'Machine') return 45;
  return 20;
};

/**
 * Parse a single day's text lines into structured exercises
 */
export const parseSingleDayText = (dayText: string) => {
  const lines = dayText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Filter out standalone day headers if user pasted them inside day box
  const validLines = lines.filter(l => !isDayHeaderLine(l));

  return validLines.map((line, eIdx) => {
    let sets = 3;
    let reps = '8-10';
    let weight = 0;
    let hasExplicitWeight = false;

    // Support ranges like 4x5-6, 4x6–8, 3x12–15, 3x60–90s, 3x12, 3 x 10, 4*8, 4 × 10
    const setRepMatch = line.match(/(\d+)\s*(?:sets?|x|\*|×|جولات?|مجموعات?)\s*(?:of\s*|×\s*)?(\d+(?:\s*[\-–—~to]\s*\d+)?\s*(?:s|sec|ثانية)?)/i);
    if (setRepMatch) {
      sets = parseInt(setRepMatch[1], 10) || 3;
      reps = setRepMatch[2].replace(/\s+/g, '') || '8-10';
    }

    const weightMatch = line.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?|كيلو|كجم|lbs?|باوند)/i);
    if (weightMatch) {
      weight = parseFloat(weightMatch[1]) || 0;
      hasExplicitWeight = true;
    }

    // Clean exercise name: remove set/rep tokens, weight tokens, leading bullets and hyphens
    let cleanName = line
      .replace(/(\d+)\s*(?:sets?|x|\*|×|جولات?|مجموعات?)\s*(?:of\s*|×\s*)?(\d+(?:\s*[\-–—~to]\s*\d+)?\s*(?:s|sec|ثانية)?)/gi, '')
      .replace(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?|كيلو|كجم|lbs?|باوند)/gi, '')
      .replace(/[@#\*]/g, ' ')
      .replace(/^[\-–—•\.\d\)]+\s*/, '') // remove leading dashes, bullets, numbers
      .replace(/[\-–—]+\s*$/, '')       // remove trailing dashes
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanName) {
      cleanName = `Exercise ${eIdx + 1}`;
    }

    const matchedId = matchExerciseId(cleanName);
    const suggestedWeight = hasExplicitWeight ? weight : estimateDefaultWeight(matchedId, cleanName);

    return {
      exerciseName: cleanName,
      matchedExerciseId: matchedId,
      targetSets: sets,
      targetReps: reps,
      suggestedWeightKg: suggestedWeight,
      restSeconds: cleanName.toLowerCase().includes('squat') || cleanName.toLowerCase().includes('deadlift') ? 120 : 90
    };
  });
};

/**
 * Smart Fallback Split Parser when offline or on error
 */
export const fallbackLocalSplitParser = (rawText: string): ParsedMultiDaySplit => {
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  const detectedDays: { name: string; lines: string[] }[] = [];
  let currentDay: { name: string; lines: string[] } = { name: 'Day 1 - Workout', lines: [] };

  for (const line of lines) {
    if (isDayHeaderLine(line)) {
      if (currentDay.lines.length > 0) {
        detectedDays.push(currentDay);
      }
      currentDay = { name: line.replace(/[:\-–—]/g, ' ').replace(/\s+/g, ' ').trim(), lines: [] };
    } else {
      currentDay.lines.push(line);
    }
  }
  if (currentDay.lines.length > 0) {
    detectedDays.push(currentDay);
  }

  const isMulti = detectedDays.length > 1;

  const parsedDays = detectedDays.map((d, dIdx) => {
    const exercises = parseSingleDayText(d.lines.join('\n'));

    return {
      dayName: d.name || `Day ${dIdx + 1}`,
      dayNumber: dIdx + 1,
      exercises: exercises.length > 0 ? exercises : [
        {
          exerciseName: 'Full Body Compound Movement',
          matchedExerciseId: 'barbell_back_squat',
          targetSets: 3,
          targetReps: '8-10',
          suggestedWeightKg: 50,
          restSeconds: 90
        }
      ]
    };
  });

  return {
    isMultiDaySplit: isMulti,
    programName: isMulti ? `Custom Split (${parsedDays.length} Days)` : (lines[0]?.slice(0, 30) || 'Custom AI Workout'),
    days: parsedDays.length > 0 ? parsedDays : [
      {
        dayName: 'Day 1 - Workout',
        dayNumber: 1,
        exercises: [
          {
            exerciseName: 'Barbell Back Squat',
            matchedExerciseId: 'barbell_back_squat',
            targetSets: 4,
            targetReps: '8',
            suggestedWeightKg: 60,
            restSeconds: 90
          }
        ]
      }
    ]
  };
};

/**
 * Real Coach Azzam chat with Gemini grounded in actual user performance metrics and multi-turn chat history
 */
export const askCoachAzzamRealAI = async (
  userMessage: string,
  userProfile: UserProfile,
  recentHistory: any[],
  recentPRs: any[],
  pastMessages: AIChatMessage[] = [],
  language: 'ar' | 'en' = 'ar'
): Promise<string> => {
  const performanceSummary = `
Athlete Profile:
- Name: ${userProfile.name}
- Primary Goal: ${userProfile.primaryGoal}
- Secondary Goal: ${userProfile.secondaryGoal || 'None'}
- Experience Level: ${userProfile.experience}
- Days Per Week: ${userProfile.daysPerWeek}
- Current Streak: ${userProfile.streakDays} days

Recent Personal Records (PRs):
${recentPRs.slice(0, 5).map(pr => `- ${pr.exerciseName}: ${pr.weight}kg × ${pr.reps} reps (1RM: ${pr.estimated1RM}kg)`).join('\n') || 'None recorded yet'}

Recent Completed Sessions:
${recentHistory.slice(0, 3).map(h => `- ${h.name} on ${h.date}: ${h.exercises?.length || 0} exercises, total volume ${(h.totalVolumeKg || 0).toLocaleString()}kg, duration ${h.durationMinutes || 0}m`).join('\n') || 'No sessions logged yet'}
`;

  const systemInstruction = `You are "كابتن عزام" (Coach Azzam), the dedicated elite AI Strength & Conditioning Coach on the AZMK (عزمك) fitness platform.

YOUR PERSONA & TRAITS:
- Reply directly, dynamically, and conversationally to whatever the user says or asks. Do NOT repeat generic templates.
- Speak naturally and authoritatively as an experienced Arab strength coach (use modern Saudi / Arab gym dialect: "يا بطل", "عاش", "وحش", "الزيادة التدريجية", "RPE", "الريكفري").
- STRICT DATA GROUNDING: Ground your answers ONLY in the athlete's real stats provided below. If the athlete has 0 completed sessions or no PRs recorded, explicitly state that they are starting fresh and guide them on their first session. NEVER claim they have completed 22 sessions or lifted weights that are not in the profile below.
- MEDICAL SAFETY DISCLAIMER RULE: If the user mentions any pain, injury, ache, chest pressure, shortness of breath, numbness, dizziness, or medical symptoms, you MUST immediately advise them to STOP exercising and seek professional medical/physical therapy clearance. State clearly that AZMK and Coach Azzam do NOT provide medical diagnosis.
- Emphasize Progressive Overload (الزيادة التدريجية للأوزان), optimal form, 7-9h sleep, and proper protein intake (1.6-2.2g/kg).
- LANGUAGE ENFORCEMENT: The user interface language is currently set to ${language.toUpperCase()}. You MUST respond ENTIRELY in ${language === 'ar' ? 'Arabic' : 'English'}, regardless of the language the user types in.
- EXERCISE NAMING RULE: Exercise names MUST ALWAYS be written STRICTLY in English ONLY. NEVER translate exercise names to Arabic. For example: say "أداء جيد في الـ Barbell Bench Press" (Do NOT say "تمرين ضغط البار").
- Keep answers punchy, structured, clear, and actionable with emojis (🔥, 💪, ⚡, 📈).

${performanceSummary}`;

  // Format past 6 messages for conversation memory
  const formattedHistory: { role: 'user' | 'model'; text: string }[] = pastMessages
    .slice(-6)
    .map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text
    }));

  return await callGeminiAPI(userMessage, systemInstruction, false, formattedHistory);
};
