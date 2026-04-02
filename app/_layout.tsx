import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import "../global.css";
import { getDb, initDatabase } from '../src/database';
import { useAuthStore } from '../src/stores/auth.store';

export const unstable_settings = {
  anchor: '(app)',
};

function DrizzleDevTools() {
  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useDrizzleStudio } = require('expo-drizzle-studio-plugin');
    useDrizzleStudio(getDb());
  }
  return null;
}

/**
 * Redirige al usuario según su estado de autenticación.
 * Solo actúa después de que `isHydrated` sea true para evitar flashes.
 */
function AuthGuard() {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isHydrated) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(app)/(home)');
    }
  }, [isAuthenticated, isHydrated, segments]);

  return null;
}

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initDatabase()
      .then(() => initialize())
      .then(() => setDbReady(true))
      .catch((err) => console.error('Error inicializando la app:', err));
  }, []);

  if (!dbReady) return <View style={{ flex: 1, backgroundColor: '#0A0A0A' }} />;

  return (
    <>
      <DrizzleDevTools />
      <AuthGuard />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(app)" />
        <Stack.Screen name="(auth)" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
