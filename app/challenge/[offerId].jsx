import { useLocalSearchParams, router } from "expo-router"
import { StyleSheet, Text, View, Image, Linking, Pressable, ScrollView, Platform } from "react-native"
import { ArrowLeft, CheckCircle2, Circle, ExternalLink, ChevronDown, ChevronUp, XCircle } from "lucide-react-native"
import { useEffect, useState } from "react"
import { COLORS } from "../../constants/theme"
import { formatReward, getUserOffer } from "../../services/B2BService"
import Spinner from "../../components/Spinner"
import { useChallengeStore } from "../../stores/challengeStore"
import { useUserStore } from "../../stores/userStore"
import { useScreenPadding } from "../../hooks/useScreenPadding"

export default function ChallengeScreen() {
  const contentPadding = useScreenPadding({ top: 24, bottom: 60 })
  const statePadding = useScreenPadding({ top: 24, bottom: 24 })
  const { offerId } = useLocalSearchParams()
  const [offer, setOffer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAllMilestones, setShowAllMilestones] = useState(false)

  const userId = useUserStore((state) => state.userId)

  const markChallengeLaunched = useChallengeStore((state) => state.markChallengeLaunched)
  const launchedChallenges = useChallengeStore((state) => state.launchedChallenges)
  const isLocallyLaunched = launchedChallenges.some((challenge) => challenge.id === offer?.id)

  const platform = Platform.OS === 'ios' ? 'ios' : 'android'

  useEffect(() => {
    let alive = true

    async function loadOffer() {
      try {
        setLoading(true)
        setError(null)

        if (!userId) return

        const result = await getUserOffer(userId, offerId, { platform, country: 'US'})

        if (alive) setOffer(result)

      } catch (err) {
        if (alive) {
          setError(err.message)
          setOffer(null)
        }
      } finally {
        if (alive) setLoading(false)
      }
    }

    loadOffer()

    return () => { alive = false }
  }, [offerId, userId])

  const handleChallengePress = async () => {
    if (!offer?.url) return

    if (offer.challengeStatus === 'available' && !isLocallyLaunched) {
      markChallengeLaunched(offer)
    }

    await Linking.openURL(offer.url)
  }

  if (loading) {
    return (
      <View style={[styles.stateScreen, statePadding]}>
        <Spinner />
      </View>
    )
  }

  if (error || !offer) {
    return (
      <View style={[styles.stateScreen, statePadding]}>
        <Text style={styles.stateTitle}>
          Couldn't load challenge
        </Text>

        <Text style={styles.stateText}>
          {error || 'Offer not found'}
        </Text>
        <Pressable style={styles.backTextButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Go back</Text>
        </Pressable>
      </View>
    )
  }

  const visibleGoals = showAllMilestones ? offer.goals : offer.goals.slice(0, 4)
  const hasMoreGoals = offer.goals.length > 4

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, contentPadding]}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={20} strokeWidth={2.4} color={COLORS.text} />
      </Pressable>

      {offer.largeImage ? (
        <Image source={{ uri: offer.largeImage }} style={styles.heroImage} />
      ) : offer.squareImage ? (
        <Image source={{ uri: offer.squareImage }} style={styles.heroImage} />
      ) : null}

      <View style={styles.header}>
        <Text style={styles.title}>
          {offer.title}
        </Text>

        <Text style={styles.reward}>
          Earn up to{' '}
          {formatReward(offer.currency, offer.amount)}
        </Text>

        {offer.tagline && (
          <Text style={styles.tagline}>
            {offer.tagline}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          MILESTONES
        </Text>

        <View style={styles.milestones}>
          {offer.goals.length === 0 ? (
            <View style={styles.emptyMilestones}>
              <Text style={styles.emptyMilestonesText}>
                No milestone details available.
              </Text>
            </View>
          ) : (
            <>
            {visibleGoals.map((goal, index) => (
              <MilestoneRow key={goal.id || index} goal={goal} />
            ))}

            {hasMoreGoals && (
              <Pressable onPress={() => setShowAllMilestones((current) => !current)}
                style={({ pressed }) => [
                  styles.showMoreButton,
                  pressed && styles.showMoreButtonPressed
                ]}
              >
                <Text style={styles.showMoreText}>
                  {showAllMilestones ? 'SHOW LESS' : `VIEW ALL ${offer.goals.length} MILESTONES`}
                </Text>

                {showAllMilestones ? (
                  <ChevronUp size={18} strokeWidth={2.5} color={COLORS.primary} />
                ) : (
                  <ChevronDown size={18} strokeWidth={2.5} color={COLORS.primary} />
                )}
              </Pressable>
            )}
            </>
          )}
        </View>
      </View>

      {/* {offer.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            ABOUT THIS CHALLENGE
          </Text>

          <Text style={styles.bodyText}>
            {stripHtml(offer.description)}
          </Text>
        </View>
      )}

      {offer.details && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            REQUIREMENTS
          </Text>

          <Text style={styles.bodyText}>
            {stripHtml(offer.details)}
          </Text>
        </View>
      )} */}

      <Pressable 
        disabled={offer.challengeStatus === 'completed'}
        onPress={handleChallengePress} 
        style={({ pressed }) => [
          styles.startButton,
          offer.challengeStatus === 'completed' && styles.startButtonCompleted,
          pressed && offer.challengeStatus !== 'completed' && styles.startButtonPressed
        ]}
      >
        <Text style={styles.startButtonText}>
          {offer.challengeStatus === 'completed'
            ? 'CHALLENGE COMPLETED'
            : offer.challengeStatus === 'active' || isLocallyLaunched
            ? 'CONTINUE CHALLENGE' : 'START CHALLENGE'}
        </Text>
        <ExternalLink size={20} strokeWidth={2.4} color={COLORS.surface} />
      </Pressable>
    </ScrollView>
  )
}

function MilestoneRow({ goal }) {
  return (
    <View style={[
      styles.milestoneRow,
      goal.completed && styles.milestoneCompleted,
      goal.failed && styles.milestoneFailed
    ]}>
      <View style={styles.milestoneIcon}>
        {goal.completed ? (
          <CheckCircle2 size={20} strokeWidth={2.2} color={COLORS.success} />
        ) : goal.failed ? (
          <XCircle size={20} strokeWidth={2.2} color={COLORS.error} />
        ) : (
          <Circle size={20} strokeWidth={2.2} color={COLORS.textMuted} />
        )}
      </View>

      <View style={styles.milestoneContent}>
        <Text style={[
          styles.milestoneText,
          goal.completed && styles.milestoneTextCompleted,
          goal.failed && styles.milestoneTextFailed
        ]}>
          {goal.text}
        </Text>
        {goal.daysLeft != null && !goal.completed && (
          <Text style={styles.milestoneMeta}>
            {goal.daysLeft} days left
          </Text>
        )}
      </View>

      <Text style={[
        styles.milestoneReward,
        goal.completed && styles.milestoneRewardCompleted
        ]}>
        {formatReward(goal.currency, goal.amount)}
      </Text>
    </View>
  )
}

function stripHtml(value = '') {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .trim()
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 60
  },
  stateScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: 24
  },
  stateTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '900'
  },
  stateText: {
    marginTop: 8,
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center'
  },
  backTextButton: {
    marginTop: 20,
    padding: 8
  },
  backText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800'
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 34,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  heroImage: {
    width: '100%',
    aspectRatio: 2,
    borderRadius: 22,
    backgroundColor: COLORS.surface
  },
  header: {
    marginTop: 24,
  },
  title: {
    color: COLORS.text,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900'
  },
  reward: {
    marginTop: 8,
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '900'
  },
  tagline: {
    marginTop: 12,
    color: COLORS.textMuted,
    fontSize: 16,
    lineHeight: 22
  },
  section: {
    marginTop: 36
  },
  sectionTitle: {
    marginBottom: 14,
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1
  },
  milestones: {
    gap: 10
  },
  milestoneRow: {
    minHeight: 74,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center'
  },
  milestoneIcon: {
    marginRight: 12
  },
  milestoneContent: {
    flex: 1
  },
  milestoneText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '800'
  },
  milestoneMeta: {
    marginTop: 4,
    color: COLORS.textMuted,
    fontSize: 12
  },
  milestoneReward: {
    marginLeft: 12,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '900'
  },
  emptyMilestones: {
    padding: 18,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 18,
    backgroundColor: COLORS.surface
  },
  emptyMilestonesText: {
    color: COLORS.textMuted,
    fontSize: 14
  },
  startButton: {
    minHeight: 60,
    marginTop: 36,
    paddingHorizontal: 20,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 5,
    borderBottomColor: COLORS.primaryPressed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9
  },
  startButtonPressed: {
    transform: [{ translateY: 3 }],
    borderBottomWidth: 2
  },
  startButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  showMoreButton: {
    minHeight: 50,
    marginTop: 2,
    paddingHorizontal: 16,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  showMoreButtonPressed: {
    transform: [{ translateY: 2 }]
  },
  showMoreText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  milestoneCompleted: {
    borderColor: COLORS.success
  },
  milestoneFailed: {
    borderColor: COLORS.error
  },
  milestoneTextCompleted: {
    color: COLORS.success
  },
  milestoneTextFailed: {
    color: COLORS.error
  },
  milestoneRewardCompleted: {
    color: COLORS.success
  },
  startButtonCompleted: {
    backgroundColor: COLORS.success,
    borderBottomColor: COLORS.success,
    opacity: 0.8
  },
  bodyText: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 22
  }
})