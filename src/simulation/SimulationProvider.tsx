import { useEffect, useReducer, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { createInitialState, simulationReducer } from './model'
import type { Language } from './model'
import { SimulationContext } from './context'
import { translations } from '../i18n/translations'
import { deriveSimulation } from './detection'
import { isUnsafeMoving } from './safety'
import { useBuzzer } from './useBuzzer'
export function SimulationProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(simulationReducer, undefined, createInitialState)
  const [language, setLanguage] = useState<Language>('id')
  const unsafeMoving = isUnsafeMoving(state)
  const freshAlert = state.alertElapsedMs === 0
  const buzzer = useBuzzer(unsafeMoving)
  useEffect(() => {
    if (!unsafeMoving) return
    let previous = performance.now()
    const timer = window.setInterval(() => {
      const now = performance.now()
      dispatch({ type: 'tick', elapsedMs: now - previous })
      previous = now
    }, 250)
    return () => clearInterval(timer)
  }, [unsafeMoving, freshAlert])
  useEffect(() => {
    document.documentElement.lang = language
    document.title = translations[language].documentTitle
  }, [language])
  return <SimulationContext.Provider value={{ state, dispatch, language, setLanguage, derived: deriveSimulation(state, language), ...buzzer }}>{children}</SimulationContext.Provider>
}
