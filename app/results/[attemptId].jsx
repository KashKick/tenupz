import { useLocalSearchParams, router } from "expo-router"
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native"
import { ArrowRight, Flame, Share2, Trophy } from "lucide-react-native"
import { COLORS } from "../../constants/theme"
import { useUserStore } from "../../stores/userStore"
import { useEffect } from "react"


export default function ResultsScreen() {
  const { score, xp, quizId, attemptId } = useLocalSearchParams()
  const numericScore = Number(score || 0)
  const numericXp = Number(xp || 0)

  const isPerfect = numericScore === 10
  const isFirsTen = quizId === 'first-ten'

  const addQuizResult = useUserStore((state) => state.addQuizResult)

  useEffect(() => {
    addQuizResult({
        attemptId,
        score: numericScore,
        xpEarned: numericXp,
        isDaily: isFirsTen,
    })
  }, [])

  const getMessage = () => {
    if (numericScore === 10) {
        return 'PERFECT TEN!'
    }

    if (numericScore >= 8) {
        return 'NICE WORK!'
    }

    if (numericScore >= 6) {
        return 'SOLID TEN!'
    }

    return 'KEEP GOING!'
  }

  const getSubtext = () => {
    if (numericScore === 10) {
        return 'You absolutely crushed it.'
    }

    if (numericScore >= 8) {
        return 'That was a strong ten.'
    }

    if (numericScore >= 6) {
        return 'Not bad. Ready for another?.'
    }

    return 'Every Ten makes you sharper.'
  }

  const handleContinue = () => {
    if (isFirsTen) {
        router.push('/onboarding/categories')
        return
    }

    router.replace('/home')
  }

  const handleShare = () => {
    console.log('Share score')
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.result}>
            <View style={styles.trophy}>
                <Trophy size={36} strokeWidth={2.5} color={COLORS.primary} />
            </View>

            <Text style={styles.score}>
                {numericScore}
                <Text style={styles.scoreTotal}>/10</Text>
            </Text>

            <Text style={styles.message}>
                {getMessage()}
            </Text>

            <Text style={styles.subtext}>
                {getSubtext()}
            </Text>
        </View>

        <View style={styles.stats}>
            <View style={styles.statCard}>
                <Text style={styles.statLabel}>
                    XP EARNED
                </Text>

                <Text style={styles.xpValue}>
                    +{numericXp}
                </Text>
            </View>

            <View style={styles.statCard}>
                <View style={styles.statIconLabel}>
                    <Flame size={17} strokeWidth={2.5} color={COLORS.coral} />
                    <Text style={styles.statLabel}>STREAK</Text>
                </View>
                <Text style={styles.statValue}>
                    1 day
                </Text>
            </View>
        </View>

        {isPerfect && (
            <View style={styles.achievement}>
                <View style={styles.achievementIcon}>
                    <Trophy size={24} strokeWidth={2.5} color={COLORS.warning} />
                </View>
                <View style={styles.achievementContent}>
                    <Text style={styles.achievementEyebrow}>
                        ACHIEVEMENT UNLOCKED
                    </Text>
                    <Text style={styles.achievementTitle}>
                        Perfect Ten
                    </Text>
                    <Text style={styles.achievementText}>
                        Get all 10 questions right in a single Ten.
                    </Text>
                </View>
            </View>
        )}

        <View style={styles.actions}>
            <Pressable onPress={handleContinue} style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed
            ]}>
                <Text style={styles.primaryButtonText}>
                    {isFirsTen ? 'CONTINUE' : 'PLAY ANOTHER'}
                </Text>

                <ArrowRight size={20} strokeWidth={2.7} color={COLORS.surface} />
            </Pressable>

            <Pressable onPress={handleShare} style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed
            ]}>
                <Share2 size={20} strokeWidth={2.7} color={COLORS.text} />
                <Text style={styles.secondaryButtonText}>
                    SHARE SCORE
                </Text>
            </Pressable>
        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    content: {
        flexGrow: 1,
        width: '100%',
        maxWidth: 520,
        alignSelf: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 48
    },
    result: {
        alignItems: 'center'
    },
    trophy: {
        width: 72,
        height: 72,
        borderRadius: 22,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 22
    },
    score: {
        color: COLORS.text,
        fontSize: 76,
        lineHeight: 62,
        fontWeight: '900',
        letterSpacing: -3
    },
    scoreTotal: {
        color: COLORS.textMuted,
        fontSize: 38,
        fontWeight: '800'
    },
    message: {
        marginTop: 10,
        color: COLORS.text,
        fontSize: 24,
        fontWeight: '900',
        textAlign: 'center'
    },
    subtext: {
        marginTop: 8,
        color: COLORS.textMuted,
        fontSize: 16,
        lineHeight: 23,
        textAlign: 'center'
    },
    stats: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 36
    },
    statCard: {
        flex: 1,
        minHeight: 110,
        padding: 18,
        borderRadius: 18,
        backgroundColor: COLORS.surface,
        justifyContent: 'space-between'
    },
    statIconLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    statLabel: {
        color: COLORS.textMuted,
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 0.7
    },
    xpValue: {
        color: COLORS.primary,
        fontSize: 28,
        fontWeightL: '900'
    },
    statValue: {
        color: COLORS.text,
        fontSize: 28,
        fontWeight: '900'
    },
    achievement: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginTop: 16,
        padding: 18,
        borderWidth: 2,
        borderColor: COLORS.warning,
        borderRadius: 18,
        backgroundColor: COLORS.surface
    },
    achievementContent: {
        flex: 1,
    },
    achievementEyebrow: {
        color: COLORS.warning,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.8,
    },
    achievementText: {
        marginTop: 3,
        color: COLORS.textMuted,
        fontSize: 14,
        lineHeight: 18
    },
    actions: {
        marginTop: 32,
        gap: 14,
    },
    primaryButton: {
        minHeight: 60,
        paddingHorizontal: 20,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        borderBottomWidth: 5,
        borderBottomColor: COLORS.primaryPressed,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    primaryButtonPressed: {
        transform: [{ translateY: 3 }],
        borderBottomWidth: 2
    },
    primaryButtonText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 0.6
    },
    secondaryButton: {
        minHeight: 60,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: 18,
        backgroundColor: COLORS.surface,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    secondaryButtonPressed: {
        transform: [{ translateY: 2 }]
    },
    secondaryButtonText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 0.1
    },
})