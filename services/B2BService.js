import { applyDevSimulation } from "./devChallengeSimulation"

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || ""

export function getRecommendedOffersForPlatform(offers, platform) {
    if (platform === 'ios' || platform === 'android') {
        return offers.filter((offer) => offer.device === platform)
    }

    const byTitle = new Map()

    for (const offer of offers) {
        const current = byTitle.get(offer.title)

        if (!current || offer.amount > current.amount) {
            byTitle.set(offer.title, offer)
        }
    }

    return [...byTitle.values()]
}

const SYMBOL_CURRENCIES = ['$', '€', '£']

function withCurrency(currency, formattedAmount) {
  return SYMBOL_CURRENCIES.includes(currency)
    ? `${currency}${formattedAmount}`
    : `${formattedAmount} ${currency}`
}

export function formatAmount(amount = 0) {
  const value = Number(amount)
  if (Number.isNaN(value)) return String(amount)

  const showDecimals = value < 1

  return value.toLocaleString(undefined, {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  })
}

export function formatReward(currency = '$', amount = 0) {
  const value = Number(amount)
  if (Number.isNaN(value)) return `${currency}${amount}`

  return withCurrency(currency, formatAmount(value))
}

const REQUEST_TIMEOUT_MS = 12000
const USER_GAMES_TTL_MS = 60000
const userGamesCache = new Map()
const inFlightRequests = new Map()

export function clearUserGamesCache() {
    userGamesCache.clear()
}

async function fetchJson(url) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
        const response = await fetch(url, {
            headers: {
                accept: 'application/json'
            },
            signal: controller.signal
        })

        if (!response.ok) {
            throw new Error('Unable to load rewards right now')
        }

        return await response.json()
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Check your connection and try again.')
        }

        throw error
    } finally {
        clearTimeout(timeout)
    }
}

export async function getUserGames(userId, { platform = 'android', country = 'US', force = false } = {}) {
    const params = new URLSearchParams({
        platform,
        country
    })

    const key = `${userId}|${platform}|${country}`

    if (inFlightRequests.has(key)) {
        return inFlightRequests.get(key)
    }

    const cached = userGamesCache.get(key)

    if (!force && cached && Date.now() - cached.timestamp < USER_GAMES_TTL_MS) {
        return cached.data
    }

    const promise = fetchJson(
        `${API_BASE}/api/user-games/${encodeURIComponent(userId)}?${params.toString()}`
    ).then((data) => {
        userGamesCache.set(key, {
            timestamp: Date.now(),
            data
        })
        return data
    }).finally(() => {
        inFlightRequests.delete(key)
    })

    inFlightRequests.set(key, promise)

    return promise
}

export async function getUserOffer(userId, offerId, options = {}) {
    const data = await getUserGames(userId, options)

    const available = Array.isArray(data.available) ? data.available : []
    const inProgress = Array.isArray(data.inProgress) ? data.inProgress : []
    const completed = Array.isArray(data.completed) ? data.completed : []
    
    const simulated = applyDevSimulation({ available, inProgress, completed })
    const completedOffer = simulated.completed.find((offer) => offer.id === offerId)
    
    if (completedOffer) {
        return { ...completedOffer, challengeStatus: 'completed'}
    }

    const activeOffer = simulated.inProgress.find(
        (offer) => offer.id === offerId
    )

    if (activeOffer) {
        return { ...activeOffer, challengeStatus: 'active'}
    }

    const availableOffer = simulated.available.find(
        (offer) => offer.id === offerId
    )

    if (availableOffer) {
        return { ...availableOffer, challengeStatus: 'available'}
    }

    throw new Error('Offer not found for user')
}