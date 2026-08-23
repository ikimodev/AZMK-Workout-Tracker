import React from 'react';

interface EquipmentImageProps {
  name: string;
  className?: string;
}

const EQUIPMENT_IMAGES: Record<string, string> = {
  // Weights
  'Dumbbell': 'https://upload.wikimedia.org/wikipedia/commons/e/e3/TwoDumbbells.JPG',
  'Barbell': 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Man_lifting_a_heavy_barbell.jpg',
  'Plate': 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Weightlifting.jpg',
  'Kettlebell': 'https://upload.wikimedia.org/wikipedia/commons/1/14/Competition_kettlebell_16_kilo.jpg',
  'EZ Bar': 'https://upload.wikimedia.org/wikipedia/commons/4/43/Weight_bench.jpg',
  'Landmine': 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Man_lifting_a_heavy_barbell.jpg',
  'Trap Bar': 'https://upload.wikimedia.org/wikipedia/commons/6/60/New_Jersey_National_Guard_-_46420386382.jpg',

  // Benches and racks
  'Pull Up Bar': 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Pull-up_on_a_straight_bar.jpg',
  'Squat Rack': 'https://upload.wikimedia.org/wikipedia/commons/8/84/Guinness_4_oasis.jpg',
  'Flat Bench': 'https://upload.wikimedia.org/wikipedia/commons/4/43/Weight_bench.jpg',
  'Adjustable Bench': 'https://upload.wikimedia.org/wikipedia/commons/4/43/Weight_bench.jpg',
  'Dip Bar': 'https://upload.wikimedia.org/wikipedia/commons/5/59/Dipexercise.svg',
  
  // Machines
  'Single Cable Machine': 'https://upload.wikimedia.org/wikipedia/commons/8/82/CableMachineUprightRow.JPG',
  'Dual Cable Machine': 'https://upload.wikimedia.org/wikipedia/commons/8/82/CableMachineUprightRow.JPG',
  'Lat Pulldown Cable': 'https://upload.wikimedia.org/wikipedia/commons/9/91/Lat_pulldown_machine.jpg',
  'Leg Press Machine': 'https://upload.wikimedia.org/wikipedia/commons/8/85/Leg_Press_Machine.jpg',
  'Smith Machine': 'https://upload.wikimedia.org/wikipedia/commons/7/74/Smith_machine.webp',
  'T-bar': 'https://upload.wikimedia.org/wikipedia/commons/8/82/CableMachineUprightRow.JPG',
  'Stack Machines': 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Weight_machine.webp',
  'Plate Machines': 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Weight_machine.webp',

  // Cardio
  'Treadmill': 'https://upload.wikimedia.org/wikipedia/commons/9/95/Exercise_Treadmill_Convey_Motion.jpg',
  'Rowing Machine': 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Rowing_Machines.jpg',
  'Spinning': 'https://upload.wikimedia.org/wikipedia/commons/0/00/Fahrrad-Ergometer_01_KMJ.jpg',
  'Elliptical Trainer': 'https://upload.wikimedia.org/wikipedia/commons/d/da/Elliptical_machine.jpg',
  'Stair Machine': 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Weight_machine.webp',
  'Air Bike': 'https://upload.wikimedia.org/wikipedia/commons/0/00/Fahrrad-Ergometer_01_KMJ.jpg',

  // Other
  'Suspension Band': 'https://upload.wikimedia.org/wikipedia/commons/8/83/TRX_Suspension_Trainer.jpg',
  'Resistance Band': 'https://upload.wikimedia.org/wikipedia/commons/0/02/Trenirovachni_lastici_set.JPG',
  'Battle Rope': 'https://upload.wikimedia.org/wikipedia/commons/7/7c/170331-N-ZY039-015_%2833869515046%29.jpg',
  'Rings': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Gymnastics_Rings.jpg',
  'Jump Rope': 'https://upload.wikimedia.org/wikipedia/commons/3/36/Jump_rope.jpg',
  'Medicine Ball': 'https://upload.wikimedia.org/wikipedia/commons/6/61/Soldier_tosses_a_medicine_ball_while_working_out_DVIDS462753.jpg',
  'Other': 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Weightlifting.jpg',
};

const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Weightlifting.jpg';

export const EquipmentImage: React.FC<EquipmentImageProps> = ({ name, className = "w-12 h-12" }) => {
  const imageUrl = EQUIPMENT_IMAGES[name] || DEFAULT_IMAGE;

  return (
    <div className={`overflow-hidden rounded-lg bg-slate-800 shrink-0 ${className}`}>
      <img 
        src={imageUrl} 
        alt={name} 
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
        }}
      />
    </div>
  );
};
