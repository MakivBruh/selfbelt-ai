import assert from 'node:assert/strict'
import { seatVisual } from '../src/simulation/cabin.ts'
assert.equal(seatVisual({ occupied: false, belted: false }, false), 'empty')
assert.equal(seatVisual({ occupied: true, belted: true }, true), 'secured')
assert.equal(seatVisual({ occupied: true, belted: false }, false), 'unbelted')
assert.equal(seatVisual({ occupied: true, belted: false }, true), 'unbelted')
console.log('PASS: cabin seat states')
