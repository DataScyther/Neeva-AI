import React, { useEffect, useState, useRef } from "react";
import {
  AppProvider,
  useAppContext,
} from "./components/AppContext";
import { Authentication } from "./components/Authentication";
import { Onboarding } from "./components/Onboarding";
import { Navigation } from "./components/Navigation";
import { CBTExercises } from "./components/CBTExercises";
import { CommunityGroups } from "./components/CommunityGroups";
import { Settings } from "./components/Settings";
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
  Calendar,
  Target,
  Award,
  ChevronRight,
  Send,
  Bot,
  User,
  Lightbulb,
  Sparkles,
  Plus,
  Smile,
} from "lucide-react";

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
      title: "Chat with AI Therapist",
      description: "Get personalized support",
      icon: MessageCircle,
      action: () =>
        dispatch({ type: "SET_VIEW", payload: "chatbot" }),
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Track Your Mood",
      description: "Log how you are feeling",
      icon: Heart,
      action: () =>
        dispatch({ type: "SET_VIEW", payload: "mood" }),
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "CBT Exercises",
      description: "Practice mindfulness",
      icon: BookOpen,
      action: () =>
        dispatch({ type: "SET_VIEW", payload: "exercises" }),
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Support Groups",
      description: "Connect with others",
      icon: Users,
      action: () =>
        dispatch({ type: "SET_VIEW", payload: "community" }),
      color: "from-purple-500 to-violet-500",
    },
  ];

  const getMoodEmoji = (mood: number) => {
    if (mood >= 4.5) return "😊";
    if (mood >= 3.5) return "🙂";
    if (mood >= 2.5) return "😐";
    if (mood >= 1.5) return "😕";
    return "😢";
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome back, {state.user?.name}!
        </h1>
        <p className="text-muted-foreground">
          How are you feeling today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-full">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Today's Mood
                </p>
                <p className="text-2xl font-bold flex items-center">
                  {averageMood > 0
                    ? averageMood.toFixed(1)
                    : "--"}
                  <span className="ml-2 text-lg">
                    {getMoodEmoji(averageMood)}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-full">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
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

        <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-500 p-2 rounded-full">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Streak
                </p>
                <p className="text-2xl font-bold">
                  {totalStreak}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500 p-2 rounded-full">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Days Active
                </p>
                <p className="text-2xl font-bold">7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 overflow-hidden group"
                onClick={action.action}
              >
                <CardContent className="p-0">
                  <div
                    className={`bg-gradient-to-r ${action.color} p-4 text-white`}
                  >
                    <IconComponent className="w-8 h-8 mb-2" />
                    <h3 className="font-semibold">
                      {action.title}
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                    <ChevronRight className="w-4 h-4 mt-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Today's Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Daily Exercises</span>
                <Badge variant="secondary">
                  {completedExercises.length}/
                  {state.exercises.length}
                </Badge>
              </div>
              <Progress
                value={
                  (completedExercises.length /
                    state.exercises.length) *
                  100
                }
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Mood Logs</span>
                <Badge variant="secondary">
                  {todayMoodEntries.length}
                </Badge>
              </div>
              <Progress
                value={Math.min(
                  todayMoodEntries.length * 33.33,
                  100,
                )}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Chat Sessions</span>
                <Badge variant="secondary">
                  {state.chatHistory.length > 0 ? "1" : "0"}
                </Badge>
              </div>
              <Progress
                value={state.chatHistory.length > 0 ? 100 : 0}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.moodEntries
              .slice(-3)
              .reverse()
              .map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50"
                >
                  <div className="text-2xl">
                    {getMoodEmoji(entry.mood)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Mood: {entry.mood}/5
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        entry.timestamp,
                      ).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

            {completedExercises
              .slice(-2)
              .map((exercise, index) => (
                <div
                  key={exercise.id}
                  className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50"
                >
                  <div className="bg-green-500 p-1 rounded-full">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Completed: {exercise.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Streak: {exercise.streak}
                    </p>
                  </div>
                </div>
              ))}

            {state.moodEntries.length === 0 &&
              completedExercises.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Start your wellness journey today!</p>
                  <p className="text-sm">
                    Track your mood or complete an exercise to
                    see activity here.
                  </p>
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Inline Chatbot Component
function Chatbot() {
  const { state, dispatch } = useAppContext();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickSuggestions = [
    "I'm feeling anxious today",
    "Help me with breathing exercises",
    "I can't sleep well",
  ];

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (
      lowerMessage.includes("anxious") ||
      lowerMessage.includes("anxiety")
    ) {
      return "I understand you're feeling anxious. Let's try a simple breathing exercise together. Take a deep breath in for 4 counts, hold for 7, and exhale for 8.";
    }
    if (
      lowerMessage.includes("breath") ||
      lowerMessage.includes("breathing")
    ) {
      return "Great choice! Breathing exercises are excellent for managing stress. Let's start with the 4-7-8 technique.";
    }
    if (
      lowerMessage.includes("sleep") ||
      lowerMessage.includes("tired")
    ) {
      return "Sleep troubles can really affect our wellbeing. Try creating a bedtime routine and avoiding screens before bed.";
    }

    return "I'm here to support you on your mental health journey. What's on your mind today?";
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim()) return;

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

    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(textToSend),
        isUser: false,
        timestamp: new Date(),
      };

      dispatch({
        type: "ADD_CHAT_MESSAGE",
        payload: aiResponse,
      });
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    if (state.chatHistory.length === 0) {
      const welcomeMessage = {
        id: "welcome",
        content: `Hello ${state.user?.name}! I'm your AI wellness companion. How are you feeling today?`,
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
    <div className="h-full flex flex-col max-w-4xl mx-auto p-4">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-6 h-6" />
            <span>AI Wellness Companion</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-4">
          <div className="flex-1 space-y-4 mb-4 overflow-y-auto max-h-96">
            {state.chatHistory.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${msg.isUser ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <div
                    className={`p-2 rounded-full ${msg.isUser ? "bg-blue-500" : "bg-purple-500"}`}
                  >
                    {msg.isUser ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  <div
                    className={`p-3 rounded-2xl ${
                      msg.isUser
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="p-2 rounded-full bg-purple-500">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {state.chatHistory.length <= 1 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">
                Quick suggestions:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => sendMessage(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share what's on your mind..."
              onKeyPress={(e) =>
                e.key === "Enter" && sendMessage()
              }
              disabled={isTyping}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={!message.trim() || isTyping}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
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
      color: "from-red-400 to-red-600",
    },
    {
      value: 2,
      emoji: "😕",
      label: "Sad",
      color: "from-orange-400 to-orange-600",
    },
    {
      value: 3,
      emoji: "😐",
      label: "Neutral",
      color: "from-yellow-400 to-yellow-600",
    },
    {
      value: 4,
      emoji: "🙂",
      label: "Good",
      color: "from-lime-400 to-lime-600",
    },
    {
      value: 5,
      emoji: "😊",
      label: "Excellent",
      color: "from-green-400 to-green-600",
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
    }, 500);
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
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
          <Heart className="w-8 h-8 text-pink-500" />
          <span>Mood Tracker</span>
        </h1>
        <p className="text-muted-foreground">
          Track your emotional wellbeing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smile className="w-5 h-5" />
                <span>How are you feeling right now?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-5 gap-3">
                {moodOptions.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={
                      selectedMood === mood.value
                        ? "default"
                        : "outline"
                    }
                    className={`h-20 w-full flex flex-col space-y-1 ${
                      selectedMood === mood.value
                        ? `bg-gradient-to-r ${mood.color} text-white border-0`
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedMood(mood.value)}
                  >
                    <span className="text-2xl">
                      {mood.emoji}
                    </span>
                    <span className="text-xs font-medium">
                      {mood.label}
                    </span>
                  </Button>
                ))}
              </div>

              {selectedMood && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {
                      moodOptions.find(
                        (m) => m.value === selectedMood,
                      )?.label
                    }{" "}
                    ({selectedMood}/5)
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Add a note (optional)
                </label>
                <Textarea
                  placeholder="What's contributing to how you feel?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleMoodSubmit}
                disabled={selectedMood === null || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <span>Recording...</span>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Record Mood</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Entries logged</span>
                <Badge variant="secondary">
                  {todayEntries.length}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Average mood</span>
                <span className="text-sm font-medium">
                  {averageMood > 0
                    ? averageMood.toFixed(1)
                    : "--"}
                  /5
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Total entries</span>
                <Badge variant="secondary">
                  {state.moodEntries.length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {state.moodEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {state.moodEntries
                .slice(-5)
                .reverse()
                .map((entry) => {
                  const moodOption = moodOptions.find(
                    (m) => m.value === entry.mood,
                  );
                  return (
                    <div
                      key={entry.id}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="text-2xl">
                        {moodOption?.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {moodOption?.label}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(
                              entry.timestamp,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        {entry.note && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {state.moodEntries.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">
              Start tracking your mood
            </h3>
            <p className="text-muted-foreground mb-4">
              Regular mood tracking helps you understand
              patterns in your emotional wellbeing.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AppContent() {
  const { state } = useAppContext();

  // Check if user has completed onboarding
  const hasCompletedOnboarding =
    localStorage.getItem("onboardingCompleted") === "true";

  useEffect(() => {
    // Apply theme on mount
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

  if (!state.isAuthenticated) {
    return <Authentication />;
  }

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

      {/* Main Content */}
      <main className="lg:pl-64 pb-16 lg:pb-0">
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