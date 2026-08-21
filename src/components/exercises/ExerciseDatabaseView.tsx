import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  RefreshCw, 
  Filter, 
  ChevronRight, 
  Dumbbell, 
  X, 
  ExternalLink,
  Sparkles,
  Play
} from 'lucide-react';
import { YoutubeIcon } from '../common/YoutubeIcon';
import { MOCK_EXERCISES, getExerciseById, getAlternativeExercises, getAllExercises } from '../../data/mockExercises';
import { Exercise, MuscleGroup, Equipment } from '../../types';
import { useWorkout } from '../../context/WorkoutContext';
import { getExerciseDisplayName, getMuscleGroupDisplayName, getEquipmentDisplayName } from '../../i18n/fitnessDictionary';

interface ExerciseDatabaseViewProps {
  onNavigate: (tab: string) => void;
}

export const ExerciseDatabaseView: React.FC<ExerciseDatabaseViewProps> = ({ onNavigate }) => {
  const { startWorkout, language, t } = useWorkout();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('All');
  const [activeExerciseModal, setActiveExerciseModal] = useState<Exercise | null>(null);

  const muscles = [
    { id: 'All', labelAr: 'الكل', labelEn: 'All' },
    { id: 'Chest', labelAr: 'الصدر (Chest)', labelEn: 'Chest' },
    { id: 'Back', labelAr: 'الظهر (Back)', labelEn: 'Back' },
    { id: 'Quads', labelAr: 'الأرجل الأمامية (Quads)', labelEn: 'Quads' },
    { id: 'Hamstrings', labelAr: 'الأرجل الخلفية (Hamstrings)', labelEn: 'Hamstrings' },
    { id: 'Shoulders', labelAr: 'الأكتاف (Shoulders)', labelEn: 'Shoulders' },
    { id: 'Biceps', labelAr: 'البايسبس (Biceps)', labelEn: 'Biceps' },
    { id: 'Triceps', labelAr: 'الترايسبس (Triceps)', labelEn: 'Triceps' },
    { id: 'Core', labelAr: 'البطن والكور (Core)', labelEn: 'Core' }
  ];

  const equipments = [
    { id: 'All', labelAr: 'جميع الأدوات', labelEn: 'All' },
    { id: 'Barbell', labelAr: 'باربل (Barbell)', labelEn: 'Barbell' },
    { id: 'Dumbbell', labelAr: 'دامبلز (Dumbbell)', labelEn: 'Dumbbell' },
    { id: 'Cable', labelAr: 'كيبل (Cable)', labelEn: 'Cable' },
    { id: 'Machine', labelAr: 'أجهزة (Machine)', labelEn: 'Machine' },
    { id: 'Bodyweight', labelAr: 'وزن الجسم (Bodyweight)', labelEn: 'Bodyweight' },
    { id: 'Smith Machine', labelAr: 'سميث (Smith)', labelEn: 'Smith Machine' }
  ];

  // Arabic keyword mapping for smart multi-lingual fitness searches
  const normalizeArabicSearch = (query: string, ex: Exercise): boolean => {
    const q = query.trim().toLowerCase();
    if (!q) return true;

    // Direct English matching
    if (
      ex.name.toLowerCase().includes(q) ||
      ex.movementPattern.toLowerCase().includes(q) ||
      ex.instructions.toLowerCase().includes(q) ||
      (ex.instructionsAr && ex.instructionsAr.includes(q))
    ) {
      return true;
    }

    // Arabic keyword associations
    const arabicMappings: Record<string, string[]> = {
      'صدر': ['chest', 'bench', 'fly', 'push'],
      'بنش': ['bench', 'chest', 'press'],
      'ظهر': ['back', 'row', 'lat', 'pulldown', 'deadlift', 'pull'],
      'سحب': ['pulldown', 'row', 'pull'],
      'كتف': ['shoulder', 'press', 'lateral', 'delt', 'overhead', 'ohp'],
      'اكتاف': ['shoulder', 'press', 'lateral', 'delt', 'overhead'],
      'ارجل': ['quad', 'squat', 'leg', 'hamstring', 'calf', 'calves'],
      'رجول': ['quad', 'squat', 'leg', 'hamstring'],
      'فخذ': ['quad', 'squat', 'leg', 'hamstring'],
      'سكوات': ['squat', 'leg press', 'hack'],
      'ديدلفت': ['deadlift', 'rdl', 'hinge'],
      'باي': ['bicep', 'curl'],
      'بايسبس': ['bicep', 'curl'],
      'تراي': ['tricep', 'pushdown', 'extension', 'skull'],
      'ترايسبس': ['tricep', 'pushdown', 'extension', 'skull'],
      'بطن': ['core', 'abs', 'leg raise', 'woodchopper'],
      'بار': ['barbell'],
      'دامبل': ['dumbbell'],
      'كيبل': ['cable'],
      'جهاز': ['machine'],
      'وزن الجسم': ['bodyweight', 'push ups', 'pull ups', 'dips']
    };

    for (const [arKey, enTerms] of Object.entries(arabicMappings)) {
      if (q.includes(arKey)) {
        for (const term of enTerms) {
          if (
            ex.name.toLowerCase().includes(term) ||
            ex.muscleGroup.toLowerCase().includes(term) ||
            ex.equipment.toLowerCase().includes(term) ||
            ex.movementPattern.toLowerCase().includes(term)
          ) {
            return true;
          }
        }
      }
    }

    return false;
  };

  const allExList = getAllExercises();

  const filteredExercises = allExList.filter(ex => {
    const matchesSearch = normalizeArabicSearch(searchQuery, ex);
    const matchesMuscle = selectedMuscle === 'All' || ex.muscleGroup === selectedMuscle;
    const matchesEquipment = selectedEquipment === 'All' || ex.equipment === selectedEquipment;

    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  const openYoutube = (query: string) => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-background-card border border-border rounded-3xl p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-accent-emerald">{t('exerciseDirectory')}</span>
            <h1 className="text-2xl font-black text-white mt-1">{t('exerciseDatabaseTitle')} ({allExList.length} Movements)</h1>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'ar' 
                ? 'أسماء التمارين الرياضية العالمية بالإنجليزية مع شرح الأداء والبدائل الحركية بالعربية.'
                : 'With biomechanical classifications, alternatives, and YouTube form guides.'}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-5">
          <Search className="absolute left-4 rtl:left-auto rtl:right-4 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-11 rtl:pl-4 rtl:pr-11 pr-4 py-3 bg-background-elevated border border-border rounded-2xl text-white text-sm focus:outline-none focus:border-accent-emerald shadow-inner"
          />
        </div>

        {/* Filters */}
        <div className="space-y-2.5 mt-4 pt-4 border-t border-border/70">
          {/* Muscle Group Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono mr-1 rtl:mr-0 rtl:ml-1 shrink-0">
              {language === 'ar' ? 'العضلة:' : 'Muscle:'}
            </span>
            {muscles.map(m => {
              const isSelected = selectedMuscle === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMuscle(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-accent-emerald text-black font-bold shadow-sm'
                      : 'bg-background-elevated text-slate-300 hover:text-white border border-border'
                  }`}
                >
                  <span>{language === 'ar' ? m.labelAr : m.labelEn}</span>
                  {isSelected && <span className="text-[10px] font-bold">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Equipment Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase font-mono mr-1 rtl:mr-0 rtl:ml-1 shrink-0">
              {language === 'ar' ? 'المعدات:' : 'Gear:'}
            </span>
            {equipments.map(eq => {
              const isSelected = selectedEquipment === eq.id;
              return (
                <button
                  key={eq.id}
                  onClick={() => setSelectedEquipment(eq.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-accent-cyan text-black font-bold shadow-sm'
                      : 'bg-background-elevated text-slate-300 hover:text-white border border-border'
                  }`}
                >
                  <span>{language === 'ar' ? eq.labelAr : eq.labelEn}</span>
                  {isSelected && <span className="text-[10px] font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map(ex => (
          <div
            key={ex.id}
            onClick={() => setActiveExerciseModal(ex)}
            className="bg-background-card border border-border hover:border-slate-600 rounded-3xl p-5 shadow-card cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20">
                  {getMuscleGroupDisplayName(ex.muscleGroup, language)}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {getEquipmentDisplayName(ex.equipment, language)}
                </span>
              </div>

              <h3 className="font-bold text-base text-white group-hover:text-accent-emerald transition-colors font-mono">
                {getExerciseDisplayName(ex.id, language)}
              </h3>
              
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {language === 'ar' ? 'النمط الحركي:' : 'Pattern:'} {ex.movementPattern}
              </p>

              <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                {language === 'ar' && ex.instructionsAr ? ex.instructionsAr : ex.instructions}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-border/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1 font-semibold group-hover:text-white transition-colors">
                <span>{language === 'ar' ? 'شرح الأداء والبدائل' : 'View Form & Swaps'}</span>
                <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openYoutube(ex.youtubeQuery);
                }}
                className="p-1.5 rounded-lg bg-background-elevated hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-border transition-all flex items-center gap-1"
                title="Watch form on YouTube"
              >
                <YoutubeIcon className="w-4 h-4 text-rose-500" />
                <span className="text-[10px] font-bold text-rose-400">YouTube</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED EXERCISE MODAL */}
      {activeExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-background-card border border-border rounded-3xl max-w-lg w-full p-6 relative shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveExerciseModal(null)}
              className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-white p-2 rounded-full bg-background-elevated"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30">
                {activeExerciseModal.muscleGroup}
              </span>
              <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded-full bg-background-elevated border border-border">
                {activeExerciseModal.equipment}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white font-mono">{activeExerciseModal.name}</h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">Biomechanical Pattern: {activeExerciseModal.movementPattern}</p>

            {/* Instruction Box */}
            <div className="mt-4 p-4 rounded-2xl bg-background-elevated border border-border/80 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent-emerald font-mono">
                {language === 'ar' ? 'طريقة الأداء الصحيحة (Proper Form)' : 'Proper Form & Execution'}
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                {language === 'ar' && activeExerciseModal.instructionsAr 
                  ? activeExerciseModal.instructionsAr 
                  : activeExerciseModal.instructions}
              </p>
            </div>

            {/* YouTube Search Button */}
            <div className="mt-4">
              <button
                onClick={() => openYoutube(activeExerciseModal.youtubeQuery)}
                className="w-full py-3 px-4 rounded-2xl bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/40 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <YoutubeIcon className="w-4 h-4 text-rose-500" />
                <span>{t('watchTutorials')} ("{activeExerciseModal.name}")</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            {/* Biomechanical Alternatives */}
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                {t('biomechanicalAlts')}
              </h4>
              
              <div className="space-y-2">
                {getAlternativeExercises(activeExerciseModal.id).map(alt => (
                  <div
                    key={alt.id}
                    onClick={() => setActiveExerciseModal(alt)}
                    className="p-3 rounded-2xl bg-background-elevated hover:bg-background-hover border border-border flex items-center justify-between cursor-pointer transition-all group"
                  >
                    <div>
                      <h5 className="font-bold text-xs text-white group-hover:text-accent-emerald font-mono">{alt.name}</h5>
                      <span className="text-[10px] text-slate-400 font-mono">{alt.equipment} • {alt.movementPattern}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white rtl:rotate-180" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
