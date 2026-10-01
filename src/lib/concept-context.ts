import { createContext, useContext } from 'react'

export interface ConceptApi {
  /** Show the "this is a concept site" notice for a demo-only action. */
  notify: (action: string) => void
}

export const ConceptContext = createContext<ConceptApi | null>(null)

export function useConcept(): ConceptApi {
  const ctx = useContext(ConceptContext)
  if (!ctx) throw new Error('useConcept must be used inside ConceptProvider')
  return ctx
}
