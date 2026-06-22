import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

export interface AudioProfile {
  name: string;
  description: string;
  frequencies: number[];
  volumes: number[];
  types: ("sine" | "triangle" | "sawtooth" | "square")[];
  effects: {
    reverb?: boolean;
    delay?: boolean;
    lowPass?: boolean;
  };
}

export const audioProfiles: { [key: string]: AudioProfile } = {
  meditation: {
    name: "Celestial Meditation",
    description: "Ethereal tones and cosmic resonance",
    frequencies: [136.1, 194.18, 256, 341.3], // OM frequency and harmonics
    volumes: [0.15, 0.12, 0.1, 0.08],
    types: ["sine", "triangle", "sine", "triangle"],
    effects: { reverb: true, lowPass: true },
  },
  breathing: {
    name: "Ocean Breath",
    description: "Gentle waves and rhythmic flow",
    frequencies: [110, 165, 220, 440], // Calming breathwork frequencies
    volumes: [0.2, 0.15, 0.1, 0.05],
    types: ["sine", "sine", "triangle", "sine"],
    effects: { reverb: true, delay: true },
  },
  journaling: {
    name: "Forest Sanctuary",
    description: "Nature sounds and gentle harmonies",
    frequencies: [174, 285, 396, 528], // Solfeggio healing frequencies
    volumes: [0.1, 0.12, 0.08, 0.06],
    types: ["triangle", "sine", "sine", "triangle"],
    effects: { reverb: true, lowPass: true },
  },
  adhd_focus: {
    name: "Neural Harmony",
    description: "Focus-enhancing binaural beats",
    frequencies: [40, 80, 120, 160], // Gamma and beta waves for focus
    volumes: [0.18, 0.15, 0.12, 0.1],
    types: ["sine", "sine", "triangle", "sine"],
    effects: { delay: true },
  },
  ambient: {
    name: "Peaceful Ambience",
    description: "Gentle background atmosphere",
    frequencies: [220, 330, 440, 660],
    volumes: [0.08, 0.06, 0.05, 0.04],
    types: ["sine", "triangle", "sine", "triangle"],
    effects: { reverb: true, lowPass: true, delay: true },
  },
};

export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private masterGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private delayNode: DelayNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isPlaying = false;
  private currentProfile: AudioProfile | null = null;

  constructor() {
    this.initAudioContext();
  }

  private async initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      await this.setupEffects();
    } catch (error) {
      console.warn("Audio context not supported:", error);
    }
  }

  private async setupEffects() {
    if (!this.audioContext) return;

    // Master gain
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.3;

    // Reverb
    this.reverbNode = this.audioContext.createConvolver();
    await this.createImpulseResponse();

    // Delay
    this.delayNode = this.audioContext.createDelay(1);
    this.delayNode.delayTime.value = 0.3;
    const delayGain = this.audioContext.createGain();
    delayGain.gain.value = 0.2;

    // Low-pass filter
    this.filterNode = this.audioContext.createBiquadFilter();
    this.filterNode.type = "lowpass";
    this.filterNode.frequency.value = 800;
    this.filterNode.Q.value = 0.5;

    // Connect effects
    this.delayNode.connect(delayGain);
    delayGain.connect(this.delayNode);
    delayGain.connect(this.masterGain);

    this.masterGain.connect(this.audioContext.destination);
  }

  private async createImpulseResponse() {
    if (!this.audioContext || !this.reverbNode) return;

    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * 2; // 2 seconds of reverb
    const impulse = this.audioContext.createBuffer(
      2,
      length,
      sampleRate,
    );

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - i / length, 2);
        channelData[i] = (Math.random() * 2 - 1) * decay * 0.1;
      }
    }

    this.reverbNode.buffer = impulse;
  }

  async play(profile: AudioProfile) {
    if (!this.audioContext || this.isPlaying) return;

    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    this.currentProfile = profile;
    this.isPlaying = true;

    // Create oscillators and gain nodes
    for (let i = 0; i < profile.frequencies.length; i++) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = profile.types[i];
      oscillator.frequency.value = profile.frequencies[i];

      // Add subtle frequency modulation for organic feel
      const lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();
      lfo.frequency.value = 0.1 + Math.random() * 0.2; // Slow modulation
      lfoGain.gain.value = 2; // Small pitch variations
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      lfo.start();

      gainNode.gain.value = 0;

      // Connect audio chain
      oscillator.connect(gainNode);

      // Apply effects based on profile
      let currentNode: AudioNode = gainNode;

      if (profile.effects.lowPass && this.filterNode) {
        currentNode.connect(this.filterNode);
        currentNode = this.filterNode;
      }

      if (profile.effects.reverb && this.reverbNode) {
        const reverbGain = this.audioContext.createGain();
        reverbGain.gain.value = 0.3;
        currentNode.connect(this.reverbNode);
        this.reverbNode.connect(reverbGain);
        reverbGain.connect(this.masterGain!);
      }

      if (profile.effects.delay && this.delayNode) {
        currentNode.connect(this.delayNode);
      } else {
        currentNode.connect(this.masterGain!);
      }

      // Fade in
      gainNode.gain.exponentialRampToValueAtTime(
        profile.volumes[i],
        this.audioContext.currentTime + 2,
      );

      oscillator.start();

      this.oscillators.push(oscillator);
      this.gainNodes.push(gainNode);
    }
  }

  stop() {
    if (!this.audioContext || !this.isPlaying) return;

    // Fade out
    this.gainNodes.forEach((gainNode) => {
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext!.currentTime + 1,
      );
    });

    // Stop oscillators after fade out
    setTimeout(() => {
      this.oscillators.forEach((osc) => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
      });
      this.oscillators = [];
      this.gainNodes = [];
      this.isPlaying = false;
    }, 1000);
  }

  setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.exponentialRampToValueAtTime(
        Math.max(0.001, volume),
        this.audioContext!.currentTime + 0.1,
      );
    }
  }

  isActive() {
    return this.isPlaying;
  }

  getCurrentProfile() {
    return this.currentProfile;
  }
}

export function useAudioManager() {
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProfile, setCurrentProfile] =
    useState<AudioProfile | null>(null);
  const [volume, setVolume] = useState(0.3);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (!audioEngineRef.current) {
      audioEngineRef.current = new AudioEngine();
    }

    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.stop();
      }
    };
  }, []);

  const playProfile = useCallback(
    async (profileKey: string) => {
      if (!audioEngineRef.current || !isEnabled) return;

      const profile = audioProfiles[profileKey];
      if (!profile) return;

      if (isPlaying) {
        audioEngineRef.current.stop();
        setIsPlaying(false);
        setCurrentProfile(null);

        // Wait for fade out
        await new Promise((resolve) =>
          setTimeout(resolve, 1100),
        );
      }

      try {
        await audioEngineRef.current.play(profile);
        setIsPlaying(true);
        setCurrentProfile(profile);
      } catch (error) {
        console.warn("Could not play audio:", error);
      }
    },
    [isPlaying, isEnabled],
  );

  const stopAudio = useCallback(() => {
    if (audioEngineRef.current) {
      audioEngineRef.current.stop();
      setIsPlaying(false);
      setCurrentProfile(null);
    }
  }, []);

  const setAudioVolume = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (audioEngineRef.current) {
      audioEngineRef.current.setVolume(newVolume);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    setIsEnabled((prev) => {
      const newEnabled = !prev;
      if (!newEnabled && isPlaying) {
        stopAudio();
      }
      return newEnabled;
    });
  }, [isPlaying, stopAudio]);

  return {
    isPlaying,
    currentProfile,
    volume,
    isEnabled,
    playProfile,
    stopAudio,
    setVolume: setAudioVolume,
    toggleAudio,
    availableProfiles: audioProfiles,
  };
}