const fs = require("fs");
const path = "src/components/dashboard/DashboardView.tsx";
let code = fs.readFileSync(path, "utf8");

// Remove the useEffect
code = code.replace(
  /React\.useEffect\(\(\) => \{\s*if \(user\.hasExistingPlan && !user\.hasSeenAITeaser\) \{[\s\S]*?\}\s*\}, \[user\.hasExistingPlan, user\.hasSeenAITeaser\]\);/,
  ""
);

// Add handleStartWorkout
code = code.replace(
  "const [showWelcomeTeaser, setShowWelcomeTeaser] = React.useState(false);",
  "const [showWelcomeTeaser, setShowWelcomeTeaser] = React.useState(false);\n\n  const handleStartWorkout = () => {\n    const hasAnyProgram = (user.programs && user.programs.length > 0) || (history && history.length > 0);\n    if (!hasAnyProgram && user.hasExistingPlan) {\n      setShowWelcomeTeaser(true);\n    } else {\n      startTodaysAutocompleteWorkout();\n    }\n  };"
);

// Replace startTodaysAutocompleteWorkout with handleStartWorkout in green buttons
code = code.replace(/onClick=\{startTodaysAutocompleteWorkout\}/g, "onClick={handleStartWorkout}");

// Update modal props
code = code.replace(
  /onOpenAIImport=\{\(\) => \{\s*setShowWelcomeTeaser\(false\);\s*updateUserProfile\(\{ hasSeenAITeaser: true \}\);\s*onOpenAIImport\(\);\s*\}\}/,
  "onOpenAIImport={() => { setShowWelcomeTeaser(false); onOpenAIImport(); }} onNavigateToPrograms={() => { setShowWelcomeTeaser(false); onNavigate('programs'); }}"
);

code = code.replace(
  /onClose=\{\(\) => \{\s*setShowWelcomeTeaser\(false\);\s*updateUserProfile\(\{ hasSeenAITeaser: true \}\);\s*\}\}/,
  "onClose={() => { setShowWelcomeTeaser(false); startTodaysAutocompleteWorkout(); }}"
);

fs.writeFileSync(path, code, "utf8");
console.log("Patched DashboardView");
