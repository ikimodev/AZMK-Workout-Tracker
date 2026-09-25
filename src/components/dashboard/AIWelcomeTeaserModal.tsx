import React from "react";
import { Sparkles, X, PenLine } from "lucide-react";
import { useWorkout } from "../../context/WorkoutContext";

interface AIWelcomeTeaserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAIImport: () => void;
  onNavigateToPrograms: () => void;
}

export const AIWelcomeTeaserModal: React.FC<AIWelcomeTeaserModalProps> = ({ isOpen, onClose, onOpenAIImport, onNavigateToPrograms }) => {
  const { language } = useWorkout();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-background-card border border-accent-indigo/50 rounded-3xl max-w-sm w-full p-6 relative shadow-2xl animate-scale-up text-center overflow-hidden">
        
        {/* Background Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-indigo/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <button onClick={onClose} className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-white z-10 bg-background-elevated p-2 rounded-full transition-all">
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-accent-indigo to-blue-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-glow-indigo animate-bounce-subtle">
            <Sparkles className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-black text-white mb-3 leading-tight">
            {language === "ar" ? "لم تقم بإضافة جدولك بعد!" : "You haven't added a plan yet!"}
          </h2>
          
          <p className="text-slate-300 mb-8 text-sm leading-relaxed">
            {language === "ar" 
              ? "للبدء بالتمرين، يجب عليك إما استيراد جدولك الخاص بنسخ النص، أو إنشاء جدولك يدوياً."
              : "To start working out, you must either import your routine by pasting text, or build it manually."}
          </p>

          <div className="w-full space-y-3">
            <button
              onClick={() => {
                onClose();
                setTimeout(() => onOpenAIImport(), 300);
              }}
              className="w-full py-4 rounded-xl bg-accent-indigo hover:bg-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-glow-indigo transition-all active:scale-95"
            >
              <Sparkles className="w-5 h-5" />
              <span>{language === "ar" ? "استيراد بالذكاء الاصطناعي (سريع)" : "AI Text Import (Fast)"}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                setTimeout(() => onNavigateToPrograms(), 300);
              }}
              className="w-full py-4 rounded-xl bg-background-elevated border border-border hover:border-slate-500 text-slate-300 hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <PenLine className="w-4 h-4" />
              <span>{language === "ar" ? "إنشاء جدول يدوياً" : "Create Plan Manually"}</span>
            </button>
            
            <button
              onClick={onClose}
              className="w-full pt-3 text-slate-500 hover:text-slate-400 text-xs font-bold transition-all underline decoration-slate-500/30 underline-offset-4"
            >
              {language === "ar" ? "تخطي والبدء بتمرين حر" : "Skip & Start Freestyle"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
