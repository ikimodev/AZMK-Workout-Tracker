import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RefreshCcw } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

interface SetTimerProps {
  initialSeconds: number;
  onUpdateSeconds: (seconds: number) => void;
  isCompleted: boolean;
}

export const SetTimer: React.FC<SetTimerProps> = ({ initialSeconds, onUpdateSeconds, isCompleted }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialSeconds || 60);
  const [isEditing, setIsEditing] = useState(false);
  const { playTimerBeep } = useWorkout();
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasBeepedZero = useRef(false);
  const hasBeepedMinus60 = useRef(false);

  useEffect(() => {
    if (isRunning && !isCompleted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;
          
          if (next === 0 && !hasBeepedZero.current) {
            playTimerBeep('finish');
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            hasBeepedZero.current = true;
          } else if (next === -60 && !hasBeepedMinus60.current) {
            playTimerBeep('warning');
            if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300]);
            hasBeepedMinus60.current = true;
          }
          
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isCompleted, playTimerBeep]);

  // Stop timer if completed
  useEffect(() => {
    if (isCompleted) {
      setIsRunning(false);
    }
  }, [isCompleted]);

  // Update parent when changing manually (but not on every tick to avoid re-renders)
  const handleManualUpdate = (val: number) => {
    setTimeLeft(val);
    onUpdateSeconds(val);
    hasBeepedZero.current = false;
    hasBeepedMinus60.current = false;
  };

  const isNegative = timeLeft < 0;

  return (
    <div className="flex items-center gap-2 justify-center w-full">
      {isEditing ? (
        <input
          type="number"
          value={timeLeft}
          onChange={(e) => handleManualUpdate(parseInt(e.target.value) || 0)}
          onBlur={() => setIsEditing(false)}
          autoFocus
          className="w-16 py-1.5 px-1 rounded-lg text-center font-mono font-bold text-sm bg-background-elevated border border-border focus:outline-none focus:border-accent-emerald text-white"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className={`w-16 py-1.5 px-1 rounded-lg text-center font-mono font-bold text-sm bg-background-card border transition-all ${
            isNegative ? 'text-rose-500 border-rose-500/50 animate-pulse' : 'text-white border-border'
          }`}
        >
          {isNegative ? '-' : ''}{Math.abs(timeLeft)}s
        </button>
      )}

      <button
        type="button"
        onClick={() => setIsRunning(!isRunning)}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
          isRunning ? 'bg-amber-500/20 text-amber-500' : 'bg-background-elevated text-accent-cyan'
        }`}
      >
        {isRunning ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
      </button>

      {isRunning || timeLeft !== (initialSeconds || 60) ? (
        <button
          type="button"
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(initialSeconds || 60);
            hasBeepedZero.current = false;
            hasBeepedMinus60.current = false;
          }}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-background-elevated text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      ) : null}
    </div>
  );
};
