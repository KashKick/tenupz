import { useLocalSearchParams, router } from "expo-router";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { Check, X } from 'lucide-react-native'
import { useState } from 'react'
import { COLORS } from "../../constants/theme";
import { FIRST_TEN_QUESTIONS } from "../../mocks/questions";
import { CATEGORY_QUESTIONS } from "../../mocks/categoryQuestions";
import { useScreenPadding } from "../../hooks/useScreenPadding";

const XP_VALUES = {
    easy: 25,
    medium: 40,
    hard: 60,
}

export default function QuizScreen() {
    const contentPadding = useScreenPadding({ top: 32, bottom: 48 })
    const { quizId } = useLocalSearchParams()

    const [questionIndex, setQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [score, setScore] = useState(0)
    const [xpEarned, setXpEarned] = useState(0)

    const questions = quizId === 'first-ten' ? FIRST_TEN_QUESTIONS : CATEGORY_QUESTIONS[quizId] || FIRST_TEN_QUESTIONS
    const question = questions[questionIndex]

    const hasAnswered = selectedAnswer !== null
    const isCorrect = selectedAnswer === question.correctAnswer

    const progress = ((questionIndex + 1) / questions.length) * 100
    const handleAnswer = (answerId) => {
        if (hasAnswered) return

        setSelectedAnswer(answerId)
        if (answerId === question.correctAnswer) {
            setScore((currentScore) => currentScore + 1)

            setXpEarned((currentXp) => currentXp + XP_VALUES[question.difficulty])
        }
    }

    const handleNext = () => {
        const isLastQuestion = questionIndex === questions.length - 1

        if (isLastQuestion) {
            const attemptId = `${quizId}-${Date.now()}`
            const finalScore = score
            const completionXp = 50
            const perfectBonus = finalScore === 10 ? 100 : 0
            const finalXp = xpEarned + completionXp + perfectBonus

            router.replace({
                pathname: `/results/${attemptId}`,
                params: {
                    score: String(finalScore),
                    xp: String(finalXp),
                    quizId
                }
            })

            return
        }

        setQuestionIndex((current) => current + 1)
        setSelectedAnswer(null)
    }

    const getAnswerStyle = (answerId) => {
        if (!hasAnswered) {
            return styles.answer
        }

        if (answerId === question.correctAnswer) {
            return [
                styles.answer,
                styles.answerCorrect
            ]
        }

        if (answerId === selectedAnswer) {
            return [
                styles.answer,
                styles.answerIncorrect
            ]
        }

        return [
            styles.answer,
            styles.answerDisabled
        ]
    }

    const getAnswerTextStyle = (answerId) => {
        if (
            hasAnswered && answerId === question.correctAnswer
        ) {
            return [
                styles.answerText,
                styles.answerTextCorrect
            ]
        }

        if (
            hasAnswered && answerId === selectedAnswer && answerId !== question.correctAnswer
        ) {
            return [
                styles.answerText,
                styles.answerTextIncorrect
            ]
        }

        return styles.answerText
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={[styles.content, contentPadding]}>
            <View style={styles.top}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressText}>
                        {questionIndex + 1} / {questions.length}
                    </Text>

                    <Text style={styles.xp}>
                        {xpEarned} XP
                    </Text>
                </View>

                <View style={styles.progressTrack}>
                    <View style={[ styles.progressFill, {width: `${progress}%`}]} />
                </View>
            </View>

            <View style={styles.questionSection}>
                <Text style={styles.category}>
                    {question.category.toUpperCase()}
                </Text>

                <Text style={styles.question}>
                    {question.question}
                </Text>
            </View>

            <View style={styles.answers}>
                {question.answers.map((answer) => {
                    const showCorrect = hasAnswered && answer.id === question.correctAnswer
                    const showIncorrect = hasAnswered && answer.id === selectedAnswer && answer.id !== question.correctAnswer

                    return (
                        <Pressable key={answer.id} disabled={hasAnswered} onPress={() => handleAnswer(answer.id)} style={({ pressed }) => [
                            getAnswerStyle(answer.id),
                            pressed && !hasAnswered && styles.answerPressed
                        ]}>
                            <Text style={getAnswerTextStyle(answer.id)}>
                                {answer.text}
                            </Text>

                            {showCorrect && (
                                <View style={styles.answerIcon}>
                                    <Check size={20} strokeWidth={3} color={COLORS.success} />
                                </View>
                            )}

                            {showIncorrect && (
                                <View style={styles.answerIcon}>
                                    <X size={20} strokeWidth={3} color={COLORS.error} />
                                </View>
                            )}
                        </Pressable>
                    )
                })}
            </View>

            {hasAnswered && (
                <View style={[styles.feedback, isCorrect ? styles.feedbackCorrect : styles.feedbackIncorrect]}>
                    <Text style={styles.feedbackTitle}>
                        {isCorrect ? "Nice!" : "Not quite!"}
                    </Text>

                    <Text style={styles.explanation}>
                        {question.explanation}
                    </Text>
                </View>
            )}

            {hasAnswered && (
                <Pressable onPress={handleNext} style={({ pressed }) => [
                    styles.nextButton,
                    pressed && styles.nextButtonPressed,
                ]}>
                    <Text style={styles.nextButtonText}>
                        {questionIndex === questions.length - 1 ? "SEE RESULTS" : "NEXT"}
                    </Text>
                </Pressable>
            )}
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
        paddingTop: 32,
        paddingBottom: 48
    },
    top: {
        marginBottom: 48,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12
    },
    progressText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '800'
    },
    xp: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '800'
    },
    progressTrack: {
        width: '100%',
        height: 10,
        borderRadius: 999,
        backgroundColor: COLORS.border,
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        borderRadius: 999,
        backgroundColor: COLORS.primary
    },
    questionSection: {
        marginBottom: 32
    },
    category: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 0.5,
        marginBottom: 12
    },
    question: {
        color: COLORS.text,
        fontSize: 30,
        lineHeight: 38,
        fontWeight: '900'
    },
    answers: {
        gap: 14
    },
    answer: {
        minHeight: 66,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: 16,
        backgroundColor: COLORS.surface,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    answerPressed: {
        transform: [{ translateY: 2 }]
    },
    answerCorrect: {
        borderColor: COLORS.success
    },
    answerIncorrect: {
        borderColor: COLORS.error
    },
    answerDisabled: {
        opacity: 0.55
    },
    answerText: {
        flex: 1,
        color: COLORS.text,
        fontSize: 18,
        fontWeight: '700'
    },
    answerTextCorrect: {
        color: COLORS.success
    },
    answerTextIncorrect: {
        color: COLORS.error
    },
    answerIcon: {
        marginLeft: 12
    },
    feedback: {
        marginTop: 24,
        padding: 18,
        borderRadius: 16
    },
    feedbackCorrect: {
        backgroundColor: '#E8F6EE'
    },
    feedbackIncorrect: {
        backgroundColor: '#FBECEB'
    },
    feedbackTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 6
    },
    explanation: {
        color: COLORS.text,
        fontSize: 16,
        lineHeight: 22
    },
    nextButton: {
        marginTop: 24,
        paddingVertical: 18,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        borderBottomWidth: 5,
        borderBottomColor: COLORS.primaryPressed
    },
    nextButtonPressed: {
        transform: [{ translateY: 3 }],
        borderBottomWidth: 2
    },
    nextButtonText: {
        color: COLORS.surface,
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1
    }
})