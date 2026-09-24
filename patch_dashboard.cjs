const fs = require("fs");
const path = "src/components/dashboard/DashboardView.tsx";
let code = fs.readFileSync(path, "utf8");

code = code.replace(
  "<span className=\\"px-1.5 py-0.2 rounded bg-accent-cyan/10 text-accent-cyan text-[9px] font-mono font-bold\\">REAL AI</span>",
  "<span className=\\"px-1.5 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan text-[9px] font-bold whitespace-nowrap\\">{language === \\"ar\\" ? \\"مجاناً أول 4 أسابيع\\" : \\"FREE 4 WEEKS\\"}</span>"
);

fs.writeFileSync(path, code, "utf8");
console.log("Patched DashboardView.tsx");

