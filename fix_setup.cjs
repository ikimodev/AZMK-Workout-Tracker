const fs = require("fs");
const path = "src/components/common/InitialSetupScreen.tsx";
let code = fs.readFileSync(path, "utf8");

code = code.replace(
  "import { Dumbbell, Target, Clock, Zap, Shield, ArrowRight, User, Weight, Footprints } from \'lucide-react\';",
  "import { Dumbbell, Target, Clock, Zap, Shield, ArrowRight, User, Weight, Footprints, Sparkles } from \'lucide-react\';"
);

// Ensure InitialSetupScreenProps is correct
code = code.replace(
  /interface InitialSetupScreenProps \{\\s*onComplete: \(\) => void;\\s*\}/,
  "interface InitialSetupScreenProps {\\n  onComplete: () => void;\\n  onOpenAIImport?: () => void;\\n}"
);

fs.writeFileSync(path, code, "utf8");
console.log("Fixed setup");

