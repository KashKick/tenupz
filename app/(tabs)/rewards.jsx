import { StyleSheet, Text, View, ScrollView, Pressable, Image } from "react-native"
import { CheckCircle2, ChevronRight, Gift, Gamepad2 } from "lucide-react-native"
import { COLORS } from "../../constants/theme"
import { useOffers } from "../../hooks/useOffers"
import { formatReward } from "../../services/B2BService"

export default function RewardsScreen() {
  const activeChallenges = []
  const completedChallenges = []
  const { offers: recommendedOffers, loading, error } = useOffers()

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          REWARDS
        </Text>

        <Text style={styles.title}>
          Your challenges
        </Text>

        <Text style={styles.subtitle}>
          Track active challenges and discover a few rewards picked for you.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          ACTIVE
        </Text>

        {activeChallenges.length === 0 ? (
          <EmptyCard icon={Gamepad2} title="No active challenges" text="Start a challenge after completing a Ten and it'll show up here."/>
        ) : (
          activeChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          COMPLETED
        </Text>

        {completedChallenges.length === 0 ? (
          <EmptyCard icon={CheckCircle2} title="Nothing yet" text="placeholder" />
        ) : (
          completedChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} completed />
          ))
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>
            FOR YOU
          </Text>

          <Text style={styles.sectionHint}>
            Up to 5
          </Text>
        </View>

        {loading ? (
          <EmptyCard icon={Gift} title='Loading challenges...' text='Finding eligible rewards for you.' />
        ) : error ? (
          <EmptyCard icon={Gift} title="Couldn't load rewards" text={error} />
        ) : recommendedOffers.length === 0 ? (
        <EmptyCard icon={Gift} title="No recommendations yet" text="Eligible challenges will appear here when available." />
      ) : (
        recommendedOffers.slice(0, 5).map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))
      )}
      </View>
    </ScrollView>
  )
}

function EmptyCard({ icon: Icon, title, text }) {
  return (
    <View style={styles.emptyCard}>
      <View style={styles.emptyIcon}>
        <Icon size={24} strokeWidth={2.3} color={COLORS.primary} />
      </View>

      <View style={styles.emptyContent}>
        <Text style={styles.emptyTitle}>
          {title}
        </Text>
        <Text style={styles.emptyText}>
          {text}
        </Text>
      </View>
    </View>
  )
}

function ChallengeCard({ challenge, completed = false }) {
  return (
    <Pressable style={styles.challengeCard}>
      <View style={styles.challengeImage}>
        <Gamepad2 size={24} strokeWidth={2.3} color={COLORS.primary} />
      </View>

      <View style={styles.challengeContent}>
        <Text style={styles.challengeTitle}>
          {challenge.title}
        </Text>
        <Text style={styles.challengeMeta}>
          {challenge.progressText}
        </Text>
        <Text style={styles.challengeReward}>
          {completed ? `Earned ${challenge.reward}` : `Earn up to ${challenge.reward}`}
        </Text>
      </View>

      <ChevronRight size={20} strokeWidth={2.3} color={COLORS.textMuted} />
    </Pressable>
  )
}

function OfferCard({ offer }) {
  return (
    <Pressable style={styles.challengeCard}>
      {offer.squareImage ? (
        <Image source={{ uri: offer.squareImage }} style={styles.offerImage} />
      ) : (
        <View style={styles.challengeImage}>
          <Gift size={26} strokeWidth={2.4} color={COLORS.primary} />
        </View>
      )}

      <View style={styles.challengeContent}>
        <Text style={styles.challengeTitle}>
          {offer.title}
        </Text>
        <Text style={styles.challengeMeta}>
          {offer.tagline || offer.category}
        </Text>
        <Text style={styles.challengeReward}>
          Earn up to {formatReward(offer.currency, offer.amount)}
        </Text>
      </View>

      <ChevronRight size={20} strokeWidth={2.3} color={COLORS.textMuted} />
    </Pressable>
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
    paddingTop: 32,
    paddingBottom: 120
  },
  header: {
    marginBottom: 36
  },
  eyebrow: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8
  },
  title: {
    color: COLORS.text,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '900'
  },
  subtitle: {
    marginTop: 12,
    maxWidth: 480,
    color: COLORS.textMuted,
    fontSize: 16,
    lineHeight: 24
  },
  section: {
    marginBottom: 38
  },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  sectionTitle: {
    marginBottom: 14,
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  sectionHint: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700'
  },
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 18,
    backgroundColor: COLORS.surface
  },
  emptyIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#EEEEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  emptyContent: {
    flex: 1
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900'
  },
  emptyText: {
    marginTop: 4,
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 19
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    marginBottom: 12
  },
  challengeImage: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#EEEEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  challengeContent: {
    flex: 1
  },
  challengeTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900'
  },
  challengeMeta: {
    marginTop: 4,
    color: COLORS.textMuted,
    fontSize: 14
  },
  challengeReward: {
    marginTop: 6,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800'
  },
  offerImage: {
    width: 58,
    height: 58,
    borderRadius: 16,
    marginRight: 14
  }
})