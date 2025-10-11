import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { checkEnvVariables } from "./utils/env-check";
import { callGemini, convertChatHistoryToGemini, OpenRouterError } from "./utils/gemini";
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
import { Settings } from "./components/Settings";
import { Navigation } from "./components/Navigation";
import { InsightsDashboard } from "./components/InsightsDashboard";
import { GuidedMeditation } from "./components/GuidedMeditation";
import { CrisisSupport } from "./components/CrisisSupport";
import { Toaster } from "./components/ui/sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Badge } from "./components/ui/badge";
import { Progress } from "./components/ui/progress";
import {
  Heart,
  MessageCircle,
  BookOpen,
  Users,
  TrendingUp,
  Target,
  ChevronRight,
  Send,
  Bot,
  User,
  Lightbulb,
  Sparkles,
  Plus,
  Smile,
  Star,
  Zap,
  Sun,
  Moon,
  Rainbow,
  Flame,
} from "lucide-react";
import { motion } from "framer-motion";

// Inline Dashboard Component
function Dashboard() {
  const { state, dispatch } = useAppContext();

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

        {/* Stats Cards */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900 shadow-xl shadow-blue-500/10">
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

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900 shadow-xl shadow-emerald-500/10">
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

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900 shadow-xl shadow-purple-500/10">
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

          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-amber-900 shadow-xl shadow-amber-500/10">
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

        {/* Quick Actions */
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
                    className={`cursor-pointer border-0 overflow-hidden group transition-all duration-300 hover:shadow-2xl ${action.shadowColor} bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700`}
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

        {/* Progress and Activity */
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

// Inline Chatbot Component
function Chatbot() {
  const { state, dispatch } = useAppContext();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [rateLimitUntil, setRateLimitUntil] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // AI Response formatting utility
  const formatAIResponse = (content: string) => {
    // Split into sentences for better readability
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);

    // Add proper punctuation if missing
    const formattedSentences = sentences.map((sentence, index) => {
      const trimmed = sentence.trim();
      if (!trimmed.match(/[.!?]$/)) {
        return index === sentences.length - 1 ? `${trimmed}.` : `${trimmed}.`;
      }
      return trimmed;
    });

    return formattedSentences.join(' ');
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatHistory, isTyping]);

  // Clear rate limit after timeout
  useEffect(() => {
    if (rateLimitUntil) {
      const timer = setTimeout(() => {
        setRateLimitUntil(null);
      }, rateLimitUntil - Date.now());

      return () => clearTimeout(timer);
    }
  }, [rateLimitUntil]);

  const quickSuggestions = [
    {
      text: "I'm feeling anxious today",
      emoji: "😰",
      color: "from-red-400 to-pink-400",
    },
    {
      text: "Help me with breathing exercises",
      emoji: "🫁",
      color: "from-blue-400 to-cyan-400",
    },
    {
      text: "I can't sleep well",
      emoji: "😴",
      color: "from-indigo-400 to-purple-400",
    },
    {
      text: "I need motivation",
      emoji: "💪",
      color: "from-orange-400 to-yellow-400",
    },
  ];

  const getAIResponse = useCallback(async (userMessage: string): Promise<string> => {
    const perf = measurePerformance('ai-response');
    perf.start();
    
    try {
      const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!OPENROUTER_API_KEY) {
        return "⚠️ I'm having trouble connecting to my AI service. The application is not properly configured with an OpenRouter API key. If you're the administrator, please set VITE_OPENROUTER_API_KEY in the environment.";
      }

      const chatHistory = convertChatHistoryToGemini(
        state.chatHistory.filter(
          (msg) => !msg.isUser || msg.content !== userMessage,
        ),
      );
      const messages = [
        ...chatHistory,
        { role: "user" as const, parts: [{ text: userMessage }] },
      ];
      const response = await callGemini(messages);
      
      const duration = perf.end();
      console.log(`AI response generated in ${duration}ms`);
      
      return response;
    } catch (error) {
      // Only log non-expected errors
      if (error instanceof OpenRouterError && !error.statusCode) {
        // Expected error when API is not configured - don't log
      } else {
        console.error("AI API Error:", error);
      }
      const lowerMessage = userMessage.toLowerCase();

      if (error instanceof OpenRouterError) {
        if (error.statusCode === 401) {
          return "⚠️ Authentication failed. Please verify your OpenRouter API key is valid and properly configured.";
        }
        if (error.statusCode === 403) {
          return "⚠️ Access forbidden. Your OpenRouter API key may not have permission to access the selected model.";
        }
        if (error.statusCode === 429) {
          return "⏳ I'm receiving a lot of requests right now. Please wait a moment and try again. For immediate support, you can also chat with our Gemini AI or use the quick suggestion buttons below.";
        }
        return `⚠️ ${error.message}`;
      }

      return getFallbackResponse(lowerMessage);
    }
  }, [state.chatHistory]);

  const getFallbackResponse = useCallback((lowerMessage: string): string => {
    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety")) {
      return "Try the 4-7-8 breathing technique: breathe in for 4, hold for 7, exhale for 8. 🌱";
    }
    if (lowerMessage.includes("sleep") || lowerMessage.includes("tired")) {
      return "Create a calming bedtime routine and avoid screens before sleep. 🌙";
    }
    if (lowerMessage.includes("sad") || lowerMessage.includes("down")) {
      return "Your feelings are valid. Try gentle movement or call a friend. 💙";
    }
    return "I'm here to listen and support you through this. 💜";
  }, []);

  const sendMessage = useCallback(async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim()) return;

    // Check if rate limited
    if (rateLimitUntil && Date.now() < rateLimitUntil) {
      const remainingTime = Math.ceil((rateLimitUntil - Date.now()) / 1000);
      dispatch({
        type: "ADD_CHAT_MESSAGE",
        payload: {
          id: Date.now().toString(),
          content: `⏳ Please wait ${remainingTime} seconds before sending another message to avoid rate limits.`,
          isUser: false,
          timestamp: new Date(),
        },
      });
      return;
    }

    // Haptic feedback for mobile
    if (isMobileDevice()) {
      triggerHapticFeedback('light');
    }

    const userMessage = {
      id: Date.now().toString(),
      content: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    dispatch({
      type: "ADD_CHAT_MESSAGE",
      payload: userMessage,
    });
    setMessage("");
    setIsTyping(true);
    
    // Use requestAnimationFrame for smooth UI update
    requestAnimationFrame(async () => {
      try {
        const aiResponseContent = await getAIResponse(textToSend);
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          content: aiResponseContent,
          isUser: false,
          timestamp: new Date(),
        };

        dispatch({
          type: "ADD_CHAT_MESSAGE",
          payload: aiResponse,
        });
        setIsTyping(false);
      } catch (error) {
        console.error('Error getting AI response:', error);

        // Handle rate limit errors specifically
        if (error instanceof OpenRouterError && error.statusCode === 429) {
          // Set rate limit for 60 seconds
          setRateLimitUntil(Date.now() + 60000);

          const rateLimitResponse = {
            id: (Date.now() + 1).toString(),
            content: "⏳ I've hit my usage limit for now. Please wait about a minute before trying again. In the meantime, feel free to use the quick suggestion buttons below! 💜",
            isUser: false,
            timestamp: new Date(),
          };

          dispatch({
            type: "ADD_CHAT_MESSAGE",
            payload: rateLimitResponse,
          });
        } else {
          const fallbackResponse = {
            id: (Date.now() + 1).toString(),
            content: "I'm having trouble responding right now. Please try again in a moment. 💙",
            isUser: false,
            timestamp: new Date(),
          };

          dispatch({
            type: "ADD_CHAT_MESSAGE",
            payload: fallbackResponse,
          });
        }
        setIsTyping(false);
      }
    });
  }, [message, getAIResponse, dispatch, rateLimitUntil]);

  useEffect(() => {
    if (state.chatHistory.length === 0) {
      const welcomeMessage = {
        id: "welcome",
        content: `Hello ${state.user?.name || 'there'}! 👋 I'm Neeva, your AI mental health companion. How are you feeling today? I'm here to listen and support you. 💜`,
        isUser: false,
        timestamp: new Date(),
      };

      setTimeout(() => {
        dispatch({
          type: "ADD_CHAT_MESSAGE",
          payload: welcomeMessage,
        });
      }, 500);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-900 dark:via-blue-900 dark:to-cyan-900">
      <div className="max-w-5xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg"
            >
              <Bot className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Neeva AI Companion
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Your safe space for support, guidance, and growth 🌱
          </p>
        </motion.div>

        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-0">
            {/* Messages Area */}
            <div className="h-[60vh] overflow-y-auto p-6 space-y-6">
              {state.chatHistory.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                  }}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[85%] ${msg.isUser ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`p-3 rounded-2xl shadow-lg ${
                        msg.isUser
                          ? "bg-gradient-to-r from-blue-500 to-purple-500"
                          : "bg-gradient-to-r from-violet-500 to-purple-500"
                      }`}
                    >
                      {msg.isUser ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-3xl shadow-lg ${
                        msg.isUser
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                          : "bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600"
                      }`}
                    >
                      <div className={`leading-relaxed ${msg.isUser ? "text-white" : ""}`}>
                        {(!msg.isUser ? formatAIResponse(msg.content) : msg.content).split('\n').map((line, index) => (
                          <p key={index} className={`${index > 0 ? "mt-3" : ""} ${!msg.isUser ? "text-gray-800 dark:text-gray-200" : ""}`}>
                            {line.trim()}
                          </p>
                        ))}
                      </div>
                      <p
                        className={`text-xs mt-2 ${
                          msg.isUser
                            ? "text-white/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date(msg.timestamp))}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions - Always available even during rate limits */}
            {state.chatHistory.length <= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="px-6 pb-4"
              >
                <p className="text-sm font-medium mb-3 text-center">
                  ✨ Try one of these conversation starters:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {quickSuggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-2xl bg-gradient-to-r ${suggestion.color} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                      onClick={() =>
                        sendMessage(suggestion.text)
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">
                          {suggestion.emoji}
                        </span>
                        <span className="text-sm font-medium">
                          {suggestion.text}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input Area */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 border-t border-gray-200 dark:border-slate-600">
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share what's on your mind... 💭"
                    onKeyPress={(e) =>
                      e.key === "Enter" && sendMessage()
                    }
                    disabled={isTyping || (rateLimitUntil && Date.now() < rateLimitUntil)}
                    className="h-12 rounded-2xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-lg text-base px-4"
                  />
                  {rateLimitUntil && Date.now() < rateLimitUntil && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-8 left-0 right-0 text-center"
                    >
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-sm">
                        <span>⏳ Rate limited</span>
                        <span className="font-medium">
                          {Math.ceil((rateLimitUntil - Date.now()) / 1000)}s
                        </span>
                      </div>
                    </motion.div>
                  )}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="absolute right-3 top-3 text-purple-400"
                  >
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                </div>
                <motion.div
                  whileHover={{ scale: rateLimitUntil && Date.now() < rateLimitUntil ? 1 : 1.05 }}
                  whileTap={{ scale: rateLimitUntil && Date.now() < rateLimitUntil ? 1 : 0.95 }}
                >
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!message.trim() || isTyping || (rateLimitUntil && Date.now() < rateLimitUntil)}
                    className={`h-12 w-12 rounded-2xl shadow-lg ${
                      rateLimitUntil && Date.now() < rateLimitUntil
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    }`}
                  >
                    {rateLimitUntil && Date.now() < rateLimitUntil ? (
                      <span className="text-white text-xs">⏳</span>
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Inline MoodTracker Component
function MoodTracker() {
  const { state, dispatch } = useAppContext();
  const [selectedMood, setSelectedMood] = useState<
    number | null
  >(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moodOptions = [
    {
      value: 1,
      emoji: "😢",
      label: "Very Sad",
      gradient: "from-red-400 via-red-500 to-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
    },
    {
      value: 2,
      emoji: "😕",
      label: "Sad",
      gradient: "from-orange-400 via-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
    {
      value: 3,
      emoji: "😐",
      label: "Neutral",
      gradient: "from-yellow-400 via-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    {
      value: 4,
      emoji: "🙂",
      label: "Good",
      gradient: "from-lime-400 via-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      value: 5,
      emoji: "😊",
      label: "Excellent",
      gradient: "from-emerald-400 via-green-500 to-teal-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
    },
  ];

  const handleMoodSubmit = async () => {
    if (selectedMood === null) return;

    setIsSubmitting(true);

    const newEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      note: note.trim(),
      timestamp: new Date(),
    };

    dispatch({ type: "ADD_MOOD_ENTRY", payload: newEntry });

    setTimeout(() => {
      setSelectedMood(null);
      setNote("");
      setIsSubmitting(false);
    }, 800);
  };

  const todayEntries = state.moodEntries.filter((entry) => {
    const today = new Date();
    const entryDate = new Date(entry.timestamp);
    return entryDate.toDateString() === today.toDateString();
  });

  const averageMood =
    state.moodEntries.length > 0
      ? state.moodEntries.reduce(
          (sum, entry) => sum + entry.mood,
          0,
        ) / state.moodEntries.length
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="p-6 space-y-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 py-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-12 h-12 text-pink-500" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Mood Tracker
            </h1>
            <Rainbow className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your emotions matter. Let's track how you're feeling
            today 💙
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-3 text-2xl">
                    <Smile className="w-7 h-7 text-yellow-500" />
                    <span>How are you feeling right now?</span>
                    <Sparkles className="w-6 h-6 text-purple-500" />
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Choose the emoji that best represents your
                    current mood
                  </p>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-5 gap-4">
                    {moodOptions.map((mood, index) => (
                      <motion.div
                        key={mood.value}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.1,
                        }}
                        whileHover={{ y: -5, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant={
                            selectedMood === mood.value
                              ? "default"
                              : "outline"
                          }
                          className={`h-32 w-full flex flex-col space-y-3 relative overflow-hidden transition-all duration-300 ${
                            selectedMood === mood.value
                              ? `bg-gradient-to-br ${mood.gradient} text-white border-0 shadow-2xl ${mood.borderColor}`
                              : `hover:shadow-xl ${mood.bgColor} ${mood.borderColor} border-2`
                          }`}
                          onClick={() =>
                            setSelectedMood(mood.value)
                          }
                        >
                          <span className="text-4xl">
                            {mood.emoji}
                          </span>
                          <div className="text-center">
                            <span className="font-bold text-sm">
                              {mood.label}
                            </span>
                          </div>
                          {selectedMood === mood.value && (
                            <motion.div
                              className="absolute inset-0 bg-white/20"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  {selectedMood && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border border-purple-200 dark:border-purple-800"
                    >
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className="text-3xl">
                          {
                            moodOptions.find(
                              (m) => m.value === selectedMood,
                            )?.emoji
                          }
                        </span>
                        <span className="text-xl font-bold">
                          {
                            moodOptions.find(
                              (m) => m.value === selectedMood,
                            )?.label
                          }
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        You're feeling{" "}
                        {moodOptions
                          .find((m) => m.value === selectedMood)
                          ?.label.toLowerCase()}{" "}
                        today ({selectedMood}/5)
                      </p>
                    </motion.div>
                  )}

                  <div className="space-y-3">
                    <label className="font-medium flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      <span>Tell us more (optional)</span>
                    </label>
                    <Textarea
                      placeholder="What's contributing to how you feel? Share your thoughts... 💭"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={4}
                      className="rounded-2xl border-2 resize-none"
                    />
                  </div>

                  <div className="w-full h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                    <Button
                      onClick={handleMoodSubmit}
                      disabled={
                        selectedMood === null || isSubmitting
                      }
                      className="w-full h-full bg-transparent hover:bg-transparent text-white font-semibold"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-5 h-5" />
                          <span>Recording your mood...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <Plus className="w-5 h-5" />
                          <span>Record My Mood</span>
                          <Heart className="w-5 h-5" />
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-amber-500" />
                    <span>Today's Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                    <span className="font-medium">
                      Entries logged
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {todayEntries.length}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                    <span className="font-medium">
                      Average mood
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">
                        {averageMood > 0
                          ? averageMood.toFixed(1)
                          : "--"}
                        /5
                      </span>
                      {averageMood > 0 && (
                        <span className="text-xl">
                          {
                            moodOptions.find(
                              (m) =>
                                Math.round(averageMood) ===
                                m.value,
                            )?.emoji
                          }
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
                    <span className="font-medium">
                      Total entries
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      {state.moodEntries.length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            
          </div>
        </div>

        {/* Recent Entries */}
        {state.moodEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span>Recent Entries</span>
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {state.moodEntries
                    .slice(-5)
                    .reverse()
                    .map((entry, index) => {
                      const moodOption = moodOptions.find(
                        (m) => m.value === entry.mood,
                      );
                      return (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-start space-x-4 p-4 rounded-2xl ${moodOption?.bgColor} ${moodOption?.borderColor} border-2`}
                        >
                          <div className="text-3xl">
                            {moodOption?.emoji}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-lg">
                                {moodOption?.label}
                              </span>
                              <span className="text-sm text-muted-foreground font-medium">
                                {new Date(
                                  entry.timestamp,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {entry.note && (
                              <p className="mt-2 text-sm font-medium bg-white/50 dark:bg-slate-700/50 p-2 rounded-lg">
                                "{entry.note}"
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          
        )}

        {/* Empty State */}
        {state.moodEntries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardContent className="text-center py-16">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="mb-6"
                >
                  <Heart className="w-20 h-20 mx-auto text-pink-400" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Start your mood journey
                </h3>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                  Regular mood tracking helps you understand
                  patterns in your emotional wellbeing. Every
                  feeling is valid! ✨
                </p>
              </CardContent>
            </Card>
          
        )}
      </div>
    </div>
  );
}

function AppContent() {
  const { state, dispatch } = useAppContext();

  // Debug environment variables
  useEffect(() => {
    const apiKey = (import.meta as any).env.VITE_OPENROUTER_API_KEY;
    console.log('=== App Environment Debug ===');
    console.log('API Key exists:', !!apiKey);
    if (apiKey) {
      console.log('API Key (masked):', `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}`);
    }
  }, []);

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
        return <Settings />;
      case "insights":
        return <InsightsDashboard />;
      case "meditation":
        return <GuidedMeditation />;
      case "crisis":
        return <CrisisSupport />;
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
