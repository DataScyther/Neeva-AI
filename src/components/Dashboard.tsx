import { useEffect } from "react";
import { useAppContext } from "./AppContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  MessageCircle,
  Heart,
  BookOpen,
  Users,
  Sun,
  Moon,
  Zap,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Rainbow,
  Star,
  Flame,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";

export function Dashboard() {
  const { state, dispatch } = useAppContext();

  // Add subtle animations on mount
  useEffect(() => {
    // Animate stats cards
    const statsCards = document.querySelectorAll('.stats-card');
    statsCards.forEach((card, index) => {
      (card as HTMLElement).style.animation = `fadeInUp 0.8s ease-out ${index * 0.1}s forwards`;
    });

    // Animate quick action cards
    const actionCards = document.querySelectorAll('.quick-action-card');
    actionCards.forEach((card, index) => {
      (card as HTMLElement).style.animation = `scaleIn 0.6s ease-out ${0.3 + index * 0.08}s forwards`;
    });
  }, []);

  const todayMoodEntries = state.moodEntries.filter((entry) => {
    const today = new Date();
    const entryDate = new Date(entry.timestamp);
    return entryDate.toDateString() === today.toDateString();
  });

  const completedExercises = state.exercises.filter(
    (ex) => ex.completed,
  );
  const totalStreak = state.exercises.reduce(
    (sum, ex) => sum + ex.streak,
    0,
  );

  const averageMood =
    todayMoodEntries.length > 0
      ? todayMoodEntries.reduce(
        (sum, entry) => sum + entry.mood,
        0,
      ) / todayMoodEntries.length
      : 0;

  const quickActions = [
    {
      title: "Chat with Neeva",
      description: "Get personalized support & guidance",
      icon: MessageCircle,
      action: () =>
        dispatch({ type: "SET_VIEW", payload: "chatbot" }),
      gradient: "from-violet-500 via-purple-500 to-indigo-500",
      shadowColor: "shadow-violet-500/25",
      iconBg: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      title: "Track Your Mood",
      description: "Express how you're feeling today",
      icon: Heart,
      action: () =>
        dispatch({ type: "SET_VIEW", payload: "mood" }),
      gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
      shadowColor: "shadow-rose-500/25",
      iconBg: "bg-rose-100 dark:bg-rose-900/30",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
    {
      title: "CBT Exercises",
      description: "Practice mindfulness & grow stronger",
      icon: BookOpen,
      action: () =>
        dispatch({ type: "SET_VIEW", payload: "exercises" }),
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      shadowColor: "shadow-emerald-500/25",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Support Groups",
      description: "Connect with your community",
      icon: Users,
      action: () =>
        dispatch({ type: "SET_VIEW", payload: "community" }),
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      shadowColor: "shadow-orange-500/25",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  const getMoodEmoji = (mood: number) => {
    if (mood >= 4.5) return "😊";
    if (mood >= 3.5) return "🙂";
    if (mood >= 2.5) return "😐";
    if (mood >= 1.5) return "😕";
    return "😢";
  };

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12)
      return {
        text: "Good morning",
        icon: Sun,
        color: "text-amber-500",
      };
    if (hour < 17)
      return {
        text: "Good afternoon",
        icon: Sun,
        color: "text-orange-500",
      };
    return {
      text: "Good evening",
      icon: Moon,
      color: "text-indigo-500",
    };
  };

  const greeting = getTimeOfDayGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 py-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <GreetingIcon
              className={`w-8 h-8 ${greeting.color}`}
            />
            <span className="text-lg text-muted-foreground font-medium">
              {greeting.text}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-300 dark:to-white bg-clip-text text-transparent">
            Welcome back, {state.user?.name}!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to continue your wellness journey? Let's see
            how you're doing today 🌟
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="stats-card relative overflow-hidden border-0 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900 shadow-xl shadow-blue-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
            <CardContent className="relative p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/25">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Today's Mood
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">
                      {averageMood > 0
                        ? averageMood.toFixed(1)
                        : "--"}
                    </span>
                    <span className="text-2xl">
                      {getMoodEmoji(averageMood)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card relative overflow-hidden border-0 bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900 shadow-xl shadow-emerald-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
            <CardContent className="relative p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/25">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Exercises Done
                  </p>
                  <p className="text-2xl font-bold">
                    {completedExercises.length}/
                    {state.exercises.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card relative overflow-hidden border-0 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900 shadow-xl shadow-purple-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
            <CardContent className="relative p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-purple-500 shadow-lg shadow-purple-500/25">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Current Streak
                  </p>
                  <p className="text-2xl font-bold">
                    {totalStreak} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="stats-card relative overflow-hidden border-0 bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-amber-900 shadow-xl shadow-amber-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
            <CardContent className="relative p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-amber-500 shadow-lg shadow-amber-500/25">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Days Active
                  </p>
                  <p className="text-2xl font-bold">7 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Zap className="w-6 h-6 text-amber-500" />
            <h2 className="text-2xl font-bold">
              Quick Actions
            </h2>
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 * index,
                  }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`quick-action-card cursor-pointer border-0 overflow-hidden group transition-all duration-300 hover:shadow-2xl ${action.shadowColor} bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700`}
                    onClick={action.action}
                  >
                    <CardContent className="p-0">
                      <div
                        className={`relative p-6 bg-gradient-to-r ${action.gradient} text-white overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative flex items-center space-x-4">
                          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                            <IconComponent className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-1">
                              {action.title}
                            </h3>
                            <p className="text-white/90 text-sm">
                              {action.description}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 180, 360],
                          }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Let's get started
                          </span>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Progress and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl">
                    Today's Progress
                  </span>
                  <Rainbow className="w-5 h-5 text-purple-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">
                        Daily Exercises
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        {completedExercises.length}/
                        {state.exercises.length}
                      </Badge>
                    </div>
                    <div className="relative">
                      <Progress
                        value={
                          (completedExercises.length /
                            state.exercises.length) *
                          100
                        }
                        className="h-3 bg-green-100 dark:bg-green-900"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">
                        Mood Logs
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {todayMoodEntries.length}
                      </Badge>
                    </div>
                    <div className="relative">
                      <Progress
                        value={Math.min(
                          todayMoodEntries.length * 33.33,
                          100,
                        )}
                        className="h-3 bg-blue-100 dark:bg-blue-900"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">
                        Chat Sessions
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      >
                        {state.chatHistory.length > 0
                          ? "1"
                          : "0"}
                      </Badge>
                    </div>
                    <div className="relative">
                      <Progress
                        value={
                          state.chatHistory.length > 0 ? 100 : 0
                        }
                        className="h-3 bg-purple-100 dark:bg-purple-900"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-indigo-50 dark:from-slate-800 dark:to-indigo-900">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-500 rounded-xl">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl">
                    Recent Activity
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.moodEntries
                  .slice(-3)
                  .reverse()
                  .map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-100 dark:border-indigo-800"
                    >
                      <div className="text-3xl">
                        {getMoodEmoji(entry.mood)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">
                          Mood: {entry.mood}/5
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            entry.timestamp,
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                {completedExercises
                  .slice(-2)
                  .map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay:
                          (state.moodEntries.length + index) *
                          0.1,
                      }}
                      className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-100 dark:border-green-800"
                    >
                      <div className="p-2 bg-green-500 rounded-xl shadow-lg">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">
                          Completed: {exercise.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Streak: {exercise.streak} days
                        </p>
                      </div>
                    </motion.div>
                  ))}

                {state.moodEntries.length === 0 &&
                  completedExercises.length === 0 && (
                    <div className="text-center py-12">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        <Heart className="w-16 h-16 mx-auto mb-4 text-pink-400" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-2">
                        Ready to start your journey?
                      </h3>
                      <p className="text-muted-foreground">
                        Track your mood or complete an exercise
                        to see your activity here ✨
                      </p>
                    </div>
                  )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
