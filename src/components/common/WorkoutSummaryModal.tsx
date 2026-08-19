import React from 'react';
import { CheckCircle2, Trophy, Clock, Weight, TrendingUp, Sparkles, X, ArrowRight } from 'lucide-react';
import { WorkoutSession } from '../../types';

interface WorkoutSummaryModalProps {
  session: WorkoutSession | null;
  onClose: () => void;
  onViewProgress: () => void;
}

export const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({ 
  session, 
  onClose, 
  onViewProgress 
}) => {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-background-card border border-accent-emerald/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl animate-slide-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full bg-background-elevated transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-accent-emerald/20 border border-accent-emerald/40 flex items-center justify-center text-accent-emerald shadow-glow-sm">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-accent-emerald">SESSION LOGGED</span>
            <h2 className="text-2xl font-black text-white">{session.name}</h2>
          </div>
        </div>

        {/* 4 Core Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          
          <div className="p-3 bg-background-elevated rounded-2xl border border-border text-center">
            <div className="flex items-center justify-center text-slate-400 mb-1">
              <Weight className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Volume</p>
            <p className="text-lg font-black font-mono text-white">
              {session.totalVolumeKg.toLocaleString()} <span className="text-xs text-slate-400 font-normal">kg</span>
            </p>
          </div>

          <div className="p-3 bg-background-elevated rounded-2xl border border-border text-center">
            <div className="flex items-center justify-center text-slate-400 mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Duration</p>
            <p className="text-lg font-black font-mono text-white">
              {session.durationMinutes} <span className="text-xs text-slate-400 font-normal">min</span>
            </p>
          </div>

          <div className="p-3 bg-background-elevated rounded-2xl border border-border text-center">
            <div className="flex items-center justify-center text-amber-400 mb-1">
              <Trophy className="w-4 h-4 fill-amber-400/20" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">PRs Hit</p>
            <p className="text-lg font-black font-mono text-amber-400">
              {session.prCount}
            </p>
          </div>

          <div className="p-3 bg-background-elevated rounded-2xl border border-border text-center">
            <div className="flex items-center justify-center text-accent-emerald mb-1">
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Progress</p>
            <p className="text-lg font-black font-mono text-emerald-400">
              +4.8%
            </p>
          </div>

        </div>

        {/* AI Performance Breakdown Box */}
        {session.aiSummary && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-accent-indigo/15 to-accent-cyan/10 border border-accent-indigo/30 mb-6">
            <div className="flex items-center gap-2 text-accent-indigo text-xs font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>AI Coach Performance Analysis</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {session.aiSummary}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onViewProgress}
            className="flex-1 py-3 px-4 rounded-xl bg-background-elevated hover:bg-background-hover text-white text-sm font-bold border border-border flex items-center justify-center gap-2 transition-all"
          >
            <TrendingUp className="w-4 h-4 text-accent-cyan" />
            <span>View Progress Charts</span>
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-accent-emerald hover:bg-emerald-400 text-black text-sm font-extrabold flex items-center justify-center gap-2 shadow-glow-sm transition-all"
          >
            <span>Done</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
