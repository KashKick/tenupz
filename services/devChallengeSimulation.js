export const DEV_SIMULATE_PROGRESS = true

export function applyDevSimulation({
  available,
  inProgress,
  completed
}) {
  let nextAvailable = [...available]
  let nextInProgress = [...inProgress]
  let nextCompleted = [...completed]

  if (!__DEV__ || !DEV_SIMULATE_PROGRESS) {
    return {
      available: nextAvailable,
      inProgress: nextInProgress,
      completed: nextCompleted
    }
  }

  const simulatedActive = nextAvailable[0]
  const simulatedCompleted = nextAvailable[1]

  if (simulatedActive) {
    const activeOffer = {
      ...simulatedActive,
      goals: simulatedActive.goals.map((goal, index) => ({
        ...goal,
        completed: index < 2,
        failed: false
      }))
    }

    nextInProgress = [
      activeOffer,
      ...nextInProgress
    ]

    nextAvailable = nextAvailable.filter(
      (offer) => offer.id !== simulatedActive.id
    )
  }

  if (simulatedCompleted) {
    const completedOffer = {
      ...simulatedCompleted,
      goals: simulatedCompleted.goals.map((goal) => ({
        ...goal,
        completed: true,
        failed: false
      }))
    }

    nextCompleted = [
      completedOffer,
      ...nextCompleted
    ]

    nextAvailable = nextAvailable.filter(
      (offer) => offer.id !== simulatedCompleted.id
    )
  }

  const unavailableTitles = new Set([
    ...nextInProgress.map((offer) => offer.title),
    ...nextCompleted.map((offer) => offer.title)
  ])

  nextAvailable = nextAvailable.filter(
    (offer) => !unavailableTitles.has(offer.title)
  )

  return {
    available: nextAvailable,
    inProgress: nextInProgress,
    completed: nextCompleted
  }
}