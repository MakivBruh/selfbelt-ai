import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

const bootstrap = readFileSync(new URL('../public/theme.js', import.meta.url), 'utf8')
function initialTheme(saved: string | null, darkSystem: boolean, storageBlocked = false) {
  const document = { documentElement: { dataset: {} as Record<string, string> } }
  runInNewContext(bootstrap, {
    document,
    window: { matchMedia: () => ({ matches: darkSystem }) },
    localStorage: { getItem() { if (storageBlocked) throw new Error('Blocked'); return saved } },
  })
  return document.documentElement.dataset.theme
}

assert.equal(initialTheme('dark', false), 'dark', 'saved choice overrides system appearance')
assert.equal(initialTheme('light', true), 'light')
assert.equal(initialTheme(null, true), 'dark', 'first visit follows system')
assert.equal(initialTheme(null, false), 'light')
assert.equal(initialTheme('invalid', true), 'dark', 'invalid saved preference falls back safely')
assert.equal(initialTheme(null, false, true), 'light', 'blocked storage must not break startup')
assert.equal(initialTheme(null, true, true), 'dark')
console.log('PASS: theme startup, saved preference, system fallback, blocked storage')
