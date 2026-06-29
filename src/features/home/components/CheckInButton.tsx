import React from 'react';
import { GradientButton } from '@/shared/components/GradientButton';

export interface CheckInButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  text?: string;
}

export const CheckInButton = React.memo(({
  onPress,
  disabled = false,
  loading = false,
  text = 'Complete Check-in',
}: CheckInButtonProps) => {
  return (
    <GradientButton
      title={text}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      size="lg"
      style={{ marginHorizontal: 24, marginTop: 40, marginBottom: 16 }}
    />
  );
});

export default CheckInButton;
