/**
 * Header — Screen header with title, subtitle, and optional actions
 */

import React from 'react';
import { View, Text } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  className?: string;
}

export function Header({
  title,
  subtitle,
  leftAction,
  rightAction,
  className = '',
}: HeaderProps) {
  return (
    <View className={`flex-row items-center justify-between pt-4 pb-6 px-5 ${className}`}>
      <View className="flex-row items-center flex-1">
        {leftAction && <View className="mr-3">{leftAction}</View>}
        <View className="flex-1">
          <Text className="text-white/40 text-label font-medium">
            {subtitle}
          </Text>
          <Text className="text-white text-card-title font-semibold mt-0.5">
            {title}
          </Text>
        </View>
      </View>
      {rightAction && <View className="ml-4">{rightAction}</View>}
    </View>
  );
}

export default Header;
