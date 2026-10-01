import { createContext, useContext } from 'react'

export interface TransitionTheme {
  label: string
  bg: string
  fg: string
}

export interface TransitionApi {
  go: (to: string, theme?: Partial<TransitionTheme>) => void
}

export const TransitionContext = createContext<TransitionApi | null>(null)

export function usePageTransition(): TransitionApi {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error('usePageTransition must be used inside TransitionProvider')
  return ctx
}
