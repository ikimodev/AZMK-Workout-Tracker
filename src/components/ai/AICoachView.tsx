import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Wrench, 
  CheckCircle2, 
  ChevronRight, 
  Flame, 
  ShieldAlert, 
  Terminal,
  Zap,
  Play,
  Lock,
  Crown
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

interface AICoachViewProps {
  onNavigate: (tab: string) => void;
}

export const AICoachView: React.FC<AICoachViewProps> = ({ onNavigate }) => {
  const { 
    user,
    aiMessages, 
    isAILoading, 
    sendChatMessage, 
    startTodaysAutocompleteWorkout,
    language,
    t
  } = useWorkout();

  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isFree = user.tier === 'free';
  const usedQuestions = user.aiQuestionsUsedToday || 0;
  const maxFreeQuestions = 5;
  const isLimitReached = isFree && usedQuestions >= maxFreeQuestions;

  const sampleQueriesAr = [
    "ليش وزني ثابت في البنش برس؟",
    "كيف تطوري هذا الشهر؟",
    "وش أتمرن في التمرين القادم؟",
    "هل تمرين الظهر كافي للنمو؟",
    "عندي ألم في الكتف أثناء البنش برس"
  ];

  const sampleQueriesEn = [
    "Why has my bench stopped improving?",
    "Am I progressing?",
    "What should I do next workout?",
    "Which muscle groups am I training the most?",
    "I have shoulder pain during bench press"
  ];

  const sampleQueries = language === 'ar' ? sampleQueriesAr : sampleQueriesEn;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isAILoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isAILoading) return;
    const text = inputQuery;
    setInputQuery('');
    await sendChatMessage(text);
  };

  const handleQuickChip = (query: string) => {
    sendChatMessage(query);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-12 animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      
      {/* Header */}
      <div className="bg-background-card border border-border rounded-3xl p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-accent-indigo to-purple-500 border border-accent-indigo/40 flex items-center justify-center text-white shadow-glow-indigo">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl text-white font-mono">
                {language === 'ar' ? 'كابتن عزام (المدرب الذكي)' : 'Coach Azzam (AI Coach)'}
              </h1>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20 text-[10px] font-bold">
                <Zap className="w-2.5 h-2.5 fill-accent-emerald" />
                <span>Gemini 1.5 Live</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'ar' 
                ? 'تحليل مباشر ومحادثة ذكية مبنية على بيانات تمارينك وأوزانك المسجلة.' 
                : 'Context-grounded analysis of your real completed workout sessions.'}
            </p>
          </div>
        </div>

        {/* Free vs Pro Quota Badge */}
        <div className="flex items-center gap-2">
          {isFree ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-background-elevated border border-border text-xs">
              <span className="text-slate-400 font-medium">
                {language === 'ar' 
                  ? `${Math.max(0, maxFreeQuestions - usedQuestions)}/5 أسئلة متبقية اليوم`
                  : `${Math.max(0, maxFreeQuestions - usedQuestions)}/5 free queries today`}
              </span>
              <button
                onClick={() => onNavigate('premium')}
                className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-[10px] flex items-center gap-1"
              >
                <Crown className="w-3 h-3 fill-black" />
                <span>Pro</span>
              </button>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 fill-amber-300" />
              <span>{language === 'ar' ? 'باقة Pro (استشارات غير محدودة)' : 'Pro Tier (Unlimited)'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Prompts Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 no-scrollbar">
        {sampleQueries.map((query, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickChip(query)}
            disabled={isAILoading || isLimitReached}
            className="px-3 py-1.5 rounded-full bg-background-card hover:bg-background-elevated border border-border hover:border-accent-indigo text-xs text-slate-300 hover:text-white whitespace-nowrap transition-all shrink-0 active:scale-95 disabled:opacity-50"
          >
            💬 {query}
          </button>
        ))}
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto bg-background-card border border-border rounded-3xl p-4 sm:p-6 space-y-4 shadow-card">
        {aiMessages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-[11px] font-mono text-slate-400">
                {msg.sender === 'user' ? (user.name || 'You') : (language === 'ar' ? 'كابتن عزام' : 'Coach Azzam')}
              </span>
              <span className="text-[10px] text-slate-600">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-3xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-accent-indigo text-white rounded-tr-none shadow-glow-indigo'
                  : 'bg-background-elevated border border-border text-slate-200 rounded-tl-none rtl:rounded-tr-none rtl:rounded-tl-3xl shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                {msg.text}
              </div>

              {/* Action Buttons if AI suggested actions */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/60 flex flex-wrap gap-2">
                  {msg.suggestedActions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (act.actionType === 'start_workout') {
                          startTodaysAutocompleteWorkout();
                          onNavigate('active_workout');
                        } else if (act.actionType === 'view_analytics') {
                          onNavigate('premium');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-accent-emerald text-black font-extrabold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Play className="w-3 h-3 fill-black" />
                      <span>{act.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isAILoading && (
          <div className="flex items-center gap-2 p-3 bg-background-elevated rounded-2xl w-fit text-xs text-slate-400 animate-pulse border border-border">
            <Sparkles className="w-4 h-4 text-accent-indigo animate-spin" />
            <span>{language === 'ar' ? 'كابتن عزام يحلل بياناتك ويفكر...' : 'Coach Azzam is analyzing your data...'}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="shrink-0 flex items-center gap-2 pt-1 pb-safe">
        <input
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          disabled={isLimitReached || isAILoading}
          placeholder={
            isLimitReached 
              ? (language === 'ar' ? 'وصلت للحد اليومي (5/5) — قم بالترقية إلى Pro للدردشة بلا حدود' : 'Daily limit reached — Upgrade to Pro')
              : (language === 'ar' ? 'اسأل كابتن عزام عن أوزانك، تمارينك، استشفائك...' : 'Ask Coach Azzam about your lifts, overload, form...')
          }
          className="flex-1 px-4 py-3.5 rounded-2xl bg-background-card border border-border text-white text-sm font-medium focus:outline-none focus:border-accent-indigo transition-all placeholder:text-slate-500 disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!inputQuery.trim() || isAILoading || isLimitReached}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-accent-indigo to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold flex items-center justify-center shadow-glow-indigo transition-all disabled:opacity-40 active:scale-95"
        >
          <Send className="w-5 h-5 rtl:rotate-180" />
        </button>
      </form>

    </div>
  );
};
