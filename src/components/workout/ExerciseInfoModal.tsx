import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import stringSimilarity from 'string-similarity';
import { EquipmentImage } from '../common/EquipmentImage';

interface ExerciseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  fallbackEquipment?: string;
  fallbackTargetMuscle?: string;
}

interface ExerciseDetails {
  id: string;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  instructions: string[];
  images: string[];
}

// Module-level cache so we don't refetch the ~1MB json every time
let globalExercisesCache: ExerciseDetails[] | null = null;

const ExerciseInfoModal: React.FC<ExerciseInfoModalProps> = ({  
  isOpen, 
  onClose, 
  exerciseName,
  fallbackEquipment,
  fallbackTargetMuscle
}) => {
  const [details, setDetails] = useState<ExerciseDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen && exerciseName) {
      setLoading(true);
      setError(false);
      setDetails(null);
      setCurrentImageIndex(0);

      const fetchAndMatch = async () => {
        try {
          // 1. Fetch or use cached exercises dictionary
          let exercises = globalExercisesCache;
          if (!exercises) {
            const res = await fetch('/exercises.json');
            if (!res.ok) throw new Error('Failed to fetch exercises dictionary');
            exercises = await res.json() as ExerciseDetails[];
            globalExercisesCache = exercises;
          }

          // Preprocess string: remove text in parentheses e.g. "Lat Pulldown (Cable)" -> "Lat Pulldown"
          const cleanName = exerciseName.replace(/\(.*?\)/g, '').trim().toLowerCase();

          // 2. Exact match
          let matchedEx = exercises.find(ex => ex.name.toLowerCase() === cleanName || ex.name.toLowerCase() === exerciseName.toLowerCase());
          
          // 3. Fuzzy Match on clean name
          if (!matchedEx) {
            const names = exercises.map(ex => ex.name.toLowerCase());
            const match = stringSimilarity.findBestMatch(cleanName, names);
            
            // If confidence > 60%
            if (match.bestMatch.rating > 0.60) {
              matchedEx = exercises[match.bestMatchIndex];
            }
          }

          // 4. Fallback: Subset / Keyword Match
          if (!matchedEx) {
            const cleanWords = cleanName.split(' ').filter(w => w.length > 2); // get meaningful words
            if (cleanWords.length > 0) {
              matchedEx = exercises.find(ex => {
                const exNameLower = ex.name.toLowerCase();
                // Check if all major words in our cleanName exist in the target name
                return cleanWords.every(word => exNameLower.includes(word));
              });
            }
          }

          if (matchedEx) {
            setDetails(matchedEx);
          } else {
            setError(true);
          }
        } catch (err) {
          console.error(err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchAndMatch();
    }
  }, [isOpen, exerciseName]);

  // Simulate a GIF by toggling between the two static images every 1.5 seconds
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (details && details.images && details.images.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev === 0 ? 1 : 0));
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [details]);

  const renderImage = () => {
    if (!details || !details.images || details.images.length === 0) return null;
    const imagePath = details.images[currentImageIndex];
    const imageUrl = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${imagePath}`;
    
    return (
      <div className="w-full h-48 sm:h-64 bg-gray-900 rounded-xl overflow-hidden mb-6 relative border border-gray-800 shadow-inner flex items-center justify-center">
        <img 
          src={imageUrl} 
          alt={details.name}
          className="w-full h-full object-contain"
        />
        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-gray-400 font-mono tracking-wider">
          VISUAL
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 300) {
                onClose();
              }
            }}
            className="fixed inset-x-0 bottom-0 z-50 bg-gray-950 border-t border-gray-800 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-gray-950/95 backdrop-blur-md pt-4 pb-3 px-6 border-b border-gray-800/50 flex justify-between items-center z-10">
              <div className="w-12 h-1.5 bg-gray-800 rounded-full absolute top-2 left-1/2 -translate-x-1/2" />
              <h2 className="text-xl font-bold text-white mt-2 capitalize truncate pr-4">
                {details ? details.name : exerciseName}
              </h2>
              <button 
                onClick={onClose}
                className="mt-2 p-2 rounded-full bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-400 text-sm animate-pulse">Loading exercise data...</p>
                </div>
              ) : error || !details ? (
                // Fallback UI
                <div className="space-y-6">
                  <div className="bg-amber-900/20 border border-amber-900/50 rounded-lg p-4 text-amber-200 text-sm">
                    Visual demonstration is currently unavailable for this exercise, but you can still view the generated details below.
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Target</p>
                      <p className="text-indigo-400 font-medium capitalize">
                        {fallbackTargetMuscle || 'Various Muscles'}
                      </p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Equipment</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6">
                          <EquipmentImage name={fallbackEquipment || 'Bodyweight'} />
                        </div>
                        <p className="text-white text-sm capitalize truncate">
                          {fallbackEquipment || 'Bodyweight'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Success UI
                <div className="space-y-6">
                  {renderImage()}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800/50">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Target Muscles</p>
                      <div className="flex flex-wrap gap-2">
                        {details.primaryMuscles.map(m => (
                          <span key={m} className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs rounded-full capitalize flex items-center">
                            🎯 {m}
                          </span>
                        ))}
                        {details.secondaryMuscles.map(m => (
                          <span key={m} className="px-2.5 py-1 bg-gray-800 border border-gray-700 text-gray-400 text-xs rounded-full capitalize">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800/50">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Equipment</p>
                      <div className="flex items-center space-x-3 bg-gray-950 p-3 rounded-lg border border-gray-900">
                        <div className="w-10 h-10 flex-shrink-0">
                          <EquipmentImage name={details.equipment} />
                        </div>
                        <p className="text-gray-300 font-medium capitalize">
                          {details.equipment.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {details.instructions && details.instructions.length > 0 && (
                    <div className="mt-8">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">How to perform</p>
                      <ul className="space-y-4">
                        {details.instructions.map((step, idx) => (
                          <li key={idx} className="flex space-x-4">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-gray-300 text-sm leading-relaxed">
                              {step}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExerciseInfoModal;
