import React, { createContext, useEffect, useMemo, useCallback } from 'react';
import { useColorScheme as useReactNativeColorScheme } from 'react-native';
import { useAppStore } from '@/core/store/useAppStore';
import { colors } from '@/theme/colors';
import type { ThemeTokens } from '@/theme';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ThemeType = 'light' | 'dark';

export interface ThemeContextType {
  mode: ThemeMode;
  theme: ThemeType;
  colors: ThemeTokens;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useAppStore((state) => state.ui.theme);
  const setMode = useAppStore((state) => state.setTheme);

  // Safely hook into standard React Native useColorScheme
  const systemColorScheme = useReactNativeColorScheme();

  const theme = useMemo<ThemeType>(() => {
    if (mode === 'auto') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return mode === 'dark' ? 'dark' : 'light';
  }, [mode, systemColorScheme]);

  const resolvedColors = useMemo(() => {
    return colors[theme];
  }, [theme]);

  // Synchronize CSS custom properties on Web
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined' && document.documentElement) {
      const root = document.documentElement;
      root.setAttribute('data-theme', theme);
      root.classList.toggle('dark', theme === 'dark');
      root.style.colorScheme = theme;

      // Update HTML metadata theme-color
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', theme === 'dark' ? '#0B0B0F' : '#F8F9FC');
      }
    }
  }, [theme]);

  // Sync NativeWind's color scheme
  useEffect(() => {
    try {
      const { colorScheme } = require('nativewind');
      if (colorScheme && typeof colorScheme.set === 'function') {
        colorScheme.set(theme);
      }
    } catch (e) {
      // NativeWind not loaded or not in mobile environment
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light');
  }, [mode, setMode]);

  return (
    <ThemeContext.Provider value={{ mode, theme, colors: resolvedColors, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
