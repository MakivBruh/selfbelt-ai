import { Section } from './Layout'
import { useCopy, useSimulation } from '../simulation/context'
import { DEMO_GRACE_MS, hasUnsafeSeat, isUnsafeMoving, safetyPhase } from '../simulation/safety'
import type { SeatId } from '../simulation/model'

const seats: SeatId[] = ['driver', 'frontPassenger', 'rearLeft', 'rearRight']

export function SafetyDemo() {
  const t = useCopy()
  const { state, derived, dispatch, audioState, toggleBuzzer } = useSimulation()
  const phase = safetyPhase(state)
  const active = isUnsafeMoving(state)
  const remaining = Math.max(0, Math.ceil((DEMO_GRACE_MS - state.alertElapsedMs) / 1000))
  const names = { driver: t.driverSeat, frontPassenger: t.frontPassengerSeat, rearLeft: t.rearLeftSeat, rearRight: t.rearRightSeat }
  const phaseLabel = phase === 'warning' ? t.safetyWarning : phase === 'slowing' ? t.safetySlowing
    : phase === 'limited' ? t.safetyLimited : hasUnsafeSeat(state) ? t.safetyStopped : t.safetyIdle
  function startDemo() {
    if (audioState !== 'ready') void toggleBuzzer()
    dispatch({ type: 'applyScenario', scenario: 'unbucklesMoving' })
    dispatch({ type: 'setSeat', seat: 'rearLeft', value: { occupied: true, belted: false, cameraBelt: false } })
  }
  return <Section id="safety-demo" title={t.safetyTitle}>
    <div className="safety-layout">
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">{t.cameraTitle}</h3>
          <span className="text-xs text-muted">{t.manual}</span>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-muted">{t.cameraNote}</p>
        <div className="camera-grid">
          {seats.map(id => {
            const seat = state.seats[id]
            const mismatch = derived.mismatchSeats.includes(id)
            const unsafe = seat.occupied && (!seat.belted || !seat.cameraBelt)
            return <article className="camera-tile" data-unsafe={unsafe} key={id}>
              <div className="camera-frame">
                <svg viewBox="0 0 200 112" role="img" aria-label={`${names[id]}: ${!seat.occupied ? t.emptySeat : seat.cameraBelt ? t.cameraVisible : t.cameraMissing}`}>
                  <rect x="4" y="4" width="192" height="104" rx="8" fill="var(--cabin)" />
                  <path d="M20 30V18H34M166 18H180V30M20 82V94H34M166 94H180V82" fill="none" stroke={unsafe ? 'var(--seat-critical)' : 'var(--seat-empty)'} strokeWidth="2" />
                  <path d="M65 100V53Q65 44 77 44H123Q135 44 135 53V100Z" fill="var(--seat)" />
                  {seat.occupied && <>
                    <circle cx="100" cy="30" r="14" fill="var(--person-head)" />
                    <path d="M78 53Q100 43 122 53L134 95H66Z" fill="var(--person-shirt)" />
                    {seat.cameraBelt && <path d="M79 50L122 91L75 94" fill="none" stroke="var(--seat-safe)" strokeWidth="6" strokeLinecap="round" />}
                  </>}
                </svg>
                <span className="camera-name">{names[id]}</span>
              </div>
              <dl className="camera-readings">
                <div><dt>{t.buckleShort}</dt><dd>{seat.belted ? t.buckleOn : t.buckleOff}</dd></div>
                <div><dt>{t.cameraShort}</dt><dd>{!seat.occupied ? t.emptySeat : seat.cameraBelt ? t.cameraVisible : t.cameraMissing}</dd></div>
              </dl>
              {mismatch && <p className="camera-mismatch">{t.mismatch}</p>}
            </article>
          })}
        </div>
      </div>
      <aside className="safety-response" data-phase={phase}>
        <p className="text-xs font-medium text-accent">{t.safetyTiming}</p>
        <h3 role="status" className="mt-3 text-lg font-semibold">{phaseLabel}</h3>
        <div className="safety-countdown">
          <span className="text-xs text-muted">{t.safetyCountdown}</span>
          <strong>{phase === 'warning' ? remaining : phase === 'idle' ? '—' : 0} <small>{t.seconds}</small></strong>
          <progress aria-label={t.safetyCountdown} max={DEMO_GRACE_MS} value={active ? Math.min(state.alertElapsedMs, DEMO_GRACE_MS) : 0} />
        </div>
        <p className="text-sm leading-relaxed">{t.safetyComparison}</p>
        <p className="mt-3 text-xs leading-relaxed text-muted">{t.safetyPolicy}</p>
        <div className="buzzer-controls">
          <button type="button" className="min-h-11 rounded border border-border px-3 text-sm" aria-pressed={audioState === 'ready'} onClick={() => void toggleBuzzer()}>
            {audioState === 'ready' ? t.muteBuzzer : t.enableBuzzer}
          </button>
          <span className="text-xs" role="status">{audioState === 'blocked' ? t.buzzerBlocked : audioState === 'ready' ? active ? t.buzzerSounding : t.buzzerReady : t.buzzerOff}</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted">{t.buzzerHelp}</p>
        <div className="safety-actions">
          <button type="button" onClick={startDemo}>{t.startSafetyDemo}</button>
          <button type="button" onClick={() => dispatch({ type: 'secureAll' })}>{t.fixBelts}</button>
        </div>
        <p className="mt-4 text-xs text-muted">{t.safetyDemoNote}</p>
      </aside>
    </div>
  </Section>
}
