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
      case "breathing":
        return <BreathingExercise />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#F8FAFF] text-slate-800 overflow-hidden relative font-sans">
      {/* Global Decorative SVG Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="absolute w-full h-auto min-h-[60vh] object-cover opacity-70 top-0 left-0" viewBox="0 0 1440 600" fill="none" preserveAspectRatio="xMidYMid slice">
          <path d="M0,200 C300,400 450,100 700,250 C950,400 1200,100 1440,250 L1440,0 L0,0 Z" fill="url(#wave-grad-1)" />
          <path d="M0,300 C250,500 400,200 650,350 C900,500 1150,200 1440,350 L1440,0 L0,0 Z" fill="url(#wave-grad-2)" opacity="0.6" />
          <defs>
            <linearGradient id="wave-grad-1" x1="0" y1="0" x2="1440" y2="400" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E6E6FA" />
              <stop offset="50%" stopColor="#F5F3FF" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
            <linearGradient id="wave-grad-2" x1="1440" y1="0" x2="0" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D8F3DC" />
              <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <Navigation />

      {/* Main Content Container */}
      <div className="flex-1 h-full flex flex-col relative z-10 overflow-hidden pl-0 lg:pl-[140px] pt-[20px]">
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
