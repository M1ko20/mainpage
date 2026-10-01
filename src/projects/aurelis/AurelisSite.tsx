import '@fontsource/cormorant-garamond/300.css'
import '@fontsource/cormorant-garamond/300-italic.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource-variable/jost/wght.css'
import { animate, AnimatePresence, m, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ConceptBar } from '../../components/shared/ConceptBar'
import { Img } from '../../components/shared/Img'
import { useConcept } from '../../lib/concept-context'
import { enter } from '../../lib/enter'
import { useSeo } from '../../lib/seo'
import { useBodyTheme } from '../../lib/useBodyTheme'
import { disciplines, featured, HERO, principles, stats, works } from './data'

const SLOW = [0.19, 1, 0.22, 1] as const
const SLOW_CSS = 'cubic-bezier(.19,1,.22,1)'
const BG = '#ECE9E3'
const INK = '#1D1C1A'
const FALLBACK = '#DAD5CC'
const wrap = 'mx-auto w-full max-w-[1760px] px-5 md:px-10 lg:px-16'
const label = 'font-jost text-[11px] font-medium uppercase tracking-[0.28em]'

function Rise({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.6, ease: SLOW, delay }}
    >
      {children}
    </m.div>
  )
}

/** Image that unveils upward, slowly, when it enters the viewport. */
function Unveil({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <m.div
      className={className}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.8, ease: SLOW, delay }}
    >
      {children}
    </m.div>
  )
}

const menu = [
  { href: '#work', label: 'Selected work', photo: works[0].photo },
  { href: '#featured', label: 'Hotel Lumen', photo: featured.images[0].photo },
  { href: '#philosophy', label: 'Philosophy', photo: '1496307653780-42ee777d4833' },
  { href: '#studio', label: 'Studio', photo: featured.images[2].photo },
  { href: '#contact', label: 'Contact', photo: works[3].photo },
]

function IndexMenu({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ref.current?.querySelector<HTMLElement>('button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && ref.current) {
        const items = [...ref.current.querySelectorAll<HTMLElement>('a, button')]
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <m.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Index"
      className="fixed inset-0 z-[80] flex flex-col bg-[#1D1C1A] text-[#ECE9E3]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: SLOW }}
    >
      <div className={`${wrap} flex h-20 items-center justify-between md:h-24`}>
        <span className={`${label} tracking-[0.42em]`}>Aurelis</span>
        <button type="button" onClick={onClose} className={`${label} flex h-11 items-center gap-3`}>
          Close
          <span className="relative block size-3" aria-hidden="true">
            <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
            <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
          </span>
        </button>
      </div>
      <div className={`${wrap} grid flex-1 items-center gap-10 pb-10 lg:grid-cols-12`}>
        <nav aria-label="Index" className="lg:col-span-7">
          <ol>
            {menu.map((item, i) => (
              <li key={item.href} className="overflow-hidden">
                <m.a
                  href={item.href}
                  onClick={onClose}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex items-baseline gap-5 py-1.5 font-cormorant text-[clamp(2.6rem,7vw,6.5rem)] font-light leading-[1.02] md:gap-8"
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.2, ease: SLOW, delay: 0.15 + i * 0.07 }}
                >
                  <span className="w-8 font-jost text-[11px] tracking-[0.2em] text-[#ECE9E3]/60 md:w-12">
                    {['I', 'II', 'III', 'IV', 'V'][i]}
                  </span>
                  <span className={`transition-[opacity,font-style] duration-700 ${active === i ? 'italic opacity-100' : 'opacity-45'}`}>
                    {item.label}
                  </span>
                </m.a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="relative hidden aspect-[4/5] max-h-[62vh] lg:col-span-4 lg:col-start-9 lg:block">
          <AnimatePresence initial={false}>
            <m.div
              key={menu[active].photo}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: SLOW }}
            >
              <Img photo={menu[active].photo} alt="" sizes="30vw" className="h-full w-full" imgClassName="saturate-[.75]" fallback="#2A2927" />
            </m.div>
          </AnimatePresence>
        </div>
      </div>
      <div className={`${wrap} flex flex-wrap justify-between gap-4 border-t border-white/10 py-6 font-jost text-[13px] text-[#ECE9E3]/60`}>
        <span>Prague — Lisbon</span>
        <span>studio@aurelis.archi</span>
      </div>
    </m.div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <header data-blend className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <div className={`${wrap} flex h-20 items-center justify-between md:h-24`}>
          <a href="#top" className={`${label} pointer-events-auto tracking-[0.42em]`}>
            Aurelis
          </a>
          <span className={`${label} hidden md:block`}>Architecture &amp; Development</span>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            className={`${label} pointer-events-auto flex h-11 items-center gap-3`}
          >
            Index
            <span className="flex w-6 flex-col gap-[5px]" aria-hidden="true">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-2/3 self-end bg-current" />
            </span>
          </button>
        </div>
      </header>
      <AnimatePresence>{open && <IndexMenu onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  )
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  return (
    <section ref={ref} id="top" className="pt-24 md:pt-32">
      <div className={wrap}>
        <div
          className={`${label} enter enter-fade grid grid-cols-2 gap-4 border-b border-[#1D1C1A]/15 pb-5 text-[#5E5950] md:grid-cols-4`}
          style={enter(0.3, 2)}
        >
          <span>Est. 2009</span>
          <span className="text-right md:text-left">Prague — Lisbon</span>
          <span className="hidden md:block">Residential · Cultural · Hospitality</span>
          <span className="hidden text-right md:block">34 buildings</span>
        </div>

        <div className="grid items-end gap-6 lg:grid-cols-12">
          <h1 className="overflow-hidden lg:col-span-9">
            <span className="sr-only">Aurelis — Architecture and Development</span>
            <span
              aria-hidden="true"
              className="enter enter-mask -ml-[0.04em] block font-cormorant text-[25.5vw] font-light leading-[0.86] tracking-[-0.045em] lg:text-[21vw] 2xl:text-[min(21vw,24rem)]"
              style={enter(0.2, 2, { ease: SLOW_CSS })}
            >
              Aurelis
            </span>
          </h1>
          <p
            className="enter enter-rise pb-[2vw] font-cormorant text-[clamp(1.6rem,2.1vw,2.2rem)] font-light leading-[1.15] lg:col-span-3"
            style={enter(1, 1.8, { ease: SLOW_CSS })}
          >
            Quiet buildings, <em>designed to outlast</em> the decade they were built in.
          </p>
        </div>
      </div>

      <div className={`${wrap} mt-4 grid gap-8 md:mt-6 lg:grid-cols-12`}>
        <div className="enter enter-clip-down relative overflow-hidden lg:col-span-9" style={enter(0.6, 2.2, { ease: SLOW_CSS })}>
          <m.div style={{ y, scale }} className="origin-top will-change-transform">
            <Img
              photo={HERO.photo}
              alt={HERO.alt}
              priority
              sizes="(min-width: 1024px) 75vw, 100vw"
              className="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[2/1]"
              imgClassName="saturate-[.8]"
              fallback={FALLBACK}
            />
          </m.div>
        </div>
        <div className="enter enter-rise flex flex-col justify-between gap-8 lg:col-span-3 lg:pb-2" style={enter(1.2, 1.8, { ease: SLOW_CSS })}>
          <p className="max-w-xs font-jost text-[15px] font-light leading-[1.75] text-[#1D1C1A]/70">
            Architecture, interiors and development under one roof — residential, cultural and hospitality work across
            Central Europe and the Atlantic coast.
          </p>
          <div className={`${label} flex items-end justify-between text-[#5E5950]`}>
            <span>
              Hotel Lumen
              <br />
              Lisbon, 2025
            </span>
            <span>Scroll</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Intro() {
  return (
    <section aria-labelledby="au-intro" className="py-28 md:py-48">
      <div className={`${wrap} grid gap-10 lg:grid-cols-12`}>
        <p className={`${label} text-[#5E5950] lg:col-span-3`}>(01) The studio</p>
        <Rise className="lg:col-span-8">
          <h2 id="au-intro" className="font-cormorant text-[clamp(2.1rem,4.4vw,4.9rem)] font-light leading-[1.08] tracking-[-0.01em]">
            We design buildings that feel <em>inevitable</em> — as if the site had been waiting for them. Twenty-six architects
            and developers, one practice, from the first sketch to the <em>last handed-over key.</em>
          </h2>
        </Rise>
      </div>
    </section>
  )
}

function WorkItem({ work, index, className, aspect, sizes }: { work: (typeof works)[number]; index: number; className: string; aspect: number; sizes: string }) {
  return (
    <figure className={`group ${className}`}>
      <Unveil>
        <div className="overflow-hidden">
          <Img
            photo={work.photo}
            alt={work.alt}
            aspect={aspect}
            sizes={sizes}
            className="transition-transform duration-[2.4s] ease-[cubic-bezier(.19,1,.22,1)] group-hover:scale-[1.04]"
            imgClassName="saturate-[.8]"
            fallback={FALLBACK}
          />
        </div>
      </Unveil>
      <Rise delay={0.2}>
        <figcaption className="mt-5 grid grid-cols-[auto_1fr_auto] items-baseline gap-4 border-t border-[#1D1C1A]/15 pt-4">
          <span className={`${label} text-[#5E5950]`}>{String(index + 1).padStart(2, '0')}</span>
          <span>
            <span className="block font-cormorant text-[clamp(1.6rem,2.2vw,2.3rem)] italic leading-tight">{work.name}</span>
            <span className="mt-1 block font-jost text-[13px] text-[#5E5950]">
              {work.place} — {work.type}
            </span>
          </span>
          <span className={`${label} text-[#5E5950]`}>{work.year}</span>
        </figcaption>
      </Rise>
    </figure>
  )
}

function SelectedWork() {
  const { notify } = useConcept()
  return (
    <section id="work" aria-labelledby="au-work" className="pb-28 md:pb-48">
      <div className={wrap}>
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[#1D1C1A]/15 pb-6">
          <h2 id="au-work" className="font-cormorant text-[clamp(3rem,7vw,7.5rem)] font-light leading-none tracking-[-0.02em]">
            Selected <em>work</em>
          </h2>
          <p className={`${label} text-[#5E5950]`}>(02) 2021 — 2025</p>
        </div>

        <div className="mt-14 grid gap-x-10 gap-y-20 md:mt-24 md:gap-y-32 lg:grid-cols-12">
          <WorkItem work={works[0]} index={0} aspect={4 / 3} sizes="(min-width: 1024px) 60vw, 100vw" className="lg:col-span-7" />
          <WorkItem work={works[1]} index={1} aspect={3 / 4} sizes="(min-width: 1024px) 30vw, 100vw" className="lg:col-span-4 lg:col-start-9 lg:mt-48" />
          <WorkItem work={works[2]} index={2} aspect={16 / 10} sizes="(min-width: 1024px) 55vw, 100vw" className="lg:col-span-6 lg:col-start-4" />
          <WorkItem work={works[3]} index={3} aspect={4 / 5} sizes="(min-width: 1024px) 35vw, 100vw" className="lg:col-span-4" />
          <WorkItem work={works[4]} index={4} aspect={4 / 3} sizes="(min-width: 1024px) 50vw, 100vw" className="lg:col-span-6 lg:col-start-7 lg:mt-64" />
        </div>

        <Rise className="mt-24 flex justify-center md:mt-36">
          <button
            type="button"
            onClick={() => notify('Request the complete portfolio')}
            className="group flex flex-col items-center gap-4 font-cormorant text-[clamp(1.6rem,2.4vw,2.4rem)] italic"
          >
            Request the complete portfolio
            <span className="h-px w-24 bg-[#1D1C1A]/30 transition-all duration-1000 ease-[cubic-bezier(.19,1,.22,1)] group-hover:w-full group-hover:bg-[#1D1C1A]" />
          </button>
        </Rise>
      </div>
    </section>
  )
}

function Featured() {
  return (
    <section id="featured" aria-labelledby="au-featured" className="bg-[#1D1C1A] py-28 text-[#ECE9E3] md:py-44">
      <div className={`${wrap} grid gap-14 lg:grid-cols-12 lg:gap-10`}>
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className={`${label} text-[#ECE9E3]/65`}>(03) Featured project</p>
            <h2 id="au-featured" className="mt-8 font-cormorant text-[clamp(3.4rem,6.5vw,7rem)] font-light italic leading-[0.95] tracking-[-0.02em]">
              {featured.name}
            </h2>
            <p className="mt-8 max-w-md font-jost text-[16px] font-light leading-[1.75] text-[#ECE9E3]/75">
              A terracotta skin that shifts with the Atlantic light. Sixty-four rooms arranged around a single courtyard, where
              the city’s noise falls away within three steps of the street.
            </p>
            <dl className="mt-10 border-t border-white/12 font-jost text-[14px]">
              {featured.facts.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8rem_1fr] border-b border-white/12 py-3">
                  <dt className="text-[#ECE9E3]/65">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="flex flex-col gap-10 md:gap-16 lg:col-span-7 lg:col-start-6">
          {featured.images.map((img, i) => (
            <Unveil key={img.photo} className={i === 1 ? 'md:w-3/4 md:self-end' : ''}>
              <Img
                photo={img.photo}
                alt={img.alt}
                aspect={i === 1 ? 4 / 5 : 4 / 3}
                sizes="(min-width: 1024px) 55vw, 100vw"
                imgClassName="saturate-[.8]"
                fallback="#2A2927"
              />
            </Unveil>
          ))}
        </div>
      </div>
    </section>
  )
}

function Philosophy() {
  return (
    <section id="philosophy" aria-labelledby="au-philosophy" className="py-28 md:py-48">
      <div className={`${wrap} grid gap-14 lg:grid-cols-12 lg:gap-10`}>
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Unveil>
              <Img
                photo="1496307653780-42ee777d4833"
                alt="White facade dissolving into morning fog"
                aspect={3 / 4}
                sizes="(min-width: 1024px) 38vw, 100vw"
                imgClassName="saturate-[.6]"
                fallback={FALLBACK}
              />
            </Unveil>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className={`${label} text-[#5E5950]`}>(04) Philosophy</p>
          <h2 id="au-philosophy" className="mt-8 font-cormorant text-[clamp(2.6rem,5vw,5.2rem)] font-light leading-[1] tracking-[-0.015em]">
            Three rules we <em>have never broken.</em>
          </h2>
          <ol className="mt-14 md:mt-24">
            {principles.map((p, i) => (
              <li key={p.title}>
                <Rise delay={i * 0.1} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-[#1D1C1A]/15 py-10 md:grid-cols-[5rem_1fr] md:py-14">
                  <span className="font-cormorant text-[1.6rem] italic text-[#5E5950]">{['I', 'II', 'III'][i]}</span>
                  <div>
                    <h3 className="font-cormorant text-[clamp(1.9rem,2.8vw,2.8rem)] leading-tight">{p.title}</h3>
                    <p className="mt-4 max-w-md font-jost text-[16px] font-light leading-[1.75] text-[#1D1C1A]/75">{p.body}</p>
                  </div>
                </Rise>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion()
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => mv.on('change', (v) => setDisplay(Math.round(v))), [mv])

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      mv.set(value)
      return
    }
    const controls = animate(mv, value, { duration: 2.6, ease: SLOW })
    return () => controls.stop()
  }, [inView, mv, value, reduce])

  return (
    <span ref={ref} className="tabular-nums">
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{value}</span>
      <span className="text-[0.45em] italic">{suffix}</span>
    </span>
  )
}

function Numbers() {
  return (
    <section aria-label="Aurelis in numbers" className="border-y border-[#1D1C1A]/15">
      <dl className={`${wrap} grid grid-cols-2 lg:grid-cols-4`}>
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col-reverse gap-3 py-12 md:py-20 ${i % 2 ? 'pl-6 md:pl-10' : ''} ${i > 0 ? 'lg:border-l lg:border-[#1D1C1A]/15 lg:pl-10' : ''} ${i % 2 ? 'border-l border-[#1D1C1A]/15' : ''} ${i > 1 ? 'border-t border-[#1D1C1A]/15 lg:border-t-0' : ''}`}
          >
            <dt className="font-jost text-[13px] text-[#5E5950]">{s.label}</dt>
            <dd className="font-cormorant text-[clamp(3.4rem,7vw,7.5rem)] font-light leading-none">
              <Counter value={s.value} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Studio() {
  return (
    <section id="studio" aria-labelledby="au-studio" className="py-28 md:py-48">
      <div className={`${wrap} grid gap-14 lg:grid-cols-12 lg:gap-10`}>
        <div className="lg:col-span-5">
          <p className={`${label} text-[#5E5950]`}>(05) Studio</p>
          <h2 id="au-studio" className="mt-8 font-cormorant text-[clamp(2.6rem,5vw,5.2rem)] font-light leading-[1] tracking-[-0.015em]">
            One practice. <em>Four disciplines.</em>
          </h2>
          <p className="mt-8 max-w-md font-jost text-[16px] font-light leading-[1.75] text-[#1D1C1A]/70">
            Because we develop what we design, decisions are made once, by the people who will live with them. It is slower
            at the start and far faster at the end.
          </p>
          <ul className="mt-12 border-t border-[#1D1C1A]/15">
            {disciplines.map(([name, desc]) => (
              <li key={name} className="grid gap-1 border-b border-[#1D1C1A]/15 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <span className="font-cormorant text-[1.6rem] italic leading-tight">{name}</span>
                <span className="font-jost text-[14px] font-light leading-relaxed text-[#1D1C1A]/65 sm:pt-1.5">{desc}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Unveil>
            <Img
              photo="1600210492486-724fe5c67fb0"
              alt="Light-filled studio lounge with linen sofa and pinned drawings"
              aspect={4 / 5}
              sizes="(min-width: 1024px) 45vw, 100vw"
              imgClassName="saturate-[.75]"
              fallback={FALLBACK}
            />
          </Unveil>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const { notify } = useConcept()
  return (
    <section id="contact" aria-labelledby="au-contact" className="bg-[#DDD8CF] pb-20 pt-28 md:pt-44">
      <div className={wrap}>
        <p className={`${label} text-[#5E5950]`}>(06) Contact</p>
        <h2 id="au-contact" className="mt-8 font-cormorant text-[clamp(3.6rem,12vw,13rem)] font-light leading-[0.88] tracking-[-0.035em]">
          Begin with
          <br />
          <em>the site.</em>
        </h2>
        <div className="mt-16 grid gap-10 border-t border-[#1D1C1A]/15 pt-10 font-jost text-[15px] font-light sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
          <div>
            <p className={`${label} mb-3 text-[#5E5950]`}>Prague</p>
            <p>Studio Vltava, 4th floor</p>
            <p>+420 · by appointment</p>
          </div>
          <div>
            <p className={`${label} mb-3 text-[#5E5950]`}>Lisbon</p>
            <p>Rua das Janelas Verdes</p>
            <p>+351 · by appointment</p>
          </div>
          <div>
            <p className={`${label} mb-3 text-[#5E5950]`}>Enquiries</p>
            <p>studio@aurelis.archi</p>
          </div>
          <div className="lg:text-right">
            <button
              type="button"
              onClick={() => notify('Arrange a consultation')}
              className="inline-flex h-14 items-center border border-[#1D1C1A] px-8 font-jost text-[12px] font-medium uppercase tracking-[0.24em] transition-colors duration-700 hover:bg-[#1D1C1A] hover:text-[#ECE9E3]"
            >
              Arrange a consultation
            </button>
          </div>
        </div>
        <footer className={`${label} mt-24 flex flex-wrap justify-between gap-4 text-[#5E5950] md:mt-36`}>
          <span>© Aurelis Architecture &amp; Development</span>
          <span>A concept project</span>
        </footer>
      </div>
    </section>
  )
}

function ScrollLine() {
  const { scrollYProgress } = useScroll()
  return <m.div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-[#8A7F6C]" style={{ scaleX: scrollYProgress }} />
}

export default function AurelisSite() {
  useSeo('/portfolio/aurelis')
  useBodyTheme(BG)

  return (
    <div className="min-h-dvh font-jost" style={{ background: BG, color: INK, ['--focus-color' as string]: INK }}>
      <ScrollLine />
      <Header />
      <main>
        <Hero />
        <Intro />
        <SelectedWork />
        <Featured />
        <Philosophy />
        <Numbers />
        <Studio />
        <Contact />
      </main>
      <ConceptBar />
    </div>
  )
}
