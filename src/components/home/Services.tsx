import { ArrowUpRight } from 'lucide-react'
import { services } from '../../data/content'
import { FadeIn } from '../shared/FadeIn'
import { RevealText } from '../shared/RevealText'
import { SectionLabel } from './SectionLabel'

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-paper-2 py-24 md:py-40">
      <div className="mx-auto max-w-[1680px] px-5 md:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SectionLabel index="03">Služby</SectionLabel>
          </div>
          <RevealText
            as="h2"
            id="services-title"
            className="font-display text-[clamp(2.4rem,5.6vw,6rem)] font-medium leading-[0.95] tracking-[-0.05em] lg:col-span-9"
            lines={[
              'Všechno, co web potřebuje.',
              [{ text: 'Nic navíc.', className: 'font-serif font-normal italic tracking-[-0.02em] text-mute' }],
            ]}
          />
        </div>

        <ul className="mt-16 border-t border-ink/15 md:mt-24">
          {services.map((s, i) => (
            <FadeIn as="li" key={s.title} delay={i * 0.04} className="group border-b border-ink/15">
              <div className="grid gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-10 lg:py-12">
                <span className="text-[13px] tabular-nums text-mute md:col-span-1 md:pt-3">0{i + 1}</span>
                <h3 className="flex items-start gap-3 font-display text-[clamp(1.9rem,3.4vw,3.5rem)] font-medium leading-[1] tracking-[-0.04em] md:col-span-5 lg:col-span-4">
                  <span className="transition-transform duration-700 ease-out-expo group-hover:translate-x-2">{s.title}</span>
                  <ArrowUpRight
                    className="mt-1 hidden shrink-0 text-signal opacity-0 transition-all duration-700 ease-out-expo group-hover:translate-x-2 group-hover:opacity-100 md:block"
                    size={28}
                    aria-hidden="true"
                  />
                </h3>
                <div className="md:col-span-6 lg:col-span-6 lg:col-start-7">
                  <p className="max-w-xl text-pretty text-[17px] leading-relaxed text-ink/75">{s.body}</p>
                  <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-mute" aria-label={`${s.title} – výstupy`}>
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex items-center gap-2">
                        <span className="size-1 rounded-full bg-signal" aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  )
}
