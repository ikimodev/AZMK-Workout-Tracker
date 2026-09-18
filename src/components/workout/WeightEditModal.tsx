import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkout } from '../../context/WorkoutContext';

interface WeightEditModalProps {
  isOpen: boolean;
  initialWeight: number;
  exerciseIndex: number;
  setIndex: number;
  onClose: () => void;
  onSave: (exerciseIndex: number, setIndex: number, newWeight: number) => void;
}

export const WeightEditModal: React.FC<WeightEditModalProps> = ({
  isOpen,
  initialWeight,
  exerciseIndex,
  setIndex,
  onClose,
  onSave
}) => {
  const { t } = useWorkout();
  const [weight, setWeight] = useState<string>(initialWeight.toString());

  useEffect(() => {
    if (isOpen) {
      setWeight(initialWeight.toString());
    }
  }, [isOpen, initialWeight]);

  const handleSave = () => {
    const val = parseFloat(weight);
    if (!isNaN(val)) {
      onSave(exerciseIndex, setIndex, val);
    }
    onClose();
  };

  const handleQuickAdd = (amount: number) => {
    const current = parseFloat(weight) || 0;
    const newWeight = Math.max(0, current + amount);
    setWeight(newWeight.toString());
    
    // Auto-save immediately to save a click
    onSave(exerciseIndex, setIndex, newWeight);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Bottom Sheet / Modal */}
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className="bg-background-card border border-border w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-6 relative shadow-2xl pb-10 sm:pb-6 z-10 touch-none"
          >
            
            {/* Drag Handle for Mobile */}
            <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto mb-6 sm:hidden cursor-grab active:cursor-grabbing" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">
              {t('weightKgCol') || 'Weight (KG)'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Set {setIndex + 1}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-full bg-background-elevated"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <div className="mb-6 relative">
          <input
            type="number"
            step="0.5"
            inputMode="decimal"
            autoFocus
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full text-center text-5xl font-black font-mono bg-background-elevated border-2 border-border focus:border-accent-emerald text-white rounded-2xl py-6 focus:outline-none transition-colors"
            placeholder="0"
          />
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono text-xl">
            KG
          </span>
        </div>

        {/* Quick adjustments */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          <button onClick={() => handleQuickAdd(-5)} className="py-3 rounded-xl bg-background-elevated hover:bg-background-hover border border-border text-slate-300 font-bold text-sm">
            -5
          </button>
          <button onClick={() => handleQuickAdd(-2.5)} className="py-3 rounded-xl bg-background-elevated hover:bg-background-hover border border-border text-slate-300 font-bold text-sm">
            -2.5
          </button>
          <button onClick={() => handleQuickAdd(2.5)} className="py-3 rounded-xl bg-background-elevated hover:bg-background-hover border border-border text-slate-300 font-bold text-sm">
            +2.5
          </button>
          <button onClick={() => handleQuickAdd(5)} className="py-3 rounded-xl bg-background-elevated hover:bg-background-hover border border-border text-slate-300 font-bold text-sm">
            +5
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-accent-emerald to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-lg uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow transition-all active:scale-95"
        >
          <Check className="w-6 h-6 stroke-[3]" />
          <span>Save Weight</span>
        </button>

      </motion.div>
    </div>
      )}
    </AnimatePresence>
  );
};
