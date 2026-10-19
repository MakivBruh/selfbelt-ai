import type { SeatState } from './model'
export type SeatVisual = 'empty' | 'secured' | 'unbelted'
export function seatVisual(seat: SeatState, _moving: boolean): SeatVisual {
  return !seat.occupied ? 'empty' : seat.belted ? 'secured' : 'unbelted'
}
