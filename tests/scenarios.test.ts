import assert from 'node:assert/strict'
import { createInitialState, simulationReducer } from '../src/simulation/model.ts'
import { presets, unbuckleRearLeft } from '../src/simulation/scenarios.ts'
import { deriveSimulation } from '../src/simulation/detection.ts'
for (const [key, level, speed] of [
  ['allSafe', 'safe', 40], ['driverUnbelted', 'critical', 40],
  ['rearUnbelted', 'warning', 40], ['unbucklesMoving', 'safe', 40],
  ['stopped', 'safe', 0],
] as const) {
  const state = simulationReducer(createInitialState(), { type: 'applyScenario', scenario: key })
  assert.deepEqual(state, presets[key])
  assert.equal(state.speedKmh, speed)
  assert.equal(deriveSimulation(state, 'en').level, level)
}
const moving = simulationReducer(createInitialState(), { type: 'applyScenario', scenario: 'unbucklesMoving' })
assert.equal(moving.seats.rearLeft.belted, true)
const unbuckled = simulationReducer(moving, { type: 'setSeat', seat: 'rearLeft', value: unbuckleRearLeft(moving) })
assert.equal(deriveSimulation(unbuckled, 'en').level, 'warning')
assert.equal(unbuckled.speedKmh, 40)
const tampered = simulationReducer(createInitialState(), { type: 'applyScenario', scenario: 'allSafe' })
tampered.seats.rearLeft.belted = false
assert.equal(presets.allSafe.seats.rearLeft.belted, true, 'preset objects must not be shared with state')
console.log('PASS: presets, staged unbuckling, immutable templates')
