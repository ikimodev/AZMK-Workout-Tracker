const fs = require("fs");
const path = "src/types/index.ts";
let code = fs.readFileSync(path, "utf8");

code = code.replace(
  "hasCompletedOnboarding?: boolean;",
  "hasCompletedOnboarding?: boolean;\\n    hasExistingPlan?: boolean;\\n    hasSeenAITeaser?: boolean;"
);

fs.writeFileSync(path, code, "utf8");
console.log("Patched types");

