import assert from 'node:assert/strict'
import { createInitialState } from '../src/simulation/model.ts'
import * as logic from '../src/simulation/detection.ts'
assert.equal(typeof logic.deriveSimulation, 'function', 'pure evaluator must exist')
const initial = createInitialState()
for (const speedKmh of [NaN, Infinity, -1, 121]) {
  assert.throws(() => logic.deriveSimulation({ ...initial, speedKmh }, 'en'), RangeError)
}

assert.equal(logic.deriveSimulation(initial, 'en').level, 'safe')

const unbelted = createInitialState()
unbelted.seats.driver.belted = false
assert.equal(logic.deriveSimulation(unbelted, 'en').level, 'notice')
unbelted.speedKmh = 1
assert.equal(logic.deriveSimulation(unbelted, 'en').level, 'critical')
unbelted.seats.driver.belted = true
unbelted.seats.rearRight = { occupied: true, belted: false, cameraBelt: false }
assert.equal(logic.deriveSimulation(unbelted, 'en').level, 'warning')

const example = logic.deriveSimulation(unbelted, 'en')
assert.equal(example.moving, true)
assert.equal(example.occupiedCount, 2)
assert.deepEqual(example.unbeltedSeats, ['rearRight'])
assert.equal(example.seats.rearRight.interpretation, 'Rear right passenger occupied and not belted while vehicle is moving')
assert.equal(example.seats.driver.interpretation, 'Driver occupied and secured')
assert.deepEqual(example.recommendations, ['fastenBelt', 'slowDownSafely'])
assert.equal(logic.deriveSimulation(unbelted, 'id').seats.rearRight.interpretation, 'Penumpang belakang kanan terisi dan sabuk belum terpasang saat kendaraan bergerak')
assert.equal(logic.deriveSimulation(initial, 'en').recommendations.length, 0)
assert.equal(logic.deriveSimulation(createInitialState(), 'en').seats.rearLeft.level, 'safe')
const absentDriver = { ...initial, speedKmh: 10, seats: { ...initial.seats, driver: { occupied: false, belted: false, cameraBelt: false } } } as typeof initial
assert.equal(logic.deriveSimulation(absentDriver, 'en').level, 'critical')
console.log('PASS: safe/notice/warning/critical, seat interpretations, localized output, recommendations, defensive driver state')


