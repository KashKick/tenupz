const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || ""

export function normalizeOffer(offer) {
  const categories = (offer.categories || [])
    .map((category) =>
      typeof category === 'string' ? category : category?.name,
    )
    .filter(Boolean)

  return {
    id: offer.id,
    title: offer.title,
    tagline: offer.card_text || '',
    image: offer.image || offer.square_image || offer.large_image || '',
    squareImage: offer.square_image || offer.image || offer.large_image || '',
    largeImage: offer.large_image || offer.image || offer.square_image || '',
    currency: offer.amount_currency || '$',
    amount: offer.amount != null ? Number(offer.amount) : '',
    category: categories[0] || 'Game',
    categories,
    isNew: offer.is_new,
    device: offer.device || null,
    url: offer.url,
    points: offer.points || [],
    goals: (offer.goals || []).map((goal) => ({
      id: goal.goal_id,
      text: goal.text,
      amount: goal.amount,
      currency: goal.amount_currency || offer.amount_currency || '$',
      daysLeft: goal.days_left,
      section: goal.section,
      position: goal.position,
    })),
  }
}

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

export async function getEligibleOffers() {
    const response = await fetch(`${API_BASE}/api/games`,
    {
        headers: {
            accept: 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error(
            `/api/games returned ${response.status}`
        )
    }

    const json = await response.json()
    const offers = Array.isArray(json.data) ? json.data : []

    const activeOffers = offers.filter((offer) => offer.budget_status === 'Active')

    return activeOffers.map(normalizeOffer)
}

export async function getOfferDetails(offerId) {
    const response = await fetch(`${API_BASE}/api/games/${encodeURIComponent(offerId)}`,
    {
        headers: {
            accept: 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error(
            `Offer request returned ${response.status}`
        )
    }

    const json = await response.json()

    return normalizeOffer(json.offer)
}