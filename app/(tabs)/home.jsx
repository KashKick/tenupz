import { router } from "expo-router"
import { Gamepad2, Play } from "lucide-react-native"
import { ScrollView, StyleSheet, View, Text, Pressable, Image } from "react-native"
import { COLORS } from "../../constants/theme"
import { CATEGORIES } from "../../constants/categories"
import { useUserStore } from "../../stores/userStore"
import { useUserGames } from "../../hooks/useUserGames"
import { useScreenPadding } from "../../hooks/useScreenPadding"
import { formatReward } from "../../services/B2BService"

export default function HomeScreen() {
    const contentPadding = useScreenPadding({ top: 32 })
    const favoriteCategories = useUserStore((state) => state.favoriteCategories)

    const personalizedCategories = favoriteCategories.length > 0 
    ? CATEGORIES.filter((category) => favoriteCategories.includes(category.id))
    : CATEGORIES

    const userId = useUserStore((state) => state.userId)
    const xp = useUserStore((state) => state.xp)
    const level = useUserStore((state) => state.level)
    const currentStreak = useUserStore((state) => state.currentStreak)
    const lastDailyPlayed = useUserStore((state) => state.lastDailyPlayed)

    const today = new Date().toLocaleDateString('en-CA')
    const dailyCompleted = lastDailyPlayed === today

    const { inProgress: activeChallenges, loading: challengesLoading } = useUserGames(userId)

    const activeChallenge = activeChallenges[0]

    const handleDailyTen = () => {
        router.push('/quiz/first-ten')
    }

    const handleCategory = (category) => {
        router.push(`/quiz/${category.id}`)
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={[styles.content, contentPadding]}>
            <View style={styles.header}>
                <Text style={styles.logo}>
                    TenUpz
                </Text>

                <View style={styles.userStats}>
                    <Text style={styles.statText}>
                        {currentStreak} Day{currentStreak === 1 ? '' : 's'} Streak
                    </Text>

                    <View style={styles.dot} />

                    <Text style={styles.statText}>
                        Level {level}
                    </Text>

                    <View style={styles.dot} />

                    <Text style={styles.statText}>
                        {xp.toLocaleString()} XP
                    </Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                    TODAY'S TEN
                </Text>

                <View style={styles.dailyCard}>
                    <View style={styles.dailyTop}>
                        <View style={styles.dailyBadge}>
                            <Text style={styles.dailyBadgeText}>
                                DAILY CHALLENGE
                            </Text>
                        </View>
                        <Text style={styles.dailyNumber}>
                            10
                        </Text>
                    </View>

                    <Text style={styles.dailyTitle}>
                        {dailyCompleted ? 'Today\'s Ten complete!' : 'Think you can go 10 for 10?'}
                    </Text>

                    <Text style={styles.dailyDescription}>
                        {dailyCompleted ? 'Come back tomorrow for another Ten.' : 'Today\'s questions are waiting.'}
                    </Text>

                    <View style={styles.dailyMeta}>
                        <Text style={styles.dailyMetaText}>
                            10 questions
                        </Text>

                        <View style={styles.dailyMetaDot} />

                        <Text style={styles.dailyMetaText}>
                            Earn XP
                        </Text>
                    </View>

                    {dailyCompleted ? (
                        <View style={styles.dailyCompleted}>
                            <Text style={styles.dailyCompletedText}>
                                COMPLETED TODAY
                            </Text>
                        </View>
                    ) : (
                        <Pressable onPress={handleDailyTen} style={({ pressed }) => [
                            styles.dailyButton,
                            pressed && styles.dailyButtonPressed,
                        ]}>
                            <Play size={20} fill={COLORS.primary} color={COLORS.primary} />
                            <Text style={styles.dailyButtonText}>
                                PLAY TODAY'S TEN
                            </Text>
                        </Pressable>
                    )}
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionLabel}>
                        PICK YOUR TEN
                    </Text>

                    <Pressable onPress={() => router.push('/play')}>
                        <Text style={styles.seeAll}>
                            See all
                        </Text>
                    </Pressable>
                </View>

                <View style={styles.categories}>
                    {personalizedCategories.map((category) => {
                        const Icon = category.icon

                        return (
                            <Pressable key={category.name} onPress={() => handleCategory(category)} style={({ pressed }) => [
                                styles.categoryCard,
                                pressed && styles.categoryCardPressed
                            ]}>
                                <View style={[ 
                                    styles.categoryIcon,
                                    {
                                        backgroundColor: `${category.color}18`
                                    }
                                ]}>
                                    <Icon size={25} strokeWidth={2.3} color={category.color} />
                                </View>

                                <Text style={styles.categoryName}>
                                    {category.name}
                                </Text>
                                <Text style={styles.categoryMeta}>
                                    10 questions
                                </Text>
                            </Pressable>
                        )
                    })}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                    ACTIVE CHALLENGE
                </Text>

                {challengesLoading ? (
                    <View style={styles.challengeCard}>
                        <Text style={styles.challengeText}>
                            Loading challenge...
                        </Text>
                    </View>
                ) : activeChallenge ? (
                    <Pressable onPress={() => router.push(`/challenge/${activeChallenge.id}`)} 
                        style={({ pressed }) => [
                            styles.challengeCard,
                            pressed && styles.challengeCardPressed
                        ]}>
                            {activeChallenge.squareImage ? (
                                <Image source={{ uri: activeChallenge.squareImage }} style={styles.challengeImage} />
                            ) : (
                                <View style={styles.challengeIcon}>
                                    <Gamepad2 size={25} strokeWidth={2.5} color={COLORS.primary} />
                                </View>
                            )}

                            <View style={styles.challengeContent}>
                                <Text style={styles.challengeTitle}>
                                    {activeChallenge.title}
                                </Text>

                                <Text style={styles.challengeText}>
                                    {activeChallenge.challengeStatus === 'pending'
                                        ? 'Waiting for tracking...'
                                        : `${activeChallenge.goals?.filter(
                                            (goal) => goal.completed
                                        ).length || 0} of ${
                                            activeChallenge.goals?.length || 0
                                        } milestones completed`}
                                </Text>

                                <Text style={styles.challengeReward}>
                                    Earn up to{' '}
                                    {formatReward(activeChallenge.currency, activeChallenge.amount)}
                                </Text>
                            </View>
                        </Pressable>
                ) : (
                    <View style={styles.challengeCard}>
                        <View style={styles.challengeIcon}>
                            <Gamepad2 size={25} strokeWidth={2.5} color={COLORS.primary} />
                        </View>
                        <View style={styles.challengeContent}>
                            <Text style={styles.challengeTitle}>
                                No active challenge yet
                            </Text>
                            <Text style={styles.challengeText}>
                                Start a challenge from Rewards and it'll show up here.
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        width: "100%",
        maxWidth: 720,
        alignSelf: 'center',
        padding: 24,
        paddingTop: 32,
        paddingBottom: 120,
    },
    header: {
        marginBottom: 32,
    },
    logo: {
        color: COLORS.text,
        fontSize: 28,
        fontWeight: "900",
        letterSpacing: 1,
    },
    userStats: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8
    },
    statText: {
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: '700'
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 999,
        backgroundColor: COLORS.border
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14
    },
    sectionLabel: {
        color: COLORS.text,
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 0.6,
        marginBottom: 14
    },
    seeAll: {
        color: COLORS.primary,
        fontSize: 13,
        fontWeight: '800'
    },
    dailyCard: {
        padding: 20,
        borderRadius: 18,
        backgroundColor: COLORS.primary
    },
    dailyTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    dailyBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: "rgba(255, 255, 255, 0.18)"
    },
    dailyBadgeText: {
        color: COLORS.surface,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5
    },
    dailyNumber: {
        color: "rgba(255, 255, 255, 0.18)",
        fontSize: 64,
        lineHeight: 64,
        fontWeight: '900'
    },
    dailyTitle: {
        maxWidth: 400,
        marginTop: 24,
        color: COLORS.surface,
        fontSize: 30,
        fontWeight: '900'
    },
    dailyDescription: {
        marginTop: 10,
        color: "rgba(255, 255, 255, 0.78)",
        fontSize: 16,
        lineHeight: 22
    },
    dailyMeta: {
        marginTop: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    dailyMetaText: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 14,
        fontWeight: '700'
    },
    dailyMetaDot: {
        width: 4,
        height: 4,
        borderRadius: 999,
        backgroundColor: "rgba(255, 255, 255, 0.45)"
    },
    dailyButton: {
        minHeight: 56,
        marginTop: 20,
        paddingHorizontal: 18,
        borderRadius: 16,
        backgroundColor: COLORS.surface,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    dailyButtonPressed: {
        transform: [{ translateY: 2 }],
        opacity: 0.92
    },
    dailyButtonText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 0.2
    },
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12
    },
    categoryCard: {
        width: '48%',
        minHeight: 142,
        padding: 16,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: 20,
        backgroundColor: COLORS.surface
    },
    categoryCardPressed: {
        transform: [{ translateY: 2}]
    },
    categoryIcon: {
        width: 46,
        height: 46,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18
    },
    categoryName: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '900'
    },
    categoryMeta: {
        marginTop: 5,
        color: COLORS.textMuted,
        fontSize: 13,
        fontWeight: '600'
    },
    challengeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 18,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: 18,
        backgroundColor: COLORS.surface
    },
    challengeIcon: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: '#EEEEFF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    challengeContent: {
        flex: 1,
    },
    challengeTitle: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '900'
    },
    challengeText: {
        marginTop: 4,
        color: COLORS.textMuted,
        fontSize: 14,
        lineHeight: 19
    },
    challengeImage: {
        width: 50,
        height: 50,
        borderRadius: 15
    },

    challengeReward: {
        marginTop: 6,
        color: COLORS.primary,
        fontSize: 13,
        fontWeight: "800"
    },

    challengeCardPressed: {
        transform: [{ translateY: 2 }]
    },
    dailyCompleted: {
        minHeight: 56,
        marginTop: 20,
        paddingHorizontal: 18,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        alignItems: 'center',
        justifyContent: 'center'
    },

    dailyCompletedText: {
        color: COLORS.surface,
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 0.4
    },
})