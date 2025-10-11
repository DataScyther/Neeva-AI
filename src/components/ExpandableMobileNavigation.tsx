import { useState, useRef, useEffect } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import { useAppContext } from "./AppContext";
import {
  Home,
  MessageCircle,
  Heart,
  Brain,
  User,
  Sparkles,
  Headphones,
  Users,
  BarChart3,
  Shield,
  Settings,
  Grid3x3,
  ChevronUp,
} from "lucide-react";
import type { AppState } from "./AppContext";

// Navigation Item Component for Primary Bar
function PrimaryNavItem({
  icon: Icon,
  label,
  isActive,
  onClick,
  color,
  hasIndicator,
}: {
  icon: any;
  label: string;
  isActive: boolean;
  onClick: () => void;
  color: string;
  hasIndicator?: boolean;
}) {
  return (
    <button
      className={`nav-item group relative flex flex-col items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl transition-all duration-300 touch-manipulation ${
        isActive ? "nav-item-active" : ""
      }`}
      onClick={onClick}
      aria-label={label}
    >
      <div className="relative">
        <div
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 ${
            isActive
              ? `bg-gradient-to-br ${color} shadow-lg shadow-${color.split("-")[1]}-500/30 scale-105`
              : "bg-gray-100/80 dark:bg-gray-800/80 group-hover:bg-gray-200/80 dark:group-hover:bg-gray-700/80 group-hover:scale-105"
          }`}
        >
          <Icon
            className={`w-5 h-5 transition-all duration-300 ${
              isActive
                ? "text-white drop-shadow-sm"
                : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
            }`}
            strokeWidth={2.5}
          />
        </div>

        {hasIndicator && (
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg shadow-purple-500/50">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-ping opacity-75" />
          </div>
        )}

        {isActive && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
        )}
      </div>

      <span
        className={`text-[10px] font-bold tracking-wide transition-all duration-300 ${
          isActive
            ? "text-gray-900 dark:text-white"
            : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

// Center Action Button
function CenterActionButton({
  icon: Icon,
  label,
  onClick,
  onExpandClick,
}: {
  icon: any;
  label: string;
  onClick: () => void;
  onExpandClick: () => void;
}) {
  return (
    <div className="relative flex flex-col items-center">
      <button
        className="nav-center-action group relative flex items-center justify-center touch-manipulation"
        onClick={onClick}
        aria-label={label}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 opacity-30 blur-2xl group-hover:opacity-40 transition-all duration-300" />

        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 shadow-2xl shadow-purple-500/40 flex items-center justify-center border-[3px] border-white dark:border-gray-800 transition-all duration-300 group-hover:shadow-purple-500/50">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 via-white/20 to-transparent" />
          <Icon
            className="w-7 h-7 text-white relative z-10 drop-shadow-lg"
            strokeWidth={2.5}
          />
          <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
        </div>
      </button>

      {/* Expand Indicator */}
      <button
        onClick={onExpandClick}
        className="mt-1 flex items-center justify-center w-8 h-3 rounded-full bg-gray-300/50 dark:bg-gray-700/50 hover:bg-gray-400/50 dark:hover:bg-gray-600/50 transition-all duration-300"
        aria-label="Expand menu"
      >
        <ChevronUp className="w-3 h-3 text-gray-600 dark:text-gray-400 animate-bounce" />
      </button>
    </div>
  );
}

// Profile Avatar
function ProfileAvatar({
  name,
  isActive,
  onClick,
}: {
  name: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`nav-item group relative flex flex-col items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl transition-all duration-300 touch-manipulation ${
        isActive ? "nav-item-active" : ""
      }`}
      onClick={onClick}
      aria-label="Profile"
    >
      <div className="relative">
        <div
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-purple-500/30 scale-105"
              : "bg-gray-100/80 dark:bg-gray-800/80 group-hover:bg-gray-200/80 dark:group-hover:bg-gray-700/80 group-hover:scale-105"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 ${
              isActive
                ? "bg-white text-blue-600"
                : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
            }`}
          >
            {name?.charAt(0) || "U"}
          </div>
        </div>

        {isActive && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
        )}
      </div>

      <span
        className={`text-[10px] font-bold tracking-wide transition-all duration-300 ${
          isActive
            ? "text-gray-900 dark:text-white"
            : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200"
        }`}
      >
        Profile
      </span>
    </button>
  );
}

// Expanded Menu Item
function ExpandedMenuItem({
  icon: Icon,
  label,
  isActive,
  onClick,
  gradient,
  index,
}: {
  icon: any;
  label: string;
  isActive: boolean;
  onClick: () => void;
  gradient: string;
  index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 25 }}
      onClick={onClick}
      className={`expanded-menu-item group relative flex flex-col items-center justify-center gap-3 p-4 rounded-3xl transition-all duration-300 touch-manipulation ${
        isActive
          ? `bg-gradient-to-br ${gradient} text-white shadow-lg`
          : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 shadow-md hover:shadow-lg"
      }`}
      aria-label={label}
    >
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
          isActive
            ? "bg-white/20"
            : "bg-gray-100 dark:bg-gray-700 group-hover:scale-110"
        }`}
      >
        <Icon
          className={`w-6 h-6 transition-all duration-300 ${
            isActive
              ? "text-white"
              : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
          }`}
          strokeWidth={2.5}
        />
      </div>

      <span
        className={`text-xs font-bold text-center leading-tight transition-all duration-300 ${
          isActive
            ? "text-white"
            : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
        }`}
      >
        {label}
      </span>

      {isActive && (
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
      )}
    </motion.button>
  );
}

export function ExpandableMobileNavigation() {
  const { state, dispatch } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [dragY, setDragY] = useState(0);
  const controls = useAnimation();
  const constraintsRef = useRef(null);

  const primaryNavItems = [
    {
      id: "dashboard",
      icon: Home,
      label: "Home",
      view: "dashboard" as const,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "chatbot",
      icon: MessageCircle,
      label: "Neeva AI",
      view: "chatbot" as const,
      color: "from-purple-500 to-purple-600",
      hasIndicator: true,
    },
    {
      id: "mood",
      icon: Heart,
      label: "Mood",
      view: "mood" as const,
      color: "from-pink-500 to-pink-600",
      isCenter: true,
    },
    {
      id: "exercises",
      icon: Brain,
      label: "CBT",
      view: "exercises" as const,
      color: "from-green-500 to-green-600",
    },
  ];

  const expandedMenuItems = [
    {
      id: "wellness",
      icon: Sparkles,
      label: "Wellness Studio",
      view: "wellness" as const,
      gradient: "from-teal-500 to-cyan-600",
    },
    {
      id: "meditation",
      icon: Headphones,
      label: "Guided Meditations",
      view: "meditation" as const,
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      id: "community",
      icon: Users,
      label: "Community",
      view: "community" as const,
      gradient: "from-orange-500 to-amber-600",
    },
    {
      id: "insights",
      icon: BarChart3,
      label: "Insights",
      view: "insights" as const,
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      id: "crisis",
      icon: Shield,
      label: "Crisis Support",
      view: "crisis" as const,
      gradient: "from-red-500 to-pink-600",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      view: "settings" as const,
      gradient: "from-gray-500 to-gray-700",
    },
  ];

  const handleNavigation = (view: AppState["currentView"]) => {
    dispatch({ type: "SET_VIEW", payload: view });
    setIsExpanded(false);
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleExpand = () => {
    setIsExpanded(true);
    if ("vibrate" in navigator) {
      navigator.vibrate([10, 5, 10]);
    }
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    if ("vibrate" in navigator) {
      navigator.vibrate(5);
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = -50;
    if (info.offset.y < threshold) {
      handleExpand();
    } else if (info.offset.y > 50 && isExpanded) {
      handleCollapse();
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        handleCollapse();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  return (
    <>
      {/* Backdrop Overlay */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
          onClick={handleCollapse}
        />
      )}

      {/* Navigation Container */}
      <nav className="expandable-nav-wrapper" aria-label="Mobile navigation">
        <motion.div
          ref={constraintsRef}
          className="expandable-nav-container"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={controls}
        >
          {/* Expanded Menu Grid */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="expanded-menu-grid"
            >
              <div className="grid grid-cols-3 gap-3 p-4">
                {expandedMenuItems.map((item, index) => (
                  <ExpandedMenuItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    isActive={state.currentView === item.view}
                    onClick={() => handleNavigation(item.view)}
                    gradient={item.gradient}
                    index={index}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Primary Navigation Bar */}
          <div className="navigation-bar">
            {/* Left Items */}
            <div className="nav-section">
              {primaryNavItems.slice(0, 2).map((item) => {
                const isActive = state.currentView === item.view;
                return (
                  <PrimaryNavItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    isActive={isActive}
                    onClick={() => handleNavigation(item.view)}
                    color={item.color}
                    hasIndicator={item.hasIndicator}
                  />
                );
              })}
            </div>

            {/* Center Action Button */}
            <div className="nav-center">
              <CenterActionButton
                icon={primaryNavItems[2].icon}
                label={primaryNavItems[2].label}
                onClick={() => handleNavigation(primaryNavItems[2].view)}
                onExpandClick={handleExpand}
              />
            </div>

            {/* Right Items */}
            <div className="nav-section">
              {primaryNavItems.slice(3).map((item) => {
                const isActive = state.currentView === item.view;
                return (
                  <PrimaryNavItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    isActive={isActive}
                    onClick={() => handleNavigation(item.view)}
                    color={item.color}
                  />
                );
              })}

              <ProfileAvatar
                name={state.user?.name || "User"}
                isActive={state.currentView === "settings"}
                onClick={() => handleNavigation("settings")}
              />
            </div>
          </div>
        </motion.div>

        {/* Home Indicator */}
        <div className="home-indicator-wrapper">
          <div className="home-indicator" />
        </div>
      </nav>
    </>
  );
}