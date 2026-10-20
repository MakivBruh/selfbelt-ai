import { createContext, useContext } from 'react'
import type { Dispatch } from 'react'
import type { Language, SimulationAction, SimulationState } from './model'
import type { DerivedState } from './detection'
import { translations } from '../i18n/translations'
type SimulationContextValue = {
  state: SimulationState
  derived: DerivedState
  dispatch: Dispatch<SimulationAction>
  language: Language
  setLanguage: (language: Language) => void
  audioState: 'off' | 'ready' | 'blocked'
  toggleBuzzer: () => Promise<void>
}
export const SimulationContext = createContext<SimulationContextValue | null>(null)
export function useSimulation() {
  const context = useContext(SimulationContext)
  if (!context) throw new Error('useSimulation requires SimulationProvider')
  return context
}
export function useCopy() { return translations[useSimulation().language] }
