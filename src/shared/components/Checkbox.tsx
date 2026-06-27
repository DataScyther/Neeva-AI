import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
  label?: string;
  error?: string;
}

export function Checkbox({ checked, onPress, label, error }: CheckboxProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-start py-1.5 active:opacity-80"
    >
      <View
        className={`w-5 h-5 rounded border mr-3 items-center justify-center ${
          checked
            ? 'bg-neeva-purple-600 border-neeva-purple-500'
            : 'bg-neeva-glass-dark/40 border-neeva-glass-border'
        }`}
      >
        {checked && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
      </View>
      <View className="flex-1">
        {label && (
          <Text className="text-white/70 text-body-sm leading-5">
            {label}
          </Text>
        )}
        {error && (
          <Text className="text-red-400 text-caption mt-1">
            {error}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export default Checkbox;
