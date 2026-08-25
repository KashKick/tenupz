import { Tabs } from 'expo-router'
import { Home, Play, Gift, User, } from 'lucide-react-native'

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#111111',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
            height: 70,
            paddingTop: 8,
            paddingBottom: 8,
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