import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Section } from './Layout'
import { useCopy, useSimulation } from '../simulation/context'
import { drivingPresentation } from '../simulation/driving'
import './SideView.css'

function Wheel({ x }: { x: number }) {
  return <g transform={`translate(${x} 194)`}>
    <circle r="27" fill="#0b121b" stroke="#617487" strokeWidth="3" />
    <g className="drive-wheel">
      <circle r="16" fill="#233442" stroke="#9eb2c3" strokeWidth="2" />
      <path d="M-16 0H16M0 -16V16M-11 -11L11 11M-11 11L11 -11" stroke="#9eb2c3" strokeWidth="2" />
    </g>
    <circle r="4" fill="#c3d4df" />
  </g>
}
export function SideView() {
  const t = useCopy()
  const { state, derived } = useSimulation()
  const [paused, setPaused] = useState(false)
  const motion = drivingPresentation(state.speedKmh, derived.level)
  const style = {
    '--road-duration': `${motion.roadSeconds || 1}s`,
    '--wheel-duration': `${motion.wheelSeconds || 1}s`,
    '--far-duration': `${(motion.roadSeconds || 1) * 5}s`,
  } as CSSProperties
  const advisory = motion.alert ? t.driveDanger : derived.level === 'notice' ? t.driveNotice : t.driveSafe
  return <Section id="side-view" title={t.side}>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <p className="font-mono text-xs tracking-wide text-muted">{motion.moving ? t.driveMoving : t.driveStopped} · <span className="text-accent">{state.speedKmh} km/h</span></p>
      <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)} className="min-h-11 rounded border border-border px-3 text-xs hover:border-accent">{paused ? t.driveResume : t.drivePause}</button>
    </div>
    <div className="drive-scene overflow-hidden rounded-md border border-border bg-[#0b1720]" data-running={motion.moving && !paused} data-warning={motion.alert} style={style}>
      <svg viewBox="0 0 560 265" role="img" aria-labelledby="drive-title drive-desc" className="block w-full">
        <title id="drive-title">{t.side}</title>
        <desc id="drive-desc">{motion.moving ? t.driveMoving : t.driveStopped}. {state.speedKmh} km/h. {advisory}</desc>
        <g className="drive-parallax" stroke="#314957" fill="none" strokeWidth="1.5">
          {[0, 1, 2, 3, 4, 5, 6].map(i => <path key={i} transform={`translate(${i * 120} 0)`} d="M0 137V100H34V137M48 137V74H90V137M0 137H120" />)}
        </g>
        <path d="M0 220H560" stroke="#607785" strokeWidth="2" />
        <g className="drive-road" stroke="#8095a3" strokeWidth="3">
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${i * 80} 244h35`} />)}
        </g>
        <path d="M119 180V157Q119 147 139 144L184 136L225 95Q232 89 244 89H327Q343 90 354 102L389 139L437 150Q448 154 448 170V191H119Z" fill="#263d4b" stroke="#91aabb" strokeWidth="2" />
        <path d="M204 134L238 102H272V134ZM282 102H324Q333 102 341 112L363 134H282Z" fill="#14313e" stroke="#6f9cac" strokeWidth="1.5" />
        <g fill="none" stroke="#aac0c9" strokeWidth="1.2"><path d="M238 101L221 132M272 102V134M283 102V134M338 109L354 132" /><path d="M186 137H390M156 157H182M389 158H422" stroke="#425f6e" /><path d="M123 177H146M420 180H447" /></g>
        <path d="M237 111Q248 107 253 117L254 132H231Z M304 110Q316 105 322 118L323 133H300Z" fill="#405b69" stroke="#9ab3c0" strokeWidth="1" />
        <g stroke="#78d7b1" strokeWidth="2">{state.seats.rearLeft.occupied && state.seats.rearLeft.belted && <path d="M243 117L254 132" />}{state.seats.driver.occupied && state.seats.driver.belted && <path d="M309 117L322 132" />}</g>
        <g fill="#162831" stroke="#8caab9" strokeWidth="1"><path d="M125 152L110 147L109 163L125 164Z" /><path d="M438 152L451 151L453 170L440 169Z" /><rect x="263" y="149" width="10" height="3" rx="1" /><rect x="336" y="149" width="10" height="3" rx="1" /></g>
        <path d="M125 182Q160 187 184 180M205 181Q297 189 365 181M406 180Q426 186 447 180" fill="none" stroke="#91a9b6" strokeWidth="1.2" />
        <path d="M184 154Q169 155 163 170M384 154Q401 155 406 170" fill="none" stroke="#7390a0" strokeWidth="2" />
        <path d="M207 96H325" stroke="#b4c8d0" strokeWidth="1.2" />
        <path d="M118 173H125M440 173H449" stroke="#e7c69c" strokeWidth="4" />
        <g fill="#a9bbc4"><circle cx="176" cy="145" r="2"/><circle cx="383" cy="145" r="2"/></g>
        <path d="M276 144V188M204 148V181M357 146V177M121 166H142M425 163H445" stroke="#7897a9" strokeWidth="2" />
        <path d="M249 147H262M331 147H344" stroke="#c1d5e1" strokeWidth="3" />
        <Wheel x={185} /><Wheel x={385} />
        <g className="drive-indicator" visibility={motion.alert ? 'visible' : 'hidden'}>
          <rect x="226" y="43" width="108" height="28" rx="4" fill="#442623" stroke="#ff897d" />
          <text x="280" y="62" textAnchor="middle" fill="#ffd0cb" fontSize="12" fontFamily="monospace">! {t.driveAlert}</text>
        </g>
      </svg>
    </div>
    <p role="status" className={`mt-4 rounded border p-3 text-sm leading-relaxed ${motion.alert ? 'border-[#95544d] bg-[#30201f] text-[#ffd0cb]' : 'border-border text-muted'}`}>{advisory}</p>
    <p className="mt-3 text-xs text-muted">{t.driveDisclaimer}</p>
  </Section>
}
