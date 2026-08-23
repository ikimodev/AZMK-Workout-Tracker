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
  'Lat Pulldown Cable': '/assets/equipment/icon_lat_pulldown_cable.png',
  'Leg Press Machine': '/assets/equipment/icon_leg_press_machine.png',
  'Smith Machine': '/assets/equipment/icon_smith_machine.png',
  'T-bar': '/assets/equipment/icon_t-bar.png',
  'Stack Machines': '/assets/equipment/icon_stack_machines.png',
  'Plate Machines': '/assets/equipment/icon_plate_machines.png',
  
  // Cardio
  'Treadmill': '/assets/equipment/icon_treadmill.png',
  'Rowing Machine': '/assets/equipment/icon_rowing_machine.png',
  'Spinning': '/assets/equipment/icon_spinning_bike.png',
  'Elliptical Trainer': '/assets/equipment/icon_elliptical_trainer.png',
  'Stair Machine': '/assets/equipment/icon_stair_machine.png',
  'Air Bike': '/assets/equipment/icon_air_bike.png',
  
  // Other
  'Suspension Band': '/assets/equipment/icon_suspension_band.png',
  'Resistance Band': '/assets/equipment/icon_resistance_band.png',
  'Battle Rope': '/assets/equipment/icon_battle_rope.png',
  'Rings': '/assets/equipment/icon_gymnastics_rings.png',
  'Jump Rope': '/assets/equipment/icon_jump_rope.png',
  'Medicine Ball': '/assets/equipment/icon_medicine_ball.png',
};

export const EquipmentImage: React.FC<EquipmentImageProps> = ({ name, className = "w-12 h-12" }) => {
  const imageUrl = EQUIPMENT_IMAGES[name];
  const [error, setError] = React.useState(false);

  if (!imageUrl || error) {
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
        onError={() => setError(true)}
      />
    </div>
  );
};
