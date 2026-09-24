const fs = require("fs");
const path = "src/components/ai/AIWorkoutImportModal.tsx";
let code = fs.readFileSync(path, "utf8");

code = code.replace(
  /const res = await parseSingleDayText\(textToParse, i \+ 1, language, user\);\n\s*if \(res && res\.exercises\.length > 0\) \{\n\s*parsedDays\.push\(\{[\s\S]*?exercises: res\.exercises\n\s*\}\);\n\s*\}/,
  `const res = await parseSingleDayText(textToParse);
        if (res && res.length > 0) {
          parsedDays.push({
            dayNumber: i + 1,
            dayName: nameToUse,
            exercises: res
          });
        }`
);

code = code.replace(
  /setParsedSplit\(\{\n\s*isMultiDaySplit: true,\n\s*days: parsedDays\n\s*\}\);/,
  `setParsedSplit({
          isMultiDaySplit: true,
          programName: "Imported Split",
          days: parsedDays
        });`
);

code = code.replace(
  /setSplitDays\(res\.days\.map\(d => \(\{\n\s*dayName: d\.dayName,\n\s*rawExercisesText: d\.exercises\.map\(e => \`\$\{e\.exerciseName\} \$\{e\.targetSets\}x\$\{e\.targetReps\} \$\{e\.suggestedWeightKg\}kg\`\)\.join\('\\n'\)\n\s*\}\)\)\);/,
  `setSplitDays(res.days.map(d => ({
          isRest: false,
          dayName: d.dayName,
          rawExercisesText: d.exercises.map(e => \`\${e.exerciseName} \${e.targetSets}x\${e.targetReps} \${e.suggestedWeightKg}kg\`).join('\\n')
        })));`
);

fs.writeFileSync(path, code, "utf8");
console.log("Fixes applied.");
