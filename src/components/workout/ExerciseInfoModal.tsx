import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Play, RefreshCw, ChevronRight } from 'lucide-react';
import { EquipmentImage } from '../common/EquipmentImage';
import { getExerciseById, getAlternativeExercises } from '../../data/mockExercises';
import { Exercise } from '../../types';
import { ExerciseThumbnail } from './ExerciseThumbnail';

interface ExerciseInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  fallbackEquipment?: string;
  fallbackTargetMuscle?: string;
}

const ExerciseInfoModal: React.FC<ExerciseInfoModalProps> = ({  
  isOpen, 
  onClose, 
  exerciseName,
  fallbackEquipment,
  fallbackTargetMuscle
}) => {
  const [details, setDetails] = useState<Exercise | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [alternatives, setAlternatives] = useState<Exercise[]>([]);

  useEffect(() => {
    if (isOpen && exerciseName) {
      const found = getExerciseById(exerciseName);
      setDetails(found || null);
      setCurrentImageIndex(0);
      if (found) {
        setAlternatives(getAlternativeExercises(found.id));
      } else {
        setAlternatives([]);
      }
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
    const imageUrl = details.images[currentImageIndex];
    
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
              {!details ? (
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
                  {(!details.images || details.images.length === 0) && (
                    <div className="bg-amber-900/20 border border-amber-900/50 rounded-lg p-4 text-amber-200 text-sm mb-6">
                      Visual demonstration is currently unavailable for this exercise, but you can still view the generated details below.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800/50">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Target Muscles</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs rounded-full capitalize flex items-center">
                          <Target size={12} className="mr-1" /> {details.muscleGroup}
                        </span>
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

                  {details.instructions && (
                    <div className="mt-8">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">How to perform</p>
                      <div className="text-gray-300 text-sm leading-relaxed space-y-4">
                        {details.instructions.split('\\n').map((para, i) => para.trim() && <p key={i}>{para}</p>)}
                      </div>
                    </div>
                  )}

                  {details.youtubeQuery && (
                    <a
                      href={\`https://www.youtube.com/results?search_query=\${encodeURIComponent(details.youtubeQuery)}\`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 w-full py-3.5 rounded-xl bg-[#282828] hover:bg-[#3f3f3f] border border-gray-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <Play className="w-4 h-4 text-red-500 fill-red-500" />
                      <span>Watch Form Tutorial on YouTube</span>
                    </a>
                  )}

                  {alternatives.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-800/50">
                      <div className="flex items-center gap-2 mb-4">
                        <RefreshCw className="w-4 h-4 text-accent-cyan" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Smart Biomechanical Alternatives</h3>
                      </div>
                      <div className="space-y-2">
                        {alternatives.map((alt) => (
                          <div
                            key={alt.id}
                            onClick={() => {
                              // If they want to browse through alternatives
                              const newFound = getExerciseById(alt.name);
                              setDetails(newFound || null);
                              setAlternatives(getAlternativeExercises(newFound.id));
                              setCurrentImageIndex(0);
                            }}
                            className="p-3 rounded-2xl bg-gray-900/50 hover:bg-gray-800 border border-gray-800 hover:border-accent-cyan/50 cursor-pointer flex items-center justify-between group transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 flex-shrink-0">
                                <ExerciseThumbnail exerciseName={alt.name} images={alt.images} equipment={alt.equipment} className="w-full h-full" />
                              </div>
                              <div>
                                <p className="font-bold text-sm text-white group-hover:text-accent-cyan transition-colors">{alt.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{alt.equipment}</p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-accent-cyan transition-colors" />
                          </div>
                        ))}
                      </div>
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
