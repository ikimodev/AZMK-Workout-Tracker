import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { EquipmentImage } from '../common/EquipmentImage';

interface ExerciseThumbnailProps {
  exerciseName: string;
  images?: string[];
  equipment?: string;
  className?: string;
}

export const ExerciseThumbnail: React.FC<ExerciseThumbnailProps> = ({ exerciseName, images, equipment, className = "w-10 h-10" }) => {
  const [imageError, setImageError] = useState(false);
  const thumbnailUrl = images && images.length > 0 ? images[0] : undefined;

  if (!thumbnailUrl || imageError) {
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
        src={thumbnailUrl} 
        alt={exerciseName} 
        className="w-full h-full object-cover rounded-lg"
        loading="lazy"
        onError={() => setImageError(true)}
      />
    </div>
  );
};
