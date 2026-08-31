import * as Crypto from "expo-crypto"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import Storage from "./storage"

const USER_STORE_VERSION = 1

const INITIAL_USER_STATE = {
    userId: null,
    xp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    lastDailyPlayed: null,
    favoriteCategories: [],
    questionsAnswered: 0,
    correctAnswers: 0,
    tensCompleted: 0,
    perfectTens: 0,
    rewardsEarned: 0,
    completedAttemptIds: []
}

const getLevelFromXp = (xp) => {
    return Math.floor(xp / 1000) + 1
}

const getLocalDataString = (date = new Date()) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

const getYesterdayDateString = () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    return getLocalDataString(yesterday)
}

export const useUserStore = create(
    persist(
        (set, get) => ({
            ...INITIAL_USER_STATE,

            ensureUserId: () => {
              const currentUserId = get().userId
              
              if (currentUserId) return currentUserId

              const newUserId = Crypto.randomUUID()

              set({
                userId: newUserId
              })

              return newUserId
            },

            addQuizResult: ({
                attemptId,
                score,
                xpEarned,
                isDaily = false,
            }) => {
                set((state) => {
                    if (state.completedAttemptIds.includes(attemptId)) {
                        return state
                    }

                    let newXp = state.xp + xpEarned
                    let newStreak = isDaily ? state.currentStreak + 1 : state.currentStreak
                    let newLongestStreak = state.longestStreak
                    let newLastDailyPlayed = state.lastDailyPlayed

                    if (isDaily) {
                        const today = getLocalDataString()
                        const yesterday = getYesterdayDateString()

                        if ( state.lastDailyPlayed === today) {
                            newStreak = state.currentStreak
                        }
                        else if (state.lastDailyPlayed === yesterday) {
                            newStreak = state.currentStreak + 1
                        }
                        else {
                            newStreak = 1
                        }

                        newLongestStreak = Math.max(
                            state.longestStreak,
                            newStreak
                        )

                        newLastDailyPlayed = today
                    }


                    return {
                        xp: newXp,
                        level: getLevelFromXp(newXp),
                        questionsAnswered: state.questionsAnswered + 10,
                        correctAnswers: state.correctAnswers + score,
                        tensCompleted: state.tensCompleted + 1,
                        perfectTens: state.perfectTens + (score === 10 ? 1 : 0),
                        currentStreak: newStreak,
                        longestStreak: newLongestStreak,
                        lastDailyPlayed: newLastDailyPlayed,
                        completedAttemptIds: [...state.completedAttemptIds, attemptId]
                    }
                })
            },

            setFavoriteCategories: (categories) => {
                set({
                    favoriteCategories: categories
                })
            },

            addReward: (amount) => {
                set((state) => ({
                    rewardsEarned: state.rewardsEarned + amount
                }))
            },

            resetUser: () => {
                set({
                    ...INITIAL_USER_STATE
                })
            }
        }),
        {
            name: 'tenupz-user',
            storage: createJSONStorage(() => Storage),
            version: USER_STORE_VERSION,
            migrate: (persistedState, version) => {
                if (!persistedState) {
                    return {
                        ...INITIAL_USER_STATE
                    }
                }

                return {
                    ...INITIAL_USER_STATE,
                    ...persistedState
                }
            }
        }
    )
)