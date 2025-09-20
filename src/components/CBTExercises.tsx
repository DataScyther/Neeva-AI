import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import { useAppContext } from "./AppContext";
import { useAudioManager, audioProfiles } from "./AudioManager";
import {
  Brain,
  Heart,
  BookOpen,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Star,
  Award,
  Zap,
  Wind,
  Headphones,
  PenTool,
  Gamepad2,
  Timer,
  Target,
  Sparkles,
  Rainbow,
  Focus,
  MemoryStick,
  Shuffle,
  Save,
  Volume2,
  VolumeX,
  ChevronRight,
  Music,
  Waves,
  Volume1,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ExerciseTimer {
  isActive: boolean;
  timeLeft: number;
  totalTime: number;
}

interface JournalEntry {
  prompt: string;
  response: string;
}

interface GameState {
  score: number;
  round: number;
  isActive: boolean;
  sequence?: number[];
  userSequence?: number[];
  currentColor?: string;
  colors?: string[];
  timeLeft?: number;
}

const exerciseCategories = {
  meditation: {
    title: "Guided Meditation",
    icon: Headphones,
    gradient: "from-purple-500 via-indigo-500 to-blue-500",
    bgGradient: "from-purple-50 via-indigo-50 to-blue-50",
    darkBgGradient:
      "dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-blue-900/20",
    exercises: [
      {
        id: "meditation-1",
        title: "Mindful Breathing Journey",
        description:
          "A guided breathing meditation with soothing audio cues and visual prompts.",
        duration: 5,
        type: "guided",
        audioGuided: true,
        instructions: [
          "Find a comfortable seated position with your back straight",
          "Close your eyes or soften your gaze downward",
          "Begin to notice your natural breath without changing it",
          "Feel the air entering through your nose, filling your lungs",
          "Notice the gentle pause between inhale and exhale",
          "When your mind wanders, gently guide it back to your breath",
          "Let each breath anchor you to this present moment",
        ],
      },
      {
        id: "meditation-2",
        title: "Body Scan & Release",
        description:
          "Progressive body awareness meditation to release tension and stress.",
        duration: 10,
        type: "guided",
        audioGuided: true,
        instructions: [
          "Lie down comfortably on your back, arms at your sides",
          "Close your eyes and take three deep, cleansing breaths",
          "Begin at the crown of your head, noticing any sensations",
          "Slowly move your attention down to your forehead, eyes, and jaw",
          "Continue down through your neck, shoulders, and arms",
          "Notice your chest rising and falling with each breath",
          "Move through your torso, hips, and down through your legs",
          "End at your toes, feeling completely relaxed and present",
        ],
      },
      {
        id: "meditation-3",
        title: "Loving-Kindness Meditation",
        description:
          "Cultivate compassion for yourself and others through guided loving-kindness practice.",
        duration: 8,
        type: "guided",
        audioGuided: true,
        instructions: [
          "Sit comfortably and place your hand on your heart",
          "Begin by sending love and kindness to yourself",
          'Repeat: "May I be happy, may I be healthy, may I be at peace"',
          "Visualize someone you love dearly",
          "Send them the same loving wishes",
          "Extend this love to a neutral person",
          "Finally, include someone you find challenging",
          "End by sending love to all beings everywhere",
        ],
      },
    ],
  },
  journaling: {
    title: "Reflective Journaling",
    icon: PenTool,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    bgGradient: "from-green-50 via-emerald-50 to-teal-50",
    darkBgGradient:
      "dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20",
    exercises: [
      {
        id: "journal-1",
        title: "Gratitude & Growth Journal",
        description:
          "Reflect on daily blessings and personal growth with guided prompts.",
        duration: 10,
        type: "journal",
        prompts: [
          "What are three things you're genuinely grateful for today?",
          "Describe a moment today when you felt proud of yourself.",
          "What challenge did you overcome recently, and how did you grow?",
          "Who in your life brings you joy, and why?",
          "What's one thing you learned about yourself this week?",
        ],
      },
      {
        id: "journal-2",
        title: "Thought Restructuring Workbook",
        description:
          "Challenge negative thought patterns using CBT techniques.",
        duration: 15,
        type: "journal",
        prompts: [
          "What negative thought has been bothering you lately?",
          "What evidence supports this thought? What evidence contradicts it?",
          "How does this thought make you feel emotionally and physically?",
          "What would you tell a friend having this same thought?",
          "Can you reframe this thought in a more balanced, realistic way?",
        ],
      },
      {
        id: "journal-3",
        title: "Future Self Visioning",
        description:
          "Connect with your goals and aspirations through reflective writing.",
        duration: 12,
        type: "journal",
        prompts: [
          "Describe your ideal day one year from now.",
          "What values are most important to your future self?",
          "What small step can you take today toward your goals?",
          "How do you want to grow emotionally and mentally?",
          "What legacy do you want to leave behind?",
        ],
      },
    ],
  },
  adhd_games: {
    title: "ADHD Focus Games",
    icon: Gamepad2,
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    bgGradient: "from-orange-50 via-amber-50 to-yellow-50",
    darkBgGradient:
      "dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20",
    exercises: [
      {
        id: "adhd-game-1",
        title: "Color Focus Challenge",
        description:
          "Improve sustained attention and cognitive flexibility with color-based tasks.",
        duration: 5,
        type: "adhd_game",
        gameType: "color_focus",
        instructions: [
          "Watch the center circle carefully",
          "Click when the circle matches the target color",
          "Ignore distracting colors around the edges",
          "Maintain focus for the entire duration",
          "Try to achieve the highest accuracy score",
        ],
      },
      {
        id: "adhd-game-2",
        title: "Memory Sequence Builder",
        description:
          "Strengthen working memory and sequential processing skills.",
        duration: 8,
        type: "adhd_game",
        gameType: "memory_sequence",
        instructions: [
          "Watch the sequence of colored buttons light up",
          "Click the buttons in the exact same order",
          "The sequence gets longer with each round",
          "Focus your attention and avoid distractions",
          "Challenge your working memory capacity",
        ],
      },
    ],
  },
  breathing: {
    title: "Breathing Techniques",
    icon: Wind,
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    bgGradient: "from-cyan-50 via-blue-50 to-indigo-50",
    darkBgGradient:
      "dark:from-cyan-900/20 dark:via-blue-900/20 dark:to-indigo-900/20",
    exercises: [
      {
        id: "breathing-1",
        title: "4-7-8 Calming Breath",
        description:
          "Powerful technique to reduce anxiety and activate the relaxation response.",
        duration: 8,
        type: "breathing",
        pattern: { inhale: 4, hold: 7, exhale: 8 },
        instructions: [
          "Sit or lie down in a comfortable position",
          "Place the tip of your tongue behind your upper teeth",
          "Exhale completely through your mouth",
          "Inhale through your nose for 4 counts",
          "Hold your breath for 7 counts",
          "Exhale through your mouth for 8 counts",
          "This completes one cycle - repeat 4 times",
        ],
      },
      {
        id: "breathing-2",
        title: "Box Breathing Balance",
        description:
          "Equal-count breathing to calm your nervous system and improve focus.",
        duration: 6,
        type: "breathing",
        pattern: { inhale: 4, hold: 4, exhale: 4, pause: 4 },
        instructions: [
          "Sit upright with your feet flat on the floor",
          "Inhale slowly through your nose for 4 counts",
          "Hold your breath for 4 counts",
          "Exhale slowly through your mouth for 4 counts",
          "Hold empty for 4 counts",
          "Repeat this square pattern rhythmically",
        ],
      },
    ],
  },
};

export function CBTExercises() {
  const { state, dispatch } = useAppContext();
  const {
    isPlaying: audioIsPlaying,
    currentProfile,
    volume,
    isEnabled: audioEnabled,
    playProfile,
    stopAudio,
    setVolume,
    toggleAudio,
    availableProfiles,
  } = useAudioManager();

  const [activeExercise, setActiveExercise] = useState<
    string | null
  >(null);
  const [timer, setTimer] = useState<ExerciseTimer>({
    isActive: false,
    timeLeft: 0,
    totalTime: 0,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [journalEntries, setJournalEntries] = useState<
    JournalEntry[]
  >([]);
  const [currentJournalResponse, setCurrentJournalResponse] =
    useState("");
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    round: 0,
    isActive: false,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isActive && timer.timeLeft > 0) {
      interval = setInterval(() => {
        setTimer((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (timer.timeLeft === 0 && timer.isActive) {
      setTimer((prev) => ({ ...prev, isActive: false }));
      if (activeExercise) {
        dispatch({
          type: "COMPLETE_EXERCISE",
          payload: activeExercise,
        });
        // Stop audio when exercise completes
        stopAudio();
      }
    }

    return () => clearInterval(interval);
  }, [
    timer.isActive,
    timer.timeLeft,
    activeExercise,
    dispatch,
    stopAudio,
  ]);

  // Audio profile mapping for exercise types
  const getAudioProfileForExercise = (exerciseType: string) => {
    switch (exerciseType) {
      case "guided":
        return "meditation";
      case "breathing":
        return "breathing";
      case "journal":
        return "journaling";
      case "adhd_game":
        return "adhd_focus";
      default:
        return "ambient";
    }
  };

  const startExercise = async (
    exerciseId: string,
    duration: number,
  ) => {
    setActiveExercise(exerciseId);
    setTimer({
      isActive: true,
      timeLeft: duration * 60,
      totalTime: duration * 60,
    });
    setCurrentStep(0);
    setJournalEntries([]);
    setCurrentJournalResponse("");

    const exercise = getExerciseById(exerciseId);
    if (exercise?.exercise.type === "adhd_game") {
      initializeGame(exercise.exercise.gameType);
    }

    // Start appropriate audio profile
    if (audioEnabled && exercise) {
      const profileKey = getAudioProfileForExercise(
        exercise.exercise.type,
      );
      await playProfile(profileKey);
    }
  };

  const initializeGame = (gameType: string) => {
    if (gameType === "memory_sequence") {
      setGameState({
        score: 0,
        round: 1,
        isActive: true,
        sequence: [Math.floor(Math.random() * 4)],
        userSequence: [],
      });
    } else if (gameType === "color_focus") {
      const colors = [
        "red",
        "blue",
        "green",
        "yellow",
        "purple",
      ];
      setGameState({
        score: 0,
        round: 1,
        isActive: true,
        currentColor:
          colors[Math.floor(Math.random() * colors.length)],
        colors: colors,
        timeLeft: 30,
      });
    }
  };

  const pauseExercise = () => {
    setTimer((prev) => ({ ...prev, isActive: false }));
  };

  const resumeExercise = () => {
    setTimer((prev) => ({ ...prev, isActive: true }));
  };

  const resetExercise = () => {
    setTimer({
      isActive: false,
      timeLeft: 0,
      totalTime: 0,
    });
    setActiveExercise(null);
    setCurrentStep(0);
    setJournalEntries([]);
    setCurrentJournalResponse("");
    setGameState({ score: 0, round: 0, isActive: false });
    // Stop audio when resetting
    stopAudio();
  };

  const saveJournalEntry = () => {
    const exercise = getExerciseById(activeExercise);
    if (
      exercise?.exercise.prompts &&
      currentStep < exercise.exercise.prompts.length
    ) {
      const newEntry: JournalEntry = {
        prompt: exercise.exercise.prompts[currentStep],
        response: currentJournalResponse,
      };
      setJournalEntries((prev) => [...prev, newEntry]);
      setCurrentJournalResponse("");

      if (currentStep < exercise.exercise.prompts.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    if (timer.totalTime === 0) return 0;
    return (
      ((timer.totalTime - timer.timeLeft) / timer.totalTime) *
      100
    );
  };

  const getExerciseById = (id: string) => {
    for (const category of Object.values(exerciseCategories)) {
      const exercise = category.exercises.find(
        (ex) => ex.id === id,
      );
      if (exercise) return { exercise, category };
    }
    return null;
  };

  const getCompletedCount = (categoryKey: string) => {
    return exerciseCategories[
      categoryKey as keyof typeof exerciseCategories
    ].exercises.filter((ex) =>
      state.exercises.some(
        (stateEx) => stateEx.id === ex.id && stateEx.completed,
      ),
    ).length;
  };

  const getTotalStreak = () => {
    return state.exercises.reduce(
      (sum, ex) => sum + ex.streak,
      0,
    );
  };

  // ADHD Game Components
  const ColorFocusGame = () => {
    const colors = gameState.colors || [];
    const targetColor = gameState.currentColor;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">
            Click when the center matches: {targetColor}
          </h3>
          <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
            {Array.from({ length: 9 }, (_, i) => {
              const isCenter = i === 4;
              const color = isCenter
                ? targetColor
                : colors[
                    Math.floor(Math.random() * colors.length)
                  ];

              return (
                <motion.button
                  key={i}
                  className={`w-16 h-16 rounded-full border-4 ${
                    color === "red"
                      ? "bg-red-500"
                      : color === "blue"
                        ? "bg-blue-500"
                        : color === "green"
                          ? "bg-green-500"
                          : color === "yellow"
                            ? "bg-yellow-500"
                            : "bg-purple-500"
                  } ${isCenter ? "border-gray-800 ring-4 ring-yellow-300" : "border-gray-300"}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (isCenter) {
                      setGameState((prev) => ({
                        ...prev,
                        score: prev.score + 10,
                        currentColor:
                          colors[
                            Math.floor(
                              Math.random() * colors.length,
                            )
                          ],
                      }));
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">
            Score: {gameState.score}
          </p>
        </div>
      </div>
    );
  };

  const MemorySequenceGame = () => {
    const sequence = gameState.sequence || [];
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
    ];

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">
            Round {gameState.round} - Watch the sequence!
          </h3>
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {colors.map((color, index) => (
              <motion.button
                key={index}
                className={`w-20 h-20 rounded-xl ${color} border-4 border-gray-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: sequence.includes(index)
                    ? [1, 1.2, 1]
                    : 1,
                  opacity: sequence.includes(index)
                    ? [1, 0.7, 1]
                    : 1,
                }}
                transition={{
                  duration: 0.5,
                  repeat: sequence.includes(index) ? 2 : 0,
                }}
                onClick={() => {
                  const userSeq = [
                    ...(gameState.userSequence || []),
                    index,
                  ];
                  setGameState((prev) => ({
                    ...prev,
                    userSequence: userSeq,
                  }));

                  if (userSeq.length === sequence.length) {
                    const correct = userSeq.every(
                      (val, idx) => val === sequence[idx],
                    );
                    if (correct) {
                      setGameState((prev) => ({
                        ...prev,
                        score: prev.score + prev.round * 10,
                        round: prev.round + 1,
                        sequence: [
                          ...sequence,
                          Math.floor(Math.random() * 4),
                        ],
                        userSequence: [],
                      }));
                    } else {
                      setGameState((prev) => ({
                        ...prev,
                        userSequence: [],
                      }));
                    }
                  }
                }}
              />
            ))}
          </div>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">
            Score: {gameState.score}
          </p>
          <p className="text-sm text-muted-foreground">
            Sequence length: {sequence.length} | Your progress:{" "}
            {gameState.userSequence?.length || 0}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900">
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Hero Header */}
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
              <Brain className="w-12 h-12 text-emerald-500" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              CBT Wellness Studio
            </h1>
            <Rainbow className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Evidence-based exercises, guided meditations, and
            cognitive games for your mental wellness journey
            🧠✨
{" "}
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-emerald-50 dark:from-slate-800 dark:to-emerald-900 shadow-xl shadow-emerald-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
            <CardContent className="relative p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-emerald-500 shadow-lg shadow-emerald-500/25">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Total Streak
                  </p>
                  <p className="text-2xl font-bold">
                    {getTotalStreak()} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {Object.entries(exerciseCategories)
            .slice(0, 3)
            .map(([key, category]) => {
              const IconComponent = category.icon;
              const completed = getCompletedCount(key);
              const total = category.exercises.length;

              return (
                <Card
                  key={key}
                  className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 shadow-xl"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} ${category.darkBgGradient} opacity-20`}
                  />
                  <CardContent className="relative p-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-2xl bg-gradient-to-r ${category.gradient} shadow-lg`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {category.title}
                        </p>
                        <p className="text-2xl font-bold">
                          {completed}/{total}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </motion.div>

        {/* Active Exercise */}
        <AnimatePresence>
          {activeExercise && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-3">
                      <Play className="w-6 h-6" />
                      <span>
                        {
                          getExerciseById(activeExercise)
                            ?.exercise.title
                        }
                      </span>
                      {/* Audio Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={toggleAudio}
                          className="text-white hover:bg-white/20"
                        >
                          {audioEnabled ? (
                            <Volume2 className="w-4 h-4" />
                          ) : (
                            <VolumeX className="w-4 h-4" />
                          )}
                        </Button>
                        {audioEnabled && audioIsPlaying && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                            className="flex items-center space-x-1"
                          >
                            <Waves className="w-4 h-4 text-green-300" />
                            <span className="text-xs">
                              {currentProfile?.name}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </CardTitle>
                    <div className="flex items-center space-x-3">
                      {/* Volume Control */}
                      {audioEnabled && audioIsPlaying && (
                        <div className="flex items-center space-x-2 min-w-[120px]">
                          <Volume1 className="w-3 h-3" />
                          <Slider
                            value={[volume]}
                            onValueChange={(value) =>
                              setVolume(value[0])
                            }
                            max={1}
                            step={0.1}
                            className="w-16"
                          />
                        </div>
                      )}
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white flex items-center space-x-1"
                      >
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatTime(timer.timeLeft)}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <Progress
                    value={getProgress()}
                    className="h-2 bg-white/20"
                  />
                  {/* Audio Profile Info */}
                  {audioEnabled &&
                    audioIsPlaying &&
                    currentProfile && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center space-x-2 mt-2 text-white/80 text-sm"
                      >
                        <Music className="w-4 h-4" />
                        <span>
                          🎵 {currentProfile.description}
                        </span>
                      </motion.div>
                    )}
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {getExerciseById(activeExercise)?.exercise
                    .type === "journal" && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold mb-4">
                          Prompt {currentStep + 1} of{" "}
                          {
                            getExerciseById(activeExercise)
                              ?.exercise.prompts?.length
                          }
                        </h3>
                        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800">
                          <CardContent className="p-6">
                            <p className="text-lg font-medium text-center">
                              {
                                getExerciseById(activeExercise)
                                  ?.exercise.prompts?.[
                                  currentStep
                                ]
                              }
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="space-y-4">
                        <Textarea
                          placeholder="Take your time to reflect and write your thoughts here..."
                          value={currentJournalResponse}
                          onChange={(e) =>
                            setCurrentJournalResponse(
                              e.target.value,
                            )
                          }
                          rows={6}
                          className="rounded-2xl border-2 resize-none text-base"
                        />
                        <div className="flex justify-center space-x-3">
                          <Button
                            onClick={saveJournalEntry}
                            disabled={
                              !currentJournalResponse.trim()
                            }
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save & Continue
                          </Button>
                        </div>
                      </div>

                      {journalEntries.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold">
                            Your Reflections:
                          </h4>
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {journalEntries.map(
                              (entry, index) => (
                                <Card
                                  key={index}
                                  className="bg-muted/50"
                                >
                                  <CardContent className="p-4">
                                    <p className="text-sm font-medium text-muted-foreground mb-2">
                                      {entry.prompt}
                                    </p>
                                    <p className="text-sm">
                                      {entry.response}
                                    </p>
                                  </CardContent>
                                </Card>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {getExerciseById(activeExercise)?.exercise
                    .type === "adhd_game" && (
                    <div className="space-y-6">
                      {getExerciseById(activeExercise)?.exercise
                        .gameType === "color_focus" && (
                        <ColorFocusGame />
                      )}
                      {getExerciseById(activeExercise)?.exercise
                        .gameType === "memory_sequence" && (
                        <MemorySequenceGame />
                      )}
                    </div>
                  )}

                  {(getExerciseById(activeExercise)?.exercise
                    .type === "guided" ||
                    getExerciseById(activeExercise)?.exercise
                      .type === "breathing") && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                          {formatTime(timer.timeLeft)}
                        </div>
                        <p className="text-muted-foreground text-lg">
                          Step {currentStep + 1} of{" "}
                          {
                            getExerciseById(activeExercise)
                              ?.exercise.instructions.length
                          }
                        </p>
                      </div>

                      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200 dark:border-blue-800">
                        <CardContent className="p-6">
                          <p className="text-center text-lg font-medium leading-relaxed">
                            {
                              getExerciseById(activeExercise)
                                ?.exercise.instructions[
                                currentStep
                              ]
                            }
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <div className="flex justify-center space-x-4">
                    {timer.isActive ? (
                      <Button
                        onClick={pauseExercise}
                        variant="outline"
                        size="lg"
                      >
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </Button>
                    ) : (
                      <Button
                        onClick={resumeExercise}
                        size="lg"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Resume
                      </Button>
                    )}
                    <Button
                      onClick={resetExercise}
                      variant="outline"
                      size="lg"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Reset
                    </Button>
                    {getExerciseById(activeExercise)?.exercise
                      .type !== "journal" &&
                      currentStep <
                        (getExerciseById(activeExercise)
                          ?.exercise.instructions.length || 1) -
                          1 && (
                        <Button
                          onClick={() =>
                            setCurrentStep((prev) => prev + 1)
                          }
                          variant="outline"
                          size="lg"
                        >
                          Next Step
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                      )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exercise Categories */}
        <Tabs defaultValue="meditation" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-16">
            {Object.entries(exerciseCategories).map(
              ([key, category]) => {
                const IconComponent = category.icon;
                return (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="flex flex-col items-center space-y-1 p-3"
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="text-xs font-medium">
                      {category.title.split(" ")[0]}
                    </span>
                  </TabsTrigger>
                );
              },
            )}
          </TabsList>

          {Object.entries(exerciseCategories).map(
            ([categoryKey, category]) => (
              <TabsContent
                key={categoryKey}
                value={categoryKey}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {category.exercises.map((exercise, index) => {
                    const isCompleted = state.exercises.some(
                      (ex) =>
                        ex.id === exercise.id && ex.completed,
                    );
                    const streak =
                      state.exercises.find(
                        (ex) => ex.id === exercise.id,
                      )?.streak || 0;
                    const IconComponent = category.icon;

                    return (
                      <motion.div
                        key={exercise.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.1,
                        }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <Card
                          className={`border-0 overflow-hidden group transition-all duration-300 hover:shadow-2xl ${
                            isCompleted
                              ? "ring-2 ring-green-200 bg-green-50/50 dark:bg-green-900/20"
                              : "hover:shadow-xl"
                          } bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700`}
                        >
                          <CardContent className="p-0">
                            <div
                              className={`relative p-6 bg-gradient-to-r ${category.gradient} text-white overflow-hidden`}
                            >
                              <div className="absolute inset-0 bg-black/10" />
                              <div className="relative flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                                    <IconComponent className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h3 className="font-bold text-lg">
                                      {exercise.title}
                                    </h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Clock className="w-4 h-4" />
                                      <span className="text-sm">
                                        {exercise.duration} min
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {isCompleted && (
                                  <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-6 h-6" />
                                    {streak > 0 && (
                                      <Badge
                                        variant="secondary"
                                        className="bg-white/20 text-white"
                                      >
                                        <Star className="w-3 h-3 mr-1" />
                                        {streak}
                                      </Badge>
                                    )}
                                  </div>
                                )}
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
                            <div className="p-6 space-y-4">
                              <p className="text-muted-foreground leading-relaxed">
                                {exercise.description}
                              </p>

                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                {exercise.type ===
                                  "journal" && (
                                  <div className="flex items-center space-x-1">
                                    <PenTool className="w-4 h-4" />
                                    <span>
                                      {exercise.prompts?.length}{" "}
                                      prompts
                                    </span>
                                  </div>
                                )}
                                {exercise.type ===
                                  "adhd_game" && (
                                  <div className="flex items-center space-x-1">
                                    <Target className="w-4 h-4" />
                                    <span>Focus training</span>
                                  </div>
                                )}
                                {exercise.audioGuided && (
                                  <div className="flex items-center space-x-1">
                                    <Headphones className="w-4 h-4" />
                                    <span>Audio guided</span>
                                  </div>
                                )}
                              </div>

                              <Button
                                onClick={() =>
                                  startExercise(
                                    exercise.id,
                                    exercise.duration,
                                  )
                                }
                                disabled={
                                  activeExercise !== null
                                }
                                className={`w-full bg-gradient-to-r ${category.gradient} hover:opacity-90 text-white shadow-lg`}
                                size="lg"
                              >
                                <Play className="w-5 h-5 mr-2" />
                                Start{" "}
                                {exercise.type === "journal"
                                  ? "Writing"
                                  : exercise.type ===
                                      "adhd_game"
                                    ? "Game"
                                    : "Session"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </TabsContent>
            ),
          )}
        </Tabs>

        {/* Achievements */}
        {getTotalStreak() > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-amber-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-amber-500" />
                  <span>Your Achievements</span>
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getTotalStreak() >= 1 && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 border-2 border-yellow-200 dark:border-yellow-800"
                    >
                      <div className="p-3 bg-yellow-500 rounded-2xl shadow-lg">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">
                          First Steps
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Completed your first exercise!
                        </p>
                      </div>
                    </motion.div>
                  )}
                  {getTotalStreak() >= 5 && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-2 border-blue-200 dark:border-blue-800"
                    >
                      <div className="p-3 bg-blue-500 rounded-2xl shadow-lg">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">
                          Building Momentum
                        </p>
                        <p className="text-sm text-muted-foreground">
                          5+ exercise completions!
                        </p>
                      </div>
                    </motion.div>
                  )}
                  {getTotalStreak() >= 10 && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 border-2 border-purple-200 dark:border-purple-800"
                    >
                      <div className="p-3 bg-purple-500 rounded-2xl shadow-lg">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">
                          Wellness Warrior
                        </p>
                        <p className="text-sm text-muted-foreground">
                          10+ exercise completions!
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}