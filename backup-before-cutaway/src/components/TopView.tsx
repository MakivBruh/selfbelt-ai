import { Section } from './Layout'
import { useCopy, useSimulation } from '../simulation/context'
import { seatVisual } from '../simulation/cabin'
import type { SeatId, SeatState } from '../simulation/model'

type SeatVisual = ReturnType<typeof seatVisual>
const seats: { id: SeatId; x: number; y: number; code: string }[] = [
  { id: 'driver', x: 89, y: 127, code: '01' },
  { id: 'rearLeft', x: 89, y: 275, code: '02' },
  { id: 'rearRight', x: 231, y: 275, code: '03' },
]
const palette: Record<SeatVisual, { stroke: string; fill: string; text: string }> = {
  empty: { stroke: '#667889', fill: '#192a36', text: '#abb9c7' },
  secured: { stroke: '#73d5aa', fill: '#173c37', text: '#adf0cf' },
  unbelted: { stroke: '#ffbe63', fill: '#463421', text: '#ffe0ad' },
}
const movingAlert = { stroke: '#ff897d', fill: '#472728', text: '#ffd0cb' }
function seatColor(status: SeatVisual, moving: boolean) {
  return status === 'unbelted' && moving ? movingAlert : palette[status]
}
function SeatGlyph({ x, y, status, moving, code }: { x: number; y: number; status: SeatVisual; moving: boolean; code: string }) {
  const c = seatColor(status, moving)
  return <g transform={`translate(${x} ${y})`}>
    <rect x="-46" y="-51" width="92" height="106" rx="13" fill="#0d1b26" stroke={c.stroke} strokeWidth="2" />
    <path d="M-29 -51 V-62 Q0 -73 29 -62 V-51" fill="none" stroke={c.stroke} strokeWidth="2" />
    {status !== 'empty' && <>
      <circle cx="0" cy="-26" r="10" fill={c.stroke} />
      <path d="M-18 3 Q0 -12 18 3 L22 33 H-22Z" fill={c.fill} stroke={c.stroke} strokeWidth="2" />
      {status === 'secured' && <path d="M-21 -3 L18 35" stroke={c.stroke} strokeWidth="5" strokeLinecap="round" />}
      {status === 'unbelted' && <path d="M0 5 V19 M0 26 V28" stroke={c.stroke} strokeWidth="4" strokeLinecap="round" />}
    </>}
    {status === 'empty' && <path d="M-17 -12 H17 M-17 10 H17" stroke={c.stroke} strokeWidth="2" strokeDasharray="5 5" />}
    <text x="-33" y="47" fontSize="10" fill={c.text} fontFamily="monospace">{code}</text>
  </g>
}
export function TopView() {
  const t = useCopy()
  const { state, dispatch, derived } = useSimulation()
  const labels: Record<SeatId, string> = { driver: t.driverSeat, rearLeft: t.rearLeftSeat, rearRight: t.rearRightSeat }
  const statusText: Record<SeatVisual, string> = { empty: t.emptySeat, secured: t.securedSeat, unbelted: t.unbeltedSeat }
  function cycle(id: SeatId, seat: SeatState) {
    const value: SeatState = id === 'driver'
      ? { occupied: true, belted: !seat.belted }
      : !seat.occupied ? { occupied: true, belted: true }
      : seat.belted ? { occupied: true, belted: false }
      : { occupied: false, belted: false }
    dispatch({ type: 'setSeat', seat: id, value })
  }
  return <Section id="top-view" title={t.top}>
    <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(185px,.7fr)]">
      <div className="min-w-0 rounded-md border border-border bg-[#0b1720] p-3 sm:p-5">
        <div className="mb-3 flex justify-between text-[11px] font-semibold tracking-[.13em] text-muted"><span>{t.cabinDiagram}</span><span>{t.manual}</span></div>
        <svg viewBox="0 0 320 420" className="mx-auto block w-full max-w-[340px]" role="img" aria-labelledby="cabin-svg-title cabin-svg-description">
          <title id="cabin-svg-title">{t.top}</title>
          <desc id="cabin-svg-description">{seats.map(({ id }) => `${labels[id]}: ${statusText[seatVisual(state.seats[id], derived.moving)]}`).join('; ')}</desc>
          <path d="M56 40 Q160 2 264 40 L282 95 V351 Q160 390 38 351 V95Z" fill="#122431" stroke="#597184" strokeWidth="3" />
          <path d="M66 57 Q160 29 254 57 L263 88 H57Z" fill="#173846" stroke="#497a8d" strokeWidth="2" />
          <path d="M59 239 H261" stroke="#526a7a" strokeDasharray="5 6" strokeWidth="2" />
          <text x="160" y="26" textAnchor="middle" fill="#aec5d1" fontSize="11" fontFamily="monospace">{t.front}</text>
          <text x="160" y="400" textAnchor="middle" fill="#aec5d1" fontSize="11" fontFamily="monospace">{t.rear}</text>
          {seats.map(({ id, x, y, code }) => <SeatGlyph key={id} x={x} y={y} code={code} moving={derived.moving} status={seatVisual(state.seats[id], derived.moving)} />)}
          <path d="M185 97 H269 V208 H185Z" fill="none" stroke="#3e5666" strokeWidth="2" strokeDasharray="5 5" />
          <text x="227" y="158" textAnchor="middle" fill="#8299a8" fontSize="10" fontFamily="monospace">—</text>
        </svg>
      </div>
      <div>
        <p className="mb-3 text-xs leading-relaxed text-muted">{t.seatHint}</p>
        <ul className="space-y-2">
          {seats.map(({ id, code }) => {
            const seat = state.seats[id]
            const status = seatVisual(seat, derived.moving)
            const c = seatColor(status, derived.moving)
            return <li key={id}>
              <button type="button" onClick={() => cycle(id, seat)} aria-label={`${labels[id]}: ${statusText[status]}. ${t.changeSeat}`} className="flex min-h-16 w-full items-center gap-3 rounded-md border border-border bg-[#0c1a24] px-3 text-left transition-colors hover:border-accent focus-visible:border-accent">
                <span className="font-mono text-xs text-muted">{code}</span>
                <span className="min-w-0 flex-1"><strong className="block text-sm font-medium">{labels[id]}</strong><span className="block text-xs" style={{ color: c.text }}>{statusText[status]}</span></span>
                <span aria-hidden="true" className="size-2.5 rounded-full" style={{ backgroundColor: c.stroke }} />
              </button>
            </li>
          })}
        </ul>
        <div className="mt-5 border-t border-border pt-4 text-xs text-muted">
          <p className="mb-2 font-semibold text-white">{t.legend}</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">{(['empty', 'secured', 'unbelted'] as const).map(status => <li key={status} className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ backgroundColor: seatColor(status, derived.moving).stroke }} />{statusText[status]}</li>)}</ul>
        </div>
      </div>
    </div>
  </Section>
}
