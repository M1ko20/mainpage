import '@fontsource-variable/space-grotesk/wght.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import { animate, AnimatePresence, m, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, Check, Copy, Menu as MenuIcon, X } from 'lucide-react'
import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { ConceptBar } from '../../components/shared/ConceptBar'
import { useConcept } from '../../lib/concept-context'
import { enter } from '../../lib/enter'
import { useSeo } from '../../lib/seo'
import { useBodyTheme } from '../../lib/useBodyTheme'
import { Dashboard } from './Dashboard'
import { benefits, integrations, metrics, plans, productTabs, testimonials } from './data'

const BG = '#05060B'
const EASE = [0.16, 1, 0.3, 1] as const
const wrap = 'mx-auto w-full max-w-[1240px] px-5 md:px-8'
const gradientText = 'bg-gradient-to-r from-[#A18BFF] via-[#7C5CFF] to-[#22D3EE] bg-clip-text text-transparent'
const kicker = 'font-jbmono text-[12px] uppercase tracking-[0.18em] text-[#8A90A6]'

function Up({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </m.div>
  )
}

function Logo() {
  return (
    <span className="flex items-center gap-2.5 font-grotesk text-[17px] font-semibold tracking-[-0.02em]">
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
        <defs>
          <linearGradient id="nx-logo" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#A18BFF" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <path d="M12 2 21 7v10l-9 5-9-5V7l9-5Z" fill="none" stroke="url(#nx-logo)" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="3" fill="url(#nx-logo)" />
        <path d="M12 2v7M21 17l-6-3.5M3 17l6-3.5" stroke="url(#nx-logo)" strokeWidth="1.6" />
      </svg>
      Nexora
    </span>
  )
}

const navLinks = [
  { href: '#product', label: 'Product' },
  { href: '#platform', label: 'Platform' },
  { href: '#customers', label: 'Customers' },
  { href: '#pricing', label: 'Pricing' },
]

function Nav() {
  const { notify } = useConcept()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 md:top-5">
      <div className="mx-auto max-w-[920px] rounded-2xl bg-[#0B0D16]/70 ring-1 ring-white/10 backdrop-blur-xl md:rounded-full">
        <nav aria-label="Primary" className="flex h-14 items-center justify-between pl-5 pr-2">
          <a href="#top" aria-label="Nexora home">
            <Logo />
          </a>
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-3.5 py-2 font-grotesk text-[14px] text-white/65 transition-colors hover:bg-white/5 hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => notify('Sign in')} className="hidden h-10 rounded-full px-4 font-grotesk text-[14px] text-white/70 hover:text-white sm:block">
              Sign in
            </button>
            <a href="#start" className="hidden h-10 items-center rounded-full bg-white px-4 font-grotesk text-[14px] font-medium text-[#05060B] transition-colors hover:bg-white/85 sm:inline-flex">
              Start building
            </a>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full text-white/80 hover:bg-white/5 md:hidden"
              aria-expanded={open}
              aria-controls="nx-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} aria-hidden="true" /> : <MenuIcon size={20} aria-hidden="true" />}
            </button>
          </div>
        </nav>
        <AnimatePresence initial={false}>
          {open && (
            <m.div
              id="nx-menu"
              className="overflow-hidden md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <ul className="border-t border-white/10 p-2">
                {navLinks.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 font-grotesk text-[16px] text-white/80 hover:bg-white/5">
                      {l.label}
                    </a>
                  </li>
                ))}
                <li className="mt-2 grid grid-cols-2 gap-2 p-1">
                  <button type="button" onClick={() => notify('Sign in')} className="h-11 rounded-xl font-grotesk text-[15px] ring-1 ring-white/15">
                    Sign in
                  </button>
                  <a href="#start" onClick={() => setOpen(false)} className="grid h-11 place-items-center rounded-xl bg-white font-grotesk text-[15px] font-medium text-[#05060B]">
                    Start building
                  </a>
                </li>
              </ul>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

function GridBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="absolute left-1/2 top-[-18%] h-[640px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,.35),transparent)] blur-2xl" />
      <div className="absolute right-[-10%] top-[30%] h-[420px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,.14),transparent)] blur-2xl" />
    </div>
  )
}

function Hero() {
  const { notify } = useConcept()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1])

  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-36 md:pb-32 md:pt-48">
      <GridBackdrop />
      <div className={`${wrap} relative text-center`}>
        <button
          type="button"
          onClick={() => notify('Read the Series B announcement')}
          className="enter enter-rise group mx-auto inline-flex items-center gap-3 rounded-full bg-white/[0.04] py-1.5 pl-1.5 pr-4 font-grotesk text-[13px] text-white/80 ring-1 ring-white/10 transition-colors hover:bg-white/[0.07]"
          style={enter(0, 0.7, { y: '10px' })}
        >
          <span className="rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] px-2.5 py-0.5 text-[12px] font-medium text-white">New</span>
          We raised a $48M Series B
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>

        <h1
          className="enter enter-rise mx-auto mt-8 max-w-[15ch] font-grotesk text-[clamp(2.7rem,7.2vw,5.9rem)] font-semibold leading-[0.98] tracking-[-0.045em]"
          style={enter(0.08, 0.9, { y: '24px' })}
        >
          The inference layer for <span className={gradientText}>production AI.</span>
        </h1>
        <p
          className="enter enter-rise mx-auto mt-7 max-w-[40rem] font-grotesk text-[clamp(1.05rem,1.5vw,1.25rem)] leading-relaxed text-[#8A90A6]"
          style={enter(0.16, 0.9, { y: '16px' })}
        >
          Deploy any model to 31 regions with one command. Nexora scales to zero, streams the first token in milliseconds and
          tells you what every request cost.
        </p>
        <div
          className="enter enter-rise mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={enter(0.24, 0.9, { y: '16px' })}
        >
          <a href="#start" className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-grotesk text-[15px] font-medium text-[#05060B] shadow-[0_0_40px_-8px_rgba(124,92,255,.8)] transition-transform hover:-translate-y-px">
            Start building — it’s free
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
          <button type="button" onClick={() => notify('Book a demo')} className="h-12 rounded-full px-6 font-grotesk text-[15px] text-white/85 ring-1 ring-white/15 transition-colors hover:bg-white/5">
            Book a demo
          </button>
        </div>
      </div>

      <div ref={ref} className={`${wrap} relative mt-16 md:mt-24 [perspective:1600px]`}>
        <div className="enter enter-rise" style={enter(0.35, 1.2, { y: '40px' })}>
        <m.div style={{ rotateX, scale }} className="origin-top">
          <div className="relative">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#7C5CFF]/60 via-white/10 to-transparent" aria-hidden="true" />
            <div className="relative">
              <Dashboard />
            </div>
          </div>
        </m.div>
        </div>
        <p className="sr-only">Product preview: a live console showing requests per second, latency, GPU utilisation and a request log.</p>
      </div>
    </section>
  )
}

function Terminal({ lines }: { lines: string[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#0A0C14] ring-1 ring-white/10">
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#FF5F57]/80" />
        <span className="size-2.5 rounded-full bg-[#FEBC2E]/80" />
        <span className="size-2.5 rounded-full bg-[#28C840]/80" />
        <span className="ml-3 font-jbmono text-[11px] text-white/55">~/models — zsh</span>
      </div>
      <pre className="min-h-[220px] overflow-x-auto p-5 font-jbmono text-[12.5px] leading-[1.85] md:p-6 md:text-[13.5px]">
        {lines.map((l, i) => (
          <m.code
            key={`${l}-${i}`}
            className={`block ${l.startsWith('$') ? 'text-white' : l.startsWith('✓') ? 'text-emerald-300' : 'text-white/55'}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.15 + i * 0.16 }}
          >
            {l || ' '}
          </m.code>
        ))}
      </pre>
    </div>
  )
}

function Product() {
  const [active, setActive] = useState(0)
  const baseId = useId()
  const tab = productTabs[active]

  return (
    <section id="product" aria-labelledby="nx-product" className="relative py-24 md:py-36">
      <div className={wrap}>
        <Up className="max-w-2xl">
          <p className={kicker}>Product</p>
          <h2 id="nx-product" className="mt-5 font-grotesk text-[clamp(2.2rem,4.6vw,3.8rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            Three verbs. <span className="text-[#8A90A6]">Everything else is automated.</span>
          </h2>
        </Up>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 [&>*]:min-w-0">
          <div role="tablist" aria-label="Product capabilities" aria-orientation="vertical" className="flex flex-col gap-2">
            {productTabs.map((t, i) => (
              <button
                key={t.id}
                role="tab"
                id={`${baseId}-${t.id}`}
                aria-selected={active === i}
                aria-controls={`${baseId}-panel`}
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault()
                    const next = (i + (e.key === 'ArrowDown' ? 1 : productTabs.length - 1)) % productTabs.length
                    setActive(next)
                    ;(e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus()
                  }
                }}
                className={`group relative overflow-hidden rounded-2xl p-6 text-left transition-colors ${active === i ? 'bg-white/[0.05] ring-1 ring-white/10' : 'hover:bg-white/[0.025]'}`}
              >
                <span className="flex items-center gap-3">
                  <span className={`font-jbmono text-[12px] ${active === i ? 'text-[#22D3EE]' : 'text-white/55'}`}>0{i + 1}</span>
                  <span className="font-grotesk text-[20px] font-medium tracking-[-0.02em]">{t.label}</span>
                </span>
                <span className={`mt-3 block font-grotesk text-[15px] leading-relaxed ${active === i ? 'text-[#8A90A6]' : 'hidden'}`}>
                  <span className="block text-white">{t.title}</span>
                  <span className="mt-2 block">{t.body}</span>
                </span>
                {active === i && <span className="absolute inset-y-4 left-0 w-[2px] rounded-full bg-gradient-to-b from-[#7C5CFF] to-[#22D3EE]" />}
              </button>
            ))}
          </div>
          <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-${tab.id}`} className="relative">
            <div className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,.18),transparent)] blur-2xl" aria-hidden="true" />
            <div className="relative">
              <Terminal key={tab.id} lines={tab.code} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  const ref = useRef<HTMLUListElement>(null)
  const onMove = (e: PointerEvent<HTMLUListElement>) => {
    const el = ref.current
    if (!el) return
    for (const card of el.querySelectorAll<HTMLElement>('[data-spot]')) {
      const r = card.getBoundingClientRect()
      card.style.setProperty('--x', `${e.clientX - r.left}px`)
      card.style.setProperty('--y', `${e.clientY - r.top}px`)
    }
  }

  return (
    <section id="platform" aria-labelledby="nx-benefits" className="py-24 md:py-36">
      <div className={wrap}>
        <Up className="mx-auto max-w-2xl text-center">
          <p className={kicker}>Platform</p>
          <h2 id="nx-benefits" className="mt-5 font-grotesk text-[clamp(2.2rem,4.6vw,3.8rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            Built for the <span className={gradientText}>boring parts</span> of AI.
          </h2>
          <p className="mt-5 font-grotesk text-[17px] leading-relaxed text-[#8A90A6]">
            Your team should be improving models, not babysitting GPUs. Nexora handles the infrastructure that never makes the demo.
          </p>
        </Up>
        <ul ref={ref} onPointerMove={onMove} className="group/grid mt-16 grid gap-px overflow-hidden rounded-3xl bg-white/[0.07] ring-1 ring-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <li
              key={b.title}
              data-spot
              className="relative bg-[#070810] p-7 md:p-9"
              style={{ backgroundImage: 'radial-gradient(420px circle at var(--x, -999px) var(--y, -999px), rgba(124,92,255,.12), transparent 45%)' }}
            >
              <span className="grid size-11 place-items-center rounded-xl bg-white/[0.04] text-[#A18BFF] ring-1 ring-white/10">
                <b.icon size={20} aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-grotesk text-[19px] font-medium tracking-[-0.02em]">{b.title}</h3>
              <p className="mt-3 font-grotesk text-[15px] leading-relaxed text-[#8A90A6]">{b.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Metric({ value, suffix, label, decimals = 0 }: { value: number; suffix: string; label: string; decimals?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion()
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => mv.on('change', setDisplay), [mv])
  useEffect(() => {
    if (!inView) return
    if (reduce) {
      mv.set(value)
      return
    }
    const c = animate(mv, value, { duration: 1.8, ease: EASE })
    return () => c.stop()
  }, [inView, mv, value, reduce])

  return (
    <div ref={ref} className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6">
      <dt className="font-grotesk text-[14px] text-[#8A90A6]">{label}</dt>
      <dd className={`font-grotesk text-[clamp(2.8rem,5.4vw,4.6rem)] font-semibold leading-none tracking-[-0.045em] tabular-nums ${gradientText}`}>
        <span aria-hidden="true">
          {display.toFixed(decimals)}
          {suffix}
        </span>
        <span className="sr-only">
          {value}
          {suffix}
        </span>
      </dd>
    </div>
  )
}

function Metrics() {
  return (
    <section aria-label="Nexora by the numbers" className="py-16 md:py-24">
      <dl className={`${wrap} grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4`}>
        {metrics.map((mt) => (
          <Metric key={mt.label} {...mt} />
        ))}
      </dl>
    </section>
  )
}

function Architecture() {
  const node = 'fill-[#0B0D16] stroke-white/15'
  const label = 'fill-white font-grotesk text-[13px]'
  const sub = 'fill-[#8A90A6] font-jbmono text-[10px]'
  return (
    <section aria-labelledby="nx-arch" className="py-24 md:py-36">
      <div className={`${wrap} grid items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] [&>*]:min-w-0`}>
        <Up>
          <p className={kicker}>Technology</p>
          <h2 id="nx-arch" className="mt-5 font-grotesk text-[clamp(2.2rem,4.4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            One endpoint. <span className="text-[#8A90A6]">A planet of GPUs behind it.</span>
          </h2>
          <ul className="mt-8 space-y-5 font-grotesk text-[15.5px] leading-relaxed text-[#8A90A6]">
            {[
              ['Edge', 'TLS, auth and rate limits terminate within 20 ms of your users.'],
              ['Router', 'Picks the pool with the shortest queue and warmest cache — per request.'],
              ['Pools', 'H100, A100 and L40S fleets, mixed to hit your latency and cost targets.'],
            ].map(([k, v]) => (
              <li key={k} className="flex gap-4">
                <span className="mt-1 font-jbmono text-[12px] text-[#22D3EE]">{k}</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </Up>
        <Up delay={0.1}>
          <div className="overflow-x-auto rounded-3xl bg-white/[0.02] p-4 ring-1 ring-white/[0.07] no-scrollbar md:p-8">
            <svg viewBox="0 0 640 360" className="min-w-[560px]" role="img" aria-label="Diagram: your app connects to the Nexora edge, which routes to H100, A100 and L40S GPU pools backed by a global weight cache.">
              <defs>
                <linearGradient id="nx-flow" x1="0" x2="1">
                  <stop offset="0%" stopColor="#7C5CFF" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
              {['M130,180 H220', 'M340,180 H400', 'M470,180 C500,180 500,80 530,80', 'M470,180 H530', 'M470,180 C500,180 500,280 530,280'].map((d) => (
                <g key={d}>
                  <path d={d} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="2" />
                  <path d={d} fill="none" stroke="url(#nx-flow)" strokeWidth="2" strokeDasharray="6 10" className="animate-[nx-flow_1.2s_linear_infinite]" />
                </g>
              ))}
              <rect x="10" y="150" width="120" height="60" rx="12" className={node} />
              <text x="70" y="177" textAnchor="middle" className={label}>Your app</text>
              <text x="70" y="195" textAnchor="middle" className={sub}>/v1/chat</text>
              <rect x="220" y="140" width="120" height="80" rx="14" className="fill-[#0B0D16]" stroke="url(#nx-flow)" strokeWidth="1.5" />
              <text x="280" y="175" textAnchor="middle" className={label}>Nexora Edge</text>
              <text x="280" y="193" textAnchor="middle" className={sub}>31 regions</text>
              <circle cx="435" cy="180" r="34" className={node} />
              <text x="435" y="184" textAnchor="middle" className={label}>Router</text>
              {[
                [80, 'H100 pool', '96 GPUs'],
                [180, 'A100 pool', '160 GPUs'],
                [280, 'L40S pool', '240 GPUs'],
              ].map(([y, t, s]) => (
                <g key={t as string}>
                  <rect x="530" y={(y as number) - 28} width="100" height="56" rx="12" className={node} />
                  <text x="580" y={(y as number) - 3} textAnchor="middle" className={label}>{t}</text>
                  <text x="580" y={(y as number) + 14} textAnchor="middle" className={sub}>{s}</text>
                </g>
              ))}
              <text x="280" y="300" textAnchor="middle" className={sub}>weights cache · 2.1 PB · streamed at boot</text>
              <path d="M280,220 V282" stroke="rgba(255,255,255,.12)" strokeDasharray="3 5" />
            </svg>
          </div>
        </Up>
      </div>
    </section>
  )
}

function Integrations() {
  const half = Math.ceil(integrations.length / 2)
  const rows = [integrations.slice(0, half), integrations.slice(half)]
  return (
    <section aria-labelledby="nx-int" className="overflow-hidden py-24 md:py-32">
      <Up className={`${wrap} text-center`}>
        <p className={kicker}>Integrations</p>
        <h2 id="nx-int" className="mt-5 font-grotesk text-[clamp(2rem,4vw,3.2rem)] font-semibold tracking-[-0.04em]">
          Fits the stack you already run.
        </h2>
      </Up>
      <div className="mt-14 flex flex-col gap-3 [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        {rows.map((row, ri) => (
          <div key={ri} className="pause-on-hover flex">
            <div className="marquee flex w-max gap-3" style={{ ['--marquee-duration' as string]: `${40 + ri * 8}s`, animationDirection: ri ? 'reverse' : 'normal' }}>
              {[...row, ...row].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  aria-hidden={i >= row.length || undefined}
                  className="flex h-14 items-center gap-3 whitespace-nowrap rounded-2xl bg-white/[0.03] px-6 font-grotesk text-[15px] text-white/75 ring-1 ring-white/[0.08]"
                >
                  <span className="size-2 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#22D3EE]" />
                  {name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section id="customers" aria-labelledby="nx-cust" className="py-24 md:py-36">
      <div className={wrap}>
        <Up className="max-w-2xl">
          <p className={kicker}>Customers</p>
          <h2 id="nx-cust" className="mt-5 font-grotesk text-[clamp(2.2rem,4.6vw,3.8rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
            Teams that stopped <span className="text-[#8A90A6]">thinking about GPUs.</span>
          </h2>
        </Up>
        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
              <m.li
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.08 }}
                className="flex h-full flex-col justify-between gap-10 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.015] p-7 ring-1 ring-white/[0.08] md:p-8"
              >
                <blockquote className="font-grotesk text-[18px] leading-[1.55] tracking-[-0.01em] text-white/90">“{t.quote}”</blockquote>
                <p className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#22D3EE] font-grotesk text-[14px] font-semibold" aria-hidden="true">
                    {t.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                  <span className="font-grotesk text-[14px]">
                    <span className="block font-medium">{t.name}</span>
                    <span className="text-[#8A90A6]">{t.role}</span>
                  </span>
                </p>
              </m.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Pricing() {
  const { notify } = useConcept()
  const [annual, setAnnual] = useState(true)

  return (
    <section id="pricing" aria-labelledby="nx-pricing" className="bg-[#F4F5F9] py-24 text-[#0B0D16] md:py-36" style={{ ['--focus-color' as string]: '#7C5CFF' }}>
      <div className={wrap}>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="font-jbmono text-[12px] uppercase tracking-[0.18em] text-[#5B6076]">Pricing</p>
            <h2 id="nx-pricing" className="mt-5 font-grotesk text-[clamp(2.2rem,4.6vw,3.8rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
              Pay for tokens, not idle GPUs.
            </h2>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-black/10" role="group" aria-label="Billing period">
            {[
              ['Monthly', false],
              ['Annual −20%', true],
            ].map(([l, v]) => (
              <button
                key={String(l)}
                type="button"
                aria-pressed={annual === v}
                onClick={() => setAnnual(v as boolean)}
                className={`h-10 rounded-full px-5 font-grotesk text-[14px] transition-colors ${annual === v ? 'bg-[#0B0D16] text-white' : 'text-[#5B6076] hover:text-[#0B0D16]'}`}
              >
                {l as string}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-14 grid gap-4 lg:grid-cols-3">
          {plans.map((p) => {
            const price = annual ? p.annual : p.monthly
            const dark = p.featured
            return (
              <li
                key={p.name}
                className={`relative flex flex-col rounded-3xl p-8 ${dark ? 'bg-[#0B0D16] text-white shadow-[0_30px_80px_-30px_rgba(124,92,255,.6)]' : 'bg-white ring-1 ring-black/[0.07]'}`}
              >
                {dark && (
                  <span className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#22D3EE] px-3 py-1 font-grotesk text-[12px] font-medium">Most popular</span>
                )}
                <h3 className="font-grotesk text-[20px] font-medium">{p.name}</h3>
                <p className={`mt-2 font-grotesk text-[15px] ${dark ? 'text-[#8A90A6]' : 'text-[#5B6076]'}`}>{p.blurb}</p>
                <p className="mt-8 flex items-baseline gap-2 font-grotesk">
                  <span className="text-[3.25rem] font-semibold leading-none tracking-[-0.04em]">{price === null ? 'Custom' : `$${price}`}</span>
                  {price !== null && <span className={dark ? 'text-[#8A90A6]' : 'text-[#5B6076]'}>/ month</span>}
                </p>
                <ul className="mt-8 flex-1 space-y-3 font-grotesk text-[15px]">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <Check size={18} className={dark ? 'text-[#22D3EE]' : 'text-[#7C5CFF]'} aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => notify(p.cta)}
                  className={`mt-10 h-12 rounded-full font-grotesk text-[15px] font-medium transition-colors ${
                    dark ? 'bg-white text-[#0B0D16] hover:bg-white/85' : 'bg-[#0B0D16] text-white hover:bg-[#23263A]'
                  }`}
                >
                  {p.cta}
                </button>
              </li>
            )
          })}
        </ul>
        <p className="mt-8 text-center font-grotesk text-[14px] text-[#5B6076]">Usage billed per second on top of plan. No minimums on Developer and Team.</p>
      </div>
    </section>
  )
}

function FinalCta() {
  const command = 'npx nexora deploy'
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section id="start" aria-labelledby="nx-cta" className="relative overflow-hidden py-28 md:py-44">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute bottom-[-40%] left-1/2 h-[700px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,.4),rgba(34,211,238,.08)_60%,transparent)] blur-2xl" />
      </div>
      <Up className={`${wrap} relative text-center`}>
        <h2 id="nx-cta" className="mx-auto max-w-[14ch] font-grotesk text-[clamp(2.6rem,6.4vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
          Ship your model <span className={gradientText}>this afternoon.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md font-grotesk text-[17px] text-[#8A90A6]">$25 of free compute every month. No credit card, no sales call.</p>
        <div className="mx-auto mt-10 flex w-full max-w-md items-center justify-between gap-3 rounded-2xl bg-[#0A0C14] py-2 pl-5 pr-2 ring-1 ring-white/10">
          <code className="truncate font-jbmono text-[14px] text-white/85">
            <span className="text-[#22D3EE]">$</span> {command}
          </code>
          <button type="button" onClick={copy} className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-white/[0.06] px-4 font-grotesk text-[13px] text-white/80 transition-colors hover:bg-white/10">
            {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
            <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </Up>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.07] pb-24 pt-10">
      <div className={`${wrap} flex flex-col gap-6 font-grotesk text-[14px] text-[#8A90A6] md:flex-row md:items-center md:justify-between`}>
        <Logo />
        <p className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400" aria-hidden="true" />
          All systems operational
        </p>
        <p>© Nexora Labs · A concept project</p>
      </div>
    </footer>
  )
}

export default function NexoraSite() {
  useSeo('/portfolio/nexora')
  useBodyTheme(BG, 'dark')

  return (
    <div className="min-h-dvh font-grotesk text-[#E8EAF2]" style={{ background: BG, ['--focus-color' as string]: '#22D3EE' }}>
      <Nav />
      <main>
        <Hero />
        <Product />
        <Benefits />
        <Metrics />
        <Architecture />
        <Integrations />
        <Testimonials />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
      <ConceptBar position="right" />
    </div>
  )
}
