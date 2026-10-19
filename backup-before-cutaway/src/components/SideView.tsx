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
