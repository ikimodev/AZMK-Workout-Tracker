import React from 'react';
import { Timer, Plus, X, Play, Pause } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

export const RestTimerFloat: React.FC = () => {
  const { 
    restTimerRemaining, 
    restTimerTotal, 
    isRestTimerActive, 
    pauseRestTimer, 
    resumeRestTimer, 
    stopRestTimer, 
    adjustRestTimer,
    t
  } = useWorkout();

  if (restTimerRemaining <= 0) return null;

  const progressPercent = Math.min(100, Math.max(0, ((restTimerTotal - restTimerRemaining) / restTimerTotal) * 100));

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-50 animate-slide-up px-2 pb-2">
      <div className="max-w-4xl mx-auto glass-panel border-accent-emerald/40 bg-[#121826]/95 rounded-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)] p-3 flex items-center justify-between border shadow-glow-sm">
        
        <div className="flex items-center gap-3">
          {/* Circular Mini Progress Ring */}
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-accent-emerald transition-all duration-1000 ease-linear"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-mono font-bold text-[10px] text-white">
              {formatTime(restTimerRemaining)}
            </span>
          </div>

          {/* Info & Title */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-accent-emerald text-xs font-bold uppercase tracking-wide">
              <Timer className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>{t('resting')}</span>
            </div>
            <span className="text-[10px] text-slate-400">{t('nextSetReadySoon')}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => adjustRestTimer(30)}
            className="px-2.5 py-1.5 bg-background-elevated hover:bg-background-hover text-slate-200 text-xs font-bold rounded-xl border border-border transition-all active:scale-95 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>30s</span>
          </button>

          {isRestTimerActive ? (
            <button
              onClick={pauseRestTimer}
              className="p-1.5 bg-background-elevated hover:bg-background-hover text-slate-200 rounded-xl border border-border transition-all"
            >
              <Pause className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={resumeRestTimer}
              className="p-1.5 bg-accent-emerald text-black font-bold rounded-xl transition-all"
            >
              <Play className="w-4 h-4 fill-black" />
            </button>
          )}

          <button
            onClick={stopRestTimer}
            className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
