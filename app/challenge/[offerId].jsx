import { useLocalSearchParams, router } from "expo-router"
import { StyleSheet, Text, View, Image, Linking, Pressable, ScrollView } from "react-native"
import { ArrowLeft, CheckCircle2, Circle, ExternalLink, Milestone, ChevronDown, ChevronUp } from "lucide-react-native"
import { useEffect, useState } from "react"
import { COLORS } from "../../constants/theme"
import { formatReward, getOfferDetails } from "../../services/B2BService"
import Spinner from "../../components/Spinner"
import { useChallengeStore } from "../../stores/challengeStore"

export default function ChallengeScreen() {
  const { offerId } = useLocalSearchParams()
  const [offer, setOffer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAllMilestones, setShowAllMilestones] = useState(false)

  const startChallenge = useChallengeStore((state) => state.startChallenge)
  const activeChallenges = useChallengeStore((state) => state.activeChallenges)
  const isActive = activeChallenges.some((challenge) => challenge.id === offer?.id)

  useEffect(() => {
    let alive = true

    async function loadOffer() {
      try {
        setLoading(true)
        setError(null)

        const result = await getOfferDetails(offerId)

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
  }, [offerId])

  const handleStart = async () => {
    if (!offer?.url) return

    startChallenge(offer)

    await Linking.openURL(offer.url)
  }

  if (loading) {
    return (
      <View style={styles.stateScreen}>
        <Spinner />
      </View>
    )
  }

  if (error || !offer) {
    return (
      <View style={styles.stateScreen}>
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
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
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

      <Pressable onPress={handleStart} 
        style={({ pressed }) => [
          styles.startButton,
          pressed && styles.startButtonPressed
        ]}
      >
        <Text style={styles.startButtonText}>
          {isActive ? 'CONTINUE CHALLENGE' : 'START CHALLENGE'}
        </Text>
        <ExternalLink size={20} strokeWidth={2.4} color={COLORS.surface} />
      </Pressable>
    </ScrollView>
  )
}

function MilestoneRow({ goal }) {
  return (
    <View style={styles.milestoneRow}>
      <View style={styles.milestoneIcon}>
        <Circle size={20} strokeWidth={2.2} color={COLORS.textMuted} />
      </View>

      <View style={styles.milestoneContent}>
        <Text style={styles.milestoneText}>
          {goal.text}
        </Text>
        {goal.daysLeft != null && (
          <Text style={styles.milestoneMeta}>
            {goal.daysLeft} days left
          </Text>
        )}
      </View>

      <Text style={styles.milestoneReward}>
        {formatReward(goal.currency, goal.amount)}
      </Text>
    </View>
  )
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
  }
})