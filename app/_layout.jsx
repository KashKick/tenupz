import { Stack } from "expo-router"

export default function RootLayout() {
  return (
    <Stack screenOptions={{
        handerShown: false,
    }} >
        <Stack.Screen name="index"/>
        <Stack.Screen name="(tabs)"/>
        <Stack.Screen name="quiz/[quizId]"/>
        <Stack.Screen name="results/[attemptId]"/>
        <Stack.Screen name="challenge/[offerId]"/>
    </Stack>
  )
}