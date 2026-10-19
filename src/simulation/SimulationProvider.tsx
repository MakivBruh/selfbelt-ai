import { useEffect, useReducer, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { createInitialState, simulationReducer } from './model'
import type { Language } from './model'
import { SimulationContext } from './context'
import { translations } from '../i18n/translations'
import { deriveSimulation } from './detection'
export function SimulationProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(simulationReducer, undefined, createInitialState)
  const [language, setLanguage] = useState<Language>('id')
  useEffect(() => {
    document.documentElement.lang = language
    document.title = translations[language].documentTitle
  }, [language])
  return <SimulationContext.Provider value={{ state, dispatch, language, setLanguage, derived: deriveSimulation(state, language) }}>{children}</SimulationContext.Provider>
}
