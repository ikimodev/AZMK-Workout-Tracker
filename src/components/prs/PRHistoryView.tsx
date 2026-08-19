import React, { useState } from 'react';
import { Trophy, Flame, TrendingUp, Calendar, ArrowUpRight, Award, Zap } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

export const PRHistoryView: React.FC = () => {
  const { prs } = useWorkout();
  const [filterType, setFilterType] = useState<'all' | 'weight' | 'reps' | 'volume'>('all');

  const filteredPRs = prs.filter(p => filterType === 'all' || p.type === filterType);

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-background-card border border-border rounded-3xl p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-amber-400">HALL OF FAME</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Personal Records ({prs.length} PRs)</h1>
          <p className="text-xs text-slate-400 mt-1">Automatically detected records across maximum weight, reps, and session tonnage.</p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 p-1 bg-background-elevated rounded-2xl border border-border">
          {(['all', 'weight', 'reps', 'volume'] as const).map(ft => (
            <button
              key={ft}
              onClick={() => setFilterType(ft)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase font-mono transition-all ${
                filterType === ft
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {ft}
            </button>
          ))}
        </div>
      </div>

      {/* PR Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPRs.map(pr => {
          const isWeight = pr.type === 'weight';
          const isRep = pr.type === 'reps';
          const isVol = pr.type === 'volume';

          return (
            <div
              key={pr.id}
              className="bg-background-card border border-border hover:border-amber-500/40 rounded-3xl p-5 shadow-card space-y-4 flex flex-col justify-between transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                      {isWeight ? 'NEW HEAVY WEIGHT PR' : isRep ? 'NEW MAX REP PR' : 'NEW TOTAL VOLUME PR'}
                    </span>
                    <h3 className="font-bold text-base text-white">{pr.exerciseName}</h3>
                  </div>
                </div>

                <span className="text-xs text-slate-400 font-mono">
                  {new Date(pr.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>

              {/* Numbers */}
              <div className="p-4 bg-background-elevated rounded-2xl border border-border/80 flex items-center justify-around">
                <div className="text-center">
                  <p className="text-[11px] text-slate-400 font-medium">Record Value</p>
                  <p className="text-2xl font-black font-mono text-white mt-0.5">
                    {pr.value} <span className="text-xs text-slate-400 font-normal">{isWeight ? 'kg' : isRep ? 'reps' : 'kg vol'}</span>
                  </p>
                  {pr.reps && isWeight && (
                    <p className="text-xs text-slate-400 font-mono">for {pr.reps} reps</p>
                  )}
                </div>

                <div className="h-10 w-px bg-border" />

                <div className="text-center">
                  <p className="text-[11px] text-slate-400 font-medium">Improvement</p>
                  <div className="flex items-center justify-center gap-0.5 text-accent-emerald font-mono font-bold text-lg mt-0.5">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+{pr.improvementPercentage}%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">vs {pr.previousBest}</p>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
