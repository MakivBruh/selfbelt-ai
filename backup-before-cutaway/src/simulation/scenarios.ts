import type { SeatState, SimulationState } from './model'
export type ScenarioId = 'allSafe' | 'driverUnbelted' | 'rearUnbelted' | 'unbucklesMoving' | 'stopped'
const belted = (): SeatState => ({ occupied: true, belted: true })
const empty = (): SeatState => ({ occupied: false, belted: false })
export const presets: Record<ScenarioId, SimulationState> = {
  allSafe: { speedKmh: 40, seats: { driver: belted(), rearLeft: belted(), rearRight: belted() } },
  driverUnbelted: { speedKmh: 40, seats: { driver: { occupied: true, belted: false }, rearLeft: empty(), rearRight: empty() } },
  rearUnbelted: { speedKmh: 40, seats: { driver: belted(), rearLeft: empty(), rearRight: { occupied: true, belted: false } } },
  unbucklesMoving: { speedKmh: 40, seats: { driver: belted(), rearLeft: belted(), rearRight: empty() } },
  stopped: { speedKmh: 0, seats: { driver: belted(), rearLeft: empty(), rearRight: empty() } },
}
export function unbuckleRearLeft(_state: SimulationState): SeatState {
  return { occupied: true, belted: false }
}
