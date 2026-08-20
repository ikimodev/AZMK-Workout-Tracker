/**
 * Gemini AI Service for AZMK (عزمك)
 * Connects directly to Google Gemini 1.5 Flash / 2.0 Flash REST API
 * Supports real LLM generative chat, multi-turn conversation memory, natural language workout extraction, and periodized program generation.
 */

import { MOCK_EXERCISES } from '../data/mockExercises';
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
  const systemInstruction = `You are a world-class strength and conditioning coach and workout parser for the AZMK (عزمك) fitness app.
Analyze the user workout text (which may be in Arabic, English, gym slang, or bullet points).

CRITICAL RULES:
1. If the input describes multiple days/splits (e.g. Day 1 Push, Day 2 Pull, Day 3 Legs or الأحد صدر، الاثنين ظهر، إلخ), you MUST separate them into distinct items in the "days" array!
2. A day title/header (like "Day 1: Push", "اليوم الأول: صدر وتراي") belongs in "dayName" and MUST NEVER BE INCLUDED AS AN EXERCISE inside "exercises"!
3. "exercises" must ONLY contain actual physical weightlifting movements (e.g. Bench Press, Squats, Rows, Curls).
4. If it is only 1 workout session, return isMultiDaySplit: false with 1 day in "days".
5. Return valid JSON only.

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

    // Filter out any exercise that looks like a day header
    const headerRegex = /^(day\s*\d+|يوم\s*\d+|اليوم\s*(الأول|الثاني|الثالث|الرابع|الخامس|السادس)|\bpush\b|\bpull\b|\blegs\b|\bupper\b|\blower\b|صدر|ظهر|أرجل|اكتاف)/i;

    parsed.days.forEach(day => {
      day.exercises = day.exercises.filter(ex => {
        const name = ex.exerciseName.trim().toLowerCase();
        const dName = day.dayName.trim().toLowerCase();
        if (name === dName || (headerRegex.test(name) && name.length < 30)) {
          return false;
        }
        return true;
      });

      day.exercises.forEach(ex => {
        ex.matchedExerciseId = matchExerciseId(ex.exerciseName);
      });
    });

    return parsed;
  } catch (error) {
    console.warn('Gemini Parse Fallback:', error);
    return fallbackLocalSplitParser(rawText);
  }
};

/**
 * Parse a single day's text lines into structured exercises
 */
export const parseSingleDayText = (dayText: string) => {
  const lines = dayText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const dayHeaderRegex = /^(day\s*\d+|يوم\s*\d+|اليوم\s*(الأول|الثاني|الثالث|الرابع|الخامس|السادس)|\bpush\b|\bpull\b|\blegs\b|\bupper\b|\blower\b|صدر|ظهر|أرجل|اكتاف)/i;

  const validLines = lines.filter(l => !dayHeaderRegex.test(l) || l.length > 35);

  return validLines.map((line, eIdx) => {
    let sets = 3;
    let reps = '8-10';
    let weight = 40;

    const setRepMatch = line.match(/(\d+)\s*(?:sets?|x|\*|جولات?|مجموعات?)\s*(?:of\s*|×\s*)?(\d+(?:-\d+)?)/i);
    if (setRepMatch) {
      sets = parseInt(setRepMatch[1], 10) || 3;
      reps = setRepMatch[2] || '8-10';
    }

    const weightMatch = line.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?|كيلو|كجم)/i);
    if (weightMatch) {
      weight = parseFloat(weightMatch[1]) || 40;
    }

    const cleanName = line
      .replace(/(\d+)\s*(?:sets?|x|\*|جولات?|مجموعات?)\s*(?:of\s*|×\s*)?(\d+(?:-\d+)?)/gi, '')
      .replace(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?|كيلو|كجم)/gi, '')
      .replace(/[@#\-\:\*\.]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() || `Exercise ${eIdx + 1}`;

    return {
      exerciseName: cleanName,
      matchedExerciseId: matchExerciseId(cleanName),
      targetSets: sets,
      targetReps: reps,
      suggestedWeightKg: weight,
      restSeconds: 90
    };
  });
};

/**
 * Smart Fallback Split Parser when offline or on error
 */
export const fallbackLocalSplitParser = (rawText: string): ParsedMultiDaySplit => {
  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
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
- Speak naturally and authoritatively as an experienced Arabic strength coach (use modern Saudi / Arab gym dialect: "يا بطل", "عاش", "وحش", "الزيادة التدريجية", "RPE", "الريكفري").
- Ground your answers in the athlete's real stats provided below. Mention their actual logged lifts, weights, or streak when relevant.
- Emphasize Progressive Overload (الزيادة التدريجية للأوزان), optimal form, 7-9h sleep, and proper protein intake (1.6-2.2g/kg).
- Keep answers punchy, structured, clear, and actionable with emojis (🔥, 💪, ⚡, 📈).
- If the user asks in English, respond in English with the same encouraging coach energy.

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
