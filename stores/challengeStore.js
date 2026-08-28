import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import storage from "./storage"

export const useChallengeStore = create(
    persist(
        (set, get) => ({
            activeChallenges: [],
            completedChallenges: [],

            startChallenge: (offer) => {
                const existing = get().activeChallenges.some(
                    (challenge) => challenge.id === offer.id
                )

                if (existing) return

                const challenge = {
                    id: offer.id,
                    title: offer.title,
                    image: offer.squareImage,
                    reward: offer.amount,
                    currency: offer.currency,
                    device: offer.device,
                    startedAt: new Date().toISOString(),
                    status: 'active'
                }

                set((state) => ({
                    activeChallenges: [
                        ...state.activeChallenges,
                        challenge
                    ]
                }))
            }
        }),
        {
            name: 'tenupz-challenges',
            storage: createJSONStorage(() => storage)
        }
    )
)