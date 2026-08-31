import { router } from "expo-router"
import { Check, ArrowRight } from 'lucide-react-native'
import { useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { COLORS } from "../../constants/theme"
import { CATEGORIES } from "../../constants/categories"
import { useUserStore } from "../../stores/userStore"
import { useScreenPadding } from "../../hooks/useScreenPadding"

export default function CategoriesOnboardingScreen() {
    const contentPadding = useScreenPadding({ top: 48, bottom: 48 })
    const [selectedCategories, setSelectedCategories] = useState([])

    const toggleCategory = (categoryId) => {
        setSelectedCategories((current) => {
            if (current.includes(categoryId)) {
                return current.filter((item) => item !== categoryId)
            }

            return [...current, categoryId]
        })
    }

    const setFavoriteCategories = useUserStore((state) => state.setFavoriteCategories)

    const handleContinue = () => {
        setFavoriteCategories(selectedCategories)
        router.replace('/home')
    }


    return (
        <ScrollView style={styles.screen} contentContainerStyle={[styles.content, contentPadding]}>
            <View style={styles.header}>
                <Text style={styles.eyebrow}>
                    MAKE IT YOURS
                </Text>

                <Text style={styles.title}>
                    What are you into?
                </Text>

                <Text style={styles.subtitle}>
                    Pick a few favorites so we can personalize your Tens.
                </Text>
            </View>

            <View style={styles.grid}>
                {CATEGORIES.map((category) => {
                    const selected =
                        selectedCategories.includes(category.id);

                    const Icon = category.icon;

                    return (
                        <Pressable
                            key={category.id}
                            onPress={() => toggleCategory(category.id)}
                            style={({ pressed }) => [
                                styles.categoryCard,
                                selected && styles.categoryCardSelected,
                                pressed && styles.categoryCardPressed,
                            ]}
                        >
                            <View
                                style={[
                                    styles.categoryIcon,
                                    selected && styles.categoryIconSelected,
                                ]}
                            >
                                <Icon
                                    size={21}
                                    strokeWidth={2.4}
                                    color={
                                        selected
                                            ? COLORS.surface
                                            : category.color
                                    }
                                />
                            </View>

                            <Text
                                style={[
                                    styles.categoryText,
                                    selected && styles.categoryTextSelected,
                                ]}
                            >
                                {category.name}
                            </Text>

                            {selected && (
                                <View style={styles.check}>
                                    <Check
                                        size={15}
                                        strokeWidth={3}
                                        color={COLORS.surface}
                                    />
                                </View>
                            )}
                        </Pressable>
                    );
                })}
            </View>

            <View style={styles.footer}>
                <Text style={styles.selectionCount}>
                    {selectedCategories.length === 0 ? 'Choose at least one' : `${selectedCategories.length} selected`}
                </Text>

                <Pressable disabled={selectedCategories.length === 0} onPress={handleContinue} style={({ pressed }) => [
                    styles.continueButton,
                    selectedCategories.length === 0 &&
                    styles.continueButtonDisabled,
                    pressed && selectedCategories.length > 0 && styles.continueButtonPressed
                ]}>
                    <Text style={styles.continueButtonText}>CONTINUE</Text>
                    <ArrowRight size={20} strokeWidth={2.7} color={COLORS.surface} />
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
        width: '100%',
        maxWidth: 640,
        alignSelf: 'center',
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 48
    },
    header: {
        marginBottom: 32
    },
    eyebrow: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 0.2,
        marginBottom: 8
    },
    title: {
        color: COLORS.text,
        fontSize: 38,
        lineHeight: 44,
        fontWeight: '900'
    },
    subtitle: {
        marginTop: 12,
        maxWidth: 440,
        color: COLORS.textMuted,
        fontSize: 16,
        lineHeight: 24
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12
    },
    categoryCard: {
        width: '48%',
        minHeight: 76,
        paddingHorizontal: 16,
        paddingVertical: 18,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: 16,
        backgroundColor: COLORS.surface,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    categoryCardSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary
    },
    categoryCardPressed: {
        transform: [{ translateY: 2 }]
    },
    categoryText: {
        flex: 1,
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '800'
    },
    categoryTextSelected: {
        color: COLORS.surface
    },
    categoryIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },

    categoryIconSelected: {
        backgroundColor: "rgba(255,255,255,0.16)",
    },
    check: {
        width: 26,
        height: 26,
        marginLeft: 8,
        borderRadius: 999,
        backgroundColor: COLORS.primaryPressed,
        alignItems: 'center',
        justifyContent: 'center'
    },
    footer: {
        marginTop: 36
    },
    selectionCount: {
        marginBottom: 21,
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center'
    },
    continueButton: {
        minHeight: 60,
        paddingHorizontal: 20,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        borderBottomWidth: 5,
        borderBottomColor: COLORS.primaryPressed,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    continueButtonText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 0.6
    },
    continueButtonDisabled:{
        opacity: 0.4
    },
    continueButtonPressed: {
        transform: [{ translateY: 3}],
        borderBottomWidth: 2
    }
})