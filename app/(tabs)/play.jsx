import { router } from "expo-router"
import { ArrowRight, Sparkles } from "lucide-react-native"
import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native"
import { COLORS } from "../../constants/theme"
import { CATEGORIES } from "../../constants/categories"
import { useScreenPadding } from "../../hooks/useScreenPadding"
import { useUserStore } from "../../stores/userStore"

export default function PlayScreen() {
    const contentPadding = useScreenPadding({ top: 32 })

    const handleCategory = (category) => {
        router.push(`/quiz/${category.id}`)
    }

    const favoriteCategories = useUserStore((state) => state.favoriteCategories)
    const recommendedCategories = favoriteCategories.length > 0 
    ? CATEGORIES.filter((category) => favoriteCategories.includes(category.id)).slice(0, 3)
    : CATEGORIES.slice(0, 3)

    return (
        <ScrollView style={styles.screen} contentContainerStyle={[styles.content, contentPadding]}>
            <View style={styles.header}>
                <Text style={styles.eyebrow}>
                    PLAY
                </Text>

                <Text style={styles.title}>
                    Pick your next Ten
                </Text>

                <Text style={styles.subtitle}>
                    Every quiz is 10 questions. Choose a category and see how you do.
                </Text>
            </View>
            
            <View style={styles.section}>
                <View style={styles.sectionTitleRow}>
                    <View style={styles.sectionTitleLeft}>
                        <Sparkles size={18} strokeWidth={2.4} color={COLORS.primary} />
                        <Text style={styles.sectionTitle}>
                            FOR YOU
                        </Text>
                    </View>
                </View>

                <View style={styles.recommendedList}>
                    {recommendedCategories.map((category) => {
                        const Icon = category.icon

                        return (
                            <Pressable key={category.id} onPress={() => handleCategory(category)} style={({ pressed }) => [
                                styles.recommendedCard,
                                pressed && styles.cardPressed
                            ]}>
                                <View style={[
                                    styles.recommendedIcon,
                                    {
                                        backgroundColor: `${category.color}18`
                                    }
                                ]}>
                                    <Icon size={26} strokeWidth={2.8} color={category.color} />
                                </View>

                                <View style={styles.recommendedContent}>
                                    <Text style={styles.recommendedName}>
                                        {category.name}
                                    </Text>

                                    <Text style={styles.recommendedMeta}>
                                        10 questions
                                    </Text>
                                </View>

                                <ArrowRight size={20} strokeWidth={2.4} color={COLORS.textMuted} />
                            </Pressable>
                        )
                    })}
                </View>
            </View>

            <View style={[styles.section, styles.categoriesSection]}>
                <Text style={styles.categoriesTitle}>
                    CATEGORIES
                </Text>

                <View style={styles.grid}>
                    {CATEGORIES.map((category) => {
                        const Icon = category.icon

                        return (
                            <Pressable key={category.id} onPress={() => handleCategory(category)} style={({ pressed }) => [
                                styles.categoryCard,
                                pressed && styles.cardPressed
                            ]}>
                                <View style={[
                                    styles.categoryIcon,
                                    {
                                        backgroundColor: `${category.color}18`
                                    }
                                ]}>
                                    <Icon size={26} strokeWidth={2.4} color={category.color} />
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
        </ScrollView>
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
        maxWidth: 460,
        color: COLORS.textMuted,
        fontSize: 16,
        lineHeight: 24
    },
    section: {
        marginBottom: 16
    },
    categoriesSection: {
        marginTop: 2
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14
    },
    sectionTitleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    sectionTitle: {
        color: COLORS.text,
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 0.8,
    },
    categoriesTitle: {
        color: COLORS.text,
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 0.8,
        marginBottom: 16
    },
    recommendedList: {
        gap: 12
    },
    recommendedCard: {
        minHeight: 82,
        padding: 16,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: 18,
        backgroundColor: COLORS.surface,
        flexDirection: 'row',
        alignItems: 'center'
    },
    recommendedIcon: {
        width: 50,
        height: 50,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14
    },
    recommendedContent: {
        flex: 1
    },
    recommendedName: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '900'
    },
    recommendedMeta: {
        marginTop: 4,
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: '600'
    },
    grid: {
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
        fontSize: 14,
        fontWeight: '900'
    },
    categoryMeta: {
        marginTop: 5,
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: '600'
    },
    cardPressed: {
        transform: [{ translateY: 2 }]
    }
})