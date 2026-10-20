import type { SeatState, SimulationState } from './model'
export type ScenarioId = 'allSafe' | 'driverUnbelted' | 'rearUnbelted' | 'unbucklesMoving' | 'stopped' | 'behindBack'
const belted = (): SeatState => ({ occupied: true, belted: true, cameraBelt: true })
const empty = (): SeatState => ({ occupied: false, belted: false, cameraBelt: false })
export const presets: Record<ScenarioId, SimulationState> = {
  allSafe: { alertElapsedMs: 0, speedKmh: 40, seats: { driver: belted(), frontPassenger: belted(), rearLeft: belted(), rearRight: belted() } },
  driverUnbelted: { alertElapsedMs: 0, speedKmh: 40, seats: { driver: { occupied: true, belted: false, cameraBelt: false }, frontPassenger: empty(), rearLeft: empty(), rearRight: empty() } },
  rearUnbelted: { alertElapsedMs: 0, speedKmh: 40, seats: { driver: belted(), frontPassenger: empty(), rearLeft: empty(), rearRight: { occupied: true, belted: false, cameraBelt: false } } },
  unbucklesMoving: { alertElapsedMs: 0, speedKmh: 40, seats: { driver: belted(), frontPassenger: empty(), rearLeft: belted(), rearRight: empty() } },
  behindBack: { alertElapsedMs: 0, speedKmh: 40, seats: { driver: { occupied: true, belted: true, cameraBelt: false }, frontPassenger: empty(), rearLeft: empty(), rearRight: empty() } },
  stopped: { alertElapsedMs: 0, speedKmh: 0, seats: { driver: belted(), frontPassenger: empty(), rearLeft: empty(), rearRight: empty() } },
}
export function unbuckleRearLeft(_state: SimulationState): SeatState {
  return { occupied: true, belted: false, cameraBelt: false }
}
