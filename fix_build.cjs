const fs = require("fs");
const path = "src/components/ai/AIWorkoutImportModal.tsx";
let code = fs.readFileSync(path, "utf8");

// Fix 1 & 2: parseSingleDayText signature and return value
// Old: const res = await parseSingleDayText(textToParse, i + 1, language, user);
//      if (res && res.exercises.length > 0) { ... exercises: res.exercises ... }
code = code.replace(
  /const res = await parseSingleDayText\(textToParse, i \+ 1, language, user\);\n\s*if \(res && res\.exercises\.length > 0\) \{\n\s*parsedDays\.push\(\{[\s\S]*?exercises: res\.exercises\n\s*\}\);\n\s*\}/,
  `const res = parseSingleDayText(textToParse);
        if (res && res.length > 0) {
          parsedDays.push({
            dayNumber: i + 1,
            dayName: nameToUse,
            exercises: res
          });
        }`
);

// Fix 3: ParsedMultiDaySplit requires programName
// Old: setParsedSplit({ isMultiDaySplit: true, days: parsedDays });
code = code.replace(
  /setParsedSplit\(\{\n\s*isMultiDaySplit: true,\n\s*days: parsedDays\n\s*\}\);/,
  `setParsedSplit({
          isMultiDaySplit: true,
          programName: "Imported Split",
          days: parsedDays
        });`
);

// Fix 4: Missing isRest in handleUpdateDayName and handleUpdateDayExercises
// They use prev.map((d, i) => i === index ? { ...d, dayName: name } : d) - actually this is correct, it preserves isRest!
// Let me check line 241 error... Wait, maybe I replaced something wrong in the other handler?
// Let us check line 241 in AIWorkoutImportModal.tsx.

