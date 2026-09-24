const fs = require("fs");
const path = "src/App.tsx";
let code = fs.readFileSync(path, "utf8");

code = code.replace(
  "<InitialSetupScreen\\n          onComplete={() => {\\n            setActiveTab(\'dashboard\');\\n            window.scrollTo({ top: 0, behavior: \'smooth\' });\\n          }}\\n        />",
  "<InitialSetupScreen\\n          onComplete={() => {\\n            setActiveTab(\'dashboard\');\\n            window.scrollTo({ top: 0, behavior: \'smooth\' });\\n          }}\\n          onOpenAIImport={() => setIsAIImportOpen(true)}\\n        />"
);

fs.writeFileSync(path, code, "utf8");
console.log("Patched App.tsx");

