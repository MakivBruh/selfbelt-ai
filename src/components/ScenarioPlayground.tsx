import { useState, type CSSProperties } from 'react'
import { Section } from './Layout'
import Magnet from './react-bits/Magnet'
import { useCopy, useSimulation } from '../simulation/context'
import type { SeatId, SeatState } from '../simulation/model'
import { unbuckleRearLeft } from '../simulation/scenarios'
import type { ScenarioId } from '../simulation/scenarios'

const seatIds: SeatId[] = ['driver', 'frontPassenger', 'rearLeft', 'rearRight']
const scenarioIds: ScenarioId[] = ['allSafe', 'driverUnbelted', 'rearUnbelted', 'unbucklesMoving', 'stopped']

export function ScenarioPlayground() {
  const t = useCopy()
  const { state, derived, dispatch } = useSimulation()
  const [message, setMessage] = useState<'' | 'unbuckleReady' | 'unbuckleDone' | 'resetDone'>('')
  const [activeScenario, setActiveScenario] = useState<ScenarioId | null>(null)
  const labels: Record<SeatId, string> = { driver: t.driverSeat, frontPassenger: t.frontPassengerSeat, rearLeft: t.rearLeftSeat, rearRight: t.rearRightSeat }
  const presets: Record<ScenarioId, string> = {
    allSafe: t.presetAllSafe, driverUnbelted: t.presetDriver,
    rearUnbelted: t.presetRear, unbucklesMoving: t.presetUnbuckle, stopped: t.presetStopped,
  }
  function changeSeat(id: SeatId, value: SeatState) {
    dispatch({ type: 'setSeat', seat: id, value })
    setMessage('')
    setActiveScenario(null)
  }
  function applyScenario(scenario: ScenarioId) {
    dispatch({ type: 'applyScenario', scenario })
    setActiveScenario(scenario)
    setMessage(scenario === 'unbucklesMoving' ? 'unbuckleReady' : '')
  }
  function unbuckle() {
    dispatch({ type: 'setSeat', seat: 'rearLeft', value: unbuckleRearLeft(state) })
    setMessage('unbuckleDone')
    setActiveScenario(null)
  }
  const canUnbuckle = state.speedKmh > 0 && state.seats.rearLeft.occupied && state.seats.rearLeft.belted
  return <Section id="playground" title={t.playground}>
    <div className="playground-content space-y-6">
      <div>
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="speed" className="text-sm font-medium">{t.speed}</label>
          <Magnet padding={8} magnetStrength={20} maxOffset={2}><output htmlFor="speed" className="font-mono text-xl font-semibold tabular-nums text-accent">{state.speedKmh} <span className="text-xs">km/h</span></output></Magnet>
        </div>
        <input id="speed" type="range" min="0" max="120" step="5" value={state.speedKmh}
          style={{ '--range-progress': `${state.speedKmh / 120 * 100}%` } as CSSProperties}
          onChange={e => { dispatch({ type: 'setSpeed', value: Number(e.target.value) }); setMessage(''); setActiveScenario(null) }}
          className="my-2 min-h-11 w-full accent-accent" />
        <div className="flex justify-between font-mono text-xs text-muted"><span>0</span><span>120 km/h</span></div>
        {!state.seats.driver.occupied && <p className="mt-2 text-xs text-amber-300">{t.driverRequired}</p>}
      </div>
      <fieldset className="space-y-3 border-t border-border pt-5">
        <legend className="float-left mb-3 w-full text-sm font-semibold">{t.seatControls}</legend>
        {seatIds.map(id => {
          const seat = state.seats[id]
          return <div key={id} className="seat-control rounded border border-border bg-[#0c1a24] p-3" data-state={!seat.occupied ? 'empty' : seat.belted ? 'safe' : 'warning'}>
            <p className="mb-2 text-sm font-medium">{labels[id]}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
              <label className="inline-flex min-h-11 cursor-pointer items-center gap-2">
                <input type="checkbox" checked={seat.occupied} disabled={id === 'driver' && derived.moving}
                  onChange={e => changeSeat(id, e.target.checked ? { occupied: true, belted: false } : { occupied: false, belted: false })}
                  className="size-5 accent-accent disabled:cursor-not-allowed" />{t.occupiedControl}
              </label>
              <label className="inline-flex min-h-11 cursor-pointer items-center gap-2">
                <input type="checkbox" checked={seat.belted} disabled={!seat.occupied}
                  onChange={e => changeSeat(id, { occupied: true, belted: e.target.checked })}
                  className="size-5 accent-accent disabled:cursor-not-allowed" />{t.beltedControl}
              </label>
            </div>
          </div>
        })}
        <p className="clear-both text-xs text-muted">{t.driverConstraint}</p>
      </fieldset>
      <fieldset className="border-t border-border pt-5">
        <legend className="float-left mb-3 w-full text-sm font-semibold">{t.scenarioPresets}</legend>
        <div className="grid clear-both gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {scenarioIds.map(id => <Magnet key={id} padding={8} magnetStrength={20} maxOffset={3} wrapperClassName="preset-magnet"><button type="button" aria-pressed={activeScenario === id} onClick={() => applyScenario(id)}
            className="min-h-11 rounded border border-border px-3 py-2 text-left text-sm hover:border-accent hover:bg-[#15303a]">{presets[id]}</button></Magnet>)}
        </div>
        {canUnbuckle && <button type="button" onClick={unbuckle}
          className="mt-3 min-h-11 w-full rounded border border-amber-500 px-3 py-2 text-left text-sm text-amber-200 hover:bg-[#45331c]">{t.triggerUnbuckle}</button>}
      </fieldset>
      <div className="border-t border-border pt-4">
        <Magnet padding={8} magnetStrength={20} maxOffset={3}><button type="button" onClick={() => { dispatch({ type: 'reset' }); setMessage('resetDone'); setActiveScenario(null) }}
          className="min-h-11 rounded border border-border px-4 text-sm hover:border-accent">{t.reset}</button></Magnet>
        <p role="status" className="mt-2 min-h-5 text-sm text-muted">{message ? t[message] : ''}</p>
      </div>
    </div>
  </Section>
}
