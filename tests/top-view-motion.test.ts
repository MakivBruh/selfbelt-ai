import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const top = readFileSync(new URL('../src/components/TopView.tsx', import.meta.url), 'utf8')
assert.match(top, /data-running=\{.*moving.*\}/, 'top view follows simulated driving state')
const css = readFileSync(new URL('../src/components/TopView.css', import.meta.url), 'utf8')
assert.match(top, /--top-road-duration.*roadSeconds/, 'road animation follows simulated speed')
assert.match(top, /className="top-road-markings"/, 'road markings appear behind the car')
assert.match(css, /data-running="true".*top-road-markings.*animation-play-state:running/s, 'road moves only while driving')
assert.match(css, /prefers-reduced-motion:reduce.*animation:none/s, 'respects reduced motion')
console.log('PASS: top view road follows speed, stops, and respects reduced motion')
