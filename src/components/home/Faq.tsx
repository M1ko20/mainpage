import { Plus } from 'lucide-react'
import { m } from 'motion/react'
import { useId, useState } from 'react'
import { questions } from '../../data/content'
import { SectionLabel } from './SectionLabel'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const baseId = useId()

  return (
    <section aria-labelledby="faq-title" className="pb-24 md:pb-40">
      <div className="mx-auto grid max-w-[1680px] gap-10 px-5 md:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-3">
          <SectionLabel index="06">Co čekat</SectionLabel>
        </div>
        <div className="lg:col-span-9">
          <h2 id="faq-title" className="font-display text-[clamp(2rem,3.6vw,3.5rem)] font-medium leading-none tracking-[-0.04em]">
            Než se zeptáte.
          </h2>
          <ul className="mt-10 border-t border-ink/15 md:mt-14">
            {questions.map((item, i) => {
              const expanded = open === i
              const panelId = `${baseId}-panel-${i}`
              const buttonId = `${baseId}-button-${i}`
              return (
                <li key={item.q} className="border-b border-ink/15">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => setOpen(expanded ? null : i)}
                      className="group flex w-full touch-manipulation items-center justify-between gap-6 py-6 text-left md:py-8"
                    >
                      <span className="text-[clamp(1.15rem,1.7vw,1.6rem)] font-medium tracking-[-0.02em] transition-colors group-hover:text-signal">
                        {item.q}
                      </span>
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-ink/15 transition-transform duration-500 ease-out-expo ${expanded ? 'rotate-45' : ''}`}
                        aria-hidden="true"
                      >
                        <Plus size={18} />
                      </span>
                    </button>
                  </h3>
                  {/* Height is animated in script: a grid-template-rows transition sticks half-way in mobile Safari. */}
                  <m.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="overflow-hidden"
                    initial={false}
                    animate={{ height: expanded ? 'auto' : 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    onAnimationComplete={() => {
                      // Closing an answer above pulls the opened question up; keep it clear of the header.
                      if (!expanded) return
                      const button = document.getElementById(buttonId)
                      if (button && button.getBoundingClientRect().top < 72) button.scrollIntoView({ block: 'center' })
                    }}
                    inert={!expanded}
                  >
                    <p className="max-w-2xl pb-8 text-pretty text-[17px] leading-relaxed text-ink/70">{item.a}</p>
                  </m.div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
