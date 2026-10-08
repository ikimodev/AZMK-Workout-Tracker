import React, { useState, useMemo } from 'react';
import { X, Search, ChevronDown, ChevronRight, Check, Dumbbell, Zap, Clock, BookOpen, Layers, Plus } from 'lucide-react';
import { Exercise } from '../../types';
import { getExerciseById, getAllExercises } from '../../data/mockExercises';
import { ExerciseThumbnail } from './ExerciseThumbnail';
import { EquipmentImage } from '../common/EquipmentImage';
import { motion, AnimatePresence } from 'framer-motion';

interface ExerciseReplaceModalProps {
  currentExerciseId: string | null;
  exerciseIndex: number | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAlternative: (exerciseIndex: number, newExerciseId: string) => void;
}

const EQUIPMENT_OPTIONS = [
  { id: 'All', name: 'All Equipment' },
  { id: 'Dumbbell', name: 'Dumbbell' },
  { id: 'Barbell', name: 'Barbell' },
  { id: 'Machine', name: 'Machine' },
  { id: 'Cable', name: 'Cable' },
  { id: 'Bodyweight', name: 'Bodyweight' }
];

const MUSCLE_GROUPS = {
  'Upper Body': ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Forearms', 'Core'],
  'Lower Body': ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves']
};

export const getSmartReplacements = (
  currentExercise: Exercise,
  allExercises: Exercise[],
  selectedEquipment?: string,
  selectedMuscle?: string
): Exercise[] => {
  return allExercises.filter(ex => {
    if (ex.id === currentExercise.id) return false;
    
    const targetMuscle = selectedMuscle || currentExercise.muscleGroup;
    const sameMuscle = ex.muscleGroup.toLowerCase() === targetMuscle.toLowerCase();
    
    const matchesEquipment = selectedEquipment && selectedEquipment !== 'All' 
      ? ex.equipment.toLowerCase() === selectedEquipment.toLowerCase()
      : true;

    return sameMuscle && matchesEquipment;
  });
};

export const ExerciseReplaceModal: React.FC<ExerciseReplaceModalProps> = ({
  currentExerciseId,
  exerciseIndex,
  isOpen,
  onClose,
  onSelectAlternative
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [showEquipmentPicker, setShowEquipmentPicker] = useState(false);
  const [showMusclePicker, setShowMusclePicker] = useState(false);

  if (!isOpen || !currentExerciseId || exerciseIndex === null) return null;

  const currentExercise = getExerciseById(currentExerciseId);
  const allExercises = getAllExercises();

  // If selectedMuscle is null, it defaults to currentExercise's muscle.
  const activeMuscle = selectedMuscle || currentExercise?.muscleGroup || 'Chest';

  const smartReplacements = currentExercise ? getSmartReplacements(currentExercise, allExercises, selectedEquipment, selectedMuscle || undefined) : [];
  
  // All exercises for this muscle (ignoring equipment filter, just to show the full library)
  const allMuscleExercises = allExercises.filter(ex => 
    ex.id !== currentExercise?.id && 
    ex.muscleGroup.toLowerCase() === activeMuscle.toLowerCase() &&
    !smartReplacements.find(s => s.id === ex.id) // exclude ones already in smart
  );

  const filteredSmart = smartReplacements.filter(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredAll = allMuscleExercises.filter(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSelect = (id: string) => {
    onSelectAlternative(exerciseIndex, id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] bg-background flex flex-col animate-fade-in pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border/30 bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <button onClick={onClose} className="text-slate-400 font-bold text-sm px-2 py-1">Cancel</button>
        <h2 className="text-lg font-black text-white">Replace Exercise</h2>
        <button onClick={onClose} className="text-accent-cyan font-bold text-sm px-2 py-1 flex items-center gap-1"><Plus className="w-4 h-4 hidden" /> </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-5">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search exercise..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background-elevated border border-border rounded-xl pl-11 pr-4 py-3.5 text-white font-medium placeholder:text-slate-500 focus:outline-none focus:border-accent-cyan/50"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 hide-scrollbar">
            <button 
              onClick={() => setShowEquipmentPicker(true)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border whitespace-nowrap transition-colors ${selectedEquipment !== 'All' ? 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan' : 'bg-background-elevated border-border text-slate-300'}`}
            >
              <span className="font-bold text-sm">{selectedEquipment === 'All' ? 'Equipment' : selectedEquipment}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowMusclePicker(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border whitespace-nowrap bg-background-elevated border-border text-slate-300 transition-colors"
            >
              <span className="font-bold text-sm">Muscle: {activeMuscle}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Smart Equivalents Section */}
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <Zap className="w-4 h-4 text-accent-cyan fill-accent-cyan/20" />
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Smart Equivalent</h3>
            </div>
            
            <div className="bg-background-card border border-border/50 rounded-2xl overflow-hidden divide-y divide-border/50 shadow-sm">
              {filteredSmart.length > 0 ? filteredSmart.map((ex) => (
                <div key={ex.id} onClick={() => handleSelect(ex.id)} className="flex items-center gap-3 p-3 hover:bg-background-elevated cursor-pointer transition-colors group">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-background shrink-0 border border-border/50">
                    <ExerciseThumbnail exerciseName={ex.name} images={ex.images} equipment={ex.equipment} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm sm:text-base line-clamp-1 group-hover:text-accent-cyan transition-colors">{ex.name}</h4>
                    <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded bg-background-elevated border border-border text-slate-400 mt-1 inline-block">{ex.equipment}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-accent-cyan shrink-0" />
                </div>
              )) : (
                <div className="p-6 text-center text-slate-400 text-sm">No exact matches found with these filters.</div>
              )}
            </div>
          </div>

          {/* All Exercises Section */}
          {filteredAll.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3 mt-6 px-1">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">All {activeMuscle}</h3>
              </div>
              
              <div className="bg-background-card border border-border/50 rounded-2xl overflow-hidden divide-y divide-border/50 shadow-sm">
                {filteredAll.map((ex) => (
                  <div key={ex.id} onClick={() => handleSelect(ex.id)} className="flex items-center gap-3 p-3 hover:bg-background-elevated cursor-pointer transition-colors group">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-background shrink-0 border border-border/50">
                      <ExerciseThumbnail exerciseName={ex.name} images={ex.images} equipment={ex.equipment} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm sm:text-base line-clamp-1 group-hover:text-slate-300 transition-colors">{ex.name}</h4>
                      <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded bg-background-elevated border border-border text-slate-400 mt-1 inline-block">{ex.equipment}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Equipment Picker Bottom Sheet */}
      <AnimatePresence>
        {showEquipmentPicker && (
          <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowEquipmentPicker(false)}>
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background-card w-full max-w-lg rounded-t-3xl border-t border-border shadow-2xl overflow-hidden pb-safe flex flex-col max-h-[80vh]"
            >
              <div className="flex justify-center p-3 shrink-0"><div className="w-12 h-1.5 bg-border rounded-full" /></div>
              <div className="px-6 pb-2 shrink-0">
                <h3 className="text-xl font-black text-white">Equipment</h3>
              </div>
              <div className="px-6 pb-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {EQUIPMENT_OPTIONS.map(eq => (
                    <button
                      key={eq.id}
                      onClick={() => { setSelectedEquipment(eq.id); setShowEquipmentPicker(false); }}
                      className={`flex flex-col items-center justify-center p-4 rounded-3xl border transition-all gap-2 relative overflow-hidden ${selectedEquipment === eq.id ? 'bg-accent-cyan/10 border-accent-cyan/50 shadow-[0_0_20px_rgba(34,211,238,0.15)] ring-1 ring-accent-cyan/20' : 'bg-background-card border-border/50 hover:bg-background-elevated hover:border-slate-500'}`}
                    >
                      {selectedEquipment === eq.id && <Check className="w-5 h-5 text-accent-cyan absolute top-3 right-3" />}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center drop-shadow-2xl">
                        {eq.id !== 'All' ? (
                          <EquipmentImage name={eq.id} className="w-full h-full object-contain" />
                        ) : (
                          <Layers className="w-8 h-8 text-slate-400" />
                        )}
                      </div>
                      <span className={`font-black text-sm sm:text-base tracking-wide ${selectedEquipment === eq.id ? 'text-accent-cyan' : 'text-slate-300'}`}>{eq.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Muscle Picker Bottom Sheet */}
      <AnimatePresence>
        {showMusclePicker && (
          <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowMusclePicker(false)}>
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background-card w-full max-w-lg rounded-t-3xl border-t border-border shadow-2xl overflow-hidden pb-safe flex flex-col max-h-[85vh]"
            >
              <div className="flex justify-center p-3 shrink-0"><div className="w-12 h-1.5 bg-border rounded-full" /></div>
              <div className="px-6 pb-2 shrink-0">
                <h3 className="text-xl font-black text-white">Muscle Group</h3>
              </div>
              <div className="px-6 pb-6 overflow-y-auto">
                {Object.entries(MUSCLE_GROUPS).map(([category, muscles]) => (
                  <div key={category} className="mt-6 first:mt-2">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3 px-1">{category}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {muscles.map(m => (
                        <button
                          key={m}
                          onClick={() => { setSelectedMuscle(m); setShowMusclePicker(false); }}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${activeMuscle === m ? 'bg-accent-emerald/10 border-accent-emerald/40 shadow-[0_0_15px_rgba(52,211,153,0.1)]' : 'bg-background-elevated border-border hover:border-slate-500'}`}
                        >
                          <span className={`font-bold ${activeMuscle === m ? 'text-accent-emerald' : 'text-slate-300'}`}>{m}</span>
                          {activeMuscle === m && <Check className="w-4 h-4 text-accent-emerald" />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
