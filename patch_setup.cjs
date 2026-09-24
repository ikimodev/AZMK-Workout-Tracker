const fs = require("fs");
const path = "src/components/common/InitialSetupScreen.tsx";
let code = fs.readFileSync(path, "utf8");

// Add onOpenAIImport prop
code = code.replace(
  "interface InitialSetupScreenProps {\\n  onComplete: () => void;\\n}",
  "interface InitialSetupScreenProps {\\n  onComplete: () => void;\\n  onOpenAIImport?: () => void;\\n}"
);

code = code.replace(
  "export const InitialSetupScreen: React.FC<InitialSetupScreenProps> = ({ onComplete }) => {",
  "export const InitialSetupScreen: React.FC<InitialSetupScreenProps> = ({ onComplete, onOpenAIImport }) => {"
);

// Prevent auto-finish if step 8 and hasPlan is true
code = code.replace(
  "if (step === 8 && hasPlan === true) {\\n        handleFinish(true);\\n        return;\\n      }",
  "// Sub-step handled in UI"
);

// Replace Step 8 UI
const step8Old = /{step === 8 && \([\s\S]*?<\/button>\s*<\/div>\s*<\/div>\s*\)}/;
const step8New = `{step === 8 && (
          <div className="space-y-6 animate-slide-up">
            {hasPlan === null && (
              <>
                <h1 className="text-3xl font-black tracking-tight mb-2">{language === "ar" ? "هل لديك جدول تمارين مسبقاً؟" : "Do you have a workout plan?"}</h1>
                <p className="text-slate-400 mb-8">{language === "ar" ? "يمكننا بناء برنامج مخصص لك، أو يمكنك إدخال جدولك الخاص." : "We can build a 4-week custom periodized program for you instantly, or you can bring your own."}</p>
                
                <div className="space-y-4">
                  <button
                    onClick={() => { setHasPlan(true); }}
                    className="w-full p-5 rounded-2xl border text-left transition-all active:scale-[0.98] bg-white/5 border-white/10 hover:bg-white/10"
                  >
                    <h3 className="text-lg font-bold text-white">{language === "ar" ? "نعم، لدي جدول" : "Yes, I have one"}</h3>
                    <p className="text-sm text-slate-400 mt-1">{language === "ar" ? "انتقل مباشرة للخطوة التالية." : "Skip setup and proceed."}</p>
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
              </>
            )}

            {hasPlan === true && (
              <div className="bg-accent-indigo/10 border border-accent-indigo/30 p-6 rounded-3xl animate-fade-in">
                <div className="w-12 h-12 bg-accent-indigo/20 rounded-2xl flex items-center justify-center text-accent-indigo mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">
                  {language === "ar" ? "طريقة أسرع لإضافة جدولك!" : "Faster way to add your routine!"}
                </h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  {language === "ar" 
                    ? "بما أن لديك جدولك الخاص، استخدم ميزة الاستيراد بالذكاء الاصطناعي (AI Import) لتحويل جدولك النصي إلى خطة تدريب كاملة في ثوانٍ. (مجاناً لأول 4 أسابيع!)"
                    : "Since you already have a plan, use our AI Text Import to instantly turn your text into a full workout program. (Free for your first 4 weeks!)"}
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      handleFinish(true);
                      setTimeout(() => {
                        if (onOpenAIImport) onOpenAIImport();
                      }, 400);
                    }}
                    className="w-full py-4 rounded-xl bg-accent-indigo hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>{language === "ar" ? "استيراد بالذكاء الاصطناعي الآن" : "Use AI Import Now (Free)"}</span>
                  </button>
                  
                  <button
                    onClick={() => handleFinish(true)}
                    className="w-full py-4 rounded-xl bg-background-elevated border border-border text-slate-300 hover:text-white font-bold transition-all"
                  >
                    {language === "ar" ? "تخطي والذهاب للرئيسية" : "Skip & go to Dashboard"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}`;

code = code.replace(step8Old, step8New);
fs.writeFileSync(path, code, "utf8");
console.log("Patched InitialSetupScreen.tsx");

