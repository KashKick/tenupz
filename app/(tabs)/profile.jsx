import { StyleSheet, Text, View, ScrollView } from "react-native"
import { Award, Flame, Star, Target, Trophy, User } from 'lucide-react-native'
import { COLORS } from '../../constants/theme'
import { useUserStore } from "../../stores/userStore"

export default function ProfileScreen() {
  const xp = useUserStore((state) => state.xp)
  const level = useUserStore((state) => state.level)
  const currentStreak = useUserStore((state) => state.currentStreak)
  const longestStreak = useUserStore((state) => state.longestStreak)

  const questionsAnswered = useUserStore(
    (state) => state.questionsAnswered
  )

  const correctAnswers = useUserStore(
    (state) => state.correctAnswers
  )

  const tensCompleted = useUserStore(
    (state) => state.tensCompleted
  )

  const perfectTens = useUserStore(
    (state) => state.perfectTens
  )

  const rewardsEarned = useUserStore(
    (state) => state.rewardsEarned
  )

  const accuracy = questionsAnswered === 0 ? 0 : Math.round((correctAnswers / questionsAnswered) * 100)

  return (
    <ScrollView style={styles.scree} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User size={34} strokeWidth={2.4} color={COLORS.primary} />
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.username}>
            RB
          </Text>
          <Text style={styles.level}>
            Level {level}
          </Text>
        </View>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressTop}>
          <View>
            <Text style={styles.progressLabel}>
              TOTAL XP
            </Text>
            <Text style={styles.xp}>
              {xp.toLocaleString()} XP
            </Text>
          </View>

          <Star size={26} strokeWidth={2.4} color={COLORS.primary}/>
        </View>
      </View>

      <View style={styles.streakRow}>
        <View style={styles.streakCard}>
          <Flame size={24} strokeWidth={2.4} color={COLORS.coral} />
          <Text style={styles.streakLabel}>
            CURRENT STREAK
          </Text>
          <Text style={styles.streakValue}>
            {currentStreak}{" "}
            {currentStreak === 1 ? 'day' : 'days'}
          </Text>
        </View>

        <View style={styles.streakCard}>
          <Trophy size={26} strokeWidth={2.4} color={COLORS.warning} />
          <Text style={styles.streakLabel}>
            BEST STREAK
          </Text>
          <Text style={styles.streakValue}>
            {longestStreak}{" "}
            {longestStreak === 1 ? 'day' : 'days'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          STATS
        </Text>

        <View style={styles.statsGrid}>
          <StatCard label='Questions Answered' value={questionsAnswered} />
          <StatCard label='Correct' value={correctAnswers} />
          <StatCard label='Accuracy' value={`${accuracy}%`} />
          <StatCard label='Tens Completed' value={tensCompleted} />
          <StatCard label='Perfect 10s' value={perfectTens} />
          <StatCard label='Rewards Earned' value={rewardsEarned} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          ACHIEVEMENTS
        </Text>

        <View style={styles.achievements}>
          <AchievementCard icon={Trophy} title="Perfect Ten" description="Get all 10 questions right." unlocked={perfectTens > 0} />
          <AchievementCard icon={Flame} title="7-Day Streak" description="Completed the Daily Ten 7 days in a row" unlocked={longestStreak >= 7} />
          <AchievementCard icon={Target} title="100 Correct" description="Answer 100 questions correctly." unlocked={correctAnswers >= 100} />
          <AchievementCard icon={Award} title="Quiz Master" description="Complete 25 Tens" unlocked={tensCompleted >= 25} />
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({ label, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>
        {value}
      </Text>
      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  )
}

function AchievementCard({ icon: Icon, title, description, unlocked }) {
  return (
    <View style={[styles.achievementCard, !unlocked && styles.achievementLocked]}>
      <View style={styles.achievementIcon}>
        <Icon size={23} strokeWidth={2.4} color={unlocked ? COLORS.primary : COLORS.textMuted} />
      </View>

      <View style={styles.achievementContent}>
        <Text style={styles.achievementTitle}>
          {title}
        </Text>
        <Text style={styles.achievementDescription}>
          {description}
        </Text>
      </View>

      <Text style={[styles.achievementStatus, unlocked && styles.achievementStatusUnlocked]}>
        {unlocked ? 'UNLOCKED' : 'LOCKED'}
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
    paddingTop: 32,
    paddingBottom: 120
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  headerContent: {
    flex: 1
  },
  username: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '900'
  },
  level: {
    marginTop: 4,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800'
  },
  progressCard: {
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 20,
    backgroundColor: COLORS.surface
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  progressLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8
  },
  xp: {
    marginTop: 5,
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '900'
  },
  streakRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12
  },
  streakCard: {
    flex: 1,
    minHeight: 130,
    padding: 18,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 20,
    backgroundColor: COLORS.surface
  },
  streakLabel: {
    marginTop: 16,
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.7
  },
  streakValue: {
    marginTop: 5,
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '900'
  },
  section: {
    marginTop: 36
  },
  sectionTitle: {
    marginBottom: 14,
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  statCard: {
    width: '48%',
    minHeight: 110,
    padding: 18,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 20,
    backgroundColor: COLORS.surface
  },
  statValue: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '900'
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '700'
  },
  achievements: {
    gap: 12
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 18,
    backgroundColor: COLORS.surface
  },
  achievementLocked: {
    opacity: 0.55
  },
  achievementIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#EEEEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  achievementContent: {
    flex: 1
  },
  achievementTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '900'
  },
  achievementDescription: {
    marginTop: 4,
    color: COLORS.textMuted,
    fontSize: 12,
  },
  achievementStatus: {
    marginLeft: 10,
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.6
  },
  achievementStatusUnlocked: {
    color: COLORS.primary
  }
});