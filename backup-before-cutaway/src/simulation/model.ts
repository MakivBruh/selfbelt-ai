import { presets } from './scenarios.ts'
import type { ScenarioId } from './scenarios'
export type Language = 'id' | 'en'
export type SeatId = 'driver' | 'rearLeft' | 'rearRight'
export type SeatState =
  | { occupied: false; belted: false }
  | { occupied: true; belted: boolean }
export type SimulationState = { speedKmh: number; seats: Record<SeatId, SeatState> }
export type SimulationAction =
  | { type: 'setSpeed'; value: number }
  | { type: 'setSeat'; seat: SeatId; value: SeatState }
  | { type: 'reset' }
  | { type: 'applyScenario'; scenario: ScenarioId }
export function createInitialState(): SimulationState {
  return { speedKmh: 0, seats: {
    driver: { occupied: true, belted: true },
    rearLeft: { occupied: false, belted: false },
    rearRight: { occupied: false, belted: false },
  } }
}
export function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  switch (action.type) {
    case 'reset': return createInitialState()
    case 'applyScenario': return Object.hasOwn(presets, action.scenario) ? structuredClone(presets[action.scenario]) : state
    case 'setSpeed':
      if (!Number.isFinite(action.value) || action.value < 0 || action.value > 120) return state
      if (action.value > 0 && !state.seats.driver.occupied) return state
      return { ...state, speedKmh: action.value }
    case 'setSeat':
      if (!Object.hasOwn(state.seats, action.seat)) return state
      if (action.seat === 'driver' && !action.value.occupied && state.speedKmh > 0) return state
      return { ...state, seats: { ...state.seats, [action.seat]: action.value.occupied
        ? { occupied: true, belted: action.value.belted }
        : { occupied: false, belted: false } } }
  }
}
