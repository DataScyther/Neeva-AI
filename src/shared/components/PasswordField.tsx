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

export function PasswordField({ showStrength = false, ...props }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <TextField
        {...props}
        secureTextEntry={!showPassword}
        rightIcon={
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={18} color="rgba(255,255,255,0.4)" />
            ) : (
              <Eye size={18} color="rgba(255,255,255,0.4)" />
            )}
          </Pressable>
        }
      />
    </>
  );
}

export default PasswordField;
