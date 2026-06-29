import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { typography, spacing, borderRadius, colors } from '@/core/theme';

export interface ReflectionInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export const ReflectionInput = React.memo(({
  value,
  onChangeText,
  placeholder = "What's contributing to this feeling today? (Optional)",
  maxLength = 200,
}: ReflectionInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          isFocused ? styles.inputWrapperFocused : styles.inputWrapperBlurred,
        ]}
      >
        <TextInput
          style={[styles.textInput, { height: inputHeight }]}
          multiline
          placeholder={placeholder}
          placeholderTextColor="rgba(255, 255, 255, 0.3)"
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onContentSizeChange={(e) => {
            setInputHeight(Math.max(40, e.nativeEvent.contentSize.height));
          }}
          allowFontScaling={true}
          accessibilityLabel="Reflection text input"
          accessibilityHint="Optionally type what is contributing to your feeling today, maximum 200 characters"
        />
        <View style={styles.bottomRow}>
          <Text style={styles.charCounter}>
            {value.length} / {maxLength}
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl, // 24px
    marginVertical: spacing.sm,    // 8px standard
  },
  inputWrapper: {
    borderRadius: borderRadius.xl, // 20px
    borderWidth: 1,
    padding: spacing.md,           // 12px (more compact)
    minHeight: 90,                 // 90dp starting height
    justifyContent: 'space-between',
  },
  inputWrapperBlurred: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  inputWrapperFocused: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(167, 139, 250, 0.4)', // Purple-400 with opacity
  },
  textInput: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: typography.fontFamily.sans,
    lineHeight: 20,
    padding: 0, // Reset default Android paddings
    textAlignVertical: 'top', // Align text to top for Android multiline
    flex: 1,
    minHeight: 40,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: spacing.xs, // 4px (more compact)
  },
  charCounter: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.3)',
    fontFamily: typography.fontFamily.sans,
  },
});

export default ReflectionInput;
