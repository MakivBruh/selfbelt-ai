import type { SeatState } from '../../simulation/model'
export function SeatLayer({ x, y, seat, moving, selected = false }: { x: number; y: number; seat: SeatState; moving: boolean; selected?: boolean }) {
  const color = !seat.occupied ? 'var(--seat-empty)' : seat.belted && seat.cameraBelt ? 'var(--seat-safe)' : moving ? 'var(--seat-critical)' : 'var(--seat-warning)'
  return <g transform={`translate(${x} ${y})`}>
    {selected && <rect x="-49" y="-70" width="98" height="142" rx="15" fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="5 4" />}
    <path d="M-36 -48Q-44 -45 -43 -25L-38 48Q0 62 38 48L43 -25Q44 -45 36 -48Z" fill="var(--seat)" stroke={color} strokeWidth="2" />
    <path d="M-25 -40H25L30 34Q0 44 -30 34Z" fill="var(--seat-inset)" stroke="var(--seat-line)" />
    <path d="M-29 -14H29M-30 3H30M-30 20H30" stroke="var(--seat-line)" />
    <rect x="-24" y="-64" width="48" height="22" rx="8" fill="var(--seat)" stroke={color} />
    {seat.occupied && <g>
      <path d="M-16 -15Q-29 -7 -26 17L-18 34L-22 53M16 -15Q29 -7 26 17L18 34L22 53" fill="none" stroke="var(--person)" strokeWidth="11" strokeLinecap="round" />
      <path d="M-16 -18Q0 -26 16 -18L18 28Q0 38 -18 28Z" fill="var(--person-shirt)" />
      <ellipse cy="-33" rx="15" ry="17" fill="var(--person-head)" />
    </g>}
    <path d={seat.cameraBelt && seat.occupied ? 'M-39 -42L25 29L-29 34' : 'M-39 -42L-39 32'} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
    <rect x="23" y="24" width="10" height="14" rx="2" fill={seat.belted ? color : 'var(--seat-critical)'} stroke="var(--cabin)" />
  </g>
}
