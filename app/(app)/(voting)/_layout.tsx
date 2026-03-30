import { Stack } from 'expo-router';

export default function VotingStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="winner"
        options={{ headerShown: false, presentation: 'modal' }}
      />
    </Stack>
  );
}
