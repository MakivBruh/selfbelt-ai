import { Container } from './Layout'
import { useCopy, useSimulation } from '../simulation/context'
export function Header() {
  const t = useCopy()
  const { language, setLanguage } = useSimulation()
  return <header className="border-b border-border bg-[#0d1821] py-2">
    <a href="#main" className="sr-only focus:not-sr-only focus:block focus:p-4">{t.skip}</a>
    <Container><div className="flex flex-wrap items-center justify-between gap-4">
      <a href="#hero" className="text-lg font-bold tracking-wide">SafeBelt <span className="text-accent">AI</span></a>
      <nav aria-label={t.navigation} className="flex flex-wrap gap-4 text-sm text-muted">
        <a className="inline-flex min-h-11 items-center" href="#dashboard">{t.dashboard}</a>
        <a className="inline-flex min-h-11 items-center" href="#detection">{t.detection}</a>
      </nav>
      <label className="flex items-center gap-2 text-sm"><span className="sr-only">{t.language}</span>
        <select value={language} onChange={e => setLanguage(e.target.value === 'en' ? 'en' : 'id')} className="min-h-11 rounded border border-border bg-surface px-3">
          <option value="id">Indonesia</option><option value="en">English</option>
        </select>
      </label>
    </div></Container>
  </header>
}
