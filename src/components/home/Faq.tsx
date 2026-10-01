import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import { questions } from '../../data/content'
import { SectionLabel } from './SectionLabel'

export function Faq() {
  // Items toggle independently: closing one above the tapped question would pull it out from under the finger.
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set([0]))
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (!next.delete(i)) next.add(i)
      return next
    })
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
              const expanded = open.has(i)
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
                      onClick={() => toggle(i)}
                      className="group flex w-full touch-manipulation items-center justify-between gap-6 py-6 text-left md:py-8"
                    >
                      <span className="text-[clamp(1.15rem,1.7vw,1.6rem)] font-medium tracking-[-0.02em] transition-colors group-hover:text-signal">
                        {item.q}
                      </span>
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-ink/15 transition-[transform,background-color,color] duration-500 ease-out-expo ${
                          expanded ? 'rotate-45 bg-ink text-paper' : ''
                        }`}
                        aria-hidden="true"
                      >
                        <Plus size={18} />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-[grid-template-rows] duration-500 ease-out-expo ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                    inert={!expanded}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-2xl pb-8 text-pretty text-[17px] leading-relaxed text-ink/70">{item.a}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
