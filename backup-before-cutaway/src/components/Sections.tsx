import { Section } from './Layout'
import { useCopy, useSimulation } from '../simulation/context'

export function Hero() {
  const t = useCopy()
  return <section id="hero" aria-labelledby="hero-heading" className="grid gap-4 py-6 lg:grid-cols-[1fr_minmax(280px,.65fr)] lg:items-end lg:py-8">
    <div>
      <p className="text-[11px] font-semibold tracking-[.14em] text-accent">{t.prototype}</p>
      <h1 id="hero-heading" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{t.title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{t.intro}</p>
    </div>
    <p className="max-w-lg text-xs leading-relaxed text-muted lg:justify-self-end">{t.disclaimer}</p>
  </section>
}
export function Dashboard() {
  const t = useCopy()
  const { state, derived } = useSimulation()
  const levels = { safe: t.levelSafe, notice: t.levelNotice, warning: t.levelWarning, critical: t.levelCritical }
  const colors = { safe: 'text-emerald-200', notice: 'text-amber-200', warning: 'text-orange-200', critical: 'text-red-200' }
  const stats = [[t.speed, `${state.speedKmh} km/h`], [t.occupants, `${derived.occupiedCount} / 3`], [t.source, t.manual]]
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
