import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const read = (file: string) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
const css = read('src/index.css')
const app = read('src/App.tsx')
// Layout contracts complement the browser geometry/interaction checks.
assert.match(css, /\.playground-dock\s*\{[^}]*max-height:\s*calc\(100dvh - 48px\)[^}]*overflow-y:\s*auto/s, 'entire sidebar must fit the viewport, including translated heading')
assert.ok(app.indexOf('<aside') < app.indexOf('<SensorSchematic'), 'dock stays within the two-view grid')
assert.match(read('src/components/ScenarioPlayground.tsx'), /<Magnet/, 'presets use the real React Bits component')
const magnet = read('src/components/react-bits/Magnet.tsx')
assert.match(magnet, /prefers-reduced-motion/)
assert.match(magnet, /pointer: coarse/)
assert.match(read('src/components/react-bits/ATTRIBUTION.md'), /DavidHDev\/react-bits/)
console.log('PASS: bounded sidebar, upstream animation, motion safeguards, attribution')
