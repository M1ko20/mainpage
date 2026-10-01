import { m, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { steps } from '../../data/content'
import { tie } from '../../lib/czech'
import { FadeIn } from '../shared/FadeIn'
import { RevealText } from '../shared/RevealText'
import { SectionLabel } from './SectionLabel'

export function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.6'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <section id="process" aria-labelledby="process-title" className="bg-ink py-24 text-paper md:py-40">
      <div className="mx-auto max-w-[1680px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel index="04" tone="dark">
              Proces
            </SectionLabel>
          </div>
          <div className="lg:col-span-9">
            <RevealText
              as="h2"
              id="process-title"
              className="font-display text-[clamp(2.4rem,5.6vw,6rem)] font-medium leading-[0.95] tracking-[-0.05em]"
              lines={[
                'Jasná cesta od',
                [
                  { text: 'prvního hovoru ' },
                  { text: 'ke spuštění.', className: 'font-serif font-normal italic tracking-[-0.02em] text-signal' },
                ],
              ]}
            />
            <FadeIn>
              <p className="mt-8 max-w-xl text-pretty text-[17px] leading-relaxed text-paper/65">
                {tie('Vždy víte, co přijde dál, kolik to stojí a co budete mít na konci každého kroku. Žádná černá skříňka, žádné nečekané faktury.')}
              </p>
            </FadeIn>
          </div>
        </div>

        <div ref={ref} className="relative mt-16 md:mt-28">
          <div className="absolute left-[7px] top-0 h-full w-px bg-white/12 lg:left-0 lg:h-px lg:w-full" aria-hidden="true">
            <m.div className="h-full w-full origin-top bg-signal lg:hidden" style={{ scaleY: progress }} />
            <m.div className="hidden h-full w-full origin-left bg-signal lg:block" style={{ scaleX: progress }} />
          </div>
          <ol className="grid gap-0 lg:grid-cols-5 lg:gap-8">
          {steps.map((step, i) => (
            <FadeIn as="li" key={step.title} delay={i * 0.08} className="relative pb-12 pl-10 lg:pb-0 lg:pl-0 lg:pt-10">
              <span className="absolute left-0 top-1.5 size-[15px] rounded-full border-[3px] border-ink bg-signal lg:-top-[7px]" aria-hidden="true" />
              <span className="font-serif text-[clamp(2.75rem,3.6vw,3.75rem)] italic leading-none text-paper/50">0{i + 1}</span>
              <h3 className="mt-4 font-display text-[clamp(1.6rem,2vw,2rem)] font-medium tracking-[-0.03em]">{step.title}</h3>
              <p className="mt-3 text-pretty text-[15.5px] leading-relaxed text-paper/65">{step.body}</p>
              <p className="mt-5 border-t border-white/10 pt-4 text-[13px]">
                <span className="text-mute-dark">Výstup — </span>
                <span>{step.outcome}</span>
              </p>
            </FadeIn>
          ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
