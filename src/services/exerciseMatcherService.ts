import { Exercise } from '../types';
import { getAllExercises } from '../data/mockExercises';
import stringSimilarity from 'string-similarity';

export interface MatcherCandidate {
  exercise: Exercise;
  score: number;
  isExactMatch: boolean;
  matchReasons: string[];
}

export interface MatchResult {
  matchedExerciseId: string | null;
  candidates: MatcherCandidate[];
  confidence: number; // 0.0 to 1.0
  ambiguous: boolean;
}

/**
 * Clean and normalize text for deterministic matching
 */
export const normalizeExerciseText = (text: string): string => {
  let clean = text.toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Normalize common abbreviations and typos
  clean = clean.replace(/\bdb\b/g, 'dumbbell')
               .replace(/dumbel|dumbell/g, 'dumbbell')
               .replace(/latral/g, 'lateral')
               .replace(/\bbb\b/g, 'barbell')
               .replace(/\bohp\b/g, 'shoulder press')
               .replace(/\boverhead press\b/g, 'shoulder press')
               .replace(/\blat raises?\b/g, 'lateral raise')
               .replace(/\bside raises?\b/g, 'lateral raise')
               .replace(/\bpec dec\b/g, 'pec deck')
               .replace(/\bpush-up\b/g, 'push up')
               .replace(/\bpushup\b/g, 'push up')
               .replace(/\bpullups\b/g, 'pull up')
               .replace(/\bpull-up\b/g, 'pull up')
               .replace(/\bbench\b/g, 'bench press')
               .replace(/\bcurls\b/g, 'curl')
               .replace(/\brows\b/g, 'row')
               .replace(/\bextensions\b/g, 'extension')
               .replace(/\braises\b/g, 'raise')
               .replace(/\biso-lateral\b/g, 'leverage')
               .replace(/\bisolateral\b/g, 'leverage')
               .replace(/\bprone\b/g, 'lying');
  return clean;
};

/**
 * Determine if text implies an attribute to avoid false generalizations
 */
const detectExplicitAttributes = (normalizedText: string) => {
  const isDumbbell = normalizedText.includes('dumbbell') || normalizedText.includes('دامبل');
  const isBarbell = normalizedText.includes('barbell') || normalizedText.includes('بار') && !normalizedText.includes('t bar');
  const isCable = normalizedText.includes('cable') || normalizedText.includes('كيبل');
  const isMachine = normalizedText.includes('machine') || normalizedText.includes('جهاز') || normalizedText.includes('مكينة');
  const isSmith = normalizedText.includes('smith') || normalizedText.includes('سميث');

  const isLying = normalizedText.includes('lying') || normalizedText.includes('مستلقي') || normalizedText.includes('bench press') || normalizedText.includes('بنش');
  const isSeated = normalizedText.includes('seated') || normalizedText.includes('جالس');
  const isStanding = normalizedText.includes('standing') || normalizedText.includes('واقف');
  
  const isIncline = normalizedText.includes('incline') || normalizedText.includes('عالي') || normalizedText.includes('علوي');
  const isDecline = normalizedText.includes('decline') || normalizedText.includes('سفلي');

  return { isDumbbell, isBarbell, isCable, isMachine, isSmith, isLying, isSeated, isStanding, isIncline, isDecline };
};

/**
 * Scores an exercise based on matching criteria
 */
const scoreCandidate = (normalizedInput: string, exercise: Exercise, attributes: ReturnType<typeof detectExplicitAttributes>): MatcherCandidate => {
  let score = 0;
  const matchReasons: string[] = [];
  const normalizedName = normalizeExerciseText(exercise.name);
  let isExactMatch = false;

  // 1. EXACT NAME MATCH
  if (normalizedInput === normalizedName) {
    score += 100;
    isExactMatch = true;
    matchReasons.push("Exact canonical name");
  } else if (normalizedInput.includes(normalizedName) || normalizedName.includes(normalizedInput)) {
    score += 60;
    matchReasons.push("Partial name match");
  }

  // 2. ALIAS MATCH
  if (exercise.aliases) {
    let bestAliasScore = 0;
    for (const alias of exercise.aliases) {
      const normalizedAlias = normalizeExerciseText(alias);
      if (normalizedInput === normalizedAlias) {
        bestAliasScore = 95;
        isExactMatch = true;
        matchReasons.push("Exact alias match");
        break;
      } else if (normalizedInput.includes(normalizedAlias) || normalizedAlias.includes(normalizedInput)) {
        if (50 > bestAliasScore) bestAliasScore = 50;
      }
    }
    if (bestAliasScore === 50) {
      matchReasons.push("Partial alias match");
    }
    score += bestAliasScore;
  }

  if (score === 0) {
    // Check tokens
    const inputTokens = normalizedInput.split(' ').filter(t => t.length > 2);
    let matchedTokens = 0;
    inputTokens.forEach(t => {
      if (normalizedName.includes(t)) matchedTokens++;
      if (exercise.aliases?.some(a => normalizeExerciseText(a).includes(t))) matchedTokens++;
    });
    
    if (matchedTokens > 0) {
      const ratio = matchedTokens / inputTokens.length;
      score += ratio * 40;
      if (ratio > 0.5) matchReasons.push("Token similarity");
    }
  }

  // 3. ATTRIBUTE MATCHING & PENALTIES (Critical for AZMK rules)
  // Equipment
  if (attributes.isDumbbell && exercise.equipment === 'Dumbbell') score += 20, matchReasons.push("Equipment matched (Dumbbell)");
  if (attributes.isBarbell && exercise.equipment === 'Barbell') score += 20, matchReasons.push("Equipment matched (Barbell)");
  if (attributes.isCable && exercise.equipment === 'Cable') score += 20, matchReasons.push("Equipment matched (Cable)");
  if (attributes.isMachine && exercise.equipment === 'Machine') score += 20, matchReasons.push("Equipment matched (Machine)");

  // Penalty for inventing equipment not requested if explicitly wrong
  if (attributes.isDumbbell && exercise.equipment !== 'Dumbbell') score -= 50, matchReasons.push("Contradiction: Wanted Dumbbell");
  if (attributes.isBarbell && exercise.equipment !== 'Barbell') score -= 50, matchReasons.push("Contradiction: Wanted Barbell");
  if (attributes.isCable && exercise.equipment !== 'Cable') score -= 50, matchReasons.push("Contradiction: Wanted Cable");
  
  // Position
  if (attributes.isLying && exercise.position === 'lying') score += 20, matchReasons.push("Position matched (Lying)");
  if (attributes.isSeated && exercise.position === 'seated') score += 20, matchReasons.push("Position matched (Seated)");
  if (attributes.isIncline && exercise.position === 'incline') score += 20, matchReasons.push("Position matched (Incline)");
  
  // Penalty for inventing position when not requested (e.g. suggesting Lying DB Lateral for DB Lateral)
  // If user didn't explicitly say "lying", but the exercise IS lying, AND it's a variation (like lateral raise)
  if (!attributes.isLying && exercise.position === 'lying' && !normalizedName.includes('bench press') && !normalizedName.includes('leg curl')) {
    score -= 40;
    matchReasons.push("Contradiction: Lying variant not requested");
  }
  if (!attributes.isSeated && exercise.position === 'seated' && exercise.muscleGroup !== 'Calves' && !normalizedName.includes('row')) {
    score -= 30;
    matchReasons.push("Contradiction: Seated variant not requested");
  }
  if (!attributes.isIncline && exercise.position === 'incline') {
    score -= 50;
    matchReasons.push("Contradiction: Incline not requested");
  }
  if (!attributes.isDecline && exercise.position === 'decline') {
    score -= 50;
    matchReasons.push("Contradiction: Decline not requested");
  }

  return {
    exercise,
    score,
    isExactMatch,
    matchReasons
  };
};

/**
 * Main matcher function for AI Import flow using Cascading Matching logic
 */
export const matchExerciseForImport = (
  rawInputText: string,
  inferredEquipment?: string,
  inferredMuscleGroup?: string
): MatchResult => {
  if (!rawInputText.trim()) {
    return { matchedExerciseId: null, candidates: [], confidence: 0, ambiguous: false };
  }

  const normalizedInput = normalizeExerciseText(rawInputText);
  const attributes = detectExplicitAttributes(normalizedInput);
  
  const allExercises = getAllExercises();
  
  // Phase 3: Deterministic Pre-Filtering
  let filteredExercises = allExercises;
  
  let eqLowerCase = inferredEquipment?.toLowerCase() || '';
  
  // Default Equipment for basic exercises if not specified
  if (!eqLowerCase && !attributes.isDumbbell && !attributes.isMachine && !attributes.isCable && !attributes.isSmith && !attributes.isBarbell) {
    if (normalizedInput.includes('hip thrust') || normalizedInput.includes('squat') || normalizedInput.includes('deadlift')) {
      eqLowerCase = 'barbell';
    }
  }

  if (attributes.isBarbell || eqLowerCase.includes('barbell')) {
    filteredExercises = filteredExercises.filter(ex => ex.equipment === 'Barbell');
  } else if (attributes.isDumbbell || eqLowerCase.includes('dumbbell')) {
    filteredExercises = filteredExercises.filter(ex => ex.equipment === 'Dumbbell');
  } else if (attributes.isCable || eqLowerCase.includes('cable')) {
    filteredExercises = filteredExercises.filter(ex => ex.equipment === 'Cable');
  } else if (attributes.isMachine || eqLowerCase.includes('machine')) {
    filteredExercises = filteredExercises.filter(ex => ex.equipment === 'Machine');
  } else if (eqLowerCase.includes('bodyweight') || normalizedInput.includes('pullups') || normalizedInput.includes('pushups')) {
    filteredExercises = filteredExercises.filter(ex => ex.equipment === 'Bodyweight');
  }

  // Pre-filter by muscle group if explicitly known and we have a lot of exercises left
  if (inferredMuscleGroup && filteredExercises.length > 10) {
    const mgLowerCase = inferredMuscleGroup.toLowerCase();
    const muscleMatched = filteredExercises.filter(ex => ex.muscleGroup.toLowerCase() === mgLowerCase || ex.secondaryMuscles.some(m => m.toLowerCase() === mgLowerCase));
    if (muscleMatched.length > 0) {
      filteredExercises = muscleMatched;
    }
  }
  
  // Phase 4: Cascading Matching & Scoring
  const candidates: MatcherCandidate[] = [];
  
  for (const ex of filteredExercises) {
    const candidate = scoreCandidate(normalizedInput, ex, attributes);
    
    // Add string-similarity score to the candidate's score
    const normName = normalizeExerciseText(ex.name);
    let bestSim = stringSimilarity.compareTwoStrings(normalizedInput, normName);
    if (ex.aliases) {
      for (const alias of ex.aliases) {
        const sim = stringSimilarity.compareTwoStrings(normalizedInput, normalizeExerciseText(alias));
        if (sim > bestSim) bestSim = sim;
      }
    }
    
    candidate.score += (bestSim * 40); // Max 40 points from pure string similarity
    
    // Equipment / Muscle bonus
    if (inferredEquipment && ex.equipment.toLowerCase() === inferredEquipment.toLowerCase()) {
       candidate.score += 15;
       if (!candidate.matchReasons.includes("Equipment matched")) candidate.matchReasons.push("Equipment matched");
    }
    if (inferredMuscleGroup && ex.muscleGroup.toLowerCase() === inferredMuscleGroup.toLowerCase()) {
       candidate.score += 15;
       if (!candidate.matchReasons.includes("Muscle matched")) candidate.matchReasons.push("Muscle matched");
    }
    
    if (candidate.score > 100) candidate.score = 100;
    
    if (candidate.score > 40) {
      candidates.push(candidate);
    }
  }

  candidates.sort((a, b) => b.score - a.score);

  if (candidates.length === 0) {
    return { matchedExerciseId: null, candidates: [], confidence: 0, ambiguous: true };
  }

  const topCandidate = candidates[0];

  // Phase 5: Auto-Approval vs UI Help
  // Token containment check (All nouns/adjectives from input must exist in the matched name or its aliases)
  const inputTokens = normalizedInput.split(' ').filter(t => t.length > 2);
  const matchedNormName = normalizeExerciseText(topCandidate.exercise.name);
  const allTokensFound = inputTokens.every(t => 
    matchedNormName.includes(t) || 
    topCandidate.exercise.aliases?.some(a => normalizeExerciseText(a).includes(t))
  );

  // Auto Confirm if >= 85% OR (>= 75% AND allTokensFound)
  if (topCandidate.score >= 85 || (topCandidate.score >= 75 && allTokensFound) || topCandidate.isExactMatch) {
    return {
      matchedExerciseId: topCandidate.exercise.id,
      candidates: candidates.slice(0, 3),
      confidence: topCandidate.score / 100,
      ambiguous: false
    };
  }

  return {
    matchedExerciseId: null, // Keep null to trigger UI help
    candidates: candidates.slice(0, 4),
    confidence: topCandidate.score / 100,
    ambiguous: true
  };
};
