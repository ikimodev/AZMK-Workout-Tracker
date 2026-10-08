import { matchExerciseForImport } from './src/services/exerciseMatcherService';

const testCases = [
  { input: "Dumbbell lateral raises", expectedSubstring: "Side_Lateral_Raise" },
  { input: "Lying dumbbell lateral raise", expectedSubstring: "Lying_One-Arm_Lateral_Raise" }, // Or similar lying variant
  { input: "DB lat raises", expectedSubstring: "Side_Lateral_Raise" },
  { input: "Cable lateral raise", expectedSubstring: "Cable_Seated_Lateral_Raise" }, // Assuming this is the closest cable one
  { input: "Seated DB shoulder press", expectedSubstring: "Dumbbell_Shoulder_Press" }, // Likely the ID
  { input: "Barbell bench", expectedSubstring: "Barbell_Bench_Press" },
  { input: "dumbel latral raise", expectedSubstring: "Side_Lateral_Raise" },
  { input: "رفرفة جانبية بالدمبل", expectedSubstring: "Side_Lateral_Raise" },
  { input: "رفرفة جانبية بالدمبل مستلقيا", expectedSubstring: "Lying_One-Arm_Lateral_Raise" }
];

console.log("Running AI Workout Import Matcher Tests...\n");

let passed = 0;

for (const tc of testCases) {
  const result = matchExerciseForImport(tc.input);
  const matchedId = result.matchedExerciseId;
  
  if (matchedId && matchedId.includes(tc.expectedSubstring)) {
    console.log(`✅ PASS: "${tc.input}" -> ${matchedId} (Confidence: ${result.confidence.toFixed(2)})`);
    passed++;
  } else {
    console.log(`❌ FAIL: "${tc.input}"`);
    console.log(`   Expected to include: ${tc.expectedSubstring}`);
    console.log(`   Got: ${matchedId} (Ambiguous: ${result.ambiguous}, Confidence: ${result.confidence.toFixed(2)})`);
    if (result.candidates.length > 0) {
      console.log(`   Top Candidate: ${result.candidates[0].exercise.id} (Score: ${result.candidates[0].score})`);
      console.log(`   Reasons: ${result.candidates[0].matchReasons.join(', ')}`);
    }
  }
}

console.log(`\nResults: ${passed} / ${testCases.length} passed.`);
