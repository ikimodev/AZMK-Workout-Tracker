import React, { useState } from 'react';
import { WorkoutProvider, useWorkout } from './context/WorkoutContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { RestTimerFloat } from './components/common/RestTimerFloat';
import { PRCelebrationModal } from './components/common/PRCelebrationModal';
import { WorkoutSummaryModal } from './components/common/WorkoutSummaryModal';
import { OnboardingModal } from './components/common/OnboardingModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { ActiveWorkoutLogger } from './components/workout/ActiveWorkoutLogger';
import { WorkoutHistoryView } from './components/workout/WorkoutHistoryView';
import { ProgramsView } from './components/programs/ProgramsView';
import { ProgressView } from './components/progress/ProgressView';
import { AICoachView } from './components/ai/AICoachView';
import { ExerciseDatabaseView } from './components/exercises/ExerciseDatabaseView';
import { PRHistoryView } from './components/prs/PRHistoryView';
import { PricingView } from './components/monetization/PricingView';
import { ReferralView } from './components/referrals/ReferralView';
import { ProfileView } from './components/profile/ProfileView';
import { CalendarView } from './components/calendar/CalendarView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AIWorkoutImportModal } from './components/ai/AIWorkoutImportModal';
import { AIProgramGeneratorModal } from './components/ai/AIProgramGeneratorModal';
import { InitialSetupScreen } from './components/common/InitialSetupScreen';
import { PWAInstallPrompt } from './components/common/PWAInstallPrompt';
import { FeedbackModal } from './components/common/FeedbackModal';
import { trackUserSession } from './services/analyticsService';

const AppContent: React.FC = () => {
  const { user, activeWorkout, lastCompletedSession, clearLastCompletedSession } = useWorkout();
  
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAIImportOpen, setIsAIImportOpen] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [isInstallPromptOpen, setIsInstallPromptOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  React.useEffect(() => {
    trackUserSession(user.name);
  }, [user.name]);

  // If user hasn't completed setup (first time or factory reset), show setup screen
  if (!user.hasCompletedOnboarding) {
    return (
      <>
        <InitialSetupScreen
          onComplete={() => {
            setActiveTab('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
        <PWAInstallPrompt 
          forceOpen={isInstallPromptOpen}
          onClose={() => setIsInstallPromptOpen(false)}
        />
      </>
    );
  }

  // If user starts workout, automatically switch to active_workout tab
  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans selection:bg-accent-emerald selection:text-black">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenInstallPrompt={() => setIsInstallPromptOpen(true)}
      />

      {/* Main Body Shell */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onNavigate={handleNavigate}
          onOpenAIImport={() => setIsAIImportOpen(true)}
          onOpenAIGenerator={() => setIsAIGeneratorOpen(true)}
        />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              onOpenAIImport={() => setIsAIImportOpen(true)}
              onOpenAIGenerator={() => setIsAIGeneratorOpen(true)}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView onNavigate={handleNavigate} />
          )}

          {activeTab === 'active_workout' && (
            <ActiveWorkoutLogger onNavigate={handleNavigate} />
          )}

          {activeTab === 'workouts' && (
            activeWorkout ? (
              <ActiveWorkoutLogger onNavigate={handleNavigate} />
            ) : (
              <WorkoutHistoryView onNavigate={handleNavigate} />
            )
          )}

          {activeTab === 'programs' && (
            <ProgramsView 
              onNavigate={handleNavigate} 
              onOpenAIGenerator={() => setIsAIGeneratorOpen(true)} 
            />
          )}

          {activeTab === 'progress' && (
            <ProgressView />
          )}

          {activeTab === 'ai_coach' && (
            <AICoachView onNavigate={handleNavigate} />
          )}

          {activeTab === 'exercises' && (
            <ExerciseDatabaseView onNavigate={handleNavigate} />
          )}

          {activeTab === 'prs' && (
            <PRHistoryView />
          )}

          {activeTab === 'premium' && (
            <PricingView />
          )}

          {activeTab === 'referrals' && (
            <ReferralView />
          )}

          {activeTab === 'profile' && (
            <ProfileView 
              onNavigate={handleNavigate} 
              onOpenOnboarding={() => setIsOnboardingOpen(true)} 
            />
          )}

          {activeTab === 'admin' && (
            <AdminDashboardView 
              onNavigate={handleNavigate} 
            />
          )}
        </main>

      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenAIImport={() => setIsAIImportOpen(true)}
        onOpenAIGenerator={() => setIsAIGeneratorOpen(true)}
      />

      {/* Floating Rest Timer */}
      <RestTimerFloat />

      {/* Floating Feedback Trigger Button (Bottom Right) */}
      <button
        onClick={() => setIsFeedbackOpen(true)}
        className="fixed bottom-20 lg:bottom-6 right-4 rtl:right-auto rtl:left-4 z-30 px-3.5 py-2 rounded-full bg-background-card/90 hover:bg-background-elevated border border-accent-emerald/40 text-accent-emerald text-xs font-bold shadow-glow-sm backdrop-blur-md flex items-center gap-1.5 transition-all active:scale-95 hover:border-accent-emerald"
        title="شاركنا رأيك في تطبيق عزمك"
      >
        <span className="text-sm">⭐</span>
        <span className="hidden sm:inline">تقييم ورأي</span>
      </button>

      {/* PR Celebration Modal */}
      <PRCelebrationModal />

      {/* Workout Completion Summary Modal */}
      <WorkoutSummaryModal
        session={lastCompletedSession}
        onClose={clearLastCompletedSession}
        onViewProgress={() => {
          clearLastCompletedSession();
          handleNavigate('progress');
        }}
      />

      {/* AI Workout Natural Language Importer Modal */}
      <AIWorkoutImportModal
        isOpen={isAIImportOpen}
        onClose={() => setIsAIImportOpen(false)}
        onWorkoutStarted={() => handleNavigate('active_workout')}
      />

      {/* AI Program Generator Modal */}
      <AIProgramGeneratorModal
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
        onProgramGenerated={() => handleNavigate('programs')}
      />

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onProgramGenerated={() => handleNavigate('programs')}
      />

      {/* User Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      {/* Mobile PWA Install Prompt Banner & Gateway */}
      <PWAInstallPrompt 
        forceOpen={isInstallPromptOpen}
        onClose={() => setIsInstallPromptOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <WorkoutProvider>
      <AppContent />
    </WorkoutProvider>
  );
}
