import { lazy, Suspense, useLayoutEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { TransitionProvider } from './lib/transition'
import { ConceptProvider } from './lib/concept'
import { Home } from './pages/Home'

const Aurelis = lazy(() => import('./projects/aurelis/AurelisSite'))
const Noir = lazy(() => import('./projects/noir/NoirSite'))
const Nexora = lazy(() => import('./projects/nexora/NexoraSite'))
const FormObject = lazy(() => import('./projects/form-object/FormObjectSite'))
const AlexMorgan = lazy(() => import('./projects/alex-morgan/AlexMorganSite'))
const NotFound = lazy(() => import('./pages/NotFound'))

/** Top of page on route change; honour #hash targets once they have rendered. */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }
    let frame = 0
    let tries = 0
    const find = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
      else if (tries++ < 60) frame = requestAnimationFrame(find)
    }
    find()
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}

export function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <TransitionProvider>
          <ConceptProvider>
            <ScrollManager />
            <Suspense fallback={<div className="min-h-dvh" aria-busy="true" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio/aurelis" element={<Aurelis />} />
                <Route path="/portfolio/noir" element={<Noir />} />
                <Route path="/portfolio/nexora" element={<Nexora />} />
                <Route path="/portfolio/form-object" element={<FormObject />} />
                <Route path="/portfolio/alex-morgan" element={<AlexMorgan />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ConceptProvider>
        </TransitionProvider>
      </MotionConfig>
    </LazyMotion>
  )
}
