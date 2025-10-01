import React, { useState, useEffect, useRef } from "react";
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
import { Slider } from "./ui/slider";
import { useAppContext } from "./AppContext";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Headphones,
  Leaf,
  Mountain,
  Waves,
  Wind,
  Heart,
  Brain,
} from "lucide-react";
// Simplified without animations for stability

interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  type:
    | "breathing"
    | "body-scan"
    | "mindfulness"
    | "loving-kindness"
    | "focus";
  icon: React.ComponentType<any>;
  color: string;
  instructions: string[];
  backgroundSound?: string;
}

const meditationSessions: MeditationSession[] = [
  {
    id: "breathing-basic",
    title: "Basic Breathing",
    description: "Simple breath awareness for beginners",
    duration: 5,
    type: "breathing",
    icon: Wind,
    color: "from-blue-400 to-cyan-500",
    instructions: [
      "Find a comfortable seated position",
      "Close your eyes or soften your gaze",
      "Notice your natural breath",
      "When your mind wanders, gently return to your breath",
      "Continue breathing naturally",
    ],
    backgroundSound: "gentle-breeze",
  },
  {
    id: "body-scan",
    title: "Body Scan Relaxation",
    description:
      "Progressive relaxation through body awareness",
    duration: 10,
    type: "body-scan",
    icon: Heart,
    color: "from-green-400 to-emerald-500",
    instructions: [
      "Lie down comfortably",
      "Start with your toes, notice any sensations",
      "Slowly move your attention up through your body",
      "Don't try to change anything, just observe",
      "End with your head and full body awareness",
    ],
    backgroundSound: "nature-sounds",
  },
  {
    id: "mindfulness",
    title: "Mindful Awareness",
    description: "Present moment awareness meditation",
    duration: 8,
    type: "mindfulness",
    icon: Leaf,
    color: "from-green-500 to-lime-500",
    instructions: [
      "Sit with your back straight but relaxed",
      "Become aware of your surroundings",
      "Notice thoughts without judgment",
      "Return to present moment awareness",
      "Rest in this open awareness",
    ],
    backgroundSound: "forest-ambience",
  },
  {
    id: "loving-kindness",
    title: "Loving Kindness",
    description: "Cultivate compassion for yourself and others",
    duration: 12,
    type: "loving-kindness",
    icon: Heart,
    color: "from-pink-400 to-rose-500",
    instructions: [
      "Begin by directing kindness to yourself",
      "Imagine someone you love and send them good wishes",
      "Think of a neutral person and extend kindness",
      "Include someone difficult in your compassion",
      "Expand to all beings everywhere",
    ],
    backgroundSound: "soft-piano",
  },
  {
    id: "mountain",
    title: "Mountain Meditation",
    description: "Stability and strength visualization",
    duration: 15,
    type: "focus",
    icon: Mountain,
    color: "from-gray-500 to-slate-600",
    instructions: [
      "Visualize yourself as a mountain",
      "Feel your base rooted deeply in the earth",
      "Your peak reaches toward the sky",
      "Weather passes over you but you remain stable",
      "Rest in this unshakeable presence",
    ],
    backgroundSound: "mountain-wind",
  },
  {
    id: "ocean-waves",
    title: "Ocean Breathing",
    description: "Rhythmic breathing with ocean visualization",
    duration: 7,
    type: "breathing",
    icon: Waves,
    color: "from-blue-500 to-indigo-600",
    instructions: [
      "Imagine sitting by a peaceful ocean",
      "Match your breath to the rhythm of waves",
      "Inhale as waves gather energy",
      "Exhale as waves gently reach the shore",
      "Let this rhythm calm your mind",
    ],
    backgroundSound: "ocean-waves",
  },
];

export function GuidedMeditation() {
  const { dispatch } = useAppContext();
  const [selectedSession, setSelectedSession] =
    useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentInstruction, setCurrentInstruction] =
    useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && selectedSession) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1;
          const totalSeconds = selectedSession.duration * 60;

          // Update instruction based on progress
          const progressPercent =
            (newTime / totalSeconds) * 100;
          const instructionIndex = Math.floor(
            (progressPercent / 100) *
              selectedSession.instructions.length,
          );
          setCurrentInstruction(
            Math.min(
              instructionIndex,
              selectedSession.instructions.length - 1,
            ),
          );

          if (newTime >= totalSeconds) {
            setIsPlaying(false);
            handleComplete();
            return totalSeconds;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, selectedSession]);

  const handleComplete = () => {
    if (selectedSession) {
      // Add to completed exercises
      dispatch({
        type: "COMPLETE_EXERCISE",
        payload: selectedSession.id,
      });
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentInstruction(0);
  };

  const handleSessionSelect = (session: MeditationSession) => {
    setSelectedSession(session);
    handleReset();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    if (!selectedSession) return 0;
    return (
      (currentTime / (selectedSession.duration * 60)) * 100
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "breathing":
        return Wind;
      case "body-scan":
        return Heart;
      case "mindfulness":
        return Leaf;
      case "loving-kindness":
        return Heart;
      case "focus":
        return Brain;
      default:
        return Leaf;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
          <Headphones className="w-8 h-8 text-purple-500" />
          <span>Guided Meditation</span>
        </h1>
        <p className="text-muted-foreground">
          Find peace and clarity through guided meditation
          practices
        </p>
      </div>

      {/* Active Session */}
      {selectedSession && (
        <div>
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`bg-gradient-to-r ${selectedSession.color} p-3 rounded-full`}
                  >
                    <selectedSession.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>
                      {selectedSession.title}
                    </CardTitle>
                    <CardDescription>
                      {selectedSession.description}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <Clock className="w-3 h-3" />
                  <span>{selectedSession.duration} min</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timer Display */}
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-purple-600">
                  {formatTime(
                    selectedSession.duration * 60 - currentTime,
                  )}
                </div>
                <Progress
                  value={getProgress()}
                  className="h-3"
                />
                <p className="text-muted-foreground">
                  {currentTime > 0
                    ? `${formatTime(currentTime)} elapsed`
                    : "Ready to begin"}
                </p>
              </div>

              {/* Current Instruction */}
              <Card className="bg-white/70 border-0 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="space-y-3">
                    <Badge variant="outline">
                      Step {currentInstruction + 1} of{" "}
                      {selectedSession.instructions.length}
                    </Badge>
                    <p className="text-lg font-medium text-purple-800">
                      {
                        selectedSession.instructions[
                          currentInstruction
                        ]
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleReset}
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset</span>
                </Button>

                {isPlaying ? (
                  <Button
                    size="lg"
                    onClick={handlePause}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 px-8"
                  >
                    <Pause className="w-6 h-6" />
                    <span>Pause</span>
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={handlePlay}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 px-8"
                  >
                    <Play className="w-6 h-6" />
                    <span>Start</span>
                  </Button>
                )}

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={(value) => {
                      setVolume(value[0] / 100);
                      setIsMuted(value[0] === 0);
                    }}
                    max={100}
                    step={1}
                    className="w-20"
                  />
                </div>
              </div>

              {/* Background Sound Info */}
              {selectedSession.backgroundSound && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    🎵 Background:{" "}
                    {selectedSession.backgroundSound.replace(
                      "-",
                      " ",
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Session Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Choose Your Meditation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meditationSessions.map((session) => {
            const IconComponent = session.icon;
            const isSelected =
              selectedSession?.id === session.id;

            return (
              <div key={session.id}>
                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isSelected
                      ? "border-2 border-purple-300 bg-purple-50"
                      : ""
                  }`}
                  onClick={() => handleSessionSelect(session)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className={`bg-gradient-to-r ${session.color} p-2 rounded-full`}
                        >
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs"
                        >
                          {session.duration} min
                        </Badge>
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          {session.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {session.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="capitalize">
                          {session.type.replace("-", " ")}
                        </span>
                        <span>
                          {session.instructions.length} steps
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Benefits of Regular Meditation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold">Reduced Stress</h3>
              <p className="text-sm text-muted-foreground">
                Lower cortisol levels and improved stress
                management
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold">Better Sleep</h3>
              <p className="text-sm text-muted-foreground">
                Improved sleep quality and faster sleep onset
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Leaf className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold">Enhanced Focus</h3>
              <p className="text-sm text-muted-foreground">
                Increased attention span and mental clarity
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* No Session Selected */}
      {!selectedSession && (
        <Card>
          <CardContent className="text-center py-12">
            <Headphones className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">
              Choose a meditation to begin
            </h3>
            <p className="text-muted-foreground">
              Select from our collection of guided meditations
              designed to support your mental wellbeing.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
