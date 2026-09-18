import React, { useEffect, useState } from 'react';
import stringSimilarity from 'string-similarity';
import { Dumbbell } from 'lucide-react';

interface ExerciseThumbnailProps {
  exerciseName: string;
  equipment?: string;
  className?: string;
}

interface ExerciseDetails {
  id: string;
  name: string;
  images: string[];
}

// Global cache to prevent multiple fetches across different thumbnail instances
let globalExercisesCache: ExerciseDetails[] | null = null;
let fetchPromise: Promise<ExerciseDetails[]> | null = null;

import { EquipmentImage } from '../common/EquipmentImage';

export const ExerciseThumbnail: React.FC<ExerciseThumbnailProps> = ({ exerciseName, equipment, className = "w-10 h-10" }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAndMatch = async () => {
      try {
        let exercises = globalExercisesCache;
        if (!exercises) {
          if (!fetchPromise) {
            fetchPromise = fetch('/exercises.json').then(res => {
              if (!res.ok) throw new Error('Failed to fetch exercises');
              return res.json();
            }).then(data => {
              globalExercisesCache = data;
              return data;
            });
          }
          exercises = await fetchPromise;
        }

        if (!isMounted) return;

        const ALIAS_MAP: Record<string, string> = {
          'plank core hold': 'plank',
          'ab wheel rollout': 'ab roller',
          'chin-ups': 'chin-up',
          'pull-ups': 'pull up'
        };

        const rawCleanName = exerciseName.replace(/\(.*?\)/g, '').trim().toLowerCase();
        const cleanName = ALIAS_MAP[rawCleanName] || rawCleanName;
        
        let matchedEx = exercises!.find(ex => ex.name.toLowerCase() === cleanName || ex.name.toLowerCase() === exerciseName.toLowerCase());
        
        if (!matchedEx) {
          const names = exercises!.map(ex => ex.name.toLowerCase());
          const match = stringSimilarity.findBestMatch(cleanName, names);
          if (match.bestMatch.rating > 0.60) {
            matchedEx = exercises![match.bestMatchIndex];
          }
        }

        if (!matchedEx) {
          const cleanWords = cleanName.split(' ').filter(w => w.length > 2);
          if (cleanWords.length > 0) {
            matchedEx = exercises!.find(ex => {
              const exNameLower = ex.name.toLowerCase();
              return cleanWords.every(word => exNameLower.includes(word));
            });
          }
        }

        if (matchedEx && matchedEx.images && matchedEx.images.length > 0) {
          // Use the first image from the external repository
          setImageUrl(`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${matchedEx.images[0]}`);
        } else {
          setImageUrl(null);
        }
      } catch (err) {
        console.error("Failed to load thumbnail for", exerciseName, err);
        if (isMounted) setImageUrl(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAndMatch();

    return () => {
      isMounted = false;
    };
  }, [exerciseName]);

  if (loading) {
    return (
      <div className={`overflow-hidden rounded-xl shrink-0 bg-background-elevated border border-border animate-pulse flex items-center justify-center ${className}`}>
        <div className="w-1/2 h-1/2 bg-slate-700/50 rounded-full" />
      </div>
    );
  }

  if (!imageUrl) {
    if (equipment) {
      return (
        <div className={`overflow-hidden shrink-0 flex items-center justify-center ${className}`}>
          <EquipmentImage name={equipment} className="w-full h-full object-contain" />
        </div>
      );
    }
    
    return (
      <div className={`overflow-hidden rounded-xl shrink-0 bg-background-elevated border border-border flex items-center justify-center ${className}`}>
        <Dumbbell className="w-1/2 h-1/2 text-slate-500" />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-xl shrink-0 bg-white border border-border shadow-sm flex items-center justify-center p-0.5 ${className}`}>
      <img 
        src={imageUrl} 
        alt={exerciseName} 
        className="w-full h-full object-cover rounded-lg"
        loading="lazy"
        onError={() => setImageUrl(null)}
      />
    </div>
  );
};
