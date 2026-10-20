import type { Language, SeatId, SimulationState } from './model'
import { isSeatSecured } from './safety.ts'
export type AlertLevel = 'safe' | 'notice' | 'warning' | 'critical'
export type RecommendationCode = 'fastenBelt' | 'slowDownSafely' | 'checkDriver' | 'checkMismatch'
export type SeatResult = { level: AlertLevel; interpretation: string }
export type DerivedState = {
  level: AlertLevel
  moving: boolean
  occupiedCount: number
  unbeltedSeats: SeatId[]
  mismatchSeats: SeatId[]
  seats: Record<SeatId, SeatResult>
  recommendations: RecommendationCode[]
  recommendationTexts: string[]
}
const seatIds: SeatId[] = ['driver', 'frontPassenger', 'rearLeft', 'rearRight']
const rank: Record<AlertLevel, number> = { safe: 0, notice: 1, warning: 2, critical: 3 }
import { detectionTranslations as messages } from '../i18n/detection.ts'
// ponytail: demo priority policy, not a validated automotive risk classification.
export function deriveSimulation(state: SimulationState, language: Language): DerivedState {
  if (!Number.isFinite(state.speedKmh) || state.speedKmh < 0 || state.speedKmh > 120) {
    throw new RangeError('speedKmh must be between 0 and 120')
  }
  const t = messages[language]
  const moving = state.speedKmh > 0
  const unbeltedSeats = seatIds.filter(id => state.seats[id].occupied && !isSeatSecured(state.seats[id]))
  const mismatchSeats = seatIds.filter(id => state.seats[id].occupied && state.seats[id].belted && !state.seats[id].cameraBelt)
  const results = seatIds.map(id => {
    const seat = state.seats[id]
    let level: AlertLevel = 'safe'
    let description = !seat.occupied ? t.empty : isSeatSecured(seat) ? t.secured
      : seat.belted && !seat.cameraBelt ? t.behindBack
      : seat.cameraBelt && !seat.belted ? t.unlatched
      : moving ? t.moving : t.stopped
    if (id === 'driver' && !seat.occupied) {
      level = moving ? 'critical' : 'notice'
      if (moving) description = t.absent
    } else if (seat.occupied && !isSeatSecured(seat)) {
      level = !moving ? 'notice' : id === 'driver' ? 'critical' : 'warning'
    }
    return [id, { level, interpretation: `${t.names[id]} ${description}` }] as const
  })
  const seats = Object.fromEntries(results) as Record<SeatId, SeatResult>
  const level = results.reduce<AlertLevel>((highest, [, result]) => rank[result.level] > rank[highest] ? result.level : highest, 'safe')
  const recommendations: RecommendationCode[] = []
  if (!state.seats.driver.occupied) recommendations.push('checkDriver')
  if (unbeltedSeats.length) recommendations.push('fastenBelt')
  if (mismatchSeats.length) recommendations.push('checkMismatch')
  if (moving && level !== 'safe') recommendations.push('slowDownSafely')
  return {
    level, moving, occupiedCount: seatIds.filter(id => state.seats[id].occupied).length,
    unbeltedSeats, mismatchSeats, seats, recommendations,
    recommendationTexts: recommendations.map(code => t.recommendations[code]),
  }
}

