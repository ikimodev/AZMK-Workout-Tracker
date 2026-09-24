const fs = require("fs");
const path = "src/components/ai/AIWorkoutImportModal.tsx";
let code = fs.readFileSync(path, "utf8");

// 1. Update handleToggleRestDay to prevent Day 1 from being a rest day
const handleToggleRestDayOld = `const handleToggleRestDay = (index: number) => {
    setSplitDays(prev => prev.map((d, i) => i === index ? { ...d, isRest: !d.isRest, dayName: '', rawExercisesText: '' } : d));
  };`;
const handleToggleRestDayNew = `const handleToggleRestDay = (index: number) => {
    if (index === 0) {
      alert(language === 'ar' ? 'لا يمكن جعل اليوم الأول يوم راحة!' : 'Day 1 cannot be a rest day!');
      return;
    }
    setSplitDays(prev => prev.map((d, i) => i === index ? { ...d, isRest: !d.isRest, dayName: '', rawExercisesText: '' } : d));
  };`;
code = code.replace(handleToggleRestDayOld, handleToggleRestDayNew);


// 2. Update the Toggle UI to be disabled on Day 1
const toggleUIOld = `<button
                      type="button"
                      onClick={() => handleToggleRestDay(activeTabDay)}
                      className={\`w-10 h-6 rounded-full transition-colors relative \${splitDays[activeTabDay].isRest ? 'bg-accent-emerald' : 'bg-slate-700'}\`}
                    >`;
const toggleUINew = `<button
                      type="button"
                      onClick={() => handleToggleRestDay(activeTabDay)}
                      disabled={activeTabDay === 0}
                      className={\`w-10 h-6 rounded-full transition-colors relative \${splitDays[activeTabDay].isRest ? 'bg-accent-emerald' : 'bg-slate-700'} \${activeTabDay === 0 ? 'opacity-50 cursor-not-allowed' : ''}\`}
                    >`;
code = code.replace(toggleUIOld, toggleUINew);


// 3. Update the Tabs UI to show "Rest" text
const tabsUIOld = `{d.isRest && <Calendar className="w-3 h-3" />}
                      {d.dayName.split(':')[0].split('-')[0] || (language === 'ar' ? \`يوم \${idx + 1}\` : \`Day \${idx + 1}\`)}`;

const tabsUINew = `{d.isRest && <Calendar className="w-3 h-3" />}
                      {d.isRest 
                        ? (language === 'ar' ? 'راحة' : 'Rest')
                        : (d.dayName.split(':')[0].split('-')[0] || (language === 'ar' ? \`يوم \${idx + 1}\` : \`Day \${idx + 1}\`))
                      }`;
code = code.replace(tabsUIOld, tabsUINew);


fs.writeFileSync(path, code, "utf8");
console.log("Rest day fixes applied.");
