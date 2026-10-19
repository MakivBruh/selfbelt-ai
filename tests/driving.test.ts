import assert from 'node:assert/strict'
import { drivingPresentation } from '../src/simulation/driving.ts'
assert.deepEqual(drivingPresentation(0, 'safe'), { moving: false, alert: false, roadSeconds: 0, wheelSeconds: 0 })
assert.deepEqual(drivingPresentation(40, 'safe'), { moving: true, alert: false, roadSeconds: 0.6, wheelSeconds: 1 })
assert.deepEqual(drivingPresentation(40, 'warning'), { moving: true, alert: true, roadSeconds: 0.6, wheelSeconds: 1 })
assert.equal(drivingPresentation(0, 'critical').alert, false)
assert.equal(drivingPresentation(120, 'critical').roadSeconds < drivingPresentation(10, 'safe').roadSeconds, true)
assert.ok(drivingPresentation(120, 'safe').roadSeconds <= 0.25, 'at 120 km/h road markings should cross rapidly')
console.log('PASS: stationary, speed animation, moving warning')
