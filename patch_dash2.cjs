const fs = require("fs");
const path = "src/components/dashboard/DashboardView.tsx";
let code = fs.readFileSync(path, "utf8");

// 1. Import the modal
code = code.replace(
  "import { getExerciseDisplayName, getFitnessGoalDisplayName, formatUnitDisplay } from '../../i18n/fitnessDictionary';",
  "import { getExerciseDisplayName, getFitnessGoalDisplayName, formatUnitDisplay } from '../../i18n/fitnessDictionary';\nimport { AIWelcomeTeaserModal } from './AIWelcomeTeaserModal';"
);

// 2. Add state and effect in DashboardView
code = code.replace(
  "const primaryGoalLabel = getFitnessGoalDisplayName(user.primaryGoal, language);",
  "const primaryGoalLabel = getFitnessGoalDisplayName(user.primaryGoal, language);\n\n  const [showWelcomeTeaser, setShowWelcomeTeaser] = React.useState(false);\n  const { updateUserProfile } = useWorkout();\n\n  React.useEffect(() => {\n    if (user.hasExistingPlan && !user.hasSeenAITeaser) {\n      const timer = setTimeout(() => {\n        setShowWelcomeTeaser(true);\n      }, 800);\n      return () => clearTimeout(timer);\n    }\n  }, [user.hasExistingPlan, user.hasSeenAITeaser]);"
);

// 3. Render the modal
code = code.replace(
  "return (\n    <div className=\"space-y-6 pb-12 animate-fade-in\">",
  "return (\n    <div className=\"space-y-6 pb-12 animate-fade-in\">\n\n      <AIWelcomeTeaserModal\n        isOpen={showWelcomeTeaser}\n        onClose={() => {\n          setShowWelcomeTeaser(false);\n          updateUserProfile({ hasSeenAITeaser: true });\n        }}\n        onOpenAIImport={() => {\n          setShowWelcomeTeaser(false);\n          updateUserProfile({ hasSeenAITeaser: true });\n          onOpenAIImport();\n        }}\n      />"
);

fs.writeFileSync(path, code, "utf8");
console.log("Patched DashboardView to show modal");
