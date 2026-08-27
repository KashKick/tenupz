import { useEffect, useState } from "react"
import { getEligibleOffers, getRecommendedOffersForPlatform } from "../services/B2BService"
import { Platform } from "react-native"

export function useOffers() {
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const currentPlatform = Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web'

    useEffect(() => {
        let alive = true

        async function loadOffers() {
            try {
                setLoading(true)
                setError(null)

                const result = await getEligibleOffers()

                const recommended = getRecommendedOffersForPlatform(result, currentPlatform)

                if (alive) {
                    setOffers(recommended)
                }
            } catch (err) {
                if (alive) {
                    setOffers([])
                    setError(err.message)
                }
            } finally {
                if (alive) {
                    setLoading(false)
                }
            }
        }

        loadOffers()

        return () => {
            alive = false
        }
    }, [])

    return {
        offers,
        loading,
        error
    }
}