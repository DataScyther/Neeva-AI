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
import { motion } from "framer-motion";

function AppContent() {
  const { state, dispatch } = useAppContext();



  // Check environment variables on app start
  useEffect(() => {
    const envCheck = checkEnvVariables();
    if (!envCheck.isValid) {
      console.error('Environment configuration issues:', envCheck.errors);
      // You could show a warning to the user here if needed
    }
  }, []);

  // Apply theme on mount
  useEffect(() => {
    const theme = state.theme;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // Auto theme based on system preference
      const isDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      document.documentElement.classList.toggle("dark", isDark);
    }
  }, [state.theme]);

  // Show authentication screen if user is not authenticated
  const hasValidUser = state.user &&
    ((state.user as any).email && (state.user as any).uid) &&
    state.isAuthenticated;

  if (!hasValidUser) {
    // Additional validation with Firebase auth service
    const hasValidProfile = authService.getCurrentUserProfile();

    // Debug logging for mobile authentication issues
    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
      console.log('Mobile auth check:', {
        hasValidUser,
        hasValidProfile,
        stateUser: state.user,
        firebaseUser: authService.getCurrentUserProfile(),
        isAuthenticated: state.isAuthenticated
      });
    }

    // All conditions must be met for user to be considered authenticated
    if (!(hasValidUser && hasValidProfile)) {
      return <AuthComponent onAuthSuccess={() => {
        const perf = measurePerformance('auth-success');
        perf.start();

        console.log('Auth success callback triggered');

        // Set onboarding as completed for existing users
        localStorage.setItem("onboardingCompleted", "true");

        // Optimized auth update - use requestAnimationFrame for smooth UI update
        requestAnimationFrame(() => {
          const currentUser = authService.getCurrentUserProfile();
          if (currentUser) {
            console.log('Updating context with user:', currentUser);
            dispatch({ type: 'SET_USER', payload: currentUser });

            // Haptic feedback on mobile for successful auth
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
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Main Content - Added safe padding for navigation */}
      <main className="lg:pl-64 pb-20 lg:pb-0 main-content">
        <div className="min-h-screen">
          {renderCurrentView()}
        </div>
      </main>

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
