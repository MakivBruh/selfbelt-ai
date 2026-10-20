import assert from 'node:assert/strict'
import { createInitialState, simulationReducer } from '../src/simulation/model.ts'
const initial = createInitialState()
const moving = simulationReducer(initial, { type: 'setSpeed', value: 50 })
assert.equal(moving.speedKmh, 50)
assert.equal(initial.speedKmh, 0)
for (const value of [NaN, Infinity, -1, 121]) assert.equal(simulationReducer(initial, { type: 'setSpeed', value }), initial)
assert.equal(simulationReducer(moving, { type: 'setSeat', seat: 'driver', value: { occupied: false, belted: false, cameraBelt: false } }), moving)
const empty = simulationReducer(initial, { type: 'setSeat', seat: 'driver', value: { occupied: false, belted: false, cameraBelt: false } })
assert.equal(simulationReducer(empty, { type: 'setSpeed', value: 5 }), empty)
assert.deepEqual(simulationReducer(moving, { type: 'reset' }), initial)
console.log('PASS: immutable updates, speed bounds, driver constraints, reset')
