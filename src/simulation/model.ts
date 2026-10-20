import { presets } from './scenarios.ts'
import type { ScenarioId } from './scenarios'
import { advanceSafety, DEMO_GRACE_MS, hasUnsafeSeat, isUnsafeMoving } from './safety.ts'
export type Language = 'id' | 'en'
export type SeatId = 'driver' | 'frontPassenger' | 'rearLeft' | 'rearRight'
export type SeatState =
  | { occupied: false; belted: false; cameraBelt: false }
  | { occupied: true; belted: boolean; cameraBelt: boolean }
export type SimulationState = { speedKmh: number; seats: Record<SeatId, SeatState>; alertElapsedMs: number }
export type SimulationAction =
  | { type: 'setSpeed'; value: number }
  | { type: 'setSeat'; seat: SeatId; value: SeatState }
  | { type: 'reset' }
  | { type: 'applyScenario'; scenario: ScenarioId }
  | { type: 'tick'; elapsedMs: number }
  | { type: 'secureAll' }
export function createInitialState(): SimulationState {
  return { speedKmh: 0, alertElapsedMs: 0, seats: {
    driver: { occupied: true, belted: true, cameraBelt: true },
    frontPassenger: { occupied: false, belted: false, cameraBelt: false },
    rearLeft: { occupied: false, belted: false, cameraBelt: false },
    rearRight: { occupied: false, belted: false, cameraBelt: false },
  } }
}
export function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  switch (action.type) {
    case 'reset': return createInitialState()
    case 'applyScenario': return Object.hasOwn(presets, action.scenario) ? structuredClone(presets[action.scenario]) : state
    case 'tick': return advanceSafety(state, action.elapsedMs)
    case 'secureAll': return {
      ...state, alertElapsedMs: 0,
      seats: Object.fromEntries(Object.entries(state.seats).map(([id, seat]) =>
        [id, seat.occupied ? { occupied: true, belted: true, cameraBelt: true } : seat])) as Record<SeatId, SeatState>,
    }
    case 'setSpeed':
      if (!Number.isFinite(action.value) || action.value < 0 || action.value > 120) return state
      if (action.value > 0 && !state.seats.driver.occupied) return state
      // Once intervention begins, manual speed changes cannot bypass the limit.
      if (state.alertElapsedMs >= DEMO_GRACE_MS && hasUnsafeSeat(state) && action.value > state.speedKmh) return state
      return { ...state, speedKmh: action.value, alertElapsedMs: action.value === 0 ? 0 : state.alertElapsedMs }
    case 'setSeat':
      if (!Object.hasOwn(state.seats, action.seat)) return state
      if (action.seat === 'driver' && !action.value.occupied && state.speedKmh > 0) return state
      {
        const next = { ...state, seats: { ...state.seats, [action.seat]: action.value.occupied
          ? { occupied: true as const, belted: action.value.belted, cameraBelt: action.value.cameraBelt }
          : { occupied: false as const, belted: false as const, cameraBelt: false as const } } }
        return isUnsafeMoving(next) ? next : { ...next, alertElapsedMs: 0 }
      }
  }
}
