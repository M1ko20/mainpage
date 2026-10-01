import '@fontsource-variable/inter/wght.css'
import { AnimatePresence, m } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { ConceptBar } from '../../components/shared/ConceptBar'
import { Img } from '../../components/shared/Img'
import { Reveal } from '../../components/shared/Reveal'
import { useConcept } from '../../lib/concept-context'
import { enter } from '../../lib/enter'
import { useSeo } from '../../lib/seo'
import { useBodyTheme } from '../../lib/useBodyTheme'
import { cases, expertise, experience, insights, portrait, quotes } from './data'

const RED = '#E4002B'
const EASE = [0.2, 0.7, 0.2, 1] as const
const EASE_CSS = 'cubic-bezier(.2,.7,.2,1)'
const small = 'text-[12px] font-medium tracking-[0.01em] text-[#6E6E6E]'

const sections = [
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Selected work' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'insights', label: 'Insights' },
  { id: 'contact', label: 'Contact' },
]

function Fade({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <Reveal className={className} y={12} margin="0px 0px -8% 0px" duration={0.6} ease={EASE} delay={delay}>
      {children}
    </Reveal>
  )
}

function Rule({ className = '' }: { className?: string }) {
  return (
    <Reveal variant="rule" aria-hidden className={`h-px origin-left bg-[#111111] ${className}`} margin="0px" duration={1} ease={EASE} />
  )
}

function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    for (const s of sections) {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])
  return active
}

function TopBar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#E5E5E5] bg-white/90 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-2 items-center px-5 md:grid-cols-12 md:gap-6 md:px-10">
        <a href="#top" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-[-0.02em] md:col-span-3">
          <span className="size-2.5" style={{ background: RED }} aria-hidden="true" />
          Alex Morgan
        </a>
        <p className="hidden text-[14px] text-[#6E6E6E] md:col-span-6 md:block">Strategy, leadership &amp; board advisory</p>
        <div className="flex justify-end md:col-span-3">
          <a href="#contact" className="hidden h-10 items-center gap-2 bg-[#111111] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[#E4002B] md:inline-flex">
            Book a call
            <ArrowRight size={15} aria-hidden="true" />
          </a>
          <button type="button" className="h-10 px-1 text-[14px] font-medium md:hidden" aria-expanded={open} aria-controls="am-index" onClick={() => setOpen((v) => !v)}>
            {open ? 'Close' : 'Index'}
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <m.nav
            id="am-index"
            aria-label="Sections"
            className="overflow-hidden border-t border-[#E5E5E5] md:hidden"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <ol className="px-5 py-3">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} onClick={() => setOpen(false)} className="flex gap-4 py-2.5 text-[17px] font-medium tracking-[-0.01em]">
                    <span className="w-6 text-[#6E6E6E]">{String(i + 1).padStart(2, '0')}</span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function SideIndex({ active }: { active: string }) {
  return (
    <nav aria-label="Sections" className="sticky top-28 hidden lg:block">
      <ol className="flex flex-col gap-2 text-[13px]">
        {sections.map((s, i) => {
          const on = active === s.id
          return (
            <li key={s.id}>
              <a href={`#${s.id}`} aria-current={on ? 'true' : undefined} className={`group flex items-center gap-3 transition-colors ${on ? 'text-[#111111]' : 'text-[#707070] hover:text-[#111111]'}`}>
                <span className="relative block h-px w-4 bg-current">
                  <span className={`absolute inset-0 origin-left transition-transform duration-500 ${on ? 'scale-x-100' : 'scale-x-0'}`} style={{ background: RED }} />
                </span>
                <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                {s.label}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function Section({ id, index, title, children }: { id: string; index: number; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`am-${id}`} className="scroll-mt-20 pt-24 md:pt-36">
      <Rule />
      <div className="mt-4 grid grid-cols-12 gap-x-6">
        <p className={`${small} col-span-2 tabular-nums md:col-span-2`}>{String(index).padStart(2, '0')}</p>
        <h2 id={`am-${id}`} className={`${small} col-span-10 md:col-span-10`}>
          {title}
        </h2>
      </div>
      <div className="mt-10 md:mt-16">{children}</div>
    </section>
  )
}

function Hero() {
  return (
    <section id="top" className="pt-28 md:pt-40">
      <h1
        className="enter enter-rise text-[clamp(2.7rem,7.4vw,8.4rem)] font-semibold leading-[0.95] tracking-[-0.055em]"
        style={enter(0, 0.8, { y: '16px', ease: EASE_CSS })}
      >
        Strategy for leaders
        <br className="hidden sm:block" /> who can’t afford
        <br className="hidden sm:block" /> to be wrong<span style={{ color: RED }}>.</span>
      </h1>

      <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-12 md:mt-20">
        <div className="enter enter-fade col-span-12 flex flex-col justify-between gap-10 md:col-span-6 lg:col-span-5" style={enter(0.25, 0.8)}>
          <p className="max-w-md text-[19px] leading-[1.5] tracking-[-0.01em] text-[#333]">
            Independent advisor to boards and executive teams on strategy, transformation and leadership. Twenty years of
            decisions — most of them difficult, all of them made in rooms like yours.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#contact" className="inline-flex h-12 items-center gap-2 bg-[#111111] px-6 text-[15px] font-medium text-white transition-colors hover:bg-[#E4002B]">
              Book an introductory call
              <ArrowRight size={16} aria-hidden="true" />
            </a>
            <a href="#work" className="inline-flex h-12 items-center px-5 text-[15px] font-medium ring-1 ring-inset ring-[#111111] transition-colors hover:bg-[#F2F2F2]">
              Selected work
            </a>
          </div>
        </div>
        <dl className="enter enter-fade col-span-12 grid grid-cols-2 gap-x-6 gap-y-5 self-end text-[14px] md:col-span-6 lg:col-span-3" style={enter(0.35, 0.8)}>
          {[
            ['Based in', 'Zurich'],
            ['Working', 'Worldwide'],
            ['Languages', 'EN, DE, FR'],
            ['Advising since', '2016'],
          ].map(([k, v]) => (
            <div key={k} className="border-t border-[#E5E5E5] pt-3">
              <dt className="text-[#6E6E6E]">{k}</dt>
              <dd className="mt-0.5 font-medium">{v}</dd>
            </div>
          ))}
        </dl>
        <figure className="enter enter-rise col-span-12 sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-9" style={enter(0.3, 1, { y: '20px', ease: EASE_CSS })}>
          <Img photo={portrait.photo} alt={portrait.alt} aspect={4 / 5} priority sizes="(min-width: 1024px) 28vw, 80vw" imgClassName="grayscale contrast-[1.05]" fallback="#EEEEEE" />
          <figcaption className={`${small} mt-3 flex justify-between`}>
            <span>Alex Morgan</span>
            <span>Zurich, 2026</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function About() {
  return (
    <Section id="about" index={1} title="About">
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        <Fade className="col-span-12 lg:col-span-9">
          <p className="text-[clamp(1.6rem,3vw,2.75rem)] font-medium leading-[1.18] tracking-[-0.035em]">
            I work with a small number of leaders at a time — usually four — on the decisions that will define their tenure. No
            teams of juniors, no frameworks for their own sake. <span className="text-[#707070]">Just a second mind, fully committed.</span>
          </p>
        </Fade>
        <Fade className="col-span-12 md:col-span-6 lg:col-span-4" delay={0.1}>
          <p className="text-[16px] leading-[1.7] text-[#444]">
            Before going independent I spent five years as a partner in a global strategy practice, and three as chief of staff
            to the CEO of a European logistics group. I know what advice looks like from both sides of the table.
          </p>
        </Fade>
        <Fade className="col-span-12 md:col-span-6 lg:col-span-4" delay={0.15}>
          <p className="text-[16px] leading-[1.7] text-[#444]">
            Clients are boards and executive teams in financial services, logistics, healthcare and industrial technology —
            mostly in Europe, occasionally beyond.
          </p>
        </Fade>
      </div>
    </Section>
  )
}

function Expertise() {
  return (
    <Section id="expertise" index={2} title="Expertise">
      <ul className="grid gap-px bg-[#E5E5E5] md:grid-cols-2">
        {expertise.map((e, i) => (
          <li key={e.title} className="group bg-white py-8 md:p-0 md:py-10 md:pr-10 md:[&:nth-child(even)]:pl-10">
            <Fade delay={(i % 2) * 0.08}>
              <div className="flex items-baseline justify-between">
                <h3 className="text-[clamp(1.6rem,2.4vw,2.25rem)] font-semibold tracking-[-0.04em]">{e.title}</h3>
                <span className={`${small} tabular-nums`}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <p className="mt-4 max-w-md text-[16px] leading-[1.65] text-[#444]">{e.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {e.items.map((it) => (
                  <li key={it} className="border border-[#E5E5E5] px-3 py-1.5 text-[13px] transition-colors group-hover:border-[#111111]">
                    {it}
                  </li>
                ))}
              </ul>
            </Fade>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Experience() {
  return (
    <Section id="experience" index={3} title="Experience">
      <table className="w-full border-collapse text-left text-[15px]">
        <caption className="sr-only">Career history</caption>
        <thead className="hidden md:table-header-group">
          <tr className={small}>
            <th scope="col" className="pb-3 font-medium">Years</th>
            <th scope="col" className="pb-3 font-medium">Role</th>
            <th scope="col" className="pb-3 font-medium">Organisation</th>
            <th scope="col" className="pb-3 text-right font-medium">Location</th>
          </tr>
        </thead>
        <tbody>
          {experience.map(([years, role, org, place]) => (
            <tr key={years} className="grid grid-cols-2 gap-x-6 gap-y-1 border-t border-[#E5E5E5] py-5 transition-colors hover:bg-[#F7F7F7] md:table-row md:py-0">
              <td className="tabular-nums text-[#6E6E6E] md:w-[18%] md:py-5">{years}</td>
              <td className="text-right font-medium md:w-[30%] md:py-5 md:text-left">{role}</td>
              <td className="col-span-2 text-[#444] md:py-5">{org}</td>
              <td className="hidden text-right text-[#6E6E6E] md:table-cell md:py-5">{place}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}

function Work() {
  return (
    <Section id="work" index={4} title="Selected work">
      <ul>
        {cases.map((c, i) => (
          <li key={c.client} className="group relative grid grid-cols-12 gap-x-6 gap-y-4 border-t border-[#E5E5E5] py-10 md:py-14">
            <span className="absolute left-0 top-[-1px] h-px w-0 transition-[width] duration-700 group-hover:w-full" style={{ background: RED }} aria-hidden="true" />
            <Fade className="col-span-12 md:col-span-5" delay={0.05 * i}>
              <p className="text-[clamp(3.5rem,8vw,7.5rem)] font-semibold leading-[0.9] tracking-[-0.06em] tabular-nums">{c.figure}</p>
              <p className="mt-2 text-[15px] text-[#6E6E6E]">{c.unit}</p>
            </Fade>
            <Fade className="col-span-12 md:col-span-6 md:col-start-7 md:pt-3" delay={0.05 * i + 0.05}>
              <h3 className="text-[20px] font-semibold tracking-[-0.02em]">{c.client}</h3>
              <p className="mt-3 max-w-md text-[16px] leading-[1.65] text-[#444]">{c.body}</p>
            </Fade>
          </li>
        ))}
      </ul>
      <p className={`${small} mt-4`}>Client names withheld. References available on request.</p>
    </Section>
  )
}

function Testimonials() {
  const [i, setI] = useState(0)
  const q = quotes[i]
  const go = (d: number) => setI((v) => (v + d + quotes.length) % quotes.length)

  return (
    <Section id="testimonials" index={5} title="Testimonials">
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-12 min-h-[16rem] md:col-span-10 md:min-h-[18rem]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <m.figure key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }}>
              <blockquote className="text-[clamp(1.7rem,3.4vw,3.1rem)] font-medium leading-[1.14] tracking-[-0.035em]">
                <span style={{ color: RED }}>“</span>
                {q.quote}
                <span style={{ color: RED }}>”</span>
              </blockquote>
              <figcaption className="mt-8 text-[15px]">
                <span className="font-medium">{q.role}</span>
                <span className="text-[#6E6E6E]"> — {q.org}</span>
              </figcaption>
            </m.figure>
          </AnimatePresence>
        </div>
        <div className="col-span-12 flex items-end justify-between gap-3 md:col-span-2 md:flex-col md:items-end">
          <p className={`${small} tabular-nums`}>
            {String(i + 1).padStart(2, '0')} / {String(quotes.length).padStart(2, '0')}
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(-1)} className="grid size-12 place-items-center ring-1 ring-inset ring-[#111111] transition-colors hover:bg-[#111111] hover:text-white" aria-label="Previous testimonial">
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} className="grid size-12 place-items-center ring-1 ring-inset ring-[#111111] transition-colors hover:bg-[#111111] hover:text-white" aria-label="Next testimonial">
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </Section>
  )
}

function Insights() {
  const { notify } = useConcept()
  return (
    <Section id="insights" index={6} title="Insights">
      <ul>
        {insights.map(([date, title, time]) => (
          <li key={title} className="border-t border-[#E5E5E5] last:border-b">
            <button type="button" onClick={() => notify('Read the article')} className="group grid w-full grid-cols-12 items-baseline gap-x-6 gap-y-2 py-6 text-left md:py-7">
              <span className={`${small} col-span-6 tabular-nums md:col-span-2`}>{date}</span>
              <span className={`${small} col-span-6 text-right md:order-last md:col-span-2`}>{time} read</span>
              <span className="col-span-12 flex items-start gap-3 text-[clamp(1.2rem,1.9vw,1.6rem)] font-medium leading-snug tracking-[-0.025em] md:col-span-8">
                <span className="decoration-[#E4002B] decoration-2 underline-offset-[6px] group-hover:underline">{title}</span>
                <ArrowUpRight size={20} className="mt-1 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Contact() {
  const { notify } = useConcept()
  return (
    <Section id="contact" index={7} title="Contact">
      <div className="grid grid-cols-12 gap-x-6 gap-y-12">
        <Fade className="col-span-12 lg:col-span-8">
          <p className="text-[clamp(3rem,8vw,8rem)] font-semibold leading-[0.92] tracking-[-0.06em]">
            Let’s talk<span style={{ color: RED }}>.</span>
          </p>
          <p className="mt-8 max-w-lg text-[18px] leading-[1.55] text-[#444]">
            An introductory call is thirty minutes and carries no obligation. If I’m not the right person for your question, I’ll
            tell you who is.
          </p>
        </Fade>
        <Fade className="col-span-12 flex flex-col justify-end gap-6 lg:col-span-4" delay={0.1}>
          <p className="flex items-center gap-2 text-[14px]">
            <span className="size-2 rounded-full" style={{ background: RED }} aria-hidden="true" />
            Accepting two new mandates from January 2027
          </p>
          <button type="button" onClick={() => notify('Book an introductory call')} className="inline-flex h-14 items-center justify-between bg-[#111111] px-6 text-[16px] font-medium text-white transition-colors hover:bg-[#E4002B]">
            Book an introductory call
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <p className="text-[15px] text-[#6E6E6E]">office@alexmorgan.ch · Zurich</p>
        </Fade>
      </div>
      <footer className={`${small} mt-28 flex flex-col justify-between gap-2 border-t border-[#E5E5E5] py-6 pb-20 sm:flex-row`}>
        <span>© Alex Morgan Advisory GmbH</span>
        <span>A concept project</span>
      </footer>
    </Section>
  )
}

export default function AlexMorganSite() {
  useSeo('/portfolio/alex-morgan')
  useBodyTheme('#FFFFFF')
  const active = useActiveSection()

  return (
    <div className="min-h-dvh bg-white font-inter text-[#111111] [font-feature-settings:'ss01','cv11']" style={{ ['--focus-color' as string]: RED }}>
      <TopBar />
      <div className="mx-auto grid max-w-[1600px] grid-cols-12 gap-x-6 px-5 md:px-10">
        <aside className="col-span-2 hidden pt-40 lg:block">
          <SideIndex active={active} />
        </aside>
        <main className="col-span-12 lg:col-span-10">
          <Hero />
          <About />
          <Expertise />
          <Experience />
          <Work />
          <Testimonials />
          <Insights />
          <Contact />
        </main>
      </div>
      <ConceptBar position="right" />
    </div>
  )
}
