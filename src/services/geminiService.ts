/**
 * Gemini AI Service for AZMK (عزمك)
 * Connects directly to Google Gemini 1.5 Flash / 2.0 Flash REST API
 * Supports real LLM generative chat, natural language workout extraction, and periodized program generation.
 */

import { MOCK_EXERCISES } from '../data/mockExercises';
import { Program, ProgramWorkout, WorkoutExercise, UserProfile } from '../types';

export const getGeminiApiKey = (): string => {
  const customKey = localStorage.getItem('azmk_gemini_api_key');
  if (customKey && customKey.trim().length > 10) {
    return customKey.trim();
  }
  return (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
};

export const setGeminiApiKey = (key: string) => {
  localStorage.setItem('azmk_gemini_api_key', key.trim());
};

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Base raw call to Gemini REST endpoint
 */
export const callGeminiAPI = async (
  prompt: string, 
  systemInstruction?: string,
  responseSchemaJson?: boolean
): Promise<string> => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const payload: any = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.4,
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
    dayName: string; // e.g. "Day 1: Push (Chest, Shoulders, Triceps)"
    dayNumber: number;
    exercises: {
      exerciseName: string;
      matchedExerciseId: string;
      targetSets: number;
      targetReps: string; // e.g. "8-10" or "8"
      suggestedWeightKg: number;
      restSeconds: number;
      notes?: string;
    }[];
  }[];
}

/**
 * Match exercise name to mock exercise database id
 */
export const matchExerciseId = (exerciseName: string): string => {
  const clean = exerciseName.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const found = MOCK_EXERCISES.find(e => 
    clean.includes(e.name.toLowerCase()) || e.name.toLowerCase().includes(clean)
  );
  if (found) return found.id;

  if (clean.includes('incline') && clean.includes('dumbbell')) return 'incline_dumbbell_press';
  if (clean.includes('incline') && clean.includes('barbell')) return 'incline_barbell_press';
  if (clean.includes('bench')) return 'barbell_bench_press';
  if (clean.includes('squat')) return 'barbell_back_squat';
  if (clean.includes('deadlift') && !clean.includes('romanian')) return 'barbell_deadlift';
  if (clean.includes('rdl') || clean.includes('romanian')) return 'romanian_deadlift';
  if (clean.includes('shoulder') || clean.includes('ohp') || clean.includes('overhead')) return 'overhead_barbell_press';
  if (clean.includes('lateral') || clean.includes('side raise')) return 'dumbbell_lateral_raise';
  if (clean.includes('lat pulldown') || clean.includes('pulldown')) return 'lat_pulldown';
  if (clean.includes('pull up') || clean.includes('pullup')) return 'pull_ups';
  if (clean.includes('row')) return 'barbell_row';
  if (clean.includes('curl')) return 'barbell_bicep_curl';
  if (clean.includes('tricep') || clean.includes('pushdown')) return 'tricep_rope_pushdown';
  if (clean.includes('leg press')) return 'leg_press';
  if (clean.includes('leg extension')) return 'leg_extensions';
  if (clean.includes('leg curl') || clean.includes('hamstring')) return 'lying_leg_curls';

  return 'barbell_bench_press';
};

/**
 * Real LLM Workout & Multi-Day Split Parser using Gemini
 */
export const parseWorkoutTextWithGemini = async (rawText: string): Promise<ParsedMultiDaySplit> => {
  const systemInstruction = `You are a world-class strength and conditioning coach and parsing assistant for the workout tracking app AZMK (عزمك).
Your task is to analyze user-provided workout text (in Arabic or English, slang, or bullet points) and parse it into a structured JSON schema.

CRITICAL INSTRUCTIONS:
1. If the user input contains multiple days (e.g., "Day 1 Push, Day 2 Pull, Day 3 Legs" or "الأحد صدر، الاثنين ظهر، الأربعاء أرجل" or "5 day split: ..."), you MUST separate them into distinct days inside the "days" array! DO NOT put all exercises into a single day.
2. If it is only a single workout session (e.g. "Bench 80kg 4x8, Triceps 3x12"), return "isMultiDaySplit": false with 1 day in the "days" array.
3. For each exercise:
   - Provide "exerciseName" (standard clear English or Arabic name).
   - "targetSets" (number of sets, default 3 or 4 if unspecified).
   - "targetReps" (string representation, e.g. "8-10", "12", "5").
   - "suggestedWeightKg" (number in kg, e.g. 60, 80, 20. If not specified, estimate reasonable weight for compound/isolation).
   - "restSeconds" (number, default 90 for compounds, 60 for accessories).
   - "notes" (brief technical tip or blank).

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

    // Populate matchedExerciseId for every exercise
    parsed.days.forEach(day => {
      day.exercises.forEach(ex => {
        ex.matchedExerciseId = matchExerciseId(ex.exerciseName);
      });
    });

    return parsed;
  } catch (error) {
    console.warn('Gemini Parse Error or No Key, using local parser:', error);
    return fallbackLocalSplitParser(rawText);
  }
};

/**
 * Smart Fallback Split Parser when offline or no API Key
 */
export const fallbackLocalSplitParser = (rawText: string): ParsedMultiDaySplit => {
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  // Detect if text contains day markers
  const dayHeaderRegex = /^(day\s*\d+|يوم\s*\d+|اليوم\s*(الأول|الثاني|الثالث|الرابع|الخامس|السادس)|\bpush\b|\bpull\b|\blegs\b|\bupper\b|\blower\b|صدر|ظهر|أرجل|اكتاف)/i;
  
  const detectedDays: { name: string; lines: string[] }[] = [];
  let currentDay: { name: string; lines: string[] } = { name: 'Day 1: Workout', lines: [] };

  for (const line of lines) {
    if (dayHeaderRegex.test(line) && line.length < 50) {
      if (currentDay.lines.length > 0) {
        detectedDays.push(currentDay);
      }
      currentDay = { name: line.replace(/[:\-]/g, '').trim(), lines: [] };
    } else {
      currentDay.lines.push(line);
    }
  }
  if (currentDay.lines.length > 0) {
    detectedDays.push(currentDay);
  }

  const isMulti = detectedDays.length > 1;

  const parsedDays = detectedDays.map((d, dIdx) => {
    const exercises = d.lines.map((line, eIdx) => {
      let sets = 3;
      let reps = '8-10';
      let weight = 40;

      const setRepMatch = line.match(/(\d+)\s*(?:sets?|x|\*)\s*(?:of\s*)?(\d+(?:-\d+)?)/i);
      if (setRepMatch) {
        sets = parseInt(setRepMatch[1], 10) || 3;
        reps = setRepMatch[2] || '8-10';
      }

      const weightMatch = line.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?|كيلو)/i);
      if (weightMatch) {
        weight = parseFloat(weightMatch[1]) || 40;
      }

      const cleanName = line
        .replace(/(\d+)\s*(?:sets?|x|\*)\s*(?:of\s*)?(\d+(?:-\d+)?)/gi, '')
        .replace(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?|كيلو)/gi, '')
        .replace(/[@#\-\:]/g, '')
        .trim() || `Exercise ${eIdx + 1}`;

      const matchedId = matchExerciseId(cleanName);

      return {
        exerciseName: cleanName,
        matchedExerciseId: matchedId,
        targetSets: sets,
        targetReps: reps,
        suggestedWeightKg: weight,
        restSeconds: 90
      };
    });

    return {
      dayName: d.name,
      dayNumber: dIdx + 1,
      exercises: exercises.length > 0 ? exercises : [
        {
          exerciseName: 'Barbell Bench Press',
          matchedExerciseId: 'barbell_bench_press',
          targetSets: 4,
          targetReps: '8',
          suggestedWeightKg: 60,
          restSeconds: 90
        }
      ]
    };
  });

  return {
    isMultiDaySplit: isMulti,
    programName: isMulti ? 'Custom AI Multi-Day Split' : (lines[0]?.slice(0, 30) || 'Custom AI Workout'),
    days: parsedDays.length > 0 ? parsedDays : [
      {
        dayName: 'Day 1: Full Workout',
        dayNumber: 1,
        exercises: [
          {
            exerciseName: 'Barbell Bench Press',
            matchedExerciseId: 'barbell_bench_press',
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
 * Real Coach Azzam chat with Gemini grounded in actual user performance metrics
 */
export const askCoachAzzamRealAI = async (
  userMessage: string,
  userProfile: UserProfile,
  recentHistory: any[],
  recentPRs: any[],
  language: 'ar' | 'en'
): Promise<string> => {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

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
- Speak naturally and authoritatively as an experienced Arabic strength coach (use modern Saudi / Arab gym dialect: "يا بطل", "عاش", "وحش", "الزيادة التدريجية", "RPE", "الريكفري").
- Ground your answers in the athlete's real stats provided below. Mention their actual logged lifts, weights, or streak when relevant.
- Emphasize Progressive Overload (الزيادة التدريجية للأوزان), optimal form, 7-9h sleep, and proper protein intake (1.6-2.2g/kg).
- Keep answers punchy, structured, clear, and actionable with emojis (🔥, 💪, ⚡, 📈).
- If the user asks in English, respond in English with the same encouraging coach energy.

${performanceSummary}`;

  return await callGeminiAPI(userMessage, systemInstruction, false);
};
