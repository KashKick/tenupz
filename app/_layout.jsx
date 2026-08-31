import { Stack } from "expo-router"
import { useEffect, useState } from "react"
import { View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useUserStore } from "../stores/userStore"
import { useChallengeStore } from "../stores/challengeStore"
import Spinner from "../components/Spinner"

export default function RootLayout() {
  const ensureUserId = useUserStore((state) => state.ensureUserId)
  const [hasHydrated, setHasHydrated] = useState(
    useUserStore.persist.hasHydrated() && 
    useChallengeStore.persist.hasHydrated()
  )

  useEffect(() => {
    const updateHydrationState = () => {
      setHasHydrated(
        useUserStore.persist.hasHydrated() &&
        useChallengeStore.persist.hasHydrated()
      )
    }

    const unsubscribeUserHydrate = useUserStore.persist.onHydrate(updateHydrationState)
    const unsubscribeUserFinish = useUserStore.persist.onFinishHydration(updateHydrationState)
    const unsubscribeChallengeHydrate = useChallengeStore.persist.onHydrate(updateHydrationState)
    const unsubscribeChallengeFinish = useChallengeStore.persist.onFinishHydration(updateHydrationState)

    updateHydrationState()

    return () => {
      unsubscribeUserHydrate()
      unsubscribeUserFinish()
      unsubscribeChallengeHydrate()
      unsubscribeChallengeFinish()
    }
  }, [])

  useEffect(() => {
    if (!hasHydrated) return

    ensureUserId()
  }, [hasHydrated, ensureUserId])

  if (!hasHydrated) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Spinner />
        </View>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{
          headerShown: false,
      }} >
          <Stack.Screen name="index"/>
          <Stack.Screen name="(tabs)"/>
          <Stack.Screen name="quiz/[quizId]"/>
          <Stack.Screen name="results/[attemptId]"/>
          <Stack.Screen name="challenge/[offerId]"/>
      </Stack>
    </SafeAreaProvider>
  )
}