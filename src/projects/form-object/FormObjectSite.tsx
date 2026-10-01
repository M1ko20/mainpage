import '@fontsource-variable/archivo/wdth.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import { AnimatePresence, m, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ConceptBar } from '../../components/shared/ConceptBar'
import { Img } from '../../components/shared/Img'
import { useConcept } from '../../lib/concept-context'
import { enter } from '../../lib/enter'
import { useSeo } from '../../lib/seo'
import { useBodyTheme } from '../../lib/useBodyTheme'
import { photoUrl } from '../../lib/unsplash'
import { hero, projects, services } from './data'

const PAPER = '#E9E7E1'
const INK = '#0A0A0A'
const BLUE = '#2B2BFF'
const SNAP = [0.65, 0, 0.35, 1] as const
const SNAP_CSS = 'cubic-bezier(.65,0,.35,1)'
const wide: CSSProperties = { fontStretch: '125%' }
const narrow: CSSProperties = { fontStretch: '62%' }
const mono = 'font-plex text-[12px] uppercase tracking-[0.04em]'

function usePointerFine() {
  const reduce = useReducedMotion()
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return fine && !reduce
}

/** Precise dot + lagging ring. Grows over anything interactive. */
function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 300, damping: 30, mass: 0.6 })
  const ry = useSpring(y, { stiffness: 300, damping: 30, mass: 0.6 })
  const [label, setLabel] = useState<string | null>(null)
  const [hot, setHot] = useState(false)

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target as Element | null
      setLabel(t?.closest<HTMLElement>('[data-fo-cursor]')?.dataset.foCursor ?? null)
      setHot(Boolean(t?.closest('a, button, input, select, [role="tab"]')))
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[110]">
      <m.div className="absolute left-0 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2B2BFF]" style={{ x, y }} />
      <m.div
        className="absolute left-0 top-0 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#2B2BFF] font-plex text-[11px] uppercase text-white transition-[width,height,background-color] duration-300"
        style={{ x: rx, y: ry, width: label ? 96 : hot ? 56 : 32, height: label ? 96 : hot ? 56 : 32, backgroundColor: label ? BLUE : 'transparent' }}
      >
        {label}
      </m.div>
    </div>
  )
}

function Clock() {
  // Starts empty so the pre-rendered HTML and the first client render match.
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])
  const time = now
    ? now.toLocaleTimeString('en-GB', { timeZone: 'Europe/Prague', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--'
  return (
    <span className="tabular-nums">
      PRG <time>{time}</time>
    </span>
  )
}

const links = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#manifesto', label: 'Manifesto' },
  { href: '#contact', label: 'Contact' },
]

function CornerNav() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <div data-blend className="pointer-events-none fixed inset-0 z-50 p-4 text-white mix-blend-difference md:p-6">
        <a href="#top" className="pointer-events-auto absolute left-4 top-4 font-archivo text-[15px] font-extrabold uppercase leading-none tracking-[-0.02em] md:left-6 md:top-6 md:text-[17px]" style={wide}>
          Form/Object
        </a>
        <nav aria-label="Primary" className="pointer-events-auto absolute right-6 top-6 hidden md:block">
          <ul className={`${mono} flex flex-col items-end gap-1.5`}>
            {links.map((l, i) => (
              <li key={l.href}>
                <a href={l.href} className="group flex items-center gap-2 hover:underline hover:decoration-2 hover:underline-offset-4">
                  <span className="opacity-75">0{i + 1}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className={`${mono} pointer-events-auto absolute right-4 top-3 h-10 px-1 md:hidden`}
        >
          Index +
        </button>
        <p className={`${mono} absolute bottom-6 right-6 hidden md:block`}>
          <Clock />
        </p>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Index"
            className="fixed inset-0 z-[70] flex flex-col bg-[#2B2BFF] p-4 text-[#E9E7E1]"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: SNAP }}
          >
            <div className="flex items-center justify-between">
              <span className="font-archivo text-[15px] font-extrabold uppercase" style={wide}>
                Form/Object
              </span>
              <button type="button" onClick={() => setOpen(false)} className={`${mono} h-10 px-1`} autoFocus>
                Close ×
              </button>
            </div>
            <ul className="mt-auto">
              {links.map((l, i) => (
                <li key={l.href} className="border-t border-white/30">
                  <a href={l.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between py-3 font-archivo text-[13vw] font-black uppercase leading-[0.95] tracking-[-0.03em]" style={wide}>
                    {l.label}
                    <span className="font-plex text-[12px] font-normal">0{i + 1}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className={`${mono} mt-8`}>
              <Clock />
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Hero() {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 80, damping: 20 })
  const sy = useSpring(my, { stiffness: 80, damping: 20 })
  const rotate = useTransform(sx, [-1, 1], [-8, 2])
  const imgX = useTransform(sx, [-1, 1], [-30, 30])
  const imgY = useTransform(sy, [-1, 1], [-20, 20])

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-4 pb-14 pt-20 md:px-6 md:pb-16 md:pt-24"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse') return
        mx.set((e.clientX / window.innerWidth) * 2 - 1)
        my.set((e.clientY / window.innerHeight) * 2 - 1)
      }}
    >
      <h1 className="relative z-10 font-archivo font-black uppercase leading-[0.8] tracking-[-0.04em]" style={wide}>
        <span className="sr-only">Form / Object — creative studio</span>
        <span aria-hidden="true" className="enter enter-slide block text-[22.5vw] md:text-[21vw]" style={enter(0, 0.9, { x: '-12%', ease: SNAP_CSS })}>
          Form
        </span>
      </h1>

      <m.div
        className="absolute left-1/2 top-1/2 z-0 w-[62vw] max-w-[520px] will-change-transform md:w-[34vw]"
        style={{ x: imgX, y: imgY, rotate, translateX: '-50%', translateY: '-46%' }}
      >
        <div className="enter enter-pop" style={enter(0.25, 1, { ease: SNAP_CSS })}>
          <Img photo={hero.photo} alt={hero.alt} aspect={4 / 5} priority sizes="(min-width: 768px) 34vw, 62vw" fallback={BLUE} />
        </div>
      </m.div>

      <div className="relative z-10 flex flex-col gap-6">
        <p
          className="enter enter-fade max-w-[22rem] font-archivo text-[clamp(1.05rem,1.5vw,1.4rem)] font-medium leading-[1.2] tracking-[-0.01em]"
          style={enter(0.6, 0.6)}
        >
          A creative studio for brands that refuse the default. Identity, spatial, digital — and the objects in between.
        </p>
        <p
          aria-hidden="true"
          className="enter enter-slide -mr-[0.02em] text-right font-archivo text-[14.6vw] font-black uppercase leading-[0.8] tracking-[-0.045em]"
          style={{ ...wide, ...enter(0.1, 0.9, { x: '12%', ease: SNAP_CSS }) }}
        >
          <span className="text-[#2B2BFF]">/</span>Object
        </p>
      </div>

      <p className={`${mono} absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 md:left-6 lg:block`}>
        (Est. 2016)
        <br />
        Prague — Berlin
      </p>
      <svg
        viewBox="0 0 100 100"
        className="absolute right-[8vw] top-[34%] z-10 hidden size-28 animate-[spin_16s_linear_infinite] md:block"
        aria-hidden="true"
      >
        <defs>
          <path id="fo-circle" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
        </defs>
        <circle cx="50" cy="50" r="49" fill={BLUE} />
        <text className="fill-[#E9E7E1] font-plex text-[10.5px] uppercase tracking-[0.2em]">
          <textPath href="#fo-circle">Scroll down ✦ See the work ✦ </textPath>
        </text>
      </svg>
    </section>
  )
}

function Band() {
  const words = ['Identity', 'Campaign', 'Exhibition', 'Object', 'Digital', 'Motion']
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {words.map((w) => (
        <span key={w} className="flex items-center gap-6 px-6 font-archivo text-[clamp(2rem,5vw,4.5rem)] font-black uppercase leading-none" style={wide}>
          {w}
          <span className="text-[#2B2BFF]">✦</span>
        </span>
      ))}
    </div>
  )
  return (
    <div data-overflow-ok className="relative z-20 -my-6 -rotate-2 scale-[1.04] overflow-hidden bg-[#0A0A0A] py-5 text-[#E9E7E1]">
      <div className="marquee flex w-max" style={{ ['--marquee-duration' as string]: '28s' }}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

function InlineImg({ photo }: { photo: string }) {
  return (
    <span
      className="mx-[0.12em] inline-block h-[0.78em] w-[1.5em] rounded-full bg-cover bg-center align-[-0.06em]"
      style={{ backgroundImage: `url(${photoUrl(photo, 320, { ratio: 0.5 })})`, backgroundColor: BLUE }}
      aria-hidden="true"
    />
  )
}

function Intro() {
  return (
    <section aria-labelledby="fo-intro" className="px-4 py-28 md:px-6 md:py-44">
      <p className={`${mono} mb-10`}>(Studio)</p>
      <h2 id="fo-intro" className="max-w-[18ch] font-archivo text-[clamp(2.4rem,6.4vw,6.6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
        We make brands <InlineImg photo={projects[0].photo} /> feel like objects — things you want to hold <InlineImg photo={projects[4].photo} /> keep, and
        show <span className="text-[#2B2BFF]">someone.</span>
      </h2>
      <div className="mt-16 grid gap-8 md:ml-[33%] md:grid-cols-2 md:gap-10">
        <p className="font-archivo text-[17px] leading-relaxed">
          Fourteen designers, architects and developers. We take on eight projects a year so that every one of them gets the whole
          studio.
        </p>
        <p className="font-archivo text-[17px] leading-relaxed">
          We start with the thing people will touch — a box, a room, a screen — and build the brand outward from there.
        </p>
      </div>
    </section>
  )
}

function Work() {
  const { notify } = useConcept()
  const fine = usePointerFine()
  const [active, setActive] = useState<number | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 250, damping: 28 })
  const sy = useSpring(y, { stiffness: 250, damping: 28 })

  return (
    <section id="work" aria-labelledby="fo-work" className="relative border-t-2 border-[#0A0A0A]">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 px-4 pb-6 pt-24 md:px-6 md:pt-36">
        <h2 id="fo-work" className="font-archivo text-[clamp(2.2rem,10vw,10rem)] font-black uppercase leading-[0.8] tracking-[-0.04em]" style={wide}>
          Work
        </h2>
        <p className={`${mono} pb-2`}>(06) Selected 2023—25</p>
      </div>

      <ul onPointerMove={(e) => {
        x.set(e.clientX)
        y.set(e.clientY)
      }} onPointerLeave={() => setActive(null)}>
        {projects.map((p, i) => (
          <li key={p.name} className="border-t-2 border-[#0A0A0A] last:border-b-2">
            <button
              type="button"
              data-fo-cursor="View"
              onClick={() => notify(`Open the ${p.name} case study`)}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-5 text-left transition-colors duration-200 hover:bg-[#2B2BFF] hover:text-[#E9E7E1] focus-visible:bg-[#2B2BFF] focus-visible:text-[#E9E7E1] md:grid-cols-[4rem_1.2fr_1fr_0.6fr_auto] md:px-6 md:py-6"
            >
              <span className="font-plex text-[12px]">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-archivo text-[clamp(1.9rem,5.4vw,5.4rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] transition-transform duration-300 group-hover:translate-x-3" style={wide}>
                {p.name}
              </span>
              <span className="hidden font-archivo text-[16px] md:block">{p.what}</span>
              <span className={`${mono} hidden md:block`}>{p.tags}</span>
              <span className="flex items-center gap-4">
                <span className="font-plex text-[12px]">{p.year}</span>
                <span className="size-14 overflow-hidden md:hidden">
                  <Img photo={p.photo} alt="" aspect={1} widths={[160, 320]} sizes="56px" fallback={BLUE} />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {fine && (
        <m.div className="pointer-events-none fixed left-0 top-0 z-[60] w-[22vw] max-w-[340px] will-change-transform" style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }} aria-hidden="true">
          <AnimatePresence>
            {active !== null && (
              <m.div
                key={active}
                className="absolute inset-x-0 top-0"
                initial={{ clipPath: 'inset(50% 50% 50% 50%)', rotate: -6 }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)', rotate: i2rot(active) }}
                exit={{ clipPath: 'inset(50% 50% 50% 50%)', opacity: 0 }}
                transition={{ duration: 0.45, ease: SNAP }}
              >
                <Img photo={projects[active].photo} alt="" aspect={4 / 5} sizes="340px" fallback={BLUE} />
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      )}
    </section>
  )
}

const i2rot = (i: number) => (i % 2 ? 4 : -4)

function Featured() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['30%', '-30%'])

  return (
    <section ref={ref} aria-labelledby="fo-featured" className="relative overflow-hidden px-4 py-28 md:px-6 md:py-48">
      <p className={`${mono} mb-8`}>(Case) Kiln — ceramics house</p>
      <div className="relative grid grid-cols-12">
        <m.div className="col-span-10 will-change-transform md:col-span-7" style={{ y: y1 }}>
          <Img photo={projects[0].photo} alt={projects[0].alt} aspect={4 / 3} sizes="(min-width: 768px) 58vw, 84vw" fallback={BLUE} />
        </m.div>
        <m.div className="col-span-6 col-start-7 -mt-24 will-change-transform md:col-span-4 md:col-start-8 md:-mt-[40%]" style={{ y: y2 }}>
          <Img photo="1487700160041-babef9c3cb55" alt="Kiln glass vase holding a single green leaf" aspect={3 / 4} sizes="(min-width: 768px) 33vw, 50vw" fallback={INK} />
        </m.div>
        <h2
          id="fo-featured"
          className="pointer-events-none absolute left-0 top-[18%] z-10 font-archivo text-[30vw] font-black uppercase leading-none tracking-[-0.05em] text-white mix-blend-difference md:left-[22%] md:text-[24vw]"
          style={wide}
        >
          Kiln
        </h2>
      </div>
      <div className="mt-16 grid gap-8 md:mt-10 md:grid-cols-12">
        <p className="font-archivo text-[clamp(1.4rem,2.4vw,2.2rem)] font-bold leading-[1.1] tracking-[-0.02em] md:col-span-5">
          A seventy-year-old ceramics house, rebuilt around the imperfection of its glazes.
        </p>
        <dl className={`${mono} grid grid-cols-2 gap-x-6 gap-y-4 md:col-span-5 md:col-start-8`}>
          {[
            ['Scope', 'Identity, packaging, retail'],
            ['Year', '2025'],
            ['Outcome', 'Sold out first run in 9 days'],
            ['Team', '5 people, 14 weeks'],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="opacity-75">{k}</dt>
              <dd className="mt-1">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" aria-labelledby="fo-services" className="border-t-2 border-[#0A0A0A]">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 px-4 pb-6 pt-24 md:px-6 md:pt-36">
        <h2 id="fo-services" className="font-archivo text-[clamp(2.2rem,10vw,10rem)] font-black uppercase leading-[0.8] tracking-[-0.04em]" style={wide}>
          Services
        </h2>
        <p className={`${mono} pb-2`}>(04) Disciplines</p>
      </div>
      <ul className="grid border-t-2 border-[#0A0A0A] sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <li
            key={s.title}
            className={`group flex min-h-[340px] flex-col justify-between border-[#0A0A0A] p-4 transition-colors duration-200 hover:bg-[#0A0A0A] hover:text-[#E9E7E1] md:p-6 ${i > 0 ? 'border-t-2 sm:border-t-0' : ''} ${i % 2 ? 'sm:border-l-2' : ''} ${i > 1 ? 'sm:border-t-2 lg:border-t-0' : ''} ${i > 0 ? 'lg:border-l-2' : ''} border-b-2`}
          >
            <div className="flex items-start justify-between">
              <span className="font-plex text-[12px]">0{i + 1}</span>
              <span className="font-archivo text-[40px] font-black leading-none text-[#2B2BFF] transition-transform duration-500 group-hover:rotate-90" aria-hidden="true">
                ✦
              </span>
            </div>
            <div>
              <h3 className="font-archivo text-[clamp(2rem,3.4vw,3rem)] font-black uppercase leading-none tracking-[-0.02em]" style={narrow}>
                {s.title}
              </h3>
              <ul className={`${mono} mt-6 flex flex-col gap-1.5`}>
                {s.items.map((it) => (
                  <li key={it}>→ {it}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Line({ children, from, className = '' }: { children: ReactNode; from: 'left' | 'right'; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], from === 'left' ? ['-8%', '6%'] : ['8%', '-6%'])
  return (
    <m.span ref={ref} className={`block whitespace-nowrap will-change-transform ${className}`} style={{ x }}>
      {children}
    </m.span>
  )
}

function Manifesto() {
  return (
    <section id="manifesto" aria-labelledby="fo-manifesto" className="overflow-hidden bg-[#0A0A0A] py-28 text-[#E9E7E1] md:py-44">
      <p className={`${mono} px-4 md:px-6`}>(Manifesto)</p>
      <h2 id="fo-manifesto" className="mt-12 px-4 font-archivo text-[clamp(2rem,9.2vw,10rem)] md:px-6 font-black uppercase leading-[0.86] tracking-[-0.04em]" style={wide}>
        <span className="sr-only">We don’t do clean. We do memorable. Every brief deserves an argument.</span>
        <span aria-hidden="true">
          <Line from="left">We don’t do</Line>
          <Line from="right" className="text-right text-[#6262FF]">
            “clean.”
          </Line>
          <Line from="left" className="pl-[8vw]">
            We do
          </Line>
          <Line from="right" className="text-right">
            memorable<span className="text-[#6262FF]">.</span>
          </Line>
        </span>
      </h2>
      <p className="mt-16 max-w-md px-4 font-archivo text-[17px] leading-relaxed text-[#E9E7E1]/70 md:ml-[50%] md:px-6">
        Every brief deserves an argument. We’d rather present one idea we believe in than three we can live with.
      </p>
    </section>
  )
}

function Contact() {
  const { notify } = useConcept()
  return (
    <section id="contact" aria-labelledby="fo-contact" className="bg-[#2B2BFF] px-4 pb-24 pt-24 text-[#E9E7E1] md:px-6 md:pt-36">
      <p className={mono}>(Contact) New projects for 2026</p>
      <h2 id="fo-contact" className="sr-only">
        Contact
      </h2>
      <button
        type="button"
        data-fo-cursor="Hello"
        onClick={() => notify('Say hello')}
        className="group mt-8 block text-left font-archivo text-[clamp(3.4rem,15vw,16rem)] font-black uppercase leading-[0.82] tracking-[-0.045em]"
        style={wide}
      >
        Say
        <br />
        hello<span className="inline-block transition-transform duration-300 group-hover:translate-x-6">→</span>
      </button>
      <div className={`${mono} mt-20 grid gap-6 border-t-2 border-[#E9E7E1] pt-6 sm:grid-cols-2 md:grid-cols-4`}>
        <p>
          new@formobject.studio
          <br />
          +49 · by appointment
        </p>
        <p>
          Prague — Holešovice
          <br />
          Berlin — Wedding
        </p>
        <p>
          Instagram
          <br />
          Are.na
        </p>
        <p className="md:text-right">
          © Form/Object
          <br />A concept project
        </p>
      </div>
    </section>
  )
}

export default function FormObjectSite() {
  useSeo('/portfolio/form-object')
  useBodyTheme(PAPER)
  const fine = usePointerFine()

  return (
    <div
      className={`min-h-dvh font-archivo ${fine ? 'cursor-none [&_a]:cursor-none [&_button]:cursor-none' : ''}`}
      style={{ background: PAPER, color: INK, ['--focus-color' as string]: BLUE }}
    >
      {fine && <Cursor />}
      <CornerNav />
      <main>
        <Hero />
        <Band />
        <Intro />
        <Work />
        <Featured />
        <Services />
        <Manifesto />
        <Contact />
      </main>
      <ConceptBar />
    </div>
  )
}
