import { useState } from 'react'
import type { CSSProperties } from 'react'
import { Section } from './Layout'
import { useCopy, useSimulation } from '../simulation/context'
import { drivingPresentation } from '../simulation/driving'
import './SideView.css'

function Wheel({ x }: { x: number }) {
  return <g transform={`translate(${x} 194)`}>
    <circle r="27" fill="var(--tire)" stroke="var(--rim)" strokeWidth="3" />
    <g className="drive-wheel">
      <circle r="16" fill="var(--trim)" stroke="var(--chrome)" strokeWidth="2" />
      <path d="M-16 0H16M0 -16V16M-11 -11L11 11M-11 11L11 -11" stroke="var(--chrome)" strokeWidth="2" />
    </g>
    <circle r="4" fill="var(--chrome)" />
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
    <div className="drive-scene overflow-hidden rounded-md border border-border" data-running={motion.moving && !paused} data-warning={motion.alert} style={style}>
      <svg viewBox="0 0 560 265" role="img" aria-labelledby="drive-title drive-desc" className="block w-full">
        <title id="drive-title">{t.side}</title>
        <desc id="drive-desc">{motion.moving ? t.driveMoving : t.driveStopped}. {state.speedKmh} km/h. {advisory}</desc>
        <defs>
          <linearGradient id="city-sky" x2="0" y2="1"><stop stopColor="var(--sky)" /><stop offset="1" stopColor="var(--horizon)" /></linearGradient>
          <linearGradient id="car-paint" x2="0" y2="1"><stop stopColor="var(--car-light)" /><stop offset=".5" stopColor="var(--car)" /><stop offset="1" stopColor="var(--car-dark)" /></linearGradient>
        </defs>
        <path d="M0 0H560V265H0Z" fill="url(#city-sky)" />
        <circle cx="462" cy="45" r="23" fill="var(--sun)" />
        <g aria-hidden="true" fill="var(--building-alt)" opacity=".65">
          <path d="M0 162Q45 112 94 139Q151 77 206 128Q259 96 308 143Q375 95 436 140Q501 104 560 153V178H0Z" />
          <path d="M102 139L107 62H113L118 139ZM103 62V53H117V62ZM109 53V28H111V53Z" />
          <path d="M99 53H121V48H99Z" />
        </g>
        <g className="drive-parallax" stroke="var(--building-line)" strokeWidth="1.5">
          {[0, 1, 2, 3, 4, 5, 6].map(i => <g key={i} transform={`translate(${i * 120} 0)`}>
            <path d="M0 166V94H34V166Z" fill={i % 2 ? 'var(--building)' : 'var(--building-alt)'} />
            <path d="M48 166V63H90V166Z" fill={i % 2 ? 'var(--building-alt)' : 'var(--building)'} />
            <path d="M8 108H26M8 123H26M8 138H26M57 79H81M57 96H81M57 113H81M57 130H81" stroke="var(--window)" strokeWidth="4" />
          </g>)}
        </g>
        <path d="M0 162H560V186H0Z" fill="var(--verge)" />
        <path d="M0 178H560V197H0Z" fill="var(--pavement)" />
        <path d="M0 197H560V265H0Z" fill="var(--road)" />
        <path d="M0 200H560" stroke="var(--marking)" strokeWidth="3" />
        <ellipse cx="285" cy="216" rx="178" ry="10" fill="var(--scene-shadow)" opacity=".22" />
        <g className="drive-road" stroke="var(--marking)" strokeWidth="3">
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${i * 80} 244h35`} />)}
        </g>
        <path d="M119 180V157Q119 147 139 144L184 136L225 95Q232 89 244 89H327Q343 90 354 102L389 139L437 150Q448 154 448 170V191H119Z" fill="url(#car-paint)" stroke="var(--car-dark)" strokeWidth="2" />
        <path d="M204 134L238 102H272V134ZM282 102H324Q333 102 341 112L363 134H282Z" fill="var(--glass)" stroke="var(--glass-edge)" strokeWidth="1.5" />
        <g fill="none" stroke="var(--chrome)" strokeWidth="1.2"><path d="M238 101L221 132M272 102V134M283 102V134M338 109L354 132" /><path d="M186 137H390M156 157H182M389 158H422" stroke="var(--car-dark)" /><path d="M123 177H146M420 180H447" /></g>
        <path d="M237 111Q248 107 253 117L254 132H231Z M304 110Q316 105 322 118L323 133H300Z" fill="var(--person-shirt)" stroke="var(--person)" strokeWidth="1" />
        <g stroke="var(--seat-safe)" strokeWidth="2">{state.seats.rearLeft.occupied && state.seats.rearLeft.belted && <path d="M243 117L254 132" />}{state.seats.driver.occupied && state.seats.driver.belted && <path d="M309 117L322 132" />}</g>
        <g fill="var(--car-dark)" stroke="var(--car-edge)" strokeWidth="1"><path d="M125 152L110 147L109 163L125 164Z" /><path d="M438 152L451 151L453 170L440 169Z" /><rect x="263" y="149" width="10" height="3" rx="1" /><rect x="336" y="149" width="10" height="3" rx="1" /></g>
        <path d="M125 182Q160 187 184 180M205 181Q297 189 365 181M406 180Q426 186 447 180" fill="none" stroke="var(--car-light)" strokeWidth="1.2" />
        <path d="M184 154Q169 155 163 170M384 154Q401 155 406 170" fill="none" stroke="var(--car-dark)" strokeWidth="2" />
        <path d="M207 96H325" stroke="var(--car-edge)" strokeWidth="1.2" />
        <path d="M118 173H125M440 173H449" stroke="var(--sun)" strokeWidth="4" />
        <g fill="var(--chrome)"><circle cx="176" cy="145" r="2"/><circle cx="383" cy="145" r="2"/></g>
        <path d="M276 144V188M204 148V181M357 146V177M121 166H142M425 163H445" stroke="var(--car-dark)" strokeWidth="2" />
        <path d="M249 147H262M331 147H344" stroke="var(--chrome)" strokeWidth="3" />
        <Wheel x={185} /><Wheel x={385} />
        <g className="drive-indicator" visibility={motion.alert ? 'visible' : 'hidden'}>
          <rect x="226" y="43" width="108" height="28" rx="4" fill="var(--critical-bg)" stroke="var(--critical)" />
          <text x="280" y="62" textAnchor="middle" fill="var(--critical)" fontSize="12" fontFamily="monospace">! {t.driveAlert}</text>
        </g>
      </svg>
    </div>
    <p role="status" className={`mt-4 rounded border p-3 text-sm leading-relaxed ${motion.alert ? 'drive-advisory-alert' : 'border-border text-muted'}`}>{advisory}</p>
    <p className="mt-3 text-xs text-muted">{t.driveDisclaimer}</p>
  </Section>
}
