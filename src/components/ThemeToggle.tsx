import { useEffect, useState } from 'react'
import { useCopy } from '../simulation/context'

type Theme = 'light' | 'dark'

export function ThemeToggle() {
  const t = useCopy()
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const syncSystem = () => {
      let saved: string | null = null
      try { saved = localStorage.getItem('safebelt-theme') } catch { /* Storage is optional. */ }
      if (saved === 'light' || saved === 'dark') return
      const next = media.matches ? 'dark' : 'light'
      setTheme(next)
    }
    const syncStorage = (event: StorageEvent) => {
      if (event.key !== 'safebelt-theme' && event.key !== null) return
      if (event.newValue === 'light' || event.newValue === 'dark') {
        setTheme(event.newValue)
      } else syncSystem()
    }
    media.addEventListener('change', syncSystem)
    window.addEventListener('storage', syncStorage)
    return () => {
      media.removeEventListener('change', syncSystem)
      window.removeEventListener('storage', syncStorage)
    }
  }, [])

  function choose(next: Theme) {
    setTheme(next)
    try { localStorage.setItem('safebelt-theme', next) } catch { /* Still works for this visit. */ }
  }

  return <div className="theme-toggle" role="group" aria-label={t.appearance}>
    {(['light', 'dark'] as const).map(mode => <button key={mode} type="button" aria-pressed={theme === mode} onClick={() => choose(mode)}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        {mode === 'light'
          ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>
          : <path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z" />}
      </svg>
      {mode === 'light' ? t.lightMode : t.darkMode}
    </button>)}
  </div>
}
