import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/(auth)/login');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!user) {
    return null; // prevents protected screens from rendering for unauthenticated users
  }

  return children;
}
