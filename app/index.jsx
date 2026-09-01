import { Redirect, router } from 'expo-router'
import { StyleSheet, Text, View, Pressable, } from 'react-native'
import { COLORS } from '../constants/theme'
import { useScreenPadding } from '../hooks/useScreenPadding'
import { useUserStore } from '../stores/userStore'

export default function WelcomeScreen() {
    const screenPadding = useScreenPadding({ top: 24, bottom: 24 })
    const tensCompleted = useUserStore((state) => state.tensCompleted)

    const handleStart = () => {
        router.push("/quiz/first-ten")
    }
    
    if (tensCompleted > 0) {
        return <Redirect href="/home" />
    }

  return (
    <View style={[styles.screen, screenPadding]}>
        <View style={styles.content}>
            <View style={styles.logoBadge}>
                <Text style={styles.logoMark}>10</Text>
            </View>

            <Text style={styles.logo}>TenUpz</Text>

            <Text style={styles.headline}>
                10 questions.
                {"\n"}
                How many can you get?
            </Text>
            <Text style={styles.subtext}>
                Test yourself, earn XP, build your streak and come back tomorrow for another Ten.
            </Text>

            <Pressable style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
            ]} onPress={handleStart}>
                <Text style={styles.buttonText}>
                    PLAY YOUR FIRST TEN
                </Text>
            </Pressable>

            <Text style={styles.note}>
                No signup required
            </Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    content: {
        width: '100%',
        maxWidth: 480,
        alignItems: 'center'
    },
    logoBadge: {
        width: 72,
        height: 72,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 22,
        transform: [{ rotate: '-4deg' }]
    },
    logoMark: {
        color: COLORS.surface,
        fontSize: 30,
        fontWeight: '900',
    },
    logo: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 4
    },
    headline: {
        marginTop: 26,
        color: COLORS.text,
        fontSize: 42,
        lineHeight: 48,
        fontWeight: '900',
        textAlign: 'center'
    },
    subtext: {
        marginTop: 18,
        maxWidth: 360,
        color: COLORS.textMuted,
        fontSize: 18,
        lineHeight: 25,
        textAlign: 'center'
    },
    button: {
        width: '100%',
        marginTop: 40,
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        borderBottomWidth: 5,
        borderBottomColor: COLORS.primaryPressed
    },
    buttonPressed: {
        transform: [{ translateY: 3 }],
        borderBottomWidth: 2
    },
    buttonText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 0.5 
    },
    note: {
        marginTop: 16,
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: '600'
    }
})