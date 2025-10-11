import React from "react";
import { useAppContext } from "./AppContext";
import {
  Home,
  MessageCircle,
  Heart,
  Brain,
  User,
} from "lucide-react";


export function MobileNavigation() {
  const { state, dispatch } = useAppContext();

  const handleNavigation = (view: string) => {
    dispatch({ type: "SET_VIEW", payload: view as any });
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  return (
    <div className="lg:hidden mobile-nav-container">
      {/* Main Navigation Pill */}
      <div
        className="navigation-pill rounded-full px-4 py-3"
        style={
          isDark
            ? { background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.15)' }
            : { background: '#ffffff', border: '1px solid rgba(0,0,0,0.12)' }
        }
      >
        <div className="flex items-center justify-between space-x-3 sm:space-x-4">
          {/* Home */}
          <button
            className={`nav-pill-item flex flex-col items-center space-y-1 ${
              state.currentView === "dashboard" ? "active" : ""
            }`}
            onClick={() => handleNavigation("dashboard")}
            aria-label="Home"
          >
            <Home className={`w-5 h-5 mb-1 ${
              state.currentView === "dashboard"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300"
            }`} />
            <span className={`text-xs font-bold ${
              state.currentView === "dashboard"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300"
            }`}>Home</span>
          </button>

          {/* AI Assistant - Neeva AI */}
          <button
            className={`nav-pill-item flex flex-col items-center space-y-1 ${
              state.currentView === "chatbot" ? "active" : ""
            }`}
            onClick={() => handleNavigation("chatbot")}
            aria-label="Neeva AI"
          >
            <div className="relative mb-1">
              <MessageCircle className={`w-5 h-5 ${
                state.currentView === "chatbot"
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-300"
              }`} />
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
            </div>
            <span className={`text-xs font-bold ${
              state.currentView === "chatbot"
                ? "text-purple-600 dark:text-purple-400"
                : "text-gray-600 dark:text-gray-300"
            }`}>Neeva AI</span>
          </button>

          {/* Center Action Button - Record Mood */}
          <button
            className="nav-center-button flex items-center justify-center"
            onClick={() => handleNavigation("mood")}
            aria-label="Record Mood"
          >
            <Heart className="w-6 h-6 text-white" />
          </button>

          {/* CBT Exercises */}
          <button
            className={`nav-pill-item flex flex-col items-center space-y-1 ${
              state.currentView === "exercises" ? "active" : ""
            }`}
            onClick={() => handleNavigation("exercises")}
            aria-label="CBT Exercises"
          >
            <Brain className={`w-5 h-5 mb-1 ${
              state.currentView === "exercises"
                ? "text-green-600 dark:text-green-400"
                : "text-gray-600 dark:text-gray-300"
            }`} />
            <span className={`text-xs font-bold ${
              state.currentView === "exercises"
                ? "text-green-600 dark:text-green-400"
                : "text-gray-600 dark:text-gray-300"
            }`}>CBT</span>
          </button>

          {/* Profile/Settings */}
          <button
            className={`nav-pill-item flex flex-col items-center space-y-1 ${
              state.currentView === "settings" ? "active" : ""
            }`}
            onClick={() => handleNavigation("settings")}
            aria-label="Profile"
          >
            <div className="relative mb-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                state.currentView === "settings"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-110"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              }`}>
                {state.user?.name?.charAt(0) || "U"}
              </div>
            </div>
            <span className={`text-xs font-bold ${
              state.currentView === "settings"
                ? "text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-300"
            }`}>Profile</span>
          </button>
        </div>
      </div>
      
      {/* Home Indicator */}
      <div className="flex justify-center mt-4">
        <div className="w-32 h-1 bg-gray-800 dark:bg-gray-200 rounded-full opacity-60" />
      </div>
    </div>
  );
}