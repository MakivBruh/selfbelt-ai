import assert from 'node:assert/strict'
import { translations } from '../src/i18n/translations.ts'
import { detectionTranslations } from '../src/i18n/detection.ts'
function compare(a: unknown, b: unknown): void {
  if (typeof a === 'string') {
    assert.equal(typeof b, 'string')
    assert.ok(a.trim() && (b as string).trim())
    return
  }
  assert.equal(Array.isArray(a), Array.isArray(b))
  assert.deepEqual(Object.keys(a as object).sort(), Object.keys(b as object).sort())
  for (const key of Object.keys(a as object)) compare((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
}
compare(translations.id, translations.en)
compare(detectionTranslations.id, detectionTranslations.en)
assert.notEqual(translations.id.unbuckleReady, translations.en.unbuckleReady)
console.log('PASS: bilingual UI and detection keys, non-empty copy, matching array lengths')
