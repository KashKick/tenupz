import { useEffect, useState, useCallback, useRef } from "react"
import { Platform, AppState } from "react-native"
import { getRecommendedOffersForPlatform, getUserGames } from "../services/B2BService"
import { applyDevSimulation } from "../services/devChallengeSimulation"
import { useChallengeStore } from "../stores/challengeStore"

export function useUserGames(userId) {
    const [state, setState] = useState({
        available: [],
        inProgress: [],
        completed: [],
        balance: 0,
        currency: '$',
        loading: true,
        refreshing: false,
        error: null
    })

    const appState = useRef(AppState.currentState)
    const mountedRef = useRef(true)

    useEffect(() => {
        mountedRef.current = true

        return () => {
            mountedRef.current = false
        }
    }, [])

    const loadUserGames= useCallback(
        async ({ force = false} = {}) => {
            if (!userId) return

            if (!force) {
                setState((current) => ({
                    ...current,
                    loading: true,
                    refreshing: false,
                    error: null
                }))
            } else {
                setState((current) => ({
                    ...current,
                    refreshing: true,
                    error: null
                }))
            }

            try {
                const platform = Platform.OS === 'ios' ? 'ios' : 'android'

                const data = await getUserGames(userId, { platform, country: 'US', force })

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

                const { launchedChallenges, removeLaunchedChallenge} = useChallengeStore.getState()

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

                const pendingIds = new Set(pendingChallenges.map((challenge) => challenge.id))

                const pendingTitles = new Set(pendingChallenges.map((challenge) => challenge.title))

                available = available.filter((offer) => !pendingIds.has(offer.id) && !pendingTitles.has(offer.title))

                const displayedInProgress = [
                    ...pendingChallenges,
                    ...inProgress
                ]

                const recommended = getRecommendedOffersForPlatform(available, platform)

                if (!mountedRef.current) return

                setState({
                    available: recommended,
                    inProgress: displayedInProgress,
                    completed,
                    balance: Number(data.balance || 0),
                    currency: data.currency || '$',
                    loading: false,
                    refreshing: false,
                    error: null,
                })
            } catch (err) {
                if (!mountedRef.current) return
                
                setState((current) => ({
                    ...current,
                    loading: false,
                    refreshing: false,
                    error: err.message
                }))
            }
        }, [userId]
    )

        useEffect(() => {
            if (!userId) {
                setState({
                    available: [],
                    inProgress: [],
                    completed: [],
                    balance: 0,
                    currency: '$',
                    loading: false,
                    refreshing: false,
                    error: null
                })

                return
            }

            loadUserGames()
        }, [userId, loadUserGames])

        useEffect(() => {
            const subscription = AppState.addEventListener(
                'change',
                (nextState) => {
                    const wasAway = appState.current === 'background'

                    if (wasAway && nextState === 'active') {
                        loadUserGames({ force: true })
                    }

                    appState.current = nextState
                }
            )

            return () => { subscription.remove() }
        }, [loadUserGames])

        const refresh = useCallback(() => {
            return loadUserGames({ force: true })
        }, [loadUserGames])

        return { 
            ...state, 
            refresh
        }
}