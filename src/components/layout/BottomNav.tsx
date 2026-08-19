import React from 'react';
import { 
  LayoutDashboard, 
  Calendar,
  Dumbbell, 
  TrendingUp, 
  Bot, 
  BookOpen, 
  Trophy 
} from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

interface BottomNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onNavigate }) => {
  const { activeWorkout, t } = useWorkout();

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'calendar', label: t('calendar').split(' ')[0], icon: Calendar },
    { id: activeWorkout ? 'active_workout' : 'workouts', label: t('workouts'), icon: Dumbbell, hasActive: !!activeWorkout },
    { id: 'progress', label: t('progress'), icon: TrendingUp },
    { id: 'ai_coach', label: t('aiCoach'), icon: Bot },
    { id: 'prs', label: t('prs'), icon: Trophy }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background-secondary/95 backdrop-blur-md border-t border-border px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id || (item.id === 'workouts' && activeTab === 'active_workout');

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
              isActive
                ? 'text-accent-emerald'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.hasActive && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent-emerald animate-ping" />
              )}
            </div>
            <span className="text-[10px] font-semibold tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
