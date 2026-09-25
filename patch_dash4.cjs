const fs = require("fs");
const path = "src/components/dashboard/DashboardView.tsx";
let code = fs.readFileSync(path, "utf8");

// First, fix the useWorkout call at the top of DashboardView component
code = code.replace(
  "const { \\n    user, \\n    history, \\n    prs, \\n    activeWorkout, \\n    startTodaysAutocompleteWorkout, \\n    activeProgram,\\n    getTodaysScheduleState,\\n    language,\\n    t\\n  } = useWorkout();",
  "const { \\n    user, \\n    history, \\n    prs, \\n    activeWorkout, \\n    startTodaysAutocompleteWorkout, \\n    activeProgram,\\n    programs,\\n    getTodaysScheduleState,\\n    language,\\n    t,\\n    updateUserProfile\\n  } = useWorkout();"
);

// We had a duplicate useWorkout for updateUserProfile, remove it
code = code.replace(
  "const { updateUserProfile } = useWorkout();",
  ""
);

// Fix the handleStartWorkout logic
code = code.replace(
  "const hasAnyProgram = (user.programs && user.programs.length > 0) || (history && history.length > 0);",
  "const hasAnyProgram = (programs && programs.length > 0) || (history && history.length > 0);"
);

fs.writeFileSync(path, code, "utf8");
console.log("Patched DashboardView");

