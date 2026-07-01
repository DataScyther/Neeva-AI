import React from 'react';
import { Stack } from 'expo-router';

export default function CommunityLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="create" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
