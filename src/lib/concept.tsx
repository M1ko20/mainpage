import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { X } from 'lucide-react'
import { TransitionLink } from '../components/shared/TransitionLink'
import { profile } from '../data/profile'
import { ConceptContext } from './concept-context'


export function ConceptProvider({ children }: { children: ReactNode }) {
  const [action, setAction] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const notify = useCallback((next: string) => {
    window.clearTimeout(timer.current)
    setAction(next)
    timer.current = window.setTimeout(() => setAction(null), 7000)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const api = useMemo(() => ({ notify }), [notify])

  return (
    <ConceptContext.Provider value={api}>
      {children}
      <div lang="cs" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[150] flex justify-center px-4 md:bottom-6">
        <AnimatePresence>
          {action && (
            <m.div
              key={action}
              role="status"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="concept-ui pointer-events-auto flex w-full max-w-md items-start gap-4 rounded-2xl bg-[#111110]/95 p-4 pl-5 text-[#F1EFEA] shadow-2xl ring-1 ring-white/10 backdrop-blur"
            >
              <div className="min-w-0 flex-1 text-sm leading-relaxed">
                <p className="font-medium">„{action}“ je v tomto konceptu vypnuté.</p>
                <p className="mt-1 text-white/60">
                  Tento web je koncepční studie, design i kód: {profile.name}. Chcete podobný web pro svou firmu?
                </p>
                <TransitionLink
                  to="/#contact"
                  label="Pojďme to probrat"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
                  onNavigate={() => setAction(null)}
                >
                  Chci nový web →
                </TransitionLink>
              </div>
              <button
                type="button"
                onClick={() => setAction(null)}
                className="-mr-1 -mt-1 grid size-8 shrink-0 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Zavřít upozornění"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </ConceptContext.Provider>
  )
}
