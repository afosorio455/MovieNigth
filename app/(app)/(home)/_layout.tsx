import { Stack } from 'expo-router';

export default function HomeStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="add-movie"
        options={{ headerShown: false, presentation: 'modal' }}
      />
    </Stack>
  );
}
