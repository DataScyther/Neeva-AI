/**
 * TextField — Text input with label, error, and optional icon
 *
 * Variants: outlined | filled
 */

import React, { useState } from 'react';
import { View, Text, TextInput, type TextInputProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

export interface TextFieldProps extends Omit<TextInputProps, 'className'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
  theme?: 'dark' | 'light';
}

export function TextField({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  value,
  onFocus,
  onBlur,
  containerClassName = '',
  theme = 'dark',
  ...inputProps
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const isDark = theme === 'dark';

  const borderColor = error
    ? 'border-red-400'
    : isFocused
    ? isDark
      ? 'border-neeva-purple-500'
      : 'border-blue-600'
    : isDark
    ? 'border-neeva-glass-border'
    : 'border-slate-200';

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    color: withTiming(
      error
        ? '#F87171'
        : isFocused
        ? isDark
          ? '#A78BFA'
          : '#1C51E2'
        : isDark
        ? 'rgba(255,255,255,0.4)'
        : '#475569',
      { duration: 200 }
    ),
  }));

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Animated.Text
          style={labelAnimatedStyle}
          className="text-body-sm font-semibold mb-2"
        >
          {label}
        </Animated.Text>
      )}

      <View
        className={`flex-row items-center rounded-xl border ${borderColor} px-4 py-3.5 ${
          isDark ? 'bg-neeva-glass-dark/40' : 'bg-white'
        }`}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}

        <TextInput
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : '#94A3B8'}
          className={`flex-1 text-body ${isDark ? 'text-white' : 'text-slate-800 font-medium'}`}
          {...inputProps}
        />

        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </View>

      {error && (
        <Text className="text-red-500 text-caption mt-1.5 font-medium">{error}</Text>
      )}

      {hint && !error && (
        <Text className={`text-caption mt-1.5 ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
          {hint}
        </Text>
      )}
    </View>
  );
}

export default TextField;
