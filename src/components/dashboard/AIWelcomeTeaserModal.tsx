import React from "react";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { useWorkout } from "../../context/WorkoutContext";

interface AIWelcomeTeaserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAIImport: () => void;
}

export const AIWelcomeTeaserModal: React.FC<AIWelcomeTeaserModalProps> = ({ isOpen, onClose, onOpenAIImport }) => {
  const { language } = useWorkout();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-background-card border border-accent-indigo/50 rounded-3xl max-w-sm w-full p-6 relative shadow-2xl animate-scale-up text-center overflow-hidden">
        
        {/* Background Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-indigo/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <button onClick={onClose} className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-white z-10 bg-background-elevated p-2 rounded-full">
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-accent-indigo to-blue-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-glow-indigo animate-bounce-subtle">
            <Sparkles className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-black text-white mb-3">
            {language === "ar" ? "جاهز لإضافة جدولك؟" : "Ready to add your plan?"}
          </h2>
          
          <p className="text-slate-300 mb-6 text-sm leading-relaxed">
            {language === "ar" 
              ? "بما أن لديك جدول تمارين، يمكنك إضافة جميع تمارينك في ثوانٍ فقط بنسخها ولصقها كنص باستخدام الذكاء الاصطناعي."
              : "Since you already have a workout routine, you can add all your exercises in seconds by pasting them as text using our AI."}
          </p>

          <button
            onClick={() => {
              onClose();
              setTimeout(() => {
                onOpenAIImport();
              }, 300);
            }}
            className="w-full py-4 rounded-xl bg-accent-indigo hover:bg-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-glow-indigo transition-all mb-3 active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            <span>{language === "ar" ? "استيراد جدولي الآن" : "Import Now by Text"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition-all"
          >
            {language === "ar" ? "ليس الآن" : "Not now"}
          </button>
        </div>
      </div>
    </div>
  );
};

