import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { TransitionContext, type TransitionTheme } from './transition-context'


interface TransitionState extends TransitionTheme {
  to: string
  phase: 'cover' | 'reveal'
}


const EASE = [0.76, 0, 0.24, 1] as const
const DEFAULT_THEME: TransitionTheme = { label: '', bg: '#0F0F0E', fg: '#F1EFEA' }

export function TransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [state, setState] = useState<TransitionState | null>(null)

  const go = useCallback(
    (to: string, theme?: Partial<TransitionTheme>) => {
      if (reduce) {
        navigate(to)
        return
      }
      setState({ ...DEFAULT_THEME, ...theme, to, phase: 'cover' })
    },
    [navigate, reduce],
  )

  const api = useMemo(() => ({ go }), [go])

  return (
    <TransitionContext.Provider value={api}>
      {children}
      <AnimatePresence>
        {state && (
          <m.div
            key="page-transition"
            aria-hidden="true"
            className="fixed inset-0 z-[200] flex items-end p-6 md:p-10"
            style={{ background: state.bg, color: state.fg }}
            initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={
              state.phase === 'cover'
                ? { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.6, ease: EASE } }
                : { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.7, ease: EASE, delay: 0.25 } }
            }
            onAnimationComplete={() => {
              if (state.phase === 'cover') {
                navigate(state.to)
                setState({ ...state, phase: 'reveal' })
              } else {
                setState(null)
              }
            }}
          >
            {state.label && (
              <m.span
                className="font-display text-[clamp(2.5rem,9vw,8rem)] leading-none tracking-[-0.04em]"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: state.phase === 'cover' ? 1 : 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: state.phase === 'cover' ? 0.2 : 0 }}
              >
                {state.label}
              </m.span>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  )
}
