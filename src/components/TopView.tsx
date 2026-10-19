import { useState } from 'react'
import type { CSSProperties } from 'react'
import { drivingPresentation } from '../simulation/driving'
import './TopView.css'
import { Section } from './Layout'
import { SeatLayer } from './vehicle/SeatLayer'
import { useCopy, useSimulation } from '../simulation/context'
import type { SeatId } from '../simulation/model'
const positions: { id: SeatId; x: number; y: number }[] = [
  { id: 'driver', x: 155, y: 310 }, { id: 'frontPassenger', x: 285, y: 310 }, { id: 'rearLeft', x: 155, y: 470 }, { id: 'rearRight', x: 285, y: 470 },
]
export function TopView() {
  const t = useCopy()
  const { state, derived, dispatch } = useSimulation()
  const [selected, setSelected] = useState<SeatId>('driver')
  const [paused, setPaused] = useState(false)
  const motion = drivingPresentation(state.speedKmh, derived.level)
  const style = { '--top-road-duration': `${motion.roadSeconds || 1}s` } as CSSProperties
  const names = { driver: t.driverSeat, frontPassenger: t.frontPassengerSeat, rearLeft: t.rearLeftSeat, rearRight: t.rearRightSeat }
  const seat = state.seats[selected]
  return <Section id="top-view" title={t.top}>
    <p className="mb-4 text-xs text-muted">{t.cutawayNote}</p>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <p className="font-mono text-xs text-muted">{motion.moving ? t.driveMoving : t.driveStopped} · <span className="text-accent">{state.speedKmh} km/h</span></p>
      <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)} className="min-h-11 rounded border border-border px-3 text-xs hover:border-accent">{paused ? t.driveResume : t.drivePause}</button>
    </div>
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_180px]">
      <svg viewBox="0 0 440 700" role="group" aria-label={t.cabinDiagram} data-running={motion.moving && !paused} style={style} className="top-drive-scene mx-auto w-full max-w-[440px] overflow-hidden rounded bg-[#0a1720]">
        <g aria-hidden="true" pointerEvents="none">
          <path d="M20 0H420V700H20Z" fill="#14232d" />
          <path d="M14 0V700M426 0V700" stroke="#526a78" strokeWidth="2" />
          <g className="top-road-markings" stroke="#91a8b5" strokeWidth="4">
            {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M42 ${i * 80 - 80}v38M398 ${i * 80 - 80}v38`} />)}
          </g>
        </g>
        <g id="body-layer" stroke="#8da5b4" strokeWidth="2">
          <path d="M114 52Q220 18 326 52Q350 66 352 124L357 580Q350 635 321 657Q220 685 119 657Q90 635 83 580L88 124Q90 66 114 52Z" fill="#354d5b" />
          <path d="M115 73Q220 44 325 73L333 177H107Z" fill="#263d49" />
          <path d="M124 87Q220 64 316 87M120 105L113 158M320 105L327 158" fill="none" stroke="#597583" />
          <path d="M108 183Q220 162 332 183L320 232H120Z" fill="#17333f" />
          <path d="M106 242H334V555Q220 578 106 555Z" fill="#101f29" />
          <path d="M111 572Q220 598 329 572L318 620Q220 645 122 620Z" fill="#17333f" />
          <path d="M110 642Q220 665 330 642" fill="none" />
          <path d="M93 243L72 230Q58 234 63 251L88 262M347 243L368 230Q382 234 377 251L352 262" fill="#364e5d" />
          <path d="M89 160L78 160V239H88M351 160H362V239H352M85 490H75V570H85M355 490H365V570H355" stroke="#070e14" strokeWidth="9" />
          <path d="M102 254V391M102 405V546M338 254V391M338 405V546" stroke="#92adbb" strokeWidth="3" />
          <path d="M103 394H337" stroke="#314b5b" strokeDasharray="4 5" />
          <path d="M108 240Q220 219 332 240L328 264H112Z" fill="#364e5c" />
          <rect x="204" y="239" width="34" height="20" rx="2" fill="#101b24" />
          <path d="M208 272H232L240 385H200Z" fill="#304652" />
          <rect x="213" y="305" width="14" height="30" rx="4" fill="#0d1c26" />
          <circle cx="220" cy="357" r="7" fill="#15232b" /><circle cx="220" cy="376" r="7" fill="#15232b" />
        </g>
        <g id="interactive-seats">{positions.map(({ id, x, y }) => <g key={id} role="button" tabIndex={0} aria-label={names[id]} aria-pressed={selected === id} aria-controls="seat-inspector" onClick={() => setSelected(id)} onKeyDown={e => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(id) } }} className="cursor-pointer focus:outline-none" >
          <SeatLayer x={x} y={y} seat={state.seats[id]} moving={derived.moving} selected={selected === id} />
          <rect x={x-50} y={y-70} width="100" height="142" fill="transparent" />
          <text x={x} y={y+84} textAnchor="middle" fill="#e0ebf1" fontSize="12">{names[id]}</text>
        </g>)}</g>
        <g id="steering-layer" transform="translate(155 264)" fill="none" stroke="#b7cbd6" strokeWidth="4"><circle r="23" /><path d="M-21 0H21M0 0V21" /><circle r="6" fill="#344c5b" /></g>
        <text x="220" y="24" textAnchor="middle" fill="#a4bdc9" fontSize="12">{t.front}</text>
      </svg>
      <div id="seat-inspector" className="self-start border-t border-border pt-4" aria-label={t.seatControls}>
        <p className="text-xs text-accent">{t.selectedSeat}</p><h3 className="my-3 font-semibold">{names[selected]}</h3>
        <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" className="size-5 accent-accent" checked={seat.occupied} disabled={selected === 'driver' && derived.moving} onChange={e => dispatch({ type:'setSeat',seat:selected,value:e.target.checked ? {occupied:true,belted:false} : {occupied:false,belted:false} })} />{t.occupiedControl}</label>
        <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" className="size-5 accent-accent" checked={seat.belted} disabled={!seat.occupied} onChange={e=>dispatch({type:'setSeat',seat:selected,value:{occupied:true,belted:e.target.checked}})} />{t.beltedControl}</label>
        <p className="mt-4 text-sm leading-relaxed text-muted" role="status">{derived.seats[selected].interpretation}</p>
        <p className="mt-4 text-xs leading-relaxed text-muted">{t.driverConstraint}</p>
      </div>
    </div>
  </Section>
}

