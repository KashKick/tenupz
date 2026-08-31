import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import storage from "./storage"

const CHALLENGE_STORE_VERSION = 1

const INITIAL_CHALLENGE_STATE = {
    launchedChallenges: []
}

export const useChallengeStore = create(
    persist(
        (set, get) => ({
            ...INITIAL_CHALLENGE_STATE,

            markChallengeLaunched: (offer) => {
                const existing = get().launchedChallenges.some(
                    (challenge) => challenge.id === offer.id
                )

                if (existing) return

                set((state) => ({
                    launchedChallenges: [
                        ...state.launchedChallenges,
                        {
                            id: offer.id,
                            title: offer.title,
                            image: offer.squareImage,
                            amount: offer.amount,
                            currency: offer.currency,
                            device: offer.device,
                            launchedAt: new Date().toISOString()
                        }
                    ]
                }))
            },

            removeLaunchedChallenge: (offerId) => {
                set((state) => ({
                    launchedChallenges:
                        state.launchedChallenges.filter(
                            (challenge) =>
                                challenge.id !== offerId
                        )
                }))
            },

            clearLaunchedChallenges: () => {
                set({
                    ...INITIAL_CHALLENGE_STATE
                })
            }
        }),
        {
            name: "tenupz-launched-challenges",
            storage: createJSONStorage(() => storage),
            version: CHALLENGE_STORE_VERSION,
            migrate: (persistedState, version) => {
                if (!persistedState) {
                    return {
                        ...INITIAL_CHALLENGE_STATE
                    }
                }

                return {
                    ...INITIAL_CHALLENGE_STATE,
                    ...persistedState
                }
            }
        }
    )
)