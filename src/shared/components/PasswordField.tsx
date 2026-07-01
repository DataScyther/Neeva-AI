/**
 * PasswordField — Password input with visibility toggle
 */

import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { TextField } from './TextField';
import type { TextFieldProps } from './TextField';

interface PasswordFieldProps extends Omit<TextFieldProps, 'rightIcon' | 'secureTextEntry'> {
  showStrength?: boolean;
}

export function PasswordField({ showStrength = false, theme = 'dark', ...props }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isDark = theme === 'dark';

  return (
    <>
      <TextField
        {...props}
        theme={theme}
        secureTextEntry={!showPassword}
        rightIcon={
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={18} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
            ) : (
              <Eye size={18} color={isDark ? 'rgba(255,255,255,0.4)' : '#94A3B8'} />
            )}
          </Pressable>
        }
      />
    </>
  );
}

export default PasswordField;
