// components/auth/AuthGuard.jsx
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { router, usePathname } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading) {
      if (!user && !pathname.startsWith('/(auth)')) {
        // User not authenticated and not on auth page, redirect to login
        router.replace('/(auth)/login');
      } else if (user && pathname.startsWith('/(auth)')) {
        // User authenticated and on auth page, redirect to tabs
        router.replace('/(tabs)');
      }
    }
  }, [user, loading, pathname]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return children;
}
