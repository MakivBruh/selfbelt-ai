import type { AlertLevel } from './detection'
export function drivingPresentation(speed: number, level: AlertLevel) {
  if (!Number.isFinite(speed) || speed < 0 || speed > 120) throw new RangeError('speed out of simulation range')
  const moving = speed > 0
  return {
    moving,
    alert: moving && (level === 'warning' || level === 'critical'),
    roadSeconds: moving ? 80 / speed : 0,
    wheelSeconds: moving ? 40 / speed : 0,
  }
}
