import assert from 'node:assert/strict'
import { createInitialState, simulationReducer } from '../src/simulation/model.ts'
import { deriveSimulation } from '../src/simulation/detection.ts'
import { presets } from '../src/simulation/scenarios.ts'
const initial = createInitialState()
assert.deepEqual(initial.seats.frontPassenger, { occupied: false, belted: false })
let state = simulationReducer(initial, { type: 'setSeat', seat: 'frontPassenger', value: { occupied: true, belted: false } })
assert.equal(deriveSimulation(state, 'id').level, 'notice')
state = simulationReducer(state, { type: 'setSpeed', value: 40 })
for (const language of ['id', 'en'] as const) {
  const result = deriveSimulation(state, language)
  assert.equal(result.level, 'warning')
  assert.equal(result.occupiedCount, 2)
  assert.deepEqual(result.unbeltedSeats, ['frontPassenger'])
  assert.ok(!result.seats.frontPassenger.interpretation.includes('undefined'))
}
state = simulationReducer(state, { type: 'setSeat', seat: 'frontPassenger', value: { occupied: true, belted: true } })
assert.equal(deriveSimulation(state, 'en').level, 'safe')
state = simulationReducer(state, { type: 'setSeat', seat: 'frontPassenger', value: { occupied: false, belted: false } })
assert.equal(deriveSimulation(state, 'en').occupiedCount, 1)
assert.deepEqual(simulationReducer(state, { type: 'reset' }), initial)
assert.deepEqual(initial.seats.frontPassenger, { occupied: false, belted: false })
for (const preset of Object.values(presets)) assert.ok(preset.seats.frontPassenger)
assert.equal(deriveSimulation(presets.allSafe, 'en').occupiedCount, 4)
console.log('PASS: front passenger occupancy, belt, warnings, count, reset, presets')
