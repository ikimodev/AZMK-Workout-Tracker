import React, { useEffect } from 'react';
import { Trophy, ArrowUpRight, Flame } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { motion, AnimatePresence } from 'framer-motion';

export const PRCelebrationModal: React.FC = () => {
  const { celebrationPR, dismissCelebrationPR } = useWorkout();

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (celebrationPR) {
      const timer = setTimeout(() => {
        dismissCelebrationPR();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [celebrationPR?.id, dismissCelebrationPR]);

  return (
    <AnimatePresence>
      {celebrationPR && (
        <div className="fixed top-12 left-0 right-0 z-[100] flex justify-center pointer-events-none px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-background-elevated/90 backdrop-blur-md border border-amber-500/50 rounded-full py-2.5 px-4 shadow-lg shadow-amber-500/10 flex items-center gap-3 pointer-events-auto cursor-pointer"
            onClick={dismissCelebrationPR}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shrink-0">
              <Trophy className="w-3.5 h-3.5 text-black fill-black" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest leading-none">New PR • {celebrationPR.exerciseName}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 leading-none">
                <span className="text-white text-xs font-bold font-mono">
                  {celebrationPR.value} kg {celebrationPR.reps ? `x ${celebrationPR.reps}` : ''}
                </span>
                <span className="text-emerald-400 text-[10px] font-bold font-mono flex items-center">
                  <ArrowUpRight className="w-2.5 h-2.5" />
                  +{celebrationPR.improvementPercentage}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
