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
  ...inputProps
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const borderColor = error
    ? 'border-red-400'
    : isFocused
    ? 'border-neeva-purple-500'
    : 'border-neeva-glass-border';

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    color: withTiming(
      error ? '#F87171' : isFocused ? '#8B5CF6' : 'rgba(255,255,255,0.4)',
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
          className="text-body-sm font-medium mb-2"
        >
          {label}
        </Animated.Text>
      )}

      <View
        className={`flex-row items-center bg-neeva-glass-dark/40 rounded-glass border ${borderColor} px-4 py-3`}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}

        <TextInput
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="rgba(255,255,255,0.3)"
          className="flex-1 text-white text-body"
          {...inputProps}
        />

        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </View>

      {error && (
        <Text className="text-red-400 text-caption mt-1.5">{error}</Text>
      )}

      {hint && !error && (
        <Text className="text-white/30 text-caption mt-1.5">{hint}</Text>
      )}
    </View>
  );
}

export default TextField;
