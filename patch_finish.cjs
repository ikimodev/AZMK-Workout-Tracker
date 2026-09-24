const fs = require("fs");
const path = "src/components/common/InitialSetupScreen.tsx";
let code = fs.readFileSync(path, "utf8");

code = code.replace(
  "hasCompletedOnboarding: true,",
  "hasCompletedOnboarding: true,\\n        hasExistingPlan: hasPlan === true,\\n        hasSeenAITeaser: false,"
);

fs.writeFileSync(path, code, "utf8");
console.log("Patched InitialSetupScreen handleFinish");

