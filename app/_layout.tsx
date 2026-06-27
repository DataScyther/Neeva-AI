/**
 * Neeva AI — Root Layout
 *
 * All providers wrap the entire app here.
 * The entry gateway (index.tsx) handles auth routing.
 */

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { NeevaProvider } from '@/core/providers/NeevaProvider';
import { ToastContainer } from '@/shared/components/Toast';

export default function RootLayout() {
  return (
    <NeevaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* Entry gateway — determines initial route */}
        <Stack.Screen name="index" options={{ animation: 'fade' }} />

        {/* Auth screens */}
        <Stack.Screen name="auth/login" options={{ animation: 'fade' }} />
        <Stack.Screen name="auth/signup" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="auth/forgot-password" options={{ animation: 'slide_from_bottom' }} />

        {/* Onboarding */}
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />

        {/* Main tab navigator */}
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      </Stack>

      {/* Global toast notifications */}
      <ToastContainer />
    </NeevaProvider>
  );
}
