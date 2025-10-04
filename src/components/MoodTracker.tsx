import React, { useState } from "react";
import { useAppContext } from "./AppContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Heart, Plus, Smile, TrendingUp, Calendar, Sparkles } from "lucide-react";

interface MoodOption {
  value: number;
  emoji: string;
  label: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  {
    value: 1,
    emoji: "😢",
    label: "Very Sad",
    color: "from-red-400 to-red-600"
  },
  {
    value: 2,
    emoji: "😕",
    label: "Sad",
    color: "from-orange-400 to-orange-600"
  },
  {
    value: 3,
    emoji: "😐",
    label: "Neutral",
    color: "from-yellow-400 to-yellow-600"
  },
  {
    value: 4,
    emoji: "🙂",
    label: "Good",
    color: "from-lime-400 to-lime-600"
  },
  {
    value: 5,
    emoji: "😊",
    label: "Excellent",
    color: "from-green-400 to-green-600"
  },
];

export function MoodTracker() {
  const { state, dispatch } = useAppContext();
  const [selectedMood, setSelectedMood] = useState<
    number | null
  >(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center space-y-3 py-6">
        <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 px-6 py-3 rounded-full">
          <Heart className="w-6 h-6 text-pink-500 animate-pulse" />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            How Are You Feeling?
          </h1>
          <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
        </div>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
          Take a moment to check in with yourself. Your mood matters, and tracking it helps you understand your emotional journey.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Mood Selection Card */}
        <div className="xl:col-span-2">
          <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="text-center pb-2">
              <CardTitle className="flex items-center justify-center space-x-2 text-lg">
                <Smile className="w-5 h-5 text-blue-500" />
                <span>Select Your Current Mood</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Circular Mood Selector */}
              <div className="relative flex items-center justify-center py-8">
                <div className="relative w-80 h-80 md:w-96 md:h-96">
                  {/* Background Circle */}
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>

                  {/* Mood Buttons in Circle */}
                  {moodOptions.map((mood, index) => {
                    const angle = (index * 72 - 90) * (Math.PI / 180); // Start from top
                    const radius = 120; // Distance from center
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                      <button
                        key={mood.value}
                        onClick={() => setSelectedMood(mood.value)}
                        className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-full flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:scale-110 shadow-lg ${
                          selectedMood === mood.value
                            ? `bg-gradient-to-r ${mood.color} text-white ring-4 ring-white dark:ring-gray-800 scale-110`
                            : `bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-xl`
                        }`}
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(-50%, -50%) translate(${x}px, ${y}px) ${selectedMood === mood.value ? 'scale(1.1)' : ''}`,
                        }}
                      >
                        <span className="text-2xl md:text-3xl mb-1">{mood.emoji}</span>
                        <span className={`text-xs font-medium leading-tight ${selectedMood === mood.value ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                          {mood.label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}

                  {/* Center Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      {selectedMood ? (
                        <div className="space-y-2">
                          <div className="text-4xl">
                            {moodOptions.find(m => m.value === selectedMood)?.emoji}
                          </div>
                          <div className="text-sm font-medium">
                            {moodOptions.find(m => m.value === selectedMood)?.label}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <Smile className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Tap a mood above
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Note Input */}
              {selectedMood && (
                <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${moodOptions.find(m => m.value === selectedMood)?.color}`}></div>
                    <label className="text-sm font-medium">
                      What's contributing to how you feel? (Optional)
                    </label>
                  </div>
                  <Textarea
                    placeholder="Share what's on your mind..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              )}

              {/* Submit Button */}
              {selectedMood && (
                <Button
                  onClick={handleMoodSubmit}
                  disabled={isSubmitting}
                  className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                  size="lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Recording Your Mood...</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <Plus className="w-5 h-5" />
                      <span>Log This Mood</span>
                    </span>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          {/* Today's Stats */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Today's Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                <span className="text-sm font-medium">Entries Today</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {todayEntries.length}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                <span className="text-sm font-medium">Average Mood</span>
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-bold">
                    {averageMood > 0 ? averageMood.toFixed(1) : "--"}
                  </span>
                  <span className="text-xs text-muted-foreground">/5</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                <span className="text-sm font-medium">Total Entries</span>
                <Badge variant="secondary">
                  {state.moodEntries.length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span>Your Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {state.moodEntries.length > 0 ? "🎯" : "🌱"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {state.moodEntries.length > 0
                    ? `${state.moodEntries.length} mood${state.moodEntries.length === 1 ? '' : 's'} tracked`
                    : "Start your journey"
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Entries */}
      {state.moodEntries.length > 0 && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-pink-500" />
              <span>Recent Mood Journal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {state.moodEntries
                .slice(-6)
                .reverse()
                .map((entry) => {
                  const moodOption = moodOptions.find(
                    (m) => m.value === entry.mood,
                  );
                  return (
                    <div
                      key={entry.id}
                      className="p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl flex-shrink-0">
                          {moodOption?.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">
                              {moodOption?.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          {entry.note && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {entry.note}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {state.moodEntries.length === 0 && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center">
              <Heart className="w-10 h-10 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              Begin Your Mood Journey
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Regular mood tracking creates awareness and helps you understand patterns in your emotional wellbeing over time.
            </p>
            <div className="text-sm text-muted-foreground">
              Select a mood above to record your first entry! 🌟
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
