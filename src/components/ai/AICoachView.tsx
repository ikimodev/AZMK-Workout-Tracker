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
    "ايش أكثر عضلات اتمرنها؟",
    "عندي ألم في الكتف أثناء التمرين"
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
                <span>{t('toolsConnected')}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'ar' 
                ? 'تحليل مباشر ومبني على بيانات تمارينك وأوزانك المسجلة.' 
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
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
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

      {/* Chat Messages Log */}
      <div className="flex-1 bg-background-card/80 border border-border rounded-3xl p-4 sm:p-6 overflow-y-auto space-y-4 shadow-inner">
        {aiMessages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
          >
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span className="font-bold text-white">
                {msg.sender === 'user' ? (user.name || 'You') : (language === 'ar' ? 'كابتن عزام' : 'Coach Azzam')}
              </span>
              <span>•</span>
              <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            {/* Tool Calls Logs View if present */}
            {msg.toolCalls && msg.toolCalls.length > 0 && (
              <div className="w-full max-w-2xl bg-black/60 border border-slate-800 rounded-2xl p-3 space-y-2 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-accent-indigo font-bold text-xs uppercase tracking-wider">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'استعلام الأدوات وقاعدة البيانات' : 'Executed Tools & Analytics'}</span>
                </div>
                {msg.toolCalls.map(tc => (
                  <div key={tc.id} className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-accent-cyan">
                      <span className="font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-accent-emerald" />
                        <code>{tc.toolName}()</code>
                      </span>
                      <span className="text-[10px] text-slate-400">{tc.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-[10px] font-sans">{tc.resultSummary}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-2xl p-4 sm:p-5 rounded-3xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-accent-indigo text-white rounded-tr-sm font-medium shadow-glow-sm'
                  : 'bg-background-elevated border border-border text-slate-100 rounded-tl-sm prose prose-invert max-w-none'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {/* Action Buttons if recommended */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border/80 flex flex-wrap gap-2 not-prose">
                  {msg.suggestedActions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (act.actionType === 'start_workout') {
                          startTodaysAutocompleteWorkout();
                        } else if (act.actionType === 'apply_progression') {
                          startTodaysAutocompleteWorkout();
                        } else {
                          onNavigate('progress');
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-accent-emerald hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
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

        {isAILoading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-background-elevated border border-border max-w-xs animate-pulse">
            <Bot className="w-5 h-5 text-accent-indigo animate-spin" />
            <span className="text-xs font-mono text-slate-300">
              {language === 'ar' ? 'كابتن عزام يقوم بفحص سجلات التمارين...' : 'Coach Azzam analyzing workout data...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar or Upgrade Wall */}
      {isLimitReached ? (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">
                {language === 'ar' ? 'استنفدت رصيد الأسئلة المجانية لليوم (5/5)' : 'Daily Free AI Quota Reached (5/5)'}
              </p>
              <p className="text-[11px] text-slate-300">
                {language === 'ar' ? 'قم بالترقية إلى Pro للدردشة غير المحدودة مع كابتن عزام.' : 'Upgrade to Pro for unlimited coaching queries.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('premium')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black text-xs shrink-0 shadow-sm"
          >
            {t('upgradeToPro')}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSend} className="flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'اسأل كابتن عزام (مثال: ليش وزني ثابت في البنش، أو وش أتمرن اليوم؟)...'
                : 'Ask Coach Azzam about your strength, plateaus, or next workout...'
            }
            className="flex-1 px-5 py-3.5 bg-background-card border border-border focus:border-accent-indigo rounded-2xl text-white text-sm font-medium focus:outline-none transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isAILoading}
            className="p-3.5 rounded-2xl bg-accent-indigo hover:bg-indigo-500 disabled:opacity-50 text-white font-bold transition-all shadow-glow-indigo shrink-0"
          >
            <Send className="w-5 h-5 rtl:rotate-180" />
          </button>
        </form>
      )}

    </div>
  );
};
