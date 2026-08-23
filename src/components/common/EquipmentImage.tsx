import React from 'react';
import { Dumbbell } from 'lucide-react';

interface EquipmentImageProps {
  name: string;
  className?: string;
}

const EQUIPMENT_IMAGES: Record<string, string> = {
  // Weights - Using custom generated 3D high-quality renders
  'Dumbbell': '/assets/equipment/icon_dumbbell.png',
  'Barbell': '/assets/equipment/icon_barbell.png',
  'Plate': '/assets/equipment/icon_plate.png',
  'Kettlebell': '/assets/equipment/icon_kettlebell.png',
  'EZ Bar': '/assets/equipment/icon_ez_bar.png',
  'Landmine': '/assets/equipment/icon_landmine.png',
  'Trap Bar': '/assets/equipment/icon_trap_bar.png',

  // Benches and racks - Using custom generated 3D high-quality renders
  'Pull Up Bar': '/assets/equipment/icon_pull_up_bar.png',
  'Squat Rack': '/assets/equipment/icon_squat_rack.png',
  'Flat Bench': '/assets/equipment/icon_flat_bench.png',
  'Adjustable Bench': '/assets/equipment/icon_adjustable_bench.png',
  'Dip Bar': '/assets/equipment/icon_dip_bar.png',
  
  // Machines - Using custom generated 3D high-quality renders
  'Single Cable Machine': '/assets/equipment/icon_single_cable_machine.png',
  'Dual Cable Machine': '/assets/equipment/icon_dual_cable_machine.png',
  'Leg Press Machine': '/assets/equipment/icon_leg_press_machine.png',

  // NOTE: For the remaining machines and cardio, 
  // temporary transparent placeholders or generic images are used until the generation limit resets.
};

export const EquipmentImage: React.FC<EquipmentImageProps> = ({ name, className = "w-12 h-12" }) => {
  const imageUrl = EQUIPMENT_IMAGES[name];

  if (!imageUrl) {
    // Fallback for ungenerated 3D icons
    return (
      <div className={`overflow-hidden rounded-lg bg-slate-800/50 border border-white/5 shrink-0 flex items-center justify-center ${className}`}>
        <Dumbbell className="w-1/2 h-1/2 text-slate-500" />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-lg shrink-0 ${className}`}>
      <img 
        src={imageUrl} 
        alt={name} 
        className="w-full h-full object-contain drop-shadow-md"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
};
