const fs = require("fs");
const path = "src/components/dashboard/DashboardView.tsx";
let code = fs.readFileSync(path, "utf8");

// Remove local state
code = code.replace(
  /const \[showWelcomeTeaser, setShowWelcomeTeaser\] = React\.useState\(false\);/,
  ""
);

// Remove handleStartWorkout
code = code.replace(
  /const handleStartWorkout = \(\) => \{[\s\S]*?\};\n\n?/,
  ""
);

// Restore onClick for green buttons
code = code.replace(/onClick=\{handleStartWorkout\}/g, "onClick={startTodaysAutocompleteWorkout}");

// Remove the AIWelcomeTeaserModal render from DashboardView
code = code.replace(
  /<AIWelcomeTeaserModal[\s\S]*?\/>/,
  ""
);

// Remove the import of AIWelcomeTeaserModal
code = code.replace(
  /import \{ AIWelcomeTeaserModal \} from \x27\.\/AIWelcomeTeaserModal\x27;/,
  ""
);

fs.writeFileSync(path, code, "utf8");
console.log("Cleaned up DashboardView");

