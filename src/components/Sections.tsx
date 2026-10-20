import { Section } from './Layout'
import { useCopy, useSimulation } from '../simulation/context'

export function Hero() {
  const t = useCopy()
  return <section id="hero" aria-labelledby="hero-heading" className="grid gap-4 py-6 lg:grid-cols-[1fr_minmax(280px,.65fr)] lg:items-end lg:py-8">
    <div>
      <h1 id="hero-heading" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{t.title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{t.intro}</p>
    </div>
    <div className="hero-note lg:justify-self-end">
      <svg className="hero-emblem" viewBox="0 0 240 100" aria-hidden="true">
        <path d="M0 50H240M120 0V100" stroke="var(--line)" strokeWidth="1" />
        <circle cx="120" cy="50" r="42" fill="none" stroke="var(--line)" />
        <path d="M90 50a30 30 0 0 1 60 0a15 15 0 0 0-30 0a15 15 0 0 1-30 0Z" fill="var(--brand-red)" />
        <path d="M90 50a15 15 0 0 0 30 0a15 15 0 0 1 30 0a30 30 0 0 1-60 0Z" fill="var(--accent)" />
        <path d="M24 39H47M24 46H47M193 54H216M193 61H216" stroke="var(--ink)" strokeWidth="2" />
      </svg>
      <p className="max-w-lg text-xs leading-relaxed text-muted">{t.disclaimer}</p>
    </div>
  </section>
}
export function Dashboard() {
  const t = useCopy()
  const { state, derived } = useSimulation()
  const levels = { safe: t.levelSafe, notice: t.levelNotice, warning: t.levelWarning, critical: t.levelCritical }
  const colors = { safe: 'status-safe', notice: 'status-notice', warning: 'status-warning', critical: 'status-critical' }
  const stats = [[t.speed, `${state.speedKmh} km/h`], [t.occupants, `${derived.occupiedCount} / ${Object.keys(state.seats).length}`], [t.source, t.manual]]
  return <Section id="dashboard" title={t.dashboard}><dl className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
    <div><dt className="text-xs text-muted">{t.logicAlert}</dt><dd className={`mt-2 text-lg font-semibold ${colors[derived.level]}`}>{levels[derived.level]}</dd></div>
    {stats.map(([label, value]) => <div key={label}><dt className="text-xs text-muted">{label}</dt><dd className="mt-2 font-mono text-lg font-medium tabular-nums">{value}</dd></div>)}
  </dl></Section>
}
export function SystemFlow() {
  const t = useCopy()
  return <Section id="system-flow" title={t.flow}><ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
    {t.flowSteps.map((step, i) => <li key={i} className="border-t border-border pt-3 text-sm"><span className="mb-2 block font-mono text-accent">0{i + 1}</span>{step}</li>)}
  </ol></Section>
}
export function Footer() { const t = useCopy(); return <footer className="mt-8 border-t border-border py-6 text-sm text-muted">{t.footer}</footer> }
