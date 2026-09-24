import React, { useEffect } from 'react';
import { Trophy, X, ArrowUpRight, Flame } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';
import { motion, AnimatePresence } from 'framer-motion';

export const PRCelebrationModal: React.FC = () => {
  const { celebrationPR, dismissCelebrationPR } = useWorkout();

  // Auto-dismiss after 5 seconds. Dependency array only includes celebrationPR.id 
  // to avoid resetting the timer if context re-renders.
  useEffect(() => {
    if (celebrationPR) {
      const timer = setTimeout(() => {
        dismissCelebrationPR();
      }, 5000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celebrationPR?.id]);

  return (
    <AnimatePresence>
      {celebrationPR && (
        <div className="fixed top-6 left-4 right-4 z-[100] flex items-center justify-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.8, bottom: 0 }}
            onDragEnd={(e, { offset, velocity }) => {
              // Dismiss if swiped up significantly
              if (offset.y < -40 || velocity.y < -200) {
                dismissCelebrationPR();
              }
            }}
            className="bg-background-card/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3 shadow-2xl shadow-amber-500/10 pointer-events-auto w-full max-w-sm flex items-center gap-3 relative cursor-grab active:cursor-grabbing"
          >
            {/* Swipe Indicator */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-slate-500/30" />

            {/* Trophy Icon */}
            <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-glow-sm">
              <Trophy className="w-6 h-6 text-black fill-black" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">New PR!</span>
              </div>
              <h3 className="text-sm font-bold text-white truncate">
                {celebrationPR.exerciseName}
              </h3>
              <div className="flex items-center gap-3 text-xs mt-0.5">
                <span className="text-accent-emerald font-mono font-bold">
                  {celebrationPR.value} kg {celebrationPR.reps ? `x ${celebrationPR.reps}` : ''}
                </span>
                <span className="text-emerald-400 font-mono font-medium flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  +{celebrationPR.improvementPercentage}%
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={dismissCelebrationPR}
              className="absolute top-2 right-2 text-slate-400 hover:text-white p-1 rounded-full bg-background-elevated transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

