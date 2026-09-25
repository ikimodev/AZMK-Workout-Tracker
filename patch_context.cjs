const fs = require("fs");
const path = "src/context/WorkoutContext.tsx";
let code = fs.readFileSync(path, "utf8");

// 1. Add showWelcomeTeaser to Context Type
code = code.replace(
  "startTodaysAutocompleteWorkout: () => void;",
  "startTodaysAutocompleteWorkout: (force?: boolean) => void;\\n  showWelcomeTeaser: boolean;\\n  setShowWelcomeTeaser: (show: boolean) => void;"
);

// 2. Add state inside Provider
code = code.replace(
  "const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);",
  "const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);\\n  const [showWelcomeTeaser, setShowWelcomeTeaser] = useState(false);"
);

// 3. Modify startTodaysAutocompleteWorkout
const oldStartFunc = "const startTodaysAutocompleteWorkout = () => {";
const newStartFunc = `const startTodaysAutocompleteWorkout = (force = false) => {
    const hasAnyProgram = (programs && programs.length > 0) || (history && history.length > 0);
    if (!force && !hasAnyProgram && user.hasExistingPlan) {
      setShowWelcomeTeaser(true);
      return;
    }`;
code = code.replace(oldStartFunc, newStartFunc);

// 4. Expose in return
code = code.replace(
  "startTodaysAutocompleteWorkout,",
  "startTodaysAutocompleteWorkout,\\n        showWelcomeTeaser,\\n        setShowWelcomeTeaser,"
);

fs.writeFileSync(path, code, "utf8");
console.log("Patched WorkoutContext");

