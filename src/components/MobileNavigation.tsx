import React from "react";
import { useAppContext } from "./AppContext";
import {
  Home,
  MessageCircle,
  Heart,
  Brain,
  User,
} from "lucide-react";

interface MobileNavigationProps {
  hidden?: boolean;
}

export function MobileNavigation({ hidden = false }: MobileNavigationProps) {
  const { state, dispatch } = useAppContext();

  const handleNavigation = (view: string) => {
    dispatch({ type: "SET_VIEW", payload: view as any });
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const navItems = [
    { id: "dashboard", label: "Home", icon: Home, view: "dashboard", color: "#3b82f6" },
    { id: "chatbot", label: "AI", icon: MessageCircle, view: "chatbot", color: "#8b5cf6" },
    { id: "mood", label: "Mood", icon: Heart, view: "mood", color: "center" },
    { id: "exercises", label: "CBT", icon: Brain, view: "exercises", color: "#22c55e" },
    { id: "settings", label: "Profile", icon: User, view: "settings", color: "#6366f1" },
  ];

  return (
    <div className={`lg:hidden mobile-nav-container ${hidden ? "mobile-nav-hidden" : ""}`}>
      <div className="navigation-pill">
        <div className="mobile-nav-items">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = state.currentView === item.view;
            const isCenter = item.color === "center";

            if (isCenter) {
              return (
                <button
                  key={item.id}
                  className={`nav-center-button ${isActive ? "active" : ""}`}
                  onClick={() => handleNavigation(item.view)}
                  aria-label={item.label}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </button>
              );
            }

            return (
              <button
                key={item.id}
                className={`nav-pill-item ${isActive ? "active" : ""}`}
                onClick={() => handleNavigation(item.view)}
                aria-label={item.label}
              >
                <div className="nav-icon-wrapper">
                  <IconComponent
                    className="nav-icon"
                    style={{ color: isActive ? item.color : undefined }}
                  />
                  {item.id === "chatbot" && !isActive && (
                    <div className="nav-pulse-dot" />
                  )}
                </div>
                {isActive && (
                  <div
                    className="nav-active-dot"
                    style={{ backgroundColor: item.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}