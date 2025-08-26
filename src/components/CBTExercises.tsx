import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAppContext } from './AppContext';
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
  Wind
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExerciseTimer {
  isActive: boolean;
  timeLeft: number;
  totalTime: number;
}

const exerciseCategories = {
  meditation: {
    title: 'Meditation & Mindfulness',
    icon: Brain,
    color: 'from-purple-500 to-indigo-600',
    exercises: [
      {
        id: 'meditation-1',
        title: 'Mindful Breathing',
        description: 'Focus on your breath to center yourself and reduce anxiety.',
        duration: 5,
        instructions: [
          'Find a comfortable seated position',
          'Close your eyes or soften your gaze',
          'Notice your natural breath without changing it',
          'When your mind wanders, gently return to your breath',
          'Continue for the full duration'
        ]
      },
      {
        id: 'meditation-2',
        title: 'Body Scan Meditation',
        description: 'Systematically relax each part of your body to release tension.',
        duration: 10,
        instructions: [
          'Lie down comfortably on your back',
          'Close your eyes and take three deep breaths',
          'Start with your toes - notice any sensations',
          'Slowly move your attention up through your body',
          'Notice each body part without judgment'
        ]
      }
    ]
  },
  breathing: {
    title: 'Breathing Techniques',
    icon: Wind,
    color: 'from-cyan-500 to-blue-600',
    exercises: [
      {
        id: 'breathing-1',
        title: '4-7-8 Breathing',
        description: 'A powerful technique to reduce anxiety and promote relaxation.',
        duration: 8,
        instructions: [
          'Inhale through your nose for 4 counts',
          'Hold your breath for 7 counts',
          'Exhale through your mouth for 8 counts',
          'Repeat this cycle 4 times',
          'Focus on the counting to stay present'
        ]
      },
      {
        id: 'breathing-2',
        title: 'Box Breathing',
        description: 'Equal-count breathing to calm your nervous system.',
        duration: 6,
        instructions: [
          'Inhale for 4 counts',
          'Hold for 4 counts',
          'Exhale for 4 counts',
          'Hold empty for 4 counts',
          'Repeat this square pattern'
        ]
      }
    ]
  },
  journaling: {
    title: 'Journaling & Reflection',
    icon: BookOpen,
    color: 'from-green-500 to-emerald-600',
    exercises: [
      {
        id: 'journaling-1',
        title: 'Gratitude Journal',
        description: 'Write down things you\'re grateful for to shift perspective.',
        duration: 10,
        instructions: [
          'Write down 3 things you\'re grateful for today',
          'For each item, write why you\'re grateful',
          'Include both big and small things',
          'Focus on specific details',
          'Read them aloud to yourself'
        ]
      },
      {
        id: 'journaling-2',
        title: 'Thought Challenge',
        description: 'Examine and reframe negative thoughts using CBT techniques.',
        duration: 15,
        instructions: [
          'Identify a negative thought you\'ve had recently',
          'Write down evidence for and against this thought',
          'Ask: "Is this thought helpful or harmful?"',
          'Create a more balanced, realistic thought',
          'Practice this new thought'
        ]
      }
    ]
  },
  selfcare: {
    title: 'Self-Care Activities',
    icon: Heart,
    color: 'from-pink-500 to-rose-600',
    exercises: [
      {
        id: 'selfcare-1',
        title: 'Self-Compassion Break',
        description: 'Practice being kind to yourself during difficult moments.',
        duration: 7,
        instructions: [
          'Place your hand on your heart',
          'Acknowledge: "This is a moment of suffering"',
          'Remember: "Suffering is part of human experience"',
          'Say: "May I be kind to myself"',
          'Feel the warmth and support you\'re giving yourself'
        ]
      },
      {
        id: 'selfcare-2',
        title: 'Progressive Muscle Relaxation',
        description: 'Systematically tense and relax muscle groups to release stress.',
        duration: 12,
        instructions: [
          'Start with your feet - tense for 5 seconds, then relax',
          'Move to your calves, then thighs',
          'Continue up through your torso, arms, and face',
          'Notice the contrast between tension and relaxation',
          'End by relaxing your whole body'
        ]
      }
    ]
  }
};

export function CBTExercises() {
  const { state, dispatch } = useAppContext();
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [timer, setTimer] = useState<ExerciseTimer>({
    isActive: false,
    timeLeft: 0,
    totalTime: 0
  });
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timer.isActive && timer.timeLeft > 0) {
      interval = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (timer.timeLeft === 0 && timer.isActive) {
      // Exercise completed
      setTimer(prev => ({ ...prev, isActive: false }));
      if (activeExercise) {
        dispatch({ type: 'COMPLETE_EXERCISE', payload: activeExercise });
      }
    }

    return () => clearInterval(interval);
  }, [timer.isActive, timer.timeLeft, activeExercise, dispatch]);

  const startExercise = (exerciseId: string, duration: number) => {
    setActiveExercise(exerciseId);
    setTimer({
      isActive: true,
      timeLeft: duration * 60,
      totalTime: duration * 60
    });
    setCurrentStep(0);
  };

  const pauseExercise = () => {
    setTimer(prev => ({ ...prev, isActive: false }));
  };

  const resumeExercise = () => {
    setTimer(prev => ({ ...prev, isActive: true }));
  };

  const resetExercise = () => {
    setTimer({
      isActive: false,
      timeLeft: 0,
      totalTime: 0
    });
    setActiveExercise(null);
    setCurrentStep(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (timer.totalTime === 0) return 0;
    return ((timer.totalTime - timer.timeLeft) / timer.totalTime) * 100;
  };

  const getExerciseById = (id: string) => {
    for (const category of Object.values(exerciseCategories)) {
      const exercise = category.exercises.find(ex => ex.id === id);
      if (exercise) return { exercise, category };
    }
    return null;
  };

  const getCompletedCount = (categoryKey: string) => {
    return exerciseCategories[categoryKey as keyof typeof exerciseCategories].exercises.filter(ex => 
      state.exercises.some(stateEx => stateEx.id === ex.id && stateEx.completed)
    ).length;
  };

  const getTotalStreak = () => {
    return state.exercises.reduce((sum, ex) => sum + ex.streak, 0);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
          <Brain className="w-8 h-8 text-purple-500" />
          <span>CBT Exercises</span>
        </h1>
        <p className="text-muted-foreground">
          Evidence-based exercises to improve your mental wellbeing
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-500 p-2 rounded-full">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Streak</p>
                <p className="text-2xl font-bold">{getTotalStreak()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {Object.entries(exerciseCategories).slice(0, 3).map(([key, category]) => {
          const IconComponent = category.icon;
          const completed = getCompletedCount(key);
          const total = category.exercises.length;
          
          return (
            <Card key={key} className="border-2 border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`bg-gradient-to-r ${category.color} p-2 rounded-full`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{category.title}</p>
                    <p className="text-2xl font-bold">{completed}/{total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Exercise */}
      <AnimatePresence>
        {activeExercise && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span>{getExerciseById(activeExercise)?.exercise.title}</span>
                  </CardTitle>
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(timer.timeLeft)}</span>
                  </Badge>
                </div>
                <Progress value={getProgress()} className="h-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-2">
                    {formatTime(timer.timeLeft)}
                  </div>
                  <p className="text-muted-foreground">
                    Step {currentStep + 1} of {getExerciseById(activeExercise)?.exercise.instructions.length}
                  </p>
                </div>

                <Card className="bg-white/70">
                  <CardContent className="p-4">
                    <p className="text-center font-medium">
                      {getExerciseById(activeExercise)?.exercise.instructions[currentStep]}
                    </p>
                  </CardContent>
                </Card>

                <div className="flex justify-center space-x-3">
                  {timer.isActive ? (
                    <Button onClick={pauseExercise} variant="outline">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={resumeExercise}>
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  <Button onClick={resetExercise} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  {currentStep < (getExerciseById(activeExercise)?.exercise.instructions.length || 1) - 1 && (
                    <Button 
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      variant="outline"
                    >
                      Next Step
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
        <TabsList className="grid w-full grid-cols-4">
          {Object.entries(exerciseCategories).map(([key, category]) => {
            const IconComponent = category.icon;
            return (
              <TabsTrigger key={key} value={key} className="flex items-center space-x-2">
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{category.title.split(' ')[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(exerciseCategories).map(([categoryKey, category]) => (
          <TabsContent key={categoryKey} value={categoryKey}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.exercises.map((exercise) => {
                const isCompleted = state.exercises.some(ex => ex.id === exercise.id && ex.completed);
                const streak = state.exercises.find(ex => ex.id === exercise.id)?.streak || 0;
                const IconComponent = category.icon;

                return (
                  <Card 
                    key={exercise.id} 
                    className={`hover:shadow-lg transition-shadow ${
                      isCompleted ? 'border-green-200 bg-green-50/50' : ''
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="flex items-center space-x-2">
                            <div className={`bg-gradient-to-r ${category.color} p-2 rounded-full`}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <span>{exercise.title}</span>
                          </CardTitle>
                          <CardDescription>{exercise.description}</CardDescription>
                        </div>
                        {isCompleted && (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            {streak > 0 && (
                              <Badge variant="secondary" className="flex items-center space-x-1">
                                <Star className="w-3 h-3" />
                                <span>{streak}</span>
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{exercise.duration} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="w-4 h-4" />
                          <span>{exercise.instructions.length} steps</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Instructions:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {exercise.instructions.slice(0, 2).map((instruction, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{instruction}</span>
                            </li>
                          ))}
                          {exercise.instructions.length > 2 && (
                            <li className="text-xs">
                              +{exercise.instructions.length - 2} more steps...
                            </li>
                          )}
                        </ul>
                      </div>

                      <Button
                        onClick={() => startExercise(exercise.id, exercise.duration)}
                        disabled={activeExercise !== null}
                        className={`w-full bg-gradient-to-r ${category.color} hover:opacity-90`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Exercise
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Achievements */}
      {getTotalStreak() > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Your Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getTotalStreak() >= 1 && (
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 border-2 border-yellow-200">
                  <div className="bg-yellow-500 p-2 rounded-full">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">First Steps</p>
                    <p className="text-sm text-muted-foreground">Completed your first exercise!</p>
                  </div>
                </div>
              )}
              {getTotalStreak() >= 5 && (
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 border-2 border-blue-200">
                  <div className="bg-blue-500 p-2 rounded-full">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Building Momentum</p>
                    <p className="text-sm text-muted-foreground">5+ exercise completions!</p>
                  </div>
                </div>
              )}
              {getTotalStreak() >= 10 && (
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 border-2 border-purple-200">
                  <div className="bg-purple-500 p-2 rounded-full">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Wellness Warrior</p>
                    <p className="text-sm text-muted-foreground">10+ exercise completions!</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}