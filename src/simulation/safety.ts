import type { SeatState, SimulationState } from './model'

// Demo parameters only; no connection to any real vehicle controller.
export const DEMO_GRACE_MS = 5000
export const CONCEPT_GRACE_SECONDS = 60
export const LIMITED_SPEED_KMH = 10
export const SPEED_STEP_KMH = 5

export function isSeatSecured(seat: SeatState) {
  return seat.occupied && seat.belted && seat.cameraBelt
}
export function hasUnsafeSeat(state: SimulationState) {
  return !state.seats.driver.occupied || Object.values(state.seats).some(seat => seat.occupied && !isSeatSecured(seat))
}
export function isUnsafeMoving(state: SimulationState) {
  return state.speedKmh > 0 && hasUnsafeSeat(state)
}
export function safetyPhase(state: SimulationState): 'idle' | 'warning' | 'slowing' | 'limited' {
  if (!isUnsafeMoving(state)) return 'idle'
  if (state.alertElapsedMs < DEMO_GRACE_MS) return 'warning'
  return state.speedKmh > LIMITED_SPEED_KMH ? 'slowing' : 'limited'
}
export function advanceSafety(state: SimulationState, deltaMs: number): SimulationState {
  if (!Number.isFinite(deltaMs) || deltaMs <= 0) return state
  if (!isUnsafeMoving(state)) return state.alertElapsedMs === 0 ? state : { ...state, alertElapsedMs: 0 }
  const elapsed = state.alertElapsedMs + deltaMs
  const steps = (ms: number) => ms < DEMO_GRACE_MS ? 0 : Math.floor((ms - DEMO_GRACE_MS) / 1000) + 1
  const reduction = (steps(elapsed) - steps(state.alertElapsedMs)) * SPEED_STEP_KMH
  // Never accelerate a car already below the target, even after a delayed timer.
  const floor = Math.min(state.speedKmh, LIMITED_SPEED_KMH)
  return { ...state, alertElapsedMs: elapsed, speedKmh: Math.max(floor, state.speedKmh - reduction) }
}
