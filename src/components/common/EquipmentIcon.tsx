import React from 'react';

interface EquipmentIconProps {
  name: string;
  className?: string;
}

export const EquipmentIcon: React.FC<EquipmentIconProps> = ({ name, className = "w-6 h-6" }) => {
  const getPath = (name: string) => {
    switch (name) {
      // Weights and Bars
      case 'Dumbbell':
        return (
          <>
            <path d="M4 8h4v8H4z" />
            <path d="M16 8h4v8h-4z" />
            <path d="M8 12h8" />
            <path d="M2 9h2v6H2z" />
            <path d="M20 9h2v6h-2z" />
          </>
        );
      case 'Barbell':
        return (
          <>
            <path d="M2 12h20" />
            <path d="M5 8v8" />
            <path d="M19 8v8" />
            <path d="M3 9v6" />
            <path d="M21 9v6" />
            <path d="M7 10v4" />
            <path d="M17 10v4" />
          </>
        );
      case 'Plate':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
          </>
        );
      case 'Kettlebell':
        return (
          <>
            <circle cx="12" cy="14" r="8" />
            <path d="M8 8V6a4 4 0 0 1 8 0v2" />
          </>
        );
      case 'EZ Bar':
        return (
          <>
            <path d="M2 12h3l2-2 2 4 2-4 2 4 2-4 2 4 2-4h3" />
            <path d="M4 9v6" />
            <path d="M20 9v6" />
          </>
        );
      case 'Landmine':
        return (
          <>
            <path d="M3 21l14-14" />
            <path d="M17 7l4 4" />
            <path d="M14 10l4-4" />
            <path d="M3 21h6" />
            <path d="M3 21v-6" />
          </>
        );
      case 'Trap Bar':
        return (
          <>
            <path d="M7 7h10l3 5-3 5H7l-3-5z" />
            <path d="M2 12h3" />
            <path d="M19 12h3" />
            <path d="M10 7v-3" />
            <path d="M14 7v-3" />
            <path d="M10 17v3" />
            <path d="M14 17v3" />
          </>
        );

      // Benches and Racks
      case 'Pull Up Bar':
        return (
          <>
            <path d="M2 6h20" />
            <path d="M4 2v4" />
            <path d="M20 2v4" />
            <path d="M6 6l2 4" />
            <path d="M18 6l-2 4" />
          </>
        );
      case 'Squat Rack':
        return (
          <>
            <path d="M4 2v20" />
            <path d="M20 2v20" />
            <path d="M2 22h20" />
            <path d="M4 6h4" />
            <path d="M20 6h-4" />
            <path d="M4 12h2" />
            <path d="M20 12h-2" />
            <path d="M4 18h4" />
            <path d="M20 18h-4" />
          </>
        );
      case 'Flat Bench':
        return (
          <>
            <path d="M3 10h18v4H3z" />
            <path d="M6 14v6" />
            <path d="M18 14v6" />
            <path d="M4 20h4" />
            <path d="M16 20h4" />
          </>
        );
      case 'Adjustable Bench':
        return (
          <>
            <path d="M4 14h6" />
            <path d="M10 14l8-6" />
            <path d="M6 14v6" />
            <path d="M14 11v9" />
            <path d="M4 20h4" />
            <path d="M12 20h4" />
          </>
        );
      case 'Dip Bar':
        return (
          <>
            <path d="M4 10h6" />
            <path d="M14 10h6" />
            <path d="M7 10v10" />
            <path d="M17 10v10" />
            <path d="M4 20h6" />
            <path d="M14 20h6" />
            <path d="M4 12v-2" />
            <path d="M20 12v-2" />
          </>
        );

      // Machines
      case 'Single Cable Machine':
      case 'Dual Cable Machine':
      case 'Stack Machines':
        return (
          <>
            <path d="M6 2v20" />
            <path d="M18 2v20" />
            <path d="M6 4h12" />
            <path d="M4 22h16" />
            <path d="M12 4v14" />
            <path d="M9 10h6" />
            <path d="M9 14h6" />
            <path d="M9 18h6" />
            <circle cx="12" cy="4" r="2" />
          </>
        );
      case 'Lat Pulldown Cable':
        return (
          <>
            <path d="M4 22h16" />
            <path d="M12 22V12" />
            <path d="M8 12h8v4H8z" />
            <path d="M6 4h12" />
            <path d="M12 4v4" />
            <path d="M4 8h16" />
            <circle cx="12" cy="4" r="2" />
          </>
        );
      case 'Leg Press Machine':
        return (
          <>
            <path d="M2 20h20" />
            <path d="M4 20l8-14" />
            <path d="M12 6l-4 4" />
            <path d="M16 10l-4 4" />
            <path d="M8 14h4v6" />
            <path d="M9 4l5 8" />
          </>
        );
      case 'Smith Machine':
        return (
          <>
            <path d="M4 2v20" />
            <path d="M20 2v20" />
            <path d="M2 22h20" />
            <path d="M6 2h12" />
            <path d="M4 12h16" />
            <path d="M2 10v4" />
            <path d="M22 10v4" />
          </>
        );
      case 'T-bar':
        return (
          <>
            <path d="M4 20l14-14" />
            <path d="M18 6l4-4" />
            <path d="M16 8l4-4" />
            <path d="M14 4l6 6" />
            <path d="M4 20h4" />
            <path d="M4 20v-4" />
          </>
        );
      case 'Plate Machines':
        return (
          <>
            <path d="M2 22h20" />
            <path d="M12 22V10" />
            <path d="M6 10h12" />
            <path d="M8 10v-4" />
            <path d="M16 10v-4" />
            <circle cx="8" cy="6" r="2" />
            <circle cx="16" cy="6" r="2" />
          </>
        );

      // Cardio
      case 'Treadmill':
        return (
          <>
            <path d="M4 20l14-4" />
            <path d="M4 20v2" />
            <path d="M18 16v6" />
            <path d="M16 17L12 5" />
            <path d="M10 5h6" />
            <path d="M13 5v4" />
          </>
        );
      case 'Rowing Machine':
        return (
          <>
            <path d="M2 18h20" />
            <path d="M6 18l-2-6" />
            <path d="M18 18V8" />
            <circle cx="18" cy="18" r="4" />
            <path d="M10 18v-4h4v4" />
            <path d="M14 14l4-2" />
          </>
        );
      case 'Spinning':
      case 'Air Bike':
        return (
          <>
            <circle cx="6" cy="16" r="4" />
            <circle cx="18" cy="16" r="4" />
            <path d="M6 16l4-8h4l4 8" />
            <path d="M10 8l-2-4h4" />
            <path d="M14 8l2-4h-3" />
            <path d="M10 16h4" />
            <circle cx="12" cy="16" r="2" />
          </>
        );
      case 'Elliptical Trainer':
        return (
          <>
            <circle cx="6" cy="16" r="4" />
            <path d="M6 16h8l4-4" />
            <path d="M10 16l2-10" />
            <path d="M14 16l-2-10" />
            <path d="M10 6h4" />
            <path d="M12 6v-2h2" />
          </>
        );
      case 'Stair Machine':
        return (
          <>
            <path d="M4 20h4v-4h4v-4h4v-4h4" />
            <path d="M4 20v2" />
            <path d="M20 8v14" />
            <path d="M16 12L12 4h4" />
          </>
        );

      // Other
      case 'Suspension Band':
        return (
          <>
            <path d="M12 2v6" />
            <path d="M12 8l-4 10" />
            <path d="M12 8l4 10" />
            <path d="M6 18h4" />
            <path d="M14 18h4" />
            <circle cx="8" cy="19" r="1" />
            <circle cx="16" cy="19" r="1" />
          </>
        );
      case 'Resistance Band':
        return (
          <>
            <path d="M4 12c0-8 16-8 16 0s-16 8-16 0z" />
            <path d="M4 12c0-6 16-6 16 0" strokeDasharray="2 2" />
          </>
        );
      case 'Battle Rope':
        return (
          <>
            <path d="M2 16c4-8 4-8 8 0s4 8 8 0 4-8 4-8" />
            <path d="M2 18c4-8 4-8 8 0s4 8 8 0 4-8 4-8" />
            <path d="M2 14v6" />
          </>
        );
      case 'Rings':
        return (
          <>
            <path d="M8 2v10" />
            <path d="M16 2v10" />
            <circle cx="8" cy="16" r="4" />
            <circle cx="16" cy="16" r="4" />
            <path d="M2 2h20" />
          </>
        );
      case 'Jump Rope':
        return (
          <>
            <path d="M4 8v4" />
            <path d="M20 8v4" />
            <path d="M4 12c0 10 16 10 16 0" />
            <path d="M2 8h4" />
            <path d="M18 8h4" />
          </>
        );
      case 'Medicine Ball':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2c0 6-4 10-10 10" />
            <path d="M12 2c0 6 4 10 10 10" />
            <path d="M12 22c0-6-4-10-10-10" />
            <path d="M12 22c0-6 4-10 10-10" />
          </>
        );

      default:
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {getPath(name)}
    </svg>
  );
};
