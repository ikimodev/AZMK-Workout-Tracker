const fs = require("fs");
const path = "src/App.tsx";
let code = fs.readFileSync(path, "utf8");

// Add import
code = code.replace(
  'import { Sidebar } from "./components/layout/Sidebar";',
  'import { Sidebar } from "./components/layout/Sidebar";\nimport { AIWelcomeTeaserModal } from "./components/dashboard/AIWelcomeTeaserModal";'
);

// Destructure from useWorkout
code = code.replace(
  "const { user, activeWorkout, lastCompletedSession, clearLastCompletedSession } = useWorkout();",
  "const { user, activeWorkout, lastCompletedSession, clearLastCompletedSession, showWelcomeTeaser, setShowWelcomeTeaser, startTodaysAutocompleteWorkout } = useWorkout();"
);

// Add the modal component to the main render output
code = code.replace(
  "</main>\n\n          <BottomNav ",
  `</main>
          <AIWelcomeTeaserModal
            isOpen={showWelcomeTeaser}
            onClose={() => {
              setShowWelcomeTeaser(false);
              startTodaysAutocompleteWorkout(true);
            }}
            onOpenAIImport={() => {
              setShowWelcomeTeaser(false);
              setIsAIImportOpen(true);
            }}
            onNavigateToPrograms={() => {
              setShowWelcomeTeaser(false);
              setActiveTab("programs");
            }}
          />
          <BottomNav `
);

fs.writeFileSync(path, code, "utf8");
console.log("Patched App.tsx");
