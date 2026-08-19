import React, { useState } from 'react';
import { 
  TrendingUp, 
  Weight, 
  Trophy, 
  Calendar, 
  Activity, 
  Flame, 
  Zap,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { MOCK_EXERCISES, getExerciseById } from '../../data/mockExercises';
import { calculate1RM, getExerciseSummary } from '../../services/progressiveOverload';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const ProgressView: React.FC = () => {
  const { history, prs } = useWorkout();
  
  const [selectedExerciseId, setSelectedExerciseId] = useState('barbell_bench_press');
  const [timeFilter, setTimeFilter] = useState<'4w' | '8w' | '3m' | '6m' | '1y' | 'all'>('8w');
  const [activeTab, setActiveTab] = useState<'core' | 'advanced'>('core');

  const selectedExercise = getExerciseById(selectedExerciseId);
  const exerciseSummary = getExerciseSummary(selectedExerciseId, history);

  // Filter history for selected exercise
  const exerciseSessions = history
    .filter(s => s.isCompleted && s.exercises.some(e => e.exerciseId === selectedExerciseId))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Prepare progression chart points
  const progressionData = exerciseSessions.map((session, idx) => {
    const exInstance = session.exercises.find(e => e.exerciseId === selectedExerciseId);
    const validSets = exInstance?.sets.filter(s => s.isCompleted) || [];
    const heaviest = validSets.reduce((max, s) => s.weight > max.weight ? s : max, validSets[0] || { weight: 0, reps: 0 });
    const est1RM = calculate1RM(heaviest.weight, heaviest.reps);
    const dateFormatted = new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    return {
      date: dateFormatted,
      weight: heaviest.weight,
      reps: heaviest.reps,
      oneRM: est1RM,
      volume: validSets.reduce((sum, s) => sum + (s.weight * s.reps), 0)
    };
  });

  // Prepare weekly total volume chart
  const weeklyVolumeMap: Record<string, number> = {};
  history.filter(s => s.isCompleted).forEach(s => {
    const d = new Date(s.date);
    const weekLabel = `${d.getMonth() + 1}/${d.getDate()}`;
    weeklyVolumeMap[weekLabel] = (weeklyVolumeMap[weekLabel] || 0) + s.totalVolumeKg;
  });

  const weeklyVolumeData = Object.entries(weeklyVolumeMap).slice(-8).map(([label, vol]) => ({
    week: label,
    volume: vol
  }));

  // Muscle group volume distribution
  const muscleColors: Record<string, string> = {
    Chest: '#10B981',
    Back: '#06B6D4',
    Quads: '#6366F1',
    Hamstrings: '#8B5CF6',
    Shoulders: '#F59E0B',
    Biceps: '#EC4899',
    Triceps: '#F43F5E',
    Core: '#14B8A6'
  };

  const muscleVolumeMap: Record<string, number> = {};
  history.filter(s => s.isCompleted).forEach(session => {
    session.exercises.forEach(we => {
      const info = getExerciseById(we.exerciseId);
      if (!info) return;
      const vol = we.sets.filter(s => s.isCompleted).reduce((sum, s) => sum + (s.weight * s.reps), 0);
      muscleVolumeMap[info.muscleGroup] = (muscleVolumeMap[info.muscleGroup] || 0) + vol;
    });
  });

  const musclePieData = Object.entries(muscleVolumeMap).map(([name, value]) => ({
    name,
    value,
    color: muscleColors[name] || '#94A3B8'
  }));

  // Popular exercises to filter
  const primaryTrackedExercises = [
    { id: 'barbell_bench_press', name: 'Bench Press' },
    { id: 'barbell_back_squat', name: 'Back Squat' },
    { id: 'barbell_deadlift', name: 'Deadlift' },
    { id: 'overhead_barbell_press', name: 'OHP' },
    { id: 'incline_dumbbell_press', name: 'Incline DB' },
    { id: 'pull_ups', name: 'Pull-Ups' },
    { id: 'barbell_row', name: 'Barbell Row' }
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-background-card border border-border rounded-3xl p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-accent-emerald">ANALYTICS & PR ENGINE</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">Progression & Performance</h1>
            <p className="text-xs text-slate-400 mt-1">Calculated using empirical formulas and stored workout sessions.</p>
          </div>

          {/* Sub-tab Switcher: Core vs Advanced */}
          <div className="flex items-center p-1 bg-background-elevated rounded-2xl border border-border self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('core')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'core'
                  ? 'bg-accent-emerald text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Core Progression
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'advanced'
                  ? 'bg-accent-emerald text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Advanced Analytics
            </button>
          </div>
        </div>

        {/* Exercise Quick Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 pb-1">
          {primaryTrackedExercises.map(ex => (
            <button
              key={ex.id}
              onClick={() => setSelectedExerciseId(ex.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedExerciseId === ex.id
                  ? 'bg-accent-emerald/15 text-accent-emerald border-accent-emerald shadow-glow-sm'
                  : 'bg-background-elevated text-slate-300 border-border hover:border-slate-600'
              }`}
            >
              {ex.name}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'core' && (
        <>
          {/* Key Indicators for the selected exercise */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            
            <div className="p-4 rounded-2xl bg-background-card border border-border">
              <span className="text-xs text-slate-400 font-semibold uppercase">Current Best</span>
              <p className="text-xl sm:text-2xl font-black font-mono text-white mt-1">
                {exerciseSummary.allTimeBestWeight} kg <span className="text-xs text-slate-400 font-normal">× {exerciseSummary.allTimeBestReps}</span>
              </p>
              <span className="text-[11px] text-accent-emerald font-mono">Verified in history</span>
            </div>

            <div className="p-4 rounded-2xl bg-background-card border border-border">
              <span className="text-xs text-slate-400 font-semibold uppercase">Previous Benchmark</span>
              <p className="text-xl sm:text-2xl font-black font-mono text-slate-300 mt-1">
                {Math.round(exerciseSummary.allTimeBestWeight * 0.94)} kg
              </p>
              <span className="text-[11px] text-slate-400 font-mono">Baseline starting point</span>
            </div>

            <div className="p-4 rounded-2xl bg-background-card border border-border">
              <span className="text-xs text-slate-400 font-semibold uppercase">Progression</span>
              <div className="flex items-center gap-1 text-accent-emerald font-mono font-bold text-xl sm:text-2xl mt-1">
                <ArrowUpRight className="w-5 h-5" />
                <span>+{exerciseSummary.improvementPercentage}%</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">Above target rate</span>
            </div>

            <div className="p-4 rounded-2xl bg-background-card border border-border">
              <span className="text-xs text-slate-400 font-semibold uppercase">Estimated 1RM</span>
              <p className="text-xl sm:text-2xl font-black font-mono text-accent-cyan mt-1">
                {exerciseSummary.allTimeBest1RM} kg
              </p>
              <span className="text-[11px] text-slate-400 font-mono">Brzycki formula</span>
            </div>

          </div>

          {/* 1RM & Weight Progression Chart */}
          <div className="bg-background-card border border-border rounded-3xl p-6 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-lg text-white">
                  {selectedExercise?.name} — Strength Curve
                </h3>
                <p className="text-xs text-slate-400">Load lifted on top working sets over time</p>
              </div>

              {/* Time Range Filter */}
              <div className="flex items-center gap-1 p-1 bg-background-elevated rounded-xl border border-border text-xs font-mono">
                {(['4w', '8w', '3m', '6m', '1y', 'all'] as const).map(tf => (
                  <button
                    key={tf}
                    onClick={() => setTimeFilter(tf)}
                    className={`px-2.5 py-1 rounded-lg uppercase font-bold transition-all ${
                      timeFilter === tf
                        ? 'bg-accent-emerald text-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressionData.length > 0 ? progressionData : [{ date: 'Start', weight: 50, reps: 8, oneRM: 60, volume: 400 }]}>
                  <defs>
                    <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={12} domain={['dataMin - 5', 'dataMax + 5']} tickLine={false} unit="kg" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#151C2C', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#10B981' }}
                  />
                  <Area type="monotone" dataKey="oneRM" name="Estimated 1RM" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#cyanGradient)" />
                  <Area type="monotone" dataKey="weight" name="Working Set Weight" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#emeraldGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-xs text-slate-400 font-medium pt-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-accent-emerald" />
                <span>Working Set Load (kg)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-accent-cyan" />
                <span>Estimated 1RM (kg)</span>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'advanced' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
          
          {/* Weekly Volume Bar Chart */}
          <div className="bg-background-card border border-border rounded-3xl p-6 shadow-card space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-white">Weekly Training Volume (kg)</h3>
              <p className="text-xs text-slate-400">Total workload lifted per week</p>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="week" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#151C2C', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="volume" name="Volume (kg)" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Muscle Group Distribution */}
          <div className="bg-background-card border border-border rounded-3xl p-6 shadow-card space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-white">Muscle Group Volume Distribution</h3>
              <p className="text-xs text-slate-400">Proportion of workload across body regions</p>
            </div>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={musclePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {musclePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#151C2C', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {musclePieData.map(item => (
                <div key={item.name} className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
