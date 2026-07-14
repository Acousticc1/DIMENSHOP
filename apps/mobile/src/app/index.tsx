import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../application/stores/useAuthStore';
import { logger } from '../shared/utils/logger';

export default function IndexPage() {
  const router = useRouter();
  const { user, session, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    logger.info('Routing checkpoint reached', { 
      hasSession: !!session, 
      userRole: user?.role 
    });

    if (!session || !user) {
      // Redirect to login flow
      router.replace('/(auth)/login');
    } else if (user.role === 'seller') {
      // Redirect to seller dashboard flow
      router.replace('/(seller)/dashboard');
    } else {
      // Default to buyer home flow
      router.replace('/(buyer)/home');
    }
  }, [user, session, isLoading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366F1" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F11',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
