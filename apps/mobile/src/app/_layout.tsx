import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../application/stores/useAuthStore';
import { logger } from '../shared/utils/logger';

export default function RootLayout() {
  const { initSession, isLoading } = useAuthStore();

  useEffect(() => {
    logger.info('Initializing application and session...');
    initSession().catch((err) => {
      logger.error('Failed to initialize session during bootstrap', err);
    });
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0F0F11' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(buyer)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(seller)" options={{ gestureEnabled: false }} />
      </Stack>
    </>
  );
}
