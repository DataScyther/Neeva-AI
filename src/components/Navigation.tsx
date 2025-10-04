import { useState, useEffect } from "react";
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
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Smart hide/show navigation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show when at the top or scrolling up
      if (currentScrollY < 10 || currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide when scrolling down after 100px
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for performance
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    return () => window.removeEventListener('scroll', scrollListener);
  }, [lastScrollY]);

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

      {/* Mobile Bottom Navigation - Optimized for smooth scrolling */}
      <div 
        className={`lg:hidden fixed bottom-0 inset-x-0 navigation-mobile navigation-glass navigation-shadow navigation-glass-effect transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="grid grid-cols-5 h-16 relative">
          {[
            ...mainNavigationItems.slice(0, 4),
            supportNavigationItems[0], // Crisis item with urgent property
          ].map((item) => {
            const IconComponent = item.icon;
            const isActive = state.currentView === item.view;

            // Type guards for safe property access
            const hasBadge = 'badge' in item && item.badge;
            const hasUrgent = 'urgent' in item && item.urgent;

            return (
              <button
                key={item.id}
                className={`nav-item flex flex-col items-center justify-center space-y-1 relative transition-all duration-200 ease-in-out ${
                  isActive
                    ? "text-blue-600 font-semibold"
                    : hasUrgent
                      ? "text-red-500"
                      : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => {
                  dispatch({
                    type: "SET_VIEW",
                    payload: item.view,
                  });
                  // Haptic feedback on mobile
                  if ('vibrate' in navigator) {
                    navigator.vibrate(10);
                  }
                }}
              >
                <IconComponent className="nav-icon w-5 h-5 transition-transform duration-200" />
                <span className="nav-label text-xs font-medium">
                  {item.label.split(" ")[0]}
                </span>
                {hasUrgent && !isActive && (
                  <div className="absolute top-1 right-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                )}
                {isActive && (
                  <div className="nav-active-indicator" />
                )}
              </button>
            );
          })}
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
          <div className="lg:hidden fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-background border-l border-border shadow-xl z-50 transform transition-transform duration-300">
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
