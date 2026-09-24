const fs = require("fs");
const path = "src/components/dashboard/DashboardView.tsx";
let code = fs.readFileSync(path, "utf8");

code = code.replace(
  /font-mono\s*font-bold">REAL AI<\/span>/,
  `font-bold whitespace-nowrap">{language === 'ar' ? 'مجاناً أول 4 أسابيع' : 'FREE 4 WEEKS'}</span>`
);

fs.writeFileSync(path, code, "utf8");
console.log("Fixed badge");
