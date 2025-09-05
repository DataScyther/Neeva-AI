import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Automatically transition after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Delay the onComplete callback to allow for fade-out animation
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center z-50 ${isVisible ? 'animate-fadeIn' : 'animate-fadeOut'}`}>
      {/* App Logo */}
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-full mb-8 animate-pulse">
        <Heart className="w-24 h-24 text-white" />
      </div>
      
      {/* App Name */}
      <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Neeva</h1>
      
      {/* Tagline */}
      <p className="text-xl text-white/90 mb-8 text-center max-w-md px-4">
        Your personal AI-powered mental wellness companion
      </p>
      
      {/* Loading indicator */}
      <div className="w-32 h-1 bg-white/30 rounded-full overflow-hidden">
        <div className="h-full bg-white rounded-full animate-progress"></div>
      </div>
    </div>
  );
}