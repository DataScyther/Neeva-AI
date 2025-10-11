import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useAppContext } from "./AppContext";
import "../styles/navigation-optimize.css";
import "../styles/navigation-glass.css";
import {
  Home,
  MessageCircle,
  Heart,
  BookOpen,
  Users,
  Settings,
  LogOut,
  BarChart3,
  Headphones,
  Shield,
  ChevronDown,
  Menu,
  X,
  Plus,
  User,
  FileText,
  Compass,
  Activity,
} from "lucide-react";
import { AppState } from "./AppContext";

// Define proper types for navigation items
type BaseNavigationItem = {
  id: string;
  label: string;
  icon: any;
  view: AppState["currentView"];
  color: string;
};

type MainNavigationItem = BaseNavigationItem & {
  badge?: string | number | null;
};

type SupportNavigationItem = BaseNavigationItem & {
  urgent: boolean;
};

type ToolsNavigationItem = BaseNavigationItem;

type NavigationItem = MainNavigationItem | SupportNavigationItem | ToolsNavigationItem;

export function Navigation() {
  const { state, dispatch } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add subtle animations using CSS transitions
  useEffect(() => {
    // Trigger re-render animations when view changes
    const items = document.querySelectorAll('.nav-pill-item');
    items.forEach((item, index) => {
      (item as HTMLElement).style.animation = `fadeInUp 0.5s ease-out ${index * 0.05}s forwards`;
    });

    const centerButton = document.querySelector('.nav-center-button');
    if (centerButton) {
      (centerButton as HTMLElement).style.animation = 'scaleIn 0.6s ease-out forwards';
    }
  }, [state.currentView]);

  const mainNavigationItems: MainNavigationItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      view: "dashboard",
      color: "text-blue-500",
    },
    {
      id: "chatbot",
      label: "Neeva Chat",
      icon: MessageCircle,
      view: "chatbot",
      color: "text-purple-500",
      badge: state.chatHistory.length > 0 ? null : "New",
    },
    {
      id: "mood",
      label: "Mood Tracker",
      icon: Heart,
      view: "mood",
      color: "text-pink-500",
      badge:
        state.moodEntries.filter((entry) => {
          const today = new Date();
          const entryDate = new Date(entry.timestamp);
          return (
            entryDate.toDateString() === today.toDateString()
          );
        }).length || null,
    },
    {
      id: "exercises",
      label: "CBT Exercises",
      icon: BookOpen,
      view: "exercises",
      color: "text-green-500",
      badge:
        state.exercises.filter((ex) => ex.completed).length ||
        null,
    },
  ];

  const toolsNavigationItems: ToolsNavigationItem[] = [
    {
      id: "meditation",
      label: "Guided Meditation",
      icon: Headphones,
      view: "meditation",
      color: "text-indigo-500",
    },
    {
      id: "insights",
      label: "Insights & Analytics",
      icon: BarChart3,
      view: "insights",
      color: "text-cyan-500",
    },
    {
      id: "community",
      label: "Support Groups",
      icon: Users,
      view: "community",
      color: "text-orange-500",
    },
  ];

  const supportNavigationItems: SupportNavigationItem[] = [
    {
      id: "crisis",
      label: "Crisis Support",
      icon: Shield,
      view: "crisis",
      color: "text-red-500",
      urgent: true,
    },
  ];

  const handleLogout = () => {
    // Clear onboarding data
    localStorage.removeItem("onboardingCompleted");
    localStorage.removeItem("onboardingData");
    dispatch({ type: "SET_USER", payload: null });
    setIsMobileMenuOpen(false); // Close menu on logout
  };

  const handleNavigation = (view: AppState["currentView"]) => {
    dispatch({ type: "SET_VIEW", payload: view });
    setIsMobileMenuOpen(false); // Close menu after navigation
  };

  const renderNavigationGroup = (
    items: NavigationItem[],
    title?: string,
  ) => (
    <div className="space-y-1">
      {title && (
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
        </div>
      )}
      {items.map((item) => {
        const IconComponent = item.icon;
        const isActive = state.currentView === item.view;

        // Type guards for safe property access
        const hasBadge = 'badge' in item && item.badge;
        const hasUrgent = 'urgent' in item && item.urgent;

        return (
          <div key={item.id}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start h-11 ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                  : hasUrgent
                    ? "hover:bg-red-50 hover:text-red-700"
                    : "hover:bg-accent"
              }`}
              onClick={() =>
                dispatch({
                  type: "SET_VIEW",
                  payload: item.view,
                })
              }
            >
              <IconComponent
                className={`w-5 h-5 mr-3 ${
                  isActive
                    ? "text-white"
                    : hasUrgent
                      ? "text-red-500"
                      : item.color
                }`}
              />
              <span className="flex-1 text-left">
                {item.label}
              </span>
              {hasBadge && (
                <Badge
                  variant="secondary"
                  className="ml-auto text-xs"
                >
                  {item.badge}
                </Badge>
              )}
              {hasUrgent && !isActive && (
                <div className="w-2 h-2 bg-red-500 rounded-full ml-auto" />
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-background lg:border-r lg:border-border lg:shadow-sm">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Neeva
                </h1>
                <p className="text-xs text-muted-foreground">
                  Mental Health Companion
                </p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                {state.user?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {state.user?.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {state.user?.email}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="shrink-0"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
            {/* Main Navigation */}
            {renderNavigationGroup(mainNavigationItems, "Main")}

            <Separator />

            {/* Tools */}
            {renderNavigationGroup(
              toolsNavigationItems,
              "Tools",
            )}

            <Separator />

            {/* Support */}
            {renderNavigationGroup(
              supportNavigationItems,
              "Support",
            )}
          </nav>

          {/* Settings & Logout */}
          <div className="px-3 py-4 border-t border-border space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start h-11"
              onClick={() =>
                dispatch({
                  type: "SET_VIEW",
                  payload: "settings",
                })
              }
            >
              <Settings className="w-5 h-5 mr-3 text-gray-500" />
              <span>Settings</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start h-11 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - New Pill Design */}
      <div className="lg:hidden mobile-nav-container">
        {/* Main Navigation Pill */}
        <div className="navigation-pill bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-full px-4 py-3 shadow-2xl">
          <div className="flex items-center justify-between space-x-3 sm:space-x-4">
            {/* Home */}
            <button
              className={`nav-pill-item flex flex-col items-center space-y-1 transition-all duration-200 ${
                state.currentView === "dashboard"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              onClick={() => {
                dispatch({ type: "SET_VIEW", payload: "dashboard" });
                if ('vibrate' in navigator) navigator.vibrate(10);
              }}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>

            {/* AI Assistant - Neeva AI */}
            <button
              className={`nav-pill-item flex flex-col items-center space-y-1 transition-all duration-200 ${
                state.currentView === "chatbot"
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              onClick={() => {
                dispatch({ type: "SET_VIEW", payload: "chatbot" });
                if ('vibrate' in navigator) navigator.vibrate(10);
              }}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs font-medium">Neeva AI</span>
              {state.chatHistory.length === 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full" />
              )}
            </button>

            {/* Center Explore Button */}
            <button
              className={`nav-center-button w-14 h-14 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200 ${
                state.currentView === "exercises"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              }`}
              onClick={() => {
                dispatch({ type: "SET_VIEW", payload: "exercises" });
                if ('vibrate' in navigator) navigator.vibrate(10);
              }}
              title="Explore CBT Wellness Studio"
              aria-label="Explore CBT Wellness Studio"
            >
              <Compass className="w-7 h-7 text-white" />
            </button>

            {/* Mood Tracker */}
            <button
              className={`nav-pill-item flex flex-col items-center space-y-1 transition-all duration-200 ${
                state.currentView === "mood"
                  ? "text-pink-600 dark:text-pink-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              onClick={() => {
                dispatch({ type: "SET_VIEW", payload: "mood" });
                if ('vibrate' in navigator) navigator.vibrate(10);
              }}
            >
              <Activity className="w-6 h-6" />
              <span className="text-xs font-medium">Mood</span>
              {state.moodEntries.filter((entry) => {
                const today = new Date();
                const entryDate = new Date(entry.timestamp);
                return entryDate.toDateString() === today.toDateString();
              }).length > 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full" />
              )}
            </button>

            {/* Profile - Opens Drawer */}
            <button
              className="nav-pill-item flex flex-col items-center space-y-1 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Profile</span>
            </button>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="flex justify-center mt-4">
          <div className="w-32 h-1 bg-gray-800 dark:bg-gray-200 rounded-full opacity-60" />
        </div>
      </div>

      {/* Mobile Menu Button for other features */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          size="sm"
          className="bg-background/80 backdrop-blur-sm border border-border shadow-lg text-foreground hover:bg-accent"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="lg:hidden fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white dark:bg-black border-l border-border shadow-xl z-50 transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Neeva</h2>
                    <p className="text-xs text-muted-foreground">
                      Mental Health Companion
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* User Info */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                    {state.user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {state.user?.name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {state.user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Main Navigation */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Main
                  </p>
                  {mainNavigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive =
                      state.currentView === item.view;

                    // Type guards for safe property access
                    const hasBadge = 'badge' in item && item.badge;

                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start h-11 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                            : "hover:bg-accent"
                        }`}
                        onClick={() =>
                          handleNavigation(item.view)
                        }
                      >
                        <IconComponent
                          className={`w-5 h-5 mr-3 ${
                            isActive ? "text-white" : item.color
                          }`}
                        />
                        <span className="flex-1 text-left">
                          {item.label}
                        </span>
                        {hasBadge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>

                <Separator />

                {/* Tools Navigation */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Tools
                  </p>
                  {toolsNavigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive =
                      state.currentView === item.view;

                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start h-11 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                            : "hover:bg-accent"
                        }`}
                        onClick={() =>
                          handleNavigation(item.view)
                        }
                      >
                        <IconComponent
                          className={`w-5 h-5 mr-3 ${
                            isActive ? "text-white" : item.color
                          }`}
                        />
                        <span className="flex-1 text-left">
                          {item.label}
                        </span>
                      </Button>
                    );
                  })}
                </div>

                <Separator />

                {/* Support Navigation */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Support
                  </p>
                  {supportNavigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive =
                      state.currentView === item.view;

                    // Type guards for safe property access
                    const hasUrgent = 'urgent' in item && item.urgent;

                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start h-11 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                            : hasUrgent
                              ? "hover:bg-red-50 hover:text-red-700"
                              : "hover:bg-accent"
                        }`}
                        onClick={() =>
                          handleNavigation(item.view)
                        }
                      >
                        <IconComponent
                          className={`w-5 h-5 mr-3 ${
                            isActive
                              ? "text-white"
                              : hasUrgent
                                ? "text-red-500"
                                : item.color
                          }`}
                        />
                        <span className="flex-1 text-left">
                          {item.label}
                        </span>
                        {hasUrgent && !isActive && (
                          <div className="w-2 h-2 bg-red-500 rounded-full ml-auto" />
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-border space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-11"
                  onClick={() => handleNavigation("settings")}
                >
                  <Settings className="w-5 h-5 mr-3 text-gray-500" />
                  <span>Settings</span>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-11 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
