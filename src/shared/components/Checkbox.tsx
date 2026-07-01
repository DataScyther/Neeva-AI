import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  error?: string;
  theme?: 'dark' | 'light';
}

export function Checkbox({ checked, onPress, label, error, theme = 'dark' }: CheckboxProps) {
  const isDark = theme === 'dark';

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-start py-1.5 active:opacity-80"
    >
      <View
        className={`w-5 h-5 rounded border mr-3 items-center justify-center ${
          checked
            ? isDark
              ? 'bg-neeva-purple-600 border-neeva-purple-500'
              : 'bg-blue-600 border-blue-600'
            : isDark
            ? 'bg-neeva-glass-dark/40 border-neeva-glass-border'
            : 'bg-white border-slate-300'
        }`}
      >
        {checked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
      </View>
      <View className="flex-1">
        {label && (
          <Text className={`text-body-sm leading-5 ${isDark ? 'text-white/70' : 'text-slate-600 font-medium'}`}>
            {label}
          </Text>
        )}
        {error && (
          <Text className={`${isDark ? 'text-red-400' : 'text-red-500'} text-caption mt-1 font-medium`}>
            {error}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export default Checkbox;
