import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Sparkles,
  Heart,
  Brain,
  Headphones,
  Activity,
  Sun,
  Moon,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";
import { useAppContext } from "./AppContext";

export function WellnessStudio() {
  const { dispatch } = useAppContext();

  const wellnessActivities = [
    {
      id: "mood-tracking",
      title: "Mood Tracking",
      description: "Track your emotional wellbeing",
      icon: Heart,
      gradient: "from-pink-500 to-rose-600",
      action: () => dispatch({ type: "SET_VIEW", payload: "mood" }),
    },
    {
      id: "cbt-exercises",
      title: "CBT Exercises",
      description: "Cognitive behavioral therapy tools",
      icon: Brain,
      gradient: "from-green-500 to-emerald-600",
      action: () => dispatch({ type: "SET_VIEW", payload: "exercises" }),
    },
    {
      id: "meditation",
      title: "Meditation",
      description: "Guided meditation sessions",
      icon: Headphones,
      gradient: "from-indigo-500 to-purple-600",
      action: () => dispatch({ type: "SET_VIEW", payload: "meditation" }),
    },
    {
      id: "breathing",
      title: "Breathing Exercises",
      description: "Calm your mind with breathwork",
      icon: Activity,
      gradient: "from-blue-500 to-cyan-600",
      action: () => {},
    },
    {
      id: "morning-routine",
      title: "Morning Routine",
      description: "Start your day mindfully",
      icon: Sun,
      gradient: "from-amber-500 to-orange-600",
      action: () => {},
    },
    {
      id: "evening-routine",
      title: "Evening Routine",
      description: "Wind down peacefully",
      icon: Moon,
      gradient: "from-indigo-600 to-purple-700",
      action: () => {},
    },
  ];

  const quickStats = [
    {
      label: "Activities Today",
      value: "3",
      icon: Zap,
      color: "text-amber-500",
    },
    {
      label: "Current Streak",
      value: "7 days",
      icon: Target,
      color: "text-green-500",
    },
    {
      label: "Progress",
      value: "85%",
      icon: TrendingUp,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-900 dark:via-cyan-900 dark:to-blue-900">
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 py-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-10 h-10 text-teal-500" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Wellness Studio
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personalized space for mental health and wellbeing activities 🌟
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card
                key={index}
                className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
              >
                <CardContent className="p-4 text-center">
                  <IconComponent className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Wellness Activities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-teal-500" />
            Wellness Activities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wellnessActivities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="cursor-pointer border-0 overflow-hidden group transition-all duration-300 hover:shadow-2xl bg-white dark:bg-slate-800"
                    onClick={activity.action}
                  >
                    <CardContent className="p-0">
                      <div
                        className={`relative p-6 bg-gradient-to-r ${activity.gradient} text-white overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative flex items-center space-x-4">
                          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                            <IconComponent className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-1">
                              {activity.title}
                            </h3>
                            <p className="text-white/90 text-sm">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={activity.action}
                        >
                          Start Activity →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Daily Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="w-6 h-6" />
                Today's Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">
                Based on your recent activity, we recommend starting with a
                5-minute breathing exercise to center yourself.
              </p>
              <Button
                variant="secondary"
                className="bg-white text-teal-600 hover:bg-gray-100"
              >
                Start Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}