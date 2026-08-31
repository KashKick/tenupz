import { useEffect, useState } from "react"
import { Platform } from "react-native"
import { getRecommendedOffersForPlatform, getUserGames } from "../services/B2BService"
import { applyDevSimulation } from "../services/devChallengeSimulation"
import { useChallengeStore } from "../stores/challengeStore"

export function useUserGames(userId) {
    const [state, setState] = useState({
        available: [],
        inProgress: [],
        completed: [],
        loading: true,
        error: null
    })

    useEffect(() => {
        if (!userId) return

        let alive = true

        async function loadUserGames() {
            try {
                setState((current) => ({
                    ...current,
                    loading: true,
                    error: null
                }))

                const platform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web'
                const data = await getUserGames(userId, { platform, country: 'US' })

                let available = Array.isArray(data.available) ? data.available : []
                let inProgress = Array.isArray(data.inProgress) ? data.inProgress : []
                let completed = Array.isArray(data.completed) ? data.completed : []

                const simulated = applyDevSimulation({ available, inProgress, completed })
                available = simulated.available
                inProgress = simulated.inProgress
                completed = simulated.completed

                const confirmedIds = new Set([
                    ...inProgress.map((offer) => offer.id),
                    ...completed.map((offer) => offer.id)
                ])

                const { launchedChallenges, removeLaunchedChallenge } = useChallengeStore.getState()

                for (const challenge of launchedChallenges) {
                    if (confirmedIds.has(challenge.id)) {
                        removeLaunchedChallenge(challenge.id)
                    }
                }

                const pendingChallenges = launchedChallenges.filter((challenge) => !confirmedIds.has(challenge.id))
                .map((challenge) => ({
                    ...challenge,
                    challengeStatus: 'pending',
                    progressText: 'Waiting for tracking...'
                }))

                const pendingIds = new Set(
                    pendingChallenges.map(
                        (challenge) => challenge.id
                    )
                )

                const pendingTitles = new Set(
                    pendingChallenges.map(
                        (challenge) => challenge.title
                    )
                )

                available = available.filter(
                    (offer) =>
                        !pendingIds.has(offer.id) &&
                        !pendingTitles.has(offer.title)
                )

                const displayedInProgress = [
                    ...pendingChallenges,
                    ...inProgress
                ]
                
                const recommended = getRecommendedOffersForPlatform(available, platform)

                if (alive) {
                    setState({
                        available: recommended,
                        inProgress: displayedInProgress,
                        completed,
                        loading: false,
                        error: null
                    })
                }
            } catch (err) {
                if (alive) {
                    setState({
                        available: [],
                        inProgress: [],
                        completed: [],
                        loading: false,
                        error: err.message
                    })
                }
            }
        }

        loadUserGames()

        return () => { alive = false }
    }, [userId])

    return state
}