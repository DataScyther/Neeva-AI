/**
 * Button — Primary call-to-action component
 *
 * Variants: primary | secondary | ghost | destructive
 * Sizes: sm | md | lg
 */

import React from 'react';
import { Pressable, Text, ActivityIndicator, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-glass font-semibold active:opacity-80',
  {
    variants: {
      variant: {
        primary: 'bg-neeva-purple-600',
        secondary: 'bg-neeva-glass-highlight border border-neeva-glass-border',
        ghost: 'bg-transparent',
        destructive: 'bg-red-500/20 border border-red-500/30',
      },
      size: {
        sm: 'px-4 py-2.5',
        md: 'px-6 py-3.5',
        lg: 'px-8 py-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

const textVariants = cva('font-semibold', {
  variants: {
    variant: {
      primary: 'text-white',
      secondary: 'text-white',
      ghost: 'text-neeva-purple-400',
      destructive: 'text-red-400',
    },
    size: {
      sm: 'text-body-sm',
      md: 'text-body',
      lg: 'text-body-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

interface ButtonProps extends Omit<PressableProps, 'children' | 'className'>, VariantProps<typeof buttonVariants> {
  title: string;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  icon,
  variant,
  size,
  className = '',
  ...pressableProps
}: ButtonProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(disabled ? 0.4 : 1, { damping: 15, stiffness: 200 }),
    };
  });

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`${buttonVariants({ variant, size })} ${className}`}
      style={animatedStyle}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : '#8B5CF6'}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text className={`${textVariants({ variant, size })} ${icon ? 'ml-2' : ''}`}>
            {title}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}

export default Button;
