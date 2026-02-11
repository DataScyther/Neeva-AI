import { useState } from "react";
import { useAppContext } from "./AppContext";
import { saveMoodEntry } from "../lib/db";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import {
  Heart,
  Smile,
  Sparkles,
  Plus,
  Star,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { motion } from "framer-motion";

export function MoodTracker() {
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

    // Save to Firestore
    const userId = (state.user as any)?.uid || (state.user as any)?.id;
    if (userId) {
      saveMoodEntry(userId, newEntry);
    }

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
            <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-full">
              <Heart className="w-8 h-8 text-pink-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Mood Tracker
            </h1>
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
                          className={`h-32 w-full flex flex-col space-y-3 relative overflow-hidden transition-all duration-300 ${selectedMood === mood.value
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
            </motion.div>
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
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
