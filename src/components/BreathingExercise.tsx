import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowLeft,
  Wind,
  Sparkles,
  Settings,
  HelpCircle,
  Vibrate,
  Award,
  Music,
  CheckCircle2
} from "lucide-react";
import { useAppContext } from "./AppContext";
import { useAudioManager } from "./AudioManager";
import { triggerHapticFeedback, isMobileDevice } from "../utils/mobile-optimizations";
import { toast } from "sonner";

// Web Audio API Phase Chime Generator (custom low-latency synthesizer)
const playPhaseChime = (phase: string) => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    // Rhythmic sound profiles depending on state
    let freq = 440;
    if (phase === 'inhale') freq = 523.25; // C5 (uplifting)
    else if (phase === 'holdIn') freq = 659.25; // E5 (suspension)
    else if (phase === 'exhale') freq = 392.00; // G4 (release)
    else freq = 329.63; // E4 (stillness)
    
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    // Smooth attack and decay envelope
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.55);
  } catch (e) {
    console.debug("Web Audio chime failed", e);
  }
};

type Technique = '478' | 'box' | 'coherent' | 'resonant' | 'custom';

export function BreathingExercise() {
  const { dispatch } = useAppContext();
  const { isPlaying: isAmbientPlaying, playProfile, stopAudio } = useAudioManager();
  
  // Exercise configuration states
  const [technique, setTechnique] = useState<Technique>('478');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [elapsedInPhase, setElapsedInPhase] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  // Sound & tactile toggles
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [chimesEnabled, setChimesEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  
  // Custom timing configuration
  const [customInhale, setCustomInhale] = useState(4);
  const [customHoldIn, setCustomHoldIn] = useState(4);
  const [customExhale, setCustomExhale] = useState(4);
  const [customHoldOut, setCustomHoldOut] = useState(4);

  // References to preserve state in intervals
  const lastScaleRef = useRef(1.0);
  const isPlayingRef = useRef(isPlaying);
  
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Technique definitions
  const getTechniqueConfig = useCallback((tech: Technique) => {
    switch (tech) {
      case '478':
        return {
          name: "4-7-8 Relaxing Breath",
          description: "Pranayama technique acting as a natural tranquilizer for the nervous system.",
          benefit: "Induces deep calmness, alleviates acute anxiety, and prepares the mind for sleep.",
          phases: [
            { type: 'inhale', duration: 4, label: "Inhale", instruction: "Breathe in through your nose", colorClass: "from-teal-400 to-emerald-500 shadow-teal-500/40", bubbleScale: 1.0, glowColor: "rgba(20, 184, 166, 0.4)" },
            { type: 'holdIn', duration: 7, label: "Hold", instruction: "Hold your breath in", colorClass: "from-indigo-500 to-purple-600 shadow-indigo-500/40", bubbleScale: 2.1, glowColor: "rgba(99, 102, 241, 0.4)" },
            { type: 'exhale', duration: 8, label: "Exhale", instruction: "Exhale through mouth with a 'whoosh'", colorClass: "from-sky-400 to-blue-500 shadow-blue-500/40", bubbleScale: 2.1, glowColor: "rgba(56, 189, 248, 0.4)" }
          ]
        };
      case 'box':
        return {
          name: "Box Breathing",
          description: "Symmetrical breathing structure used by Navy SEALs for rapid physiological resets.",
          benefit: "Reduces panic, balances core energy, and enhances mental clarity and cognitive performance.",
          phases: [
            { type: 'inhale', duration: 4, label: "Inhale", instruction: "Inhale slowly through your nose", colorClass: "from-teal-400 to-emerald-500 shadow-teal-500/40", bubbleScale: 1.0, glowColor: "rgba(20, 184, 166, 0.4)" },
            { type: 'holdIn', duration: 4, label: "Hold", instruction: "Hold your breath in", colorClass: "from-indigo-500 to-purple-600 shadow-indigo-500/40", bubbleScale: 2.1, glowColor: "rgba(99, 102, 241, 0.4)" },
            { type: 'exhale', duration: 4, label: "Exhale", instruction: "Exhale slowly through your mouth", colorClass: "from-sky-400 to-blue-500 shadow-blue-500/40", bubbleScale: 2.1, glowColor: "rgba(56, 189, 248, 0.4)" },
            { type: 'holdOut', duration: 4, label: "Pause", instruction: "Hold your breath out empty", colorClass: "from-slate-500 to-slate-600 shadow-slate-500/40", bubbleScale: 1.0, glowColor: "rgba(100, 116, 139, 0.3)" }
          ]
        };
      case 'coherent':
        return {
          name: "Coherent Breathing",
          description: "Rhythmic pacing aiming for a perfectly balanced rate of 5-6 breath cycles per minute.",
          benefit: "Increases Heart Rate Variability (HRV), stabilizes blood pressure, and calms body systems.",
          phases: [
            { type: 'inhale', duration: 5, label: "Inhale", instruction: "Inhale smoothly through your nose", colorClass: "from-teal-400 to-emerald-500 shadow-teal-500/40", bubbleScale: 1.0, glowColor: "rgba(20, 184, 166, 0.4)" },
            { type: 'exhale', duration: 5, label: "Exhale", instruction: "Exhale gently through your nose", colorClass: "from-sky-400 to-blue-500 shadow-blue-500/40", bubbleScale: 2.1, glowColor: "rgba(56, 189, 248, 0.4)" }
          ]
        };
      case 'resonant':
        return {
          name: "Resonant Relaxer",
          description: "A 4-second inhalation followed by a prolonged 6-second exhalation.",
          benefit: "Triggers the parasympathetic nervous system to quickly down-regulate physiological stress.",
          phases: [
            { type: 'inhale', duration: 4, label: "Inhale", instruction: "Inhale deep into your abdomen", colorClass: "from-teal-400 to-emerald-500 shadow-teal-500/40", bubbleScale: 1.0, glowColor: "rgba(20, 184, 166, 0.4)" },
            { type: 'exhale', duration: 6, label: "Exhale", instruction: "Release the breath fully and slowly", colorClass: "from-sky-400 to-blue-500 shadow-blue-500/40", bubbleScale: 2.1, glowColor: "rgba(56, 189, 248, 0.4)" }
          ]
        };
      case 'custom':
      default:
        return {
          name: "Custom Pacing",
          description: "A fully personalized breathing sequence adapted to your personal lung capability.",
          benefit: "Tailored practice matches your exact relaxation rate and progress goals.",
          phases: [
            ...(customInhale > 0 ? [{ type: 'inhale', duration: customInhale, label: "Inhale", instruction: "Breathe in deeply", colorClass: "from-teal-400 to-emerald-500 shadow-teal-500/40", bubbleScale: 1.0, glowColor: "rgba(20, 184, 166, 0.4)" }] : []),
            ...(customHoldIn > 0 ? [{ type: 'holdIn', duration: customHoldIn, label: "Hold", instruction: "Suspend your breath", colorClass: "from-indigo-500 to-purple-600 shadow-indigo-500/40", bubbleScale: 2.1, glowColor: "rgba(99, 102, 241, 0.4)" }] : []),
            ...(customExhale > 0 ? [{ type: 'exhale', duration: customExhale, label: "Exhale", instruction: "Exhale smoothly", colorClass: "from-sky-400 to-blue-500 shadow-blue-500/40", bubbleScale: 2.1, glowColor: "rgba(56, 189, 248, 0.4)" }] : []),
            ...(customHoldOut > 0 ? [{ type: 'holdOut', duration: customHoldOut, label: "Pause", instruction: "Hold empty before inhale", colorClass: "from-slate-500 to-slate-600 shadow-slate-500/40", bubbleScale: 1.0, glowColor: "rgba(100, 116, 139, 0.3)" }] : [])
          ]
        };
    }
  }, [customInhale, customHoldIn, customExhale, customHoldOut]);

  const config = getTechniqueConfig(technique);
  const activePhase = config.phases[currentPhaseIndex];
  const activeDuration = activePhase?.duration || 4;

  // Handle ambient music toggling
  useEffect(() => {
    if (musicEnabled && isPlaying) {
      playProfile('breathing');
    } else {
      stopAudio();
    }
  }, [musicEnabled, isPlaying, playProfile, stopAudio]);

  // Main high-precision animation and state tick (100ms frequency)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setElapsedInPhase((prev) => {
          const next = Math.round((prev + 0.1) * 10) / 10;
          
          if (next >= activeDuration) {
            // Move to next phase
            setCurrentPhaseIndex((prevIndex) => {
              const nextIndex = (prevIndex + 1) % config.phases.length;
              const nextPhase = config.phases[nextIndex];
              
              // Trigger chimes and haptics on transitions
              if (chimesEnabled) {
                playPhaseChime(nextPhase.type);
              }
              if (hapticsEnabled) {
                triggerHapticFeedback('medium');
              }
              
              // Cycle count completes when returning to phase 0
              if (nextIndex === 0) {
                setCompletedCycles((c) => {
                  const newCount = c + 1;
                  // Achievement toast
                  if (newCount === 4) {
                    toast.success("4 breath cycles completed! Feel the calm settling in. 🌸");
                  }
                  return newCount;
                });
              }
              
              return nextIndex;
            });
            return 0; // Reset phase stopwatch
          }
          return next;
        });

        // Add to total timer
        setTotalSeconds((prev) => prev + 0.1);
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeDuration, config.phases.length, chimesEnabled, hapticsEnabled, config.phases]);

  // Handle Keyboard Shortcuts for Accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault(); // Prevent page scrolling
        setIsPlaying((p) => !p);
      } else if (e.code === "KeyR") {
        resetExercise();
      } else if (e.code === "Escape") {
        handleBack();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleBack = () => {
    stopAudio();
    dispatch({ type: 'SET_VIEW', payload: 'wellness' });
  };

  const togglePlay = () => {
    if (!isPlaying) {
      // First start chimes and haptic feedback
      if (chimesEnabled) playPhaseChime(config.phases[currentPhaseIndex].type);
      if (hapticsEnabled) triggerHapticFeedback('light');
    }
    setIsPlaying(!isPlaying);
  };

  const resetExercise = () => {
    setIsPlaying(false);
    setCurrentPhaseIndex(0);
    setElapsedInPhase(0);
    setCompletedCycles(0);
    setTotalSeconds(0);
    stopAudio();
    toast.info("Session reset.");
  };

  // Compute animated scale dynamically on the CPU to record current sizes
  // but Framer Motion will render the GPU smooth transition.
  let currentScale = 1.0;
  if (activePhase) {
    const startScale = activePhase.type === 'inhale' ? 1.0 : activePhase.type === 'exhale' ? 2.1 : activePhase.bubbleScale;
    const endScale = activePhase.type === 'inhale' ? 2.1 : activePhase.type === 'exhale' ? 1.0 : activePhase.bubbleScale;
    
    const progress = Math.min(1, elapsedInPhase / activeDuration);
    
    if (activePhase.type === 'inhale') {
      currentScale = 1.0 + 1.1 * progress;
    } else if (activePhase.type === 'exhale') {
      currentScale = 2.1 - 1.1 * progress;
    } else {
      currentScale = activePhase.bubbleScale;
    }
  }

  // Preserve scale for seamless pausing
  if (isPlaying) {
    lastScaleRef.current = currentScale;
  }

  // SVG circular outline progress computation
  const svgRadius = 90;
  const svgCircumference = 2 * Math.PI * svgRadius;
  const progressPercent = Math.min(1, elapsedInPhase / activeDuration);
  const strokeDashoffset = svgCircumference - (svgCircumference * progressPercent);

  // Format stopwatch output
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = Math.floor(secs % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 max-w-5xl mx-auto space-y-8 select-none relative pb-24 lg:pb-8">
      {/* CSS custom variables injected locally for absolute high performance */}
      <style>{`
        .breathe-outer-glow {
          box-shadow: 0 0 80px 20px var(--glow-color, rgba(20, 184, 166, 0.2));
          transition: box-shadow 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .breathe-bg-gradient {
          transition: background-color 1.2s ease, background-image 1.2s ease;
        }
        .progress-ring-circle {
          transition: stroke-dashoffset 0.1s linear, stroke 0.6s ease;
        }
      `}</style>

      {/* Header and Controls */}
      <div className="flex items-center justify-between z-10">
        <Button
          variant="ghost"
          className="rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/40 dark:border-slate-700/40 hover:bg-white/60 dark:hover:bg-slate-700/60 font-semibold"
          onClick={handleBack}
          aria-label="Back to Wellness Studio"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Wellness Studio
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/40 dark:border-slate-700/40 ${showGuide ? 'text-teal-600 dark:text-teal-400' : ''}`}
            onClick={() => setShowGuide(!showGuide)}
            title="Practice Guide"
          >
            <HelpCircle className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/40 dark:border-slate-700/40 ${showSettings ? 'text-teal-600 dark:text-teal-400' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
            title="Customize Rhythm"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start flex-1">
        
        {/* Left Hand Context Panel */}
        <div className="space-y-6 lg:col-span-1">
          <div className="p-6 rounded-[32px] bg-white/40 dark:bg-slate-800/30 backdrop-blur-xl border border-white/60 dark:border-slate-700/30 shadow-lg space-y-4">
            <div className="flex items-center space-x-3 text-teal-600 dark:text-teal-400">
              <Wind className="w-6 h-6 animate-pulse" />
              <h2 className="text-xl font-bold tracking-tight">Breathing Studio</h2>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white leading-tight">
                {config.name}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {config.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100/50 dark:border-teal-900/30">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Core Benefit
              </h4>
              <p className="text-xs text-teal-950 dark:text-teal-200/90 leading-relaxed">
                {config.benefit}
              </p>
            </div>
          </div>

          {/* Quick Info & Stats Card */}
          <div className="p-6 rounded-[32px] bg-white/40 dark:bg-slate-800/30 backdrop-blur-xl border border-white/60 dark:border-slate-700/30 shadow-lg space-y-4">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Session Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/50 text-center border border-white/60 dark:border-slate-700/30">
                <p className="text-2xl font-black text-slate-800 dark:text-white">{completedCycles}</p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Cycles</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/50 text-center border border-white/60 dark:border-slate-700/30">
                <p className="text-2xl font-black text-slate-800 dark:text-white">{formatTime(totalSeconds)}</p>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">Elapsed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Center Canvas: Visualizing Bubble */}
        <div className="flex flex-col items-center justify-center space-y-8 lg:col-span-2 min-h-[450px]">
          
          <div 
            className="relative flex items-center justify-center w-[300px] h-[300px]"
            style={{ '--glow-color': activePhase?.glowColor } as React.CSSProperties}
          >
            {/* Soft Breathing Ambient Particle Ring */}
            <div className="absolute inset-0 rounded-full border border-teal-500/10 dark:border-teal-400/5 scale-125 pointer-events-none" />
            <div className="absolute inset-0 rounded-full border border-teal-500/5 dark:border-teal-400/2 scale-150 pointer-events-none" />

            {/* SVG Circular Progress Track */}
            <svg className="absolute w-[240px] h-[240px] -rotate-90 z-10 pointer-events-none">
              {/* Outer Track Ring */}
              <circle
                cx="120"
                cy="120"
                r={svgRadius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth="6"
                className="text-slate-200 dark:text-slate-800/40 opacity-80"
              />
              {/* Active countdown border progress */}
              <circle
                cx="120"
                cy="120"
                r={svgRadius}
                fill="transparent"
                stroke={activePhase?.type === 'inhale' ? '#0ea5e9' : activePhase?.type === 'holdIn' ? '#8b5cf6' : activePhase?.type === 'exhale' ? '#14b8a6' : '#64748b'}
                strokeWidth="6"
                strokeDasharray={svgCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="progress-ring-circle"
              />
            </svg>

            {/* Glowing, Pulsing Bubble Sphere */}
            <motion.div
              animate={{ 
                scale: isPlaying ? currentScale : lastScaleRef.current,
                filter: activePhase?.type === 'holdIn' ? 'blur(1px)' : 'blur(0px)'
              }}
              transition={{ duration: 0.1, ease: "linear" }}
              className={`absolute w-[100px] h-[100px] rounded-full bg-gradient-to-tr ${activePhase ? activePhase.colorClass : 'from-teal-400 to-teal-500'} breathe-outer-glow z-0 flex items-center justify-center will-change-transform`}
            >
              {/* Inside Bubble Watery Reflection Effect */}
              <div className="absolute top-1 right-2 w-6 h-3 rounded-full bg-white/20 blur-[1px] rotate-12" />
            </motion.div>

            {/* Dynamic Label HUD */}
            <div className="relative z-20 text-center flex flex-col items-center justify-center p-6 select-none pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activePhase?.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                >
                  {activePhase?.label}
                </motion.span>
              </AnimatePresence>

              <span className="text-white/80 font-bold text-sm tracking-wide mt-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                {isPlaying 
                  ? `${Math.max(0.1, Math.round((activeDuration - elapsedInPhase) * 10) / 10).toFixed(1)}s`
                  : "Paused"
                }
              </span>
            </div>
          </div>

          {/* Subtitle Instruction */}
          <div className="text-center max-w-md px-4 min-h-[50px] flex items-center justify-center">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300 leading-relaxed italic">
              {isPlaying ? activePhase?.instruction : "Click Start to begin breathing exercise"}
            </p>
          </div>

          {/* Action Deck (Play/Pause, Reset) */}
          <div className="flex items-center gap-4 z-10">
            <Button
              onClick={togglePlay}
              size="lg"
              className={`rounded-full px-8 py-6 text-base font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 ${
                isPlaying 
                  ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-800' 
                  : 'bg-teal-500 hover:bg-teal-600 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2 fill-current" /> Start
                </>
              )}
            </Button>

            <Button
              onClick={resetExercise}
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 border border-slate-200 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-700"
              title="Reset Session (R)"
            >
              <RotateCcw className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </Button>
          </div>

          {/* Setup Techniques Row */}
          <div className="flex flex-wrap justify-center gap-2 bg-slate-100/50 dark:bg-slate-900/40 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 w-full max-w-md">
            {(['478', 'box', 'coherent', 'resonant', 'custom'] as Technique[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTechnique(t);
                  setCurrentPhaseIndex(0);
                  setElapsedInPhase(0);
                  setIsPlaying(false);
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all ${
                  technique === t
                    ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {t === '478' ? '4-7-8' : t}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Settings Overlay Drawer */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 left-4 right-4 lg:left-auto lg:right-4 lg:w-[380px] p-6 rounded-[32px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-white/60 dark:border-slate-800/60 shadow-2xl space-y-6 z-40"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-teal-500" />
                Session Settings
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-8 px-3"
                onClick={() => setShowSettings(false)}
              >
                Done
              </Button>
            </div>

            {/* Custom Timers */}
            {technique === 'custom' ? (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Custom Timing (seconds)</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>Inhale</span>
                    <span>{customInhale}s</span>
                  </div>
                  <Slider
                    value={[customInhale]}
                    onValueChange={(val) => setCustomInhale(val[0])}
                    min={2}
                    max={10}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>Hold (In)</span>
                    <span>{customHoldIn}s</span>
                  </div>
                  <Slider
                    value={[customHoldIn]}
                    onValueChange={(val) => setCustomHoldIn(val[0])}
                    min={0}
                    max={12}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>Exhale</span>
                    <span>{customExhale}s</span>
                  </div>
                  <Slider
                    value={[customExhale]}
                    onValueChange={(val) => setCustomExhale(val[0])}
                    min={2}
                    max={10}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>Pause (Hold Out)</span>
                    <span>{customHoldOut}s</span>
                  </div>
                  <Slider
                    value={[customHoldOut]}
                    onValueChange={(val) => setCustomHoldOut(val[0])}
                    min={0}
                    max={12}
                    step={1}
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 text-center border border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                To adjust timing parameters, select the <strong className="text-teal-500">Custom</strong> preset.
              </div>
            )}

            {/* Audio Toggles */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Audio & Tactile Controls</h4>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Music className="w-4 h-4 text-slate-400" />
                  Ocean Ambient Track
                </span>
                <Switch
                  checked={musicEnabled}
                  onCheckedChange={(checked) => setMusicEnabled(checked)}
                  aria-label="Toggle ambient music"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-slate-400" />
                  Voice/Chime Cues
                </span>
                <Switch
                  checked={chimesEnabled}
                  onCheckedChange={(checked) => setChimesEnabled(checked)}
                  aria-label="Toggle chimes"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Vibrate className="w-4 h-4 text-slate-400" />
                  Haptic Pulse Transitions
                </span>
                <Switch
                  checked={hapticsEnabled}
                  onCheckedChange={(checked) => setHapticsEnabled(checked)}
                  aria-label="Toggle vibration"
                  disabled={!isMobileDevice()}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* practice instructions help overlay */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 left-4 right-4 lg:left-auto lg:right-4 lg:w-[380px] p-6 rounded-[32px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/60 dark:border-slate-800/60 shadow-2xl space-y-4 z-40"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-teal-500" />
                How to Practice
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full h-8 px-3"
                onClick={() => setShowGuide(false)}
              >
                Close
              </Button>
            </div>
            
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed overflow-y-auto max-h-[300px]">
              <p>
                1. <strong>Posture:</strong> Sit upright in a comfortable position, relax your shoulders, and plant your feet flat.
              </p>
              <p>
                2. <strong>Inhale:</strong> When the bubble grows and turns green, draw breath slowly through your nose, expanding your stomach first.
              </p>
              <p>
                3. <strong>Hold:</strong> During suspension, stay relaxed. Avoid tightening your throat or chest muscles.
              </p>
              <p>
                4. <strong>Exhale:</strong> As the bubble collapses, release your breath fully. If practicing 4-7-8, make a soft audible "whoosh" sound.
              </p>
              <p>
                5. <strong>Consistency:</strong> Aim for 4-8 completed cycles twice a day. You will feel a natural lowering of heart rate and release of physical tension.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
