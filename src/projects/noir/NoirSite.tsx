import '@fontsource-variable/bodoni-moda/standard.css'
import '@fontsource-variable/bodoni-moda/standard-italic.css'
import '@fontsource-variable/manrope/wght.css'
import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { ConceptBar } from '../../components/shared/ConceptBar'
import { Img } from '../../components/shared/Img'
import { Reveal } from '../../components/shared/Reveal'
import { useConcept } from '../../lib/concept-context'
import { enter } from '../../lib/enter'
import { useSeo } from '../../lib/seo'
import { useBodyTheme } from '../../lib/useBodyTheme'
import { gallery, menus, photos, rooms } from './data'

const BG = '#0B0A09'
const CREAM = '#F3EDE3'
const FALLBACK = '#1A1714'
const EASE = [0.22, 1, 0.36, 1] as const
const EASE_CSS = 'cubic-bezier(.22,1,.36,1)'
const wrap = 'mx-auto w-full max-w-[1600px] px-5 md:px-10'
const eyebrow = 'font-manrope text-[11px] font-semibold uppercase tracking-[0.32em] text-[#C9A45C]'

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")"

function Appear({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <Reveal className={className} y={28} margin="0px 0px -12% 0px" duration={1.3} ease={EASE} delay={delay}>
      {children}
    </Reveal>
  )
}

/** Image that drifts against the scroll direction inside its frame. */
function Parallax({ photo, alt, aspect, sizes, className = '', amount = 12 }: { photo: string; alt: string; aspect: number; sizes: string; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`])
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={{ aspectRatio: aspect }}>
      <m.div className="absolute -inset-y-[16%] inset-x-0 will-change-transform" style={{ y }}>
        <Img photo={photo} alt={alt} sizes={sizes} className="h-full w-full" fallback={FALLBACK} />
      </m.div>
    </div>
  )
}

const navLeft = [
  { href: '#menu', label: 'Menu' },
  { href: '#chef', label: 'Chef' },
  { href: '#experience', label: 'Experience' },
]

function Header() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (v) => setSolid(v > 80))

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const link = 'font-manrope text-[12px] font-medium uppercase tracking-[0.24em] text-[#F3EDE3]/80 transition-colors hover:text-[#C9A45C]'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-700 ${
          solid && !open ? 'border-b border-white/[0.06] bg-[#0B0A09]/80 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <div className={`${wrap} grid h-20 grid-cols-[1fr_auto_1fr] items-center md:h-24`}>
          <nav aria-label="Primary" className="flex items-center gap-8">
            <button
              type="button"
              className={`${link} relative z-[70] flex h-11 items-center gap-3 lg:hidden`}
              aria-expanded={open}
              aria-controls="noir-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="flex w-5 flex-col gap-[5px]" aria-hidden="true">
                <span className={`h-px w-full bg-current transition-transform duration-500 ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
                <span className={`h-px w-full bg-current transition-transform duration-500 ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
              </span>
              {open ? 'Close' : 'Menu'}
            </button>
            {navLeft.map((l) => (
              <a key={l.href} href={l.href} className={`${link} hidden lg:block`}>
                {l.label}
              </a>
            ))}
          </nav>
          <a href="#top" className="relative z-[70] font-bodoni text-[26px] font-medium tracking-[0.34em] md:text-[30px]" aria-label="Noir — home">
            <span className="mr-[-0.34em]">NOIR</span>
          </a>
          <div className="flex items-center justify-end gap-8">
            <a href="#visit" className={`${link} hidden lg:block`}>
              Visit
            </a>
            <a
              href="#reserve"
              className="inline-flex h-10 items-center border border-[#C9A45C]/70 px-4 font-manrope text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C9A45C] transition-colors duration-500 hover:bg-[#C9A45C] hover:text-[#0B0A09] md:h-11 md:px-6"
            >
              Reserve
            </a>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="noir-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#0B0A09] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <ul className="flex flex-col items-center gap-4">
              {[...navLeft, { href: '#visit', label: 'Visit' }, { href: '#reserve', label: 'Reserve' }].map((l, i) => (
                <m.li
                  key={l.href}
                  initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.07 }}
                >
                  <a href={l.href} onClick={() => setOpen(false)} className="font-bodoni text-[clamp(2.6rem,11vw,4rem)] italic leading-tight">
                    {l.label}
                  </a>
                </m.li>
              ))}
            </ul>
            <p className="absolute bottom-24 font-manrope text-[12px] uppercase tracking-[0.24em] text-[#8B8378]">Tue — Sat · from 19:00</p>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <m.div className="absolute inset-0 will-change-transform" style={{ y }}>
        <div className="enter enter-zoom h-full w-full" style={enter(0, 7, { scale: 1.18, ease: 'cubic-bezier(.25,.1,.25,1)' })}>
          <Img photo={photos.hero} alt="Candlelit table set with wine glasses and a plated course" priority className="h-full w-full" imgClassName="brightness-[.42] saturate-[.8]" fallback={FALLBACK} />
        </div>
      </m.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(11,10,9,.85)_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0B0A09] to-transparent" aria-hidden="true" />

      <m.div className={`${wrap} relative flex h-full flex-col items-center justify-center pt-10 text-center`} style={{ opacity: fade }}>
        <p className={`${eyebrow} enter enter-fade`} style={enter(0.6, 1.6)}>
          Contemporary dining · Prague
        </p>
        <h1 className="mt-7 font-bodoni text-[clamp(3.4rem,10.5vw,10rem)] font-normal leading-[0.98] tracking-[-0.02em] [text-shadow:0_2px_40px_rgba(0,0,0,.5)]">
          <span className="enter enter-blur block" style={enter(0.3, 1.8, { ease: EASE_CSS })}>
            Dinner,
          </span>
          <span className="enter enter-blur block italic text-[#C9A45C]" style={enter(0.55, 1.8, { ease: EASE_CSS })}>
            after dark.
          </span>
        </h1>
        <p className="enter enter-fade mt-8 max-w-md font-manrope text-[16px] leading-relaxed text-[#F3EDE3]/75 md:text-[17px]" style={enter(1.1, 1.6)}>
          Eleven courses cooked over fire, smoke and patience. Twenty-four seats, one sitting a night.
        </p>
        <div className="enter enter-rise mt-10 flex flex-col items-center gap-5 sm:flex-row sm:gap-8" style={enter(1.35, 1.2, { y: '12px', ease: EASE_CSS })}>
          <a
            href="#reserve"
            className="inline-flex h-14 items-center bg-[#C9A45C] px-9 font-manrope text-[12px] font-semibold uppercase tracking-[0.24em] text-[#0B0A09] transition-colors duration-500 hover:bg-[#F3EDE3]"
          >
            Reserve a table
          </a>
          <a href="#menu" className="group font-manrope text-[12px] font-semibold uppercase tracking-[0.24em] text-[#F3EDE3]/85">
            View the menu
            <span className="mt-1 block h-px w-full origin-left scale-x-50 bg-[#C9A45C] transition-transform duration-700 group-hover:scale-x-100" />
          </a>
        </div>
      </m.div>

      <div className={`${wrap} absolute inset-x-0 bottom-8 flex items-end justify-between font-manrope text-[11px] uppercase tracking-[0.24em] text-[#F3EDE3]/55`}>
        <span className="hidden sm:block">Tue — Sat · 19:00</span>
        <span className="mx-auto flex flex-col items-center gap-3 sm:mx-0" aria-hidden="true">
          <span className="relative block h-12 w-px overflow-hidden bg-white/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[noir-drip_2.4s_ease-in-out_infinite] bg-[#C9A45C]" />
          </span>
        </span>
        <span className="hidden sm:block">Vinohrady, Prague 2</span>
      </div>
    </section>
  )
}

function Philosophy() {
  return (
    <section aria-labelledby="noir-philosophy" className="relative py-28 md:py-44">
      <div className={`${wrap} grid gap-16 lg:grid-cols-12`}>
        <div className="lg:col-span-7 lg:col-start-3 lg:text-center">
          <Appear>
            <p className={eyebrow}>Philosophy</p>
          </Appear>
          <Appear delay={0.1}>
            <h2 id="noir-philosophy" className="mt-8 font-bodoni text-[clamp(2rem,4vw,3.9rem)] font-normal leading-[1.14] tracking-[-0.01em]">
              We cook with what the season allows and <em className="text-[#C9A45C]">the fire decides.</em> Nothing is rushed.
              Nothing is wasted.
            </h2>
          </Appear>
        </div>
        <div className="grid grid-cols-12 gap-4 lg:col-span-12 lg:mt-16">
          <Parallax photo={photos.knife} alt="Chef’s knife slicing chives on a board" aspect={3 / 4} sizes="(min-width: 1024px) 30vw, 60vw" className="col-span-7 md:col-span-5 md:col-start-2" amount={10} />
          <div className="col-span-5 mt-24 md:col-span-4 md:col-start-8 md:mt-48">
            <Parallax photo={photos.flame} alt="Chef working a flaming pan in the kitchen" aspect={4 / 5} sizes="(min-width: 1024px) 26vw, 40vw" amount={18} />
            <Appear delay={0.2}>
              <p className="mt-6 max-w-xs font-manrope text-[14px] leading-relaxed text-[#8B8378]">
                Our kitchen has no gas. Everything is cooked over beech, oak or vine cuttings — the only way we know how.
              </p>
            </Appear>
          </div>
        </div>
      </div>
    </section>
  )
}

function Menu() {
  const [active, setActive] = useState(0)
  const baseId = useId()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const menu = menus[active]

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    const next = (active + (e.key === 'ArrowRight' ? 1 : menus.length - 1)) % menus.length
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <section id="menu" aria-labelledby="noir-menu-title" className="border-t border-white/[0.06] bg-[#100E0C] py-28 md:py-40">
      <div className={`${wrap} grid gap-14 lg:grid-cols-12 lg:gap-16`}>
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-32">
            <Parallax photo={photos.plate} alt="Grilled fish with herbs on a dark stoneware plate" aspect={4 / 5} sizes="40vw" amount={8} />
          </div>
        </div>
        <div className="lg:col-span-7">
          <p className={eyebrow}>The menu</p>
          <h2 id="noir-menu-title" className="mt-6 font-bodoni text-[clamp(3rem,7vw,6.5rem)] font-normal leading-none tracking-[-0.02em]">
            Tonight<em className="text-[#C9A45C]">.</em>
          </h2>

          <div role="tablist" aria-label="Menus" className="mt-12 flex gap-8 border-b border-white/10" onKeyDown={onKey}>
            {menus.map((mn, i) => (
              <button
                key={mn.id}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                role="tab"
                id={`${baseId}-tab-${mn.id}`}
                aria-selected={active === i}
                aria-controls={`${baseId}-panel-${mn.id}`}
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                className={`relative -mb-px pb-4 font-manrope text-[12px] font-semibold uppercase tracking-[0.24em] transition-colors ${
                  active === i ? 'text-[#F3EDE3]' : 'text-[#8B8378] hover:text-[#F3EDE3]'
                }`}
              >
                {mn.label}
                <span className={`absolute inset-x-0 bottom-0 h-px bg-[#C9A45C] transition-transform duration-700 ${active === i ? 'scale-x-100' : 'scale-x-0'}`} />
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={menu.id}
              role="tabpanel"
              id={`${baseId}-panel-${menu.id}`}
              aria-labelledby={`${baseId}-tab-${menu.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <p className="mt-8 max-w-lg font-manrope text-[15px] leading-relaxed text-[#8B8378]">{menu.intro}</p>
              <ol className="mt-10">
                {menu.dishes.map((d, i) => (
                  <li key={d.name} className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 border-b border-white/[0.07] py-5 transition-colors hover:border-[#C9A45C]/40">
                    <span className="font-bodoni text-[14px] italic text-[#8B8378]">{menu.id === 'tasting' ? toRoman(i + 1) : String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="font-bodoni text-[clamp(1.3rem,2vw,1.65rem)] leading-snug transition-colors duration-500 group-hover:text-[#C9A45C]">{d.name}</h3>
                      <p className="mt-1 font-manrope text-[14px] text-[#8B8378]">{d.note}</p>
                    </div>
                    {d.price && <span className="font-manrope text-[14px] tabular-nums text-[#F3EDE3]/80">{d.price}</span>}
                  </li>
                ))}
              </ol>
              <p className="mt-8 font-manrope text-[13px] tracking-[0.02em] text-[#C9A45C]">{menu.footer}</p>
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function toRoman(n: number) {
  const map: [number, string][] = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let out = ''
  let rest = n
  for (const [value, numeral] of map) {
    while (rest >= value) {
      out += numeral
      rest -= value
    }
  }
  return out
}

function Chef() {
  return (
    <section id="chef" aria-labelledby="noir-chef" className="py-28 md:py-44">
      <div className={`${wrap} grid items-center gap-14 lg:grid-cols-12 lg:gap-10`}>
        <div className="lg:col-span-6">
          <Parallax photo={photos.chef} alt="Chef Elias Varga plating under copper lamps" aspect={4 / 5} sizes="(min-width: 1024px) 48vw, 100vw" amount={10} />
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <Appear>
            <p className={eyebrow}>The chef</p>
          </Appear>
          <Appear delay={0.1}>
            <blockquote className="mt-8">
              <p id="noir-chef" className="font-bodoni text-[clamp(2rem,3.6vw,3.4rem)] italic leading-[1.12]">
                “Fire is the oldest technique we have. After twenty years, I’m still learning it.”
              </p>
              <footer className="mt-8 font-manrope text-[13px] uppercase tracking-[0.24em] text-[#C9A45C]">Elias Varga — Chef &amp; owner</footer>
            </blockquote>
          </Appear>
          <Appear delay={0.2}>
            <p className="mt-10 max-w-md font-manrope text-[15px] leading-[1.8] text-[#F3EDE3]/65">
              Trained in Copenhagen and San Sebastián, Elias came home in 2019 to open a restaurant without a gas line. Every
              dish at Noir starts with the same question: what can the fire do that nothing else can?
            </p>
          </Appear>
        </div>
      </div>
    </section>
  )
}

function Room({ room, index }: { room: (typeof rooms)[number]; index: number }) {
  return (
    <article className="relative h-[70svh] min-h-[440px] w-full shrink-0 overflow-hidden lg:h-[74vh] lg:w-[62vw]">
      <Img photo={room.photo} alt={room.alt} sizes="(min-width: 1024px) 62vw, 100vw" className="h-full w-full" imgClassName="brightness-[.6]" fallback={FALLBACK} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09]/90 via-transparent to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between md:p-10">
        <div>
          <p className="font-bodoni text-[14px] italic text-[#C9A45C]">{toRoman(index + 1)}</p>
          <h3 className="mt-2 font-bodoni text-[clamp(2.2rem,4.4vw,4.2rem)] leading-none">{room.title}</h3>
        </div>
        <p className="max-w-sm font-manrope text-[15px] leading-relaxed text-[#F3EDE3]/75">{room.body}</p>
      </div>
    </article>
  )
}

function HorizontalRooms({ progress }: { progress: MotionValue<number> }) {
  const track = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const x = useTransform(progress, [0.05, 0.95], [0, -distance])
  return (
    <m.div ref={track} className="flex w-max gap-6 px-10 will-change-transform" style={{ x }}>
      <div className="flex w-[30vw] shrink-0 flex-col justify-end pb-4">
        <p className={eyebrow}>The experience</p>
        <h2 id="noir-experience" className="mt-6 font-bodoni text-[clamp(3rem,5vw,5.5rem)] leading-[0.95]">
          Three rooms, <em className="text-[#C9A45C]">one evening.</em>
        </h2>
      </div>
      {rooms.map((r, i) => (
        <Room key={r.title} room={r} index={i} />
      ))}
    </m.div>
  )
}

function Experience() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [wide, setWide] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setWide(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (wide && !reduce) {
    return (
      <section ref={ref} id="experience" aria-labelledby="noir-experience" className="relative h-[300vh] bg-[#0B0A09]">
        <div data-overflow-ok className="sticky top-0 flex h-screen items-center overflow-hidden">
          <HorizontalRooms progress={scrollYProgress} />
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} id="experience" aria-labelledby="noir-experience" className="py-24">
      <div className={wrap}>
        <p className={eyebrow}>The experience</p>
        <h2 id="noir-experience" className="mt-6 font-bodoni text-[clamp(2.6rem,9vw,4rem)] leading-[0.95]">
          Three rooms, <em className="text-[#C9A45C]">one evening.</em>
        </h2>
        <div className="mt-12 flex flex-col gap-4">
          {rooms.map((r, i) => (
            <Room key={r.title} room={r} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const up = useTransform(scrollYProgress, [0, 1], ['6%', '-10%'])
  const down = useTransform(scrollYProgress, [0, 1], ['-4%', '8%'])
  const columns = [gallery.slice(0, 2), gallery.slice(2, 4), gallery.slice(4, 6)]

  return (
    <section ref={ref} aria-label="Gallery" className="overflow-hidden py-24 md:py-40">
      <div className={`${wrap} grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5`}>
        {columns.map((col, ci) => (
          <m.div key={ci} className={`flex flex-col gap-3 will-change-transform md:gap-5 ${ci === 2 ? 'hidden md:flex' : ''} ${ci === 1 ? 'pt-16 md:pt-32' : ''}`} style={{ y: ci === 1 ? down : up }}>
            {col.map((g, gi) => (
              <Img key={g.photo} photo={g.photo} alt={g.alt} aspect={gi % 2 === ci % 2 ? 3 / 4 : 4 / 5} sizes="(min-width: 768px) 32vw, 50vw" fallback={FALLBACK} className="transition-[filter] duration-700 hover:brightness-110" />
            ))}
          </m.div>
        ))}
      </div>
    </section>
  )
}

function Reserve() {
  const { notify } = useConcept()
  const id = useId()
  const submit = (e: FormEvent) => {
    e.preventDefault()
    notify('Request a table')
  }
  const field =
    'h-14 w-full appearance-none border-b border-white/20 bg-transparent font-manrope text-[16px] text-[#F3EDE3] outline-none transition-colors focus:border-[#C9A45C] [color-scheme:dark]'
  const fieldLabel = 'font-manrope text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8B8378]'

  return (
    <section id="reserve" aria-labelledby="noir-reserve" className="relative overflow-hidden py-28 md:py-44">
      <div className="absolute inset-0" aria-hidden="true">
        <Img photo={photos.cocktail} alt="" sizes="100vw" className="h-full w-full" imgClassName="brightness-[.25] blur-[2px] scale-105" fallback={FALLBACK} />
      </div>
      <div className={`${wrap} relative`}>
        <div className="mx-auto max-w-3xl border border-[#C9A45C]/30 bg-[#0B0A09]/75 px-6 py-14 text-center md:px-16 md:py-20">
          <p className={eyebrow}>Reservations</p>
          <h2 id="noir-reserve" className="mt-6 font-bodoni text-[clamp(2.6rem,6vw,5rem)] leading-none">
            Your table, <em className="text-[#C9A45C]">tonight.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-md font-manrope text-[15px] leading-relaxed text-[#F3EDE3]/65">
            Bookings open sixty days ahead, at noon. For groups larger than eight, ask about the private room.
          </p>
          <form onSubmit={submit} className="mt-12 grid gap-8 text-left sm:grid-cols-3">
            <label className="flex flex-col gap-2" htmlFor={`${id}-date`}>
              <span className={fieldLabel}>Date</span>
              <input id={`${id}-date`} type="date" required className={field} />
            </label>
            <label className="flex flex-col gap-2" htmlFor={`${id}-time`}>
              <span className={fieldLabel}>Seating</span>
              <select id={`${id}-time`} className={field} defaultValue="19:00">
                <option className="bg-[#0B0A09]">18:30</option>
                <option className="bg-[#0B0A09]">19:00</option>
                <option className="bg-[#0B0A09]">21:00 — counter</option>
              </select>
            </label>
            <label className="flex flex-col gap-2" htmlFor={`${id}-guests`}>
              <span className={fieldLabel}>Guests</span>
              <select id={`${id}-guests`} className={field} defaultValue="2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n} className="bg-[#0B0A09]">
                    {n} {n === 1 ? 'guest' : 'guests'}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="h-14 bg-[#C9A45C] font-manrope text-[12px] font-semibold uppercase tracking-[0.24em] text-[#0B0A09] transition-colors duration-500 hover:bg-[#F3EDE3] sm:col-span-3"
            >
              Find a table
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

function Visit() {
  const hours = [
    ['Tuesday — Thursday', '18:30 — 23:30'],
    ['Friday — Saturday', '18:00 — 00:30'],
    ['Sunday — Monday', 'Private events'],
  ]
  return (
    <section id="visit" aria-labelledby="noir-visit" className="border-t border-white/[0.06] py-28 md:py-40">
      <div className={`${wrap} grid gap-14 lg:grid-cols-12 lg:gap-10`}>
        <div className="lg:col-span-5">
          <p className={eyebrow}>Visit</p>
          <h2 id="noir-visit" className="mt-6 font-bodoni text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.95]">
            Find the <em className="text-[#C9A45C]">brass door.</em>
          </h2>
          <address className="mt-10 font-manrope text-[16px] not-italic leading-[1.8] text-[#F3EDE3]/80">
            Noir
            <br />
            Vinohrady, Prague 2
            <br />
            Five minutes from Náměstí Míru
          </address>
          <dl className="mt-10 border-t border-white/10 font-manrope text-[15px]">
            {hours.map(([d, h]) => (
              <div key={d} className="flex justify-between gap-4 border-b border-white/10 py-4">
                <dt className="text-[#8B8378]">{d}</dt>
                <dd>{h}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Parallax photo={photos.facade} alt="Restaurant terrace glowing under stone arcades at night" aspect={4 / 3} sizes="(min-width: 1024px) 48vw, 100vw" amount={8} />
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] pb-24 pt-20 text-center">
      <p className="font-bodoni text-[clamp(4rem,18vw,16rem)] font-normal leading-none tracking-[0.12em]" aria-hidden="true">
        <span className="mr-[-0.12em]">NOIR</span>
      </p>
      <div className={`${wrap} mt-10 flex flex-col items-center justify-between gap-4 font-manrope text-[12px] uppercase tracking-[0.2em] text-[#8B8378] md:flex-row`}>
        <span>© Noir — Contemporary Dining</span>
        <span>A concept project</span>
      </div>
    </footer>
  )
}

export default function NoirSite() {
  useSeo('/portfolio/noir')
  useBodyTheme(BG, 'dark')

  return (
    <div className="min-h-dvh font-manrope" style={{ background: BG, color: CREAM, ['--focus-color' as string]: '#C9A45C' }}>
      {/* Plain (not blended) grain: a blend-mode layer over the viewport would be re-composited on every scrolled frame. */}
      <div className="pointer-events-none fixed inset-0 z-[40] opacity-[0.035]" style={{ backgroundImage: GRAIN }} aria-hidden="true" />
      <Header />
      <main>
        <Hero />
        <Philosophy />
        <Menu />
        <Chef />
        <Experience />
        <Gallery />
        <Reserve />
        <Visit />
      </main>
      <Footer />
      <ConceptBar />
    </div>
  )
}
