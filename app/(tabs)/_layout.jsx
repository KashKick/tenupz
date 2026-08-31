import { Tabs } from 'expo-router'
import { Home, Play, Gift, User, } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TabsLayout() {
  const insets = useSafeAreaInsets()

  return (
    <Tabs screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#111111',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
            height: 70 + insets.bottom,
            paddingTop: 8,
            paddingBottom: 8 + insets.bottom,
        },
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
        }
    }}>
        <Tabs.Screen name='home' options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
                <Home color={color} size={size} strokeWidth={2.2} />
            )
        }}/>

        <Tabs.Screen name='play' options={{
            title: "Play",
            tabBarIcon: ({ color, size }) => (
                <Play color={color} size={size} strokeWidth={2.2} />
            )
        }}/>

        <Tabs.Screen name='rewards' options={{
            title: "Rewards",
            tabBarIcon: ({ color, size }) => (
                <Gift color={color} size={size} strokeWidth={2.2} />
            )
        }}/>

        <Tabs.Screen name='profile' options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
                <User color={color} size={size} strokeWidth={2.2} />
            )
        }}/>
    </Tabs>
  )
}