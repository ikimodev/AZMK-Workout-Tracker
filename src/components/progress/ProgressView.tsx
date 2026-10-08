import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search,
  ChevronDown,
  Sparkles,
  Lock,
  ArrowUpRight,
  Activity,
  Plus
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { getExerciseById } from '../../data/mockExercises';
import { calculate1RM, getExerciseSummary } from '../../services/progressiveOverload';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

interface ProgressViewProps {
  onNavigate?: (tab: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ onNavigate }) => {
  const { history, user, language, startTodaysAutocompleteWorkout } = useWorkout();
  
  const [selectedExerciseId, setSelectedExerciseId] = useState('barbell_bench_press');
  const [timeFilter, setTimeFilter] = useState('8w');

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

  const hasEnoughData = progressionData.length >= 2;

  // Mock progression data for ghost chart
  const ghostData = [
    { date: 'W1', weight: 40 },
    { date: 'W2', weight: 45 },
    { date: 'W3', weight: 55 },
    { date: 'W4', weight: 65 },
    { date: 'W5', weight: 70 },
  ];

  // Calculate Next AI Target (mock logic for UI)
  const currentBestWeight = exerciseSummary.allTimeBestWeight || 0;
  const currentBestReps = exerciseSummary.allTimeBestReps || 0;
  const nextTargetWeight = currentBestWeight > 0 ? currentBestWeight + 2.5 : 40;
  const nextTargetReps = currentBestReps > 0 ? currentBestReps : 8;
  
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

  const isPro = user?.tier === 'premium';

  return (
    <div className="space-y-4 pb-24 animate-fade-in max-w-5xl mx-auto">
      
      {/* 1. Header & Exercise Chips */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-4 px-2">
          <h1 className="text-lg font-black text-white">{language === 'ar' ? 'التطور والإحصائيات' : 'Progression & Analytics'}</h1>
          <button className="p-2 rounded-full bg-background-elevated text-slate-400 hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar px-2">
          {primaryTrackedExercises.map(ex => {
            const exSummary = getExerciseSummary(ex.id, history);
            const isSelected = selectedExerciseId === ex.id;
            return (
              <button
                key={ex.id}
                onClick={() => setSelectedExerciseId(ex.id)}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-accent-emerald/15 text-accent-emerald border-accent-emerald shadow-glow-sm'
                    : 'bg-background-card text-slate-300 border-border hover:border-slate-600'
                }`}
              >
                <span className={`text-[11px] sm:text-xs font-bold ${isSelected ? 'text-accent-emerald' : 'text-slate-300'}`}>
                  {ex.name}
                </span>
                <span className={`text-[9px] font-mono mt-0.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {exSummary.allTimeBestWeight > 0 ? `${exSummary.allTimeBestWeight} kg` : '--'}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. AI SMART TARGET (Teaser style instead of Full Blur) */}
      <div className="mx-2 p-[1px] rounded-3xl bg-gradient-to-r from-accent-emerald/40 to-accent-cyan/40 shadow-glow-sm">
        <div className="p-5 rounded-[23px] bg-background-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-emerald" />
              <h3 className="text-xs font-extrabold text-accent-emerald uppercase tracking-widest">
                {language === 'ar' ? 'هدف الجلسة القادمة ⚡' : 'AI Target for Next Workout ⚡'}
              </h3>
            </div>
            {!isPro && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[9px] font-bold border border-amber-500/20">
                PRO 👑
              </span>
            )}
          </div>

          <p className="text-sm sm:text-base font-bold text-slate-200 leading-snug mb-3">
            {language === 'ar' ? 'استناداً لجلستك الأخيرة:' : 'Based on your last session:'} <span className="text-white">{nextTargetWeight} kg × {nextTargetReps} reps</span>
          </p>

          {!isPro ? (
            <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 text-amber-500 font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
              <Lock className="w-3.5 h-3.5" />
              {language === 'ar' ? 'توصية الذكاء الاصطناعي مقفلة للمشتركين 👑' : 'Unlock AI Recommendations 👑'}
            </button>
          ) : (
            <div className="inline-flex items-center self-start gap-1.5 px-3 py-1.5 rounded-lg bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald text-xs font-bold">
               <TrendingUp className="w-3.5 h-3.5" />
               <span>{language === 'ar' ? `زيادة مقترحة +${2.5} كجم` : '+2.5 kg Overload Recommendation'}</span>
             </div>
          )}
        </div>
      </div>

      {/* 3. COMPACT 2x1 METRIC BANNER */}
      <div className="mx-2 grid grid-cols-2 rounded-3xl bg-background-card border border-border divide-x divide-border overflow-hidden shadow-card">
        <div className="p-4 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{language === 'ar' ? 'أقصى وزن تقديري' : 'Estimated 1RM'}</span>
          <div className="flex items-end gap-2">
            <span className="text-xl font-black font-mono text-accent-cyan">
              {exerciseSummary.allTimeBest1RM > 0 ? exerciseSummary.allTimeBest1RM : '--'} <span className="text-xs text-slate-500 font-normal">kg</span>
            </span>
            {exerciseSummary.improvementPercentage > 0 && (
              <div className="flex items-center text-accent-emerald text-[11px] font-bold pb-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>+{exerciseSummary.improvementPercentage}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 flex flex-col justify-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{language === 'ar' ? 'أفضل أداء حالي' : 'Current Best'}</span>
          <div className="flex items-end gap-2">
            <span className="text-xl font-black font-mono text-white">
              {exerciseSummary.allTimeBestWeight > 0 ? exerciseSummary.allTimeBestWeight : '--'} <span className="text-xs text-slate-500 font-normal">kg</span>
            </span>
            {exerciseSummary.allTimeBestReps > 0 && (
              <span className="text-sm font-bold text-slate-400 pb-0.5">
                × {exerciseSummary.allTimeBestReps}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. STRENGTH CURVE */}
      <div className="mx-2 p-5 rounded-3xl bg-background-card border border-border shadow-card relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent-emerald" />
            {language === 'ar' ? 'منحنى القوة' : 'Strength Curve'}
          </h3>
          <div className="relative">
             <select 
               value={timeFilter}
               onChange={(e) => setTimeFilter(e.target.value)}
               className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-background-elevated border border-border text-xs font-bold text-white outline-none cursor-pointer"
             >
               <option value="4w">{language === 'ar' ? '4 أسابيع' : '4 Weeks'}</option>
               <option value="8w">{language === 'ar' ? '8 أسابيع' : '8 Weeks'}</option>
               <option value="3m">{language === 'ar' ? '3 أشهر' : '3 Months'}</option>
               <option value="6m">{language === 'ar' ? '6 أشهر' : '6 Months'}</option>
               <option value="all">{language === 'ar' ? 'الكل' : 'All Time'}</option>
             </select>
             <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="h-48 w-full -ml-3 relative z-10">
          {!hasEnoughData ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center pl-3">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={ghostData}>
                   <Area type="monotone" dataKey="weight" stroke="#334155" strokeWidth={2} strokeDasharray="5 5" fill="none" isAnimationActive={false} />
                 </AreaChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex items-center justify-center text-center px-8 bg-background-card/60 backdrop-blur-[1px]">
                 <p className="text-xs font-bold text-slate-400 leading-relaxed max-w-[200px]">
                   {language === 'ar' ? 'سجل جلستين على الأقل لرسم منحنى قوتك وتتبع أوزانك تلقائياً' : 'Log at least 2 sessions to draw your strength curve automatically'}
                 </p>
               </div>
             </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressionData}>
                <defs>
                  <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 2.5', 'dataMax + 5']} stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} width={40} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151C2C', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#10B981', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="weight" name="Working Weight" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#emeraldGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 5. RECENT WORKING SETS STRIP */}
      <div className="mx-2 p-5 rounded-3xl bg-background-card border border-border shadow-card">
        <h3 className="font-extrabold text-sm text-white mb-4">
          {language === 'ar' ? 'الجلسات الأخيرة' : 'Recent Working Sets'} <span className="text-slate-500 font-normal ml-1">{language === 'ar' ? '(آخر 3)' : '(Last 3)'}</span>
        </h3>
        
        {exerciseSessions.length > 0 ? (
          <div className="space-y-3">
            {exerciseSessions.slice(-3).reverse().map((session, i) => {
              const exInstance = session.exercises.find(e => e.exerciseId === selectedExerciseId);
              const sets = exInstance?.sets.filter(s => s.isCompleted) || [];
              const setString = sets.map(s => s.reps).join(', ');
              const weightStr = sets.length > 0 ? `${sets[0].weight} kg` : '0 kg';
              const dateStr = new Date(session.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald shrink-0" />
                  <div className="flex-1 flex items-center justify-between text-sm">
                    <span className="text-slate-300 font-mono w-16">{dateStr}:</span>
                    <span className="text-white font-bold font-mono">
                      {weightStr} × {setString}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2 opacity-50">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 p-2 rounded-lg bg-background-elevated border border-border border-dashed">
                <span>Set 1</span>
                <span>-- kg × -- reps</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 p-2 rounded-lg bg-background-elevated border border-border border-dashed">
                <span>Set 2</span>
                <span>-- kg × -- reps</span>
              </div>
            </div>
            <button 
              onClick={startTodaysAutocompleteWorkout}
              className="w-full py-2.5 rounded-xl bg-background-elevated border border-accent-emerald/30 text-accent-emerald text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 hover:bg-accent-emerald/10"
            >
              <Plus className="w-4 h-4" />
              {language === 'ar' ? 'سجل تمرينك الأول الآن' : 'Log Session Now'}
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
