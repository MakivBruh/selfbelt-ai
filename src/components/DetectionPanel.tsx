import type { PropsWithChildren } from 'react'
import { Section } from './Layout'
import { useCopy, useSimulation } from '../simulation/context'
import type { AlertLevel } from '../simulation/detection'
import type { SeatId } from '../simulation/model'

const seatIds: SeatId[] = ['driver', 'frontPassenger', 'rearLeft', 'rearRight']
const colors: Record<AlertLevel, string> = {
  safe: 'status-safe',
  notice: 'status-notice',
  warning: 'status-warning',
  critical: 'status-critical',
}
function LogicBlock({ number, title, children }: PropsWithChildren<{ number: string; title: string }>) {
  return <div className="border-t border-border pt-4">
    <h3 className="mb-3 flex gap-3 text-sm font-semibold"><span className="font-mono text-accent">{number}</span>{title}</h3>
    {children}
  </div>
}
function LevelBadge({ level, label }: { level: AlertLevel; label: string }) {
  return <span className={`status-badge inline-flex rounded border px-2 py-1 text-xs font-semibold ${colors[level]}`}>{label}</span>
}
export function DetectionPanel() {
  const t = useCopy()
  const { state, derived } = useSimulation()
  const names = { driver: t.driverSeat, frontPassenger: t.frontPassengerSeat, rearLeft: t.rearLeftSeat, rearRight: t.rearRightSeat }
  const levels: Record<AlertLevel, string> = { safe: t.levelSafe, notice: t.levelNotice, warning: t.levelWarning, critical: t.levelCritical }
  return <Section id="detection" title={t.detection}>
    <p className="mb-5 text-xs leading-relaxed text-muted">{t.logicDisclaimer}</p>
    <div className="grid gap-5 md:grid-cols-2">
      <LogicBlock number="01" title={t.logicInputs}>
        <dl className="mb-4 grid grid-cols-2 gap-2 text-xs">
          <dt className="text-muted">{t.source}</dt><dd className="text-right">{t.manual}</dd>
          <dt className="text-muted">{t.speed}</dt><dd className="text-right font-mono">{state.speedKmh} km/h</dd>
        </dl>
        <table className="w-full text-left text-xs">
          <caption className="sr-only">{t.seatControls}</caption>
          <thead className="text-muted"><tr><th scope="col" className="pb-2 font-medium">{t.logicSeat}</th><th scope="col" className="pb-2 font-medium">{t.occupiedControl}</th><th scope="col" className="pb-2 font-medium">{t.buckleShort}</th><th scope="col" className="pb-2 font-medium">{t.cameraShort}</th></tr></thead>
          <tbody>{seatIds.map(id => <tr key={id} className="border-t border-border">
            <th scope="row" className="py-2 pr-2 font-medium">{names[id]}</th>
            <td className="py-2 font-mono">{state.seats[id].occupied ? t.yes : t.no}</td>
            <td className="py-2 font-mono">{state.seats[id].belted ? t.yes : t.no}</td>
            <td className="py-2 font-mono">{state.seats[id].cameraBelt ? t.yes : t.no}</td>
          </tr>)}</tbody>
        </table>
        
      </LogicBlock>
      <LogicBlock number="02" title={t.logicConditions}>
        <p className="mb-3 font-mono text-xs text-accent">speedKmh &gt; 0 = {derived.moving ? t.yes : t.no}</p>
        <ul className="space-y-3">{seatIds.map(id => <li key={id} className="text-sm leading-relaxed">
          <p>{derived.seats[id].interpretation}</p>
          <div className="mt-1"><LevelBadge level={derived.seats[id].level} label={levels[derived.seats[id].level]} /></div>
        </li>)}</ul>
      </LogicBlock>
      <LogicBlock number="03" title={t.logicResult}>
        <p role="status" aria-live="polite" aria-atomic="true" className="flex flex-wrap items-center gap-3 text-sm"><span>{t.logicAlert}</span><LevelBadge level={derived.level} label={levels[derived.level]} /></p>
        <p className="mt-3 text-xs leading-relaxed text-muted">{t.logicPriority}</p>
        <p className="mt-3 text-xs leading-relaxed text-muted">{t.safetyTiming} {t.safetyPolicy}</p>
      </LogicBlock>
      <LogicBlock number="04" title={t.logicActions}>
        {derived.recommendations.length ? <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed">{derived.recommendationTexts.map((text, i) => <li key={derived.recommendations[i]}>{text}</li>)}</ul>
          : <p className="text-sm leading-relaxed text-muted">{t.logicNoAction}</p>}
      </LogicBlock>
    </div>
  </Section>
}
