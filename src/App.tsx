import { useEffect } from "react";
import { checkEnvVariables } from "./utils/env-check";
import { authService } from "./lib/auth";
import { isMobileDevice, measurePerformance, triggerHapticFeedback } from "./utils/mobile-optimizations";
import {
  AppProvider,
  useAppContext,
} from "./components/AppContext";
import AuthComponent from "./components/AuthComponent";
import { Onboarding } from "./components/Onboarding";
import { CommunityGroups } from "./components/CommunityGroups";
import { CBTExercises } from "./components/CBTExercises";
import { Settings as SettingsComponent } from "./components/Settings";
import { Navigation } from "./components/Navigation";
import { InsightsDashboard } from "./components/InsightsDashboard";
import { GuidedMeditation } from "./components/GuidedMeditation";
import { CrisisSupport } from "./components/CrisisSupport";
import { WellnessStudio } from "./components/WellnessStudio";
import { BreathingExercise } from "./components/BreathingExercise";
import { Dashboard } from "./components/Dashboard";
import { Chatbot } from "./components/Chatbot";
import { MoodTracker } from "./components/MoodTracker";
import { Toaster } from "./components/ui/sonner";
import {
  Card,
  CardContent,
} from "./components/ui/card";
import {
  Heart,
} from "lucide-react";

function AppContent() {
  const { state, dispatch } = useAppContext();

  // Check environment variables on app start
  useEffect(() => {
    const envCheck = checkEnvVariables();
    if (!envCheck.isValid) {
      console.error('Environment configuration issues:', envCheck.errors);
    }
  }, []);

  // Show authentication screen if user is not authenticated
  const hasValidUser = state.user &&
    ((state.user as any).email && (state.user as any).uid) &&
    state.isAuthenticated;

  if (!hasValidUser) {
    const hasValidProfile = authService.getCurrentUserProfile();

    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
      console.log('Mobile auth check:', {
        hasValidUser,
        hasValidProfile,
        stateUser: state.user,
        firebaseUser: authService.getCurrentUserProfile(),
        isAuthenticated: state.isAuthenticated
      });
    }

    if (!(hasValidUser && hasValidProfile)) {
      return <AuthComponent onAuthSuccess={() => {
        const perf = measurePerformance('auth-success');
        perf.start();

        console.log('Auth success callback triggered');

        localStorage.setItem("onboardingCompleted", "true");

        requestAnimationFrame(() => {
          const currentUser = authService.getCurrentUserProfile();
          if (currentUser) {
            console.log('Updating context with user:', currentUser);
            dispatch({ type: 'SET_USER', payload: currentUser });

            if (isMobileDevice()) {
              triggerHapticFeedback('light');
            }
          } else {
            console.log('No current user found in auth service');
          }

          const duration = perf.end();
          console.log(`Auth update completed in ${duration}ms`);
        });
      }} />;
    }
  }

  // Check if user has completed onboarding
  const hasCompletedOnboarding =
    localStorage.getItem("onboardingCompleted") === "true";

  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  const renderCurrentView = () => {
    switch (state.currentView) {
      case "dashboard":
        return <Dashboard />;
      case "chatbot":
        return <Chatbot />;
      case "mood":
        return <MoodTracker />;
      case "exercises":
        return <CBTExercises />;
      case "community":
        return <CommunityGroups />;
      case "settings":
        return <SettingsComponent />;
      case "insights":
        return <InsightsDashboard />;
      case "meditation":
        return <GuidedMeditation />;
      case "crisis":
        return <CrisisSupport />;
      case "wellness":
        return <WellnessStudio />;
      case "breathing":
        return <BreathingExercise />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen w-full flex bg-[var(--color-bg)] text-[var(--color-text)] overflow-hidden relative font-sans">
      <Navigation />

      {/* Main Content Container */}
      <div className="flex-1 h-full flex flex-col overflow-hidden pl-0 lg:pl-[140px] pt-[20px]">
        {renderCurrentView()}
      </div>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
