const fs = require("fs");
const path = "src/components/common/InitialSetupScreen.tsx";
let code = fs.readFileSync(path, "utf8");

// We need to replace the entire step 8 JSX
const step8Old = /{step === 8 && \([\s\S]*?<\/button>\s*<\/div>\s*<\/div>\s*\)}/;

const step8New = `{step === 8 && (
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-3xl font-black tracking-tight mb-2">{language === "ar" ? "هل لديك جدول تمارين مسبقاً؟" : "Do you have a workout plan?"}</h1>
            <p className="text-slate-400 mb-8">{language === "ar" ? "يمكننا بناء برنامج مخصص لك، أو يمكنك إدخال جدولك الخاص." : "We can build a 4-week custom periodized program for you instantly, or you can bring your own."}</p>
            
            <div className="space-y-4">
              <button
                onClick={() => { setHasPlan(true); handleFinish(true); }}
                className="w-full p-5 rounded-2xl border text-left transition-all active:scale-[0.98] bg-white/5 border-white/10 hover:bg-white/10"
              >
                <h3 className="text-lg font-bold text-white">{language === "ar" ? "نعم، لدي جدول" : "Yes, I have one"}</h3>
                <p className="text-sm text-slate-400 mt-1">{language === "ar" ? "انتقل مباشرة للرئيسية لإضافة جدولك." : "Skip setup and proceed to Dashboard."}</p>
              </button>

              <button
                onClick={() => { setHasPlan(false); handleNext(); }}
                className="w-full p-5 rounded-2xl border text-left transition-all active:scale-[0.98] flex items-center justify-between bg-white/5 border-white/10 hover:bg-white/10"
              >
                <div>
                  <h3 className="text-lg font-bold text-white">{language === "ar" ? "لا، أريد جدولاً بالذكاء الاصطناعي" : "No, I want one (AI Program)"}</h3>
                  <p className="text-sm text-slate-400 mt-1">{language === "ar" ? "أجب عن بعض الأسئلة للحصول على خطة مخصصة." : "Answer a few more questions to get a tailored plan."}</p>
                </div>
                <Zap className="w-6 h-6 text-accent-emerald flex-shrink-0" />
              </button>
            </div>
          </div>
        )}`;

code = code.replace(step8Old, step8New);

// And we can remove the weird check in handleNext if it still exists
code = code.replace(
  "if (step === 8 && hasPlan === true) {\n        handleFinish(true);\n        return;\n      }",
  "// hasPlan check handled by button click"
);

fs.writeFileSync(path, code, "utf8");
console.log("Patched step 8");
