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

  const navItems = [
    {
      id: "dashboard",
      icon: Home,
      label: "Home",
      view: "dashboard" as const,
      color: "text-blue-600",
      activeColor: "text-blue-600",
    },
    {
      id: "chatbot",
      icon: MessageCircle,
      label: "Neeva AI",
      view: "chatbot" as const,
      color: "text-purple-600",
      activeColor: "text-purple-600",
      hasIndicator: true,
    },
    {
      id: "mood",
      icon: Heart,
      label: "Mood",
      view: "mood" as const,
      color: "text-pink-600",
      activeColor: "text-pink-600",
      isCenter: true,
    },
    {
      id: "exercises",
      icon: Brain,
      label: "CBT",
      view: "exercises" as const,
      color: "text-green-600",
      activeColor: "text-green-600",
    },
    {
      id: "profile",
      icon: User,
      label: "Profile",
      view: "settings" as const,
      color: "text-gray-600",
      activeColor: "text-gray-900",
      isProfile: true,
    },
  ];

  const handleNavigation = (view: string) => {
    dispatch({ type: "SET_VIEW", payload: view as any });
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <div className="mobile-nav-container">
      <div className="navigation-pill">
        <div className="flex items-center justify-between px-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = state.currentView === item.view;
            
            if (item.isCenter) {
              return (
                <button
                  key={item.id}
                  className="nav-center-button"
                  onClick={() => handleNavigation(item.view)}
                  aria-label={item.label}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </button>
              );
            }

            if (item.isProfile) {
              return (
                <button
                  key={item.id}
                  className={`nav-pill-item ${
                    isActive ? item.activeColor : "text-gray-500"
                  }`}
                  onClick={() => handleNavigation(item.view)}
                  aria-label={item.label}
                >
                  <div className="relative mb-1">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs">
                      {state.user?.name?.charAt(0) || "U"}
                    </div>
                  </div>
                  <span className="text-xs font-semibold">{item.label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                className={`nav-pill-item ${
                  isActive ? item.activeColor : "text-gray-500"
                }`}
                onClick={() => handleNavigation(item.view)}
                aria-label={item.label}
              >
                <div className="relative mb-1">
                  <IconComponent className="w-5 h-5" />
                  {item.hasIndicator && (
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
                  )}
                </div>
                <span className="text-xs font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Home Indicator */}
      <div className="flex justify-center mt-4">
        <div className="w-32 h-1 bg-gray-800 dark:bg-gray-200 rounded-full opacity-60" />
      </div>
    </div>
  );
}
