import { AnimatePresence, m, useInView, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Pause, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { projects, screenshot } from '../../data/projects'
import { TransitionLink } from '../shared/TransitionLink'

const INTERVAL = 4200
const SIZES = '(min-width: 1024px) 70vw, 100vw'
const srcSet = (slug: string) => `${screenshot(slug, 800)} 800w, ${screenshot(slug, 1600)} 1600w`

/**
 * Showreel of the concept sites: an index on the left, a live preview on
 * the right. Proof of range before the visitor has scrolled a single section.
 */
export function Reel() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  // Only cycle while the reel is on screen: no work (or image downloads) for a section nobody is looking at.
  const inView = useInView(ref)
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [paused, setPaused] = useState(false)
  const running = !paused && !hovered && !reduce && inView
  const project = projects[index]

  // Fetch and decode the next screenshot ahead of time, so the wipe never reveals an empty frame.
  useEffect(() => {
    if (!inView) return
    const next = projects[(index + 1) % projects.length].slug
    const img = new Image()
    img.sizes = SIZES
    img.srcset = srcSet(next)
    img.src = screenshot(next, 1600)
    img.decode().catch(() => {})
  }, [inView, index])

  useEffect(() => {
    if (!running) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % projects.length), INTERVAL)
    return () => window.clearTimeout(id)
  }, [running, index])

  return (
    <div
      ref={ref}
      className="grid gap-6 lg:grid-cols-12 lg:gap-10 [&>*]:min-w-0"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div className="flex flex-col justify-between gap-6 lg:col-span-3">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-mute">Showreel · 5 webů</p>
          {!reduce && (
            <button
              type="button"
              onClick={() => setPaused((v) => !v)}
              className="grid size-8 place-items-center rounded-full text-mute ring-1 ring-ink/10 transition-colors hover:bg-ink/5 hover:text-ink"
              aria-label={paused ? 'Přehrát showreel' : 'Pozastavit showreel'}
            >
              {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
            </button>
          )}
        </div>

        <ol className="-mx-5 flex gap-2 overflow-x-auto px-5 no-scrollbar lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
          {projects.map((p, i) => {
            const active = i === index
            return (
              <li key={p.slug} className="shrink-0 lg:border-t lg:border-ink/10 lg:last:border-b">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  onFocus={() => setIndex(i)}
                  aria-pressed={active}
                  className={`group relative flex w-full items-baseline gap-3 overflow-hidden rounded-full px-4 py-2.5 text-left ring-1 transition-colors lg:rounded-none lg:px-0 lg:py-4 lg:ring-0 ${
                    active ? 'bg-ink text-paper ring-ink lg:bg-transparent lg:text-ink' : 'text-ink/65 ring-ink/10 hover:text-ink'
                  }`}
                >
                  <span className="hidden text-[12px] tabular-nums lg:inline">0{i + 1}</span>
                  <span className="whitespace-nowrap text-[15px] font-medium tracking-[-0.01em] lg:text-[clamp(1.1rem,1.5vw,1.45rem)]">
                    {p.name}
                  </span>
                  <span className="ml-auto hidden text-[12px] text-mute xl:inline">{p.sector}</span>
                  {active && (
                    <span className="absolute bottom-0 left-0 hidden h-[2px] w-full bg-ink/10 lg:block" aria-hidden="true">
                      <span
                        key={`${index}-${running}`}
                        className={`block h-full bg-signal ${running ? 'animate-[reel-progress_linear_forwards]' : 'w-full'}`}
                        style={running ? { animationDuration: `${INTERVAL}ms` } : undefined}
                      />
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ol>

        <p className="hidden max-w-xs text-pretty text-[14px] leading-relaxed text-mute lg:block" aria-live="polite">
          {project.summary}
        </p>
      </div>

      <TransitionLink
        to={`/portfolio/${project.slug}`}
        label={project.name}
        bg={project.theme.bg}
        fg={project.theme.fg}
        className="group relative block lg:col-span-9"
        aria-label={`Otevřít web ${project.name} — ${project.sector}`}
        data-cursor="Otevřít"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-paper-2 shadow-[0_40px_80px_-40px_rgba(15,15,14,0.5)] ring-1 ring-ink/10">
          <AnimatePresence initial={false}>
            {/* Wipe built from two opposing transforms (not clip-path), so it runs on the compositor. */}
            <m.div
              key={project.slug}
              className="absolute inset-0 overflow-hidden"
              initial={{ x: '100%', zIndex: 2 }}
              animate={{ x: '0%', zIndex: 2 }}
              exit={{ zIndex: 1 }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
            >
              <m.div
                className="absolute inset-0"
                style={{ background: project.theme.bg }}
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
              >
                <m.img
                  src={screenshot(project.slug, 1600)}
                  srcSet={srcSet(project.slug)}
                  sizes={SIZES}
                  alt=""
                  width={1600}
                  height={1000}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-full w-full object-cover object-top"
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                  onError={(e) => {
                    e.currentTarget.style.visibility = 'hidden'
                  }}
                />
              </m.div>
            </m.div>
          </AnimatePresence>
          <span className="absolute bottom-4 right-4 z-10 inline-flex h-10 items-center gap-2 rounded-full bg-paper/90 pl-4 pr-1.5 text-[13px] font-medium text-ink shadow-lg backdrop-blur transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 md:bottom-6 md:right-6">
            Otevřít {project.name}
            <span className="grid size-7 place-items-center rounded-full bg-ink text-paper">
              <ArrowUpRight size={14} aria-hidden="true" />
            </span>
          </span>
        </div>
      </TransitionLink>
    </div>
  )
}
